import React, { useEffect, useState } from 'react'
import { Card, Popover, Tooltip, Form, Space, Upload, Skeleton, Input, Select, Modal, Tabs } from 'antd'
// import { certificateConfigApi } from '~/api/certificate-old/certificate-config'
import { ShowNoti } from '~/common/utils'
import { Eye, PlusCircle } from 'react-feather'
import EditorField from '~/common/components/FormControl/EditorField'
import PrimaryButton from '~/common/components/Primary/Button'
// import { uploadImageApi } from '~/api/user'
import { useRouter } from 'next/router'
import { FiEdit } from 'react-icons/fi'
import ModalViewCertificateExam from './ModalViewCetificateExam'
import { BsFileImage } from 'react-icons/bs'
import { certificateConfigApi } from '~/api/certificate/certificate-config'
import { UploadFileApi } from '~/api/common/upload-image'

const UpdateCertificate = () => {
	const router = useRouter()
	const { slug } = router.query
	const [open, setOpen] = useState(false)
	const [certificateExam, setCertificateExam] = useState([])
	const [contentCertificate, setContentCertificate] = useState('')
	const [loading, setLoading] = useState(false)
	const [loadingInitPage, setLoadingInitPage] = useState(false)
	const [background, setBackground] = useState('')
	const [backside, setBackside] = useState('')
	const [tab, setTab] = useState<string>('1')

	const [uploading, setUploading] = useState(false)

	const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

	const [form] = Form.useForm()

	const watchContent = Form.useWatch('Content', form)

	const getGuide = async () => {
		try {
			const response = await certificateConfigApi.getGuide()
			if (response.status == 200) {
				setCertificateExam(response.data.data)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	const getCertificateById = async () => {
		try {
			setLoadingInitPage(true)
			if (slug) {
				const response = await certificateConfigApi.getById(slug)
				if (response.status === 200) {
					setBackground(response.data.data.Background)
					setBackside(response.data.data.Backside)
					setContentCertificate(response.data.data.Content)
					form.setFieldsValue({ Name: response.data.data.Name, Content: response.data.data.Content })
				}
				setLoadingInitPage(false)
			}
		} catch (error) {
			ShowNoti('error', error.message)
			setLoadingInitPage(false)
		}
	}

	useEffect(() => {
		getGuide()
	}, [])

	useEffect(() => {
		if (slug) {
			getCertificateById()
		} else {
			form.setFieldsValue({
				Content: ''
			})
		}
	}, [slug])

	const onChangeEditor = (value) => {
		form.setFieldsValue({
			Content: value
		})
	}

	const onChangeTabs = (key: string) => {
		setTab(key)
	}
	const handleCopyTextGuide = (value) => {
		navigator.clipboard.writeText(value)
		ShowNoti('success', 'Đã sao chép')
	}

	const onFinish = async (data) => {
		setLoading(true)
		try {
			const payload = {
				Background: background,
				Backside: backside,
				...data,
				Width: dimensions.width,
				Height: dimensions.height
			}

			// {
			//   "Name": "string",
			//   "Content": "string",
			//   "Background": "string",
			//   "Backside": "string",
			//   "Width": 0,
			//   "Height": 0
			// }

			if (!slug) {
				const response = await certificateConfigApi.createCertificateConfig(payload)
				if (response.status === 200) {
					ShowNoti('success', response.data.message)
					setBackground('')
					setContentCertificate('')
					form.setFieldsValue({ Name: '', Content: '' })
				}
			} else {
				const response = await certificateConfigApi.updateCertificateConfig({ Id: slug, ...payload })
				if (response.status === 200) {
					ShowNoti('success', response.data.message)
					setBackground(response.data.data.Background)
					setContentCertificate(response.data.data.Content)
					form.setFieldsValue({
						Name: response.data.data.Name
					})
				}
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	async function uploadBackground(params, type) {
		try {
			setUploading(true)
			const response = await UploadFileApi.uploadImage(params)
			if (response.status === 200) {
				if (type === 'background') {
					setBackground(response.data.data)
					setContentCertificate(watchContent)
				} else {
					setBackside(response.data.data)
				}
				ShowNoti('success', response.data.message)
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setUploading(false)
		}
	}

	const contentCertificatePopover = (
		<div>
			{certificateExam.map((ex, index) => {
				return (
					<div onClick={() => handleCopyTextGuide(ex?.Key)} className="mb-2 select-none" key={index}>
						<Tooltip className="cursor-pointer" placement="left" title={'Nhấn để sao chép'}>
							{/* <span className="font-[700]">{`${certificate.split(':')[0]}:`}</span> */}
							{/* <span>{certificate.split(':')[1]}</span> */}

							<span className="font-[700]">{`${ex?.Value}:`}</span>
							<span>{ex?.Key}</span>
						</Tooltip>
					</div>
				)
			})}
		</div>
	)

	const certificatePopover = (
		<Popover overlayClassName="show-arrow" content={contentCertificatePopover} placement="bottomRight" trigger="hover">
			<div className="none-selection cursor-pointer h-[36px] inline-flex px-3 items-center bg-[#0A89FF] hover:bg-[#157ddd] focus:bg-[#1576cf] text-[#fff] rounded-[6px]">
				<Eye className="mr-2" size={16} />
				<div>Xem mã hướng dẫn</div>
			</div>
		</Popover>
	)

	const extraCertificate = () => (
		<Space wrap>
			{tab === '1' ? (
				<Upload customRequest={(event) => uploadBackground(event.file, 'background')} showUploadList={false}>
					<div className="none-selection cursor-pointer h-[36px] inline-flex px-3 items-center bg-[#0A89FF] hover:bg-[#157ddd] focus:bg-[#1576cf] text-[#fff] rounded-[6px]">
						{!background ? (
							<>
								<PlusCircle className="mr-2" size={16} />
								Thêm hình nền mặt trước chứng nhận
							</>
						) : (
							<>
								<FiEdit className="mr-2" size={16} />
								Thay đổi hình nền mặt trước chứng nhận
							</>
						)}
					</div>
				</Upload>
			) : (
				<Upload customRequest={(event) => uploadBackground(event.file, 'bacckside')} showUploadList={false}>
					<div className="none-selection cursor-pointer h-[36px] inline-flex px-3 items-center bg-[#0A89FF] hover:bg-[#157ddd] focus:bg-[#1576cf] text-[#fff] rounded-[6px]">
						{!background ? (
							<>
								<PlusCircle className="mr-2" size={16} />
								Thêm hình nền mặt sau chứng nhận
							</>
						) : (
							<>
								<FiEdit className="mr-2" size={16} />
								Thay đổi hình nền mặt sau chứng nhận
							</>
						)}
					</div>
				</Upload>
			)}
			{certificatePopover}
		</Space>
	)

	const editContent = () => (
		<>
			<div className="text-danger">
				Lưu ý: Hình ảnh có kích cỡ A4, trường hợp hình ảnh sai kích cỡ có thể gây mất ảnh hoặc không đồng bộ với mẫu đã được tạo
			</div>

			{!uploading ? (
				<>
					<label className="text-[14px] font-[500] mb-1 inline-flex items-center">Nội dung mặt trước</label>
					<EditorField
						height={800}
						customFieldProps={{
							quickbars_insert_toolbar: false,
							quickbars: false,
							contextmenu: 'none',
							content_style: `
									html{
									width: 794px; 
									height: 1123px;
								}
								body {
									background-image: 
										url("${background}");
										background-size: cover;
										background-repeat: no-repeat; 
										width: 794px; 
										height: 1123px;
										margin:0rem;
										line-height: 1;
										font-size:14px;
								}
								p {
									display: block;
									margin-block-start: 0;
									margin-block-end: 0;
									margin-inline-start: 0px;
									margin-inline-end: 0px;
								}
								`
						}}
						initialValue={contentCertificate}
						name="Content"
						onChangeEditor={onChangeEditor}
					/>
				</>
			) : (
				<Skeleton />
			)}
		</>
	)

	function onInitBackground(params) {
		setDimensions({ width: params.target?.naturalWidth, height: params.target?.naturalHeight })
	}

	return (
		<div className="container">
			{!!background && <img className="hidden absolute" src={background} onLoad={onInitBackground} />}
			<Card title={slug ? 'Cập nhật mẫu chứng nhận' : 'Thêm mới mẫu chứng nhận'} extra={extraCertificate()} className="max-w-[1200px]">
				<Form
					layout="vertical"
					onFinishFailed={(value) => ShowNoti('error', 'Vui lòng nhập tên mẫu chứng nhận')}
					form={form}
					onFinish={onFinish}
					className="d-flex flex-col justify-center items-center"
				>
					{loadingInitPage ? (
						<Skeleton />
					) : (
						<div className="grid grid-col-1 gap-3  max-w-[825px] w-full">
							<Form.Item
								className="col-span-1"
								name="Name"
								label="Tên mẫu chứng nhận"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
							>
								<Input className="input primary-input" placeholder="Nhập tên mẫu chứng nhận" />
							</Form.Item>

							{editContent()}

							{/* <Tabs
								centered
								defaultActiveKey={tab}
								// @ts-ignore
								items={[
									{
										key: '1',
										label: `Mặt trước`,
										children: editContent()
									}
									// {
									// 	key: '2',
									// 	label: `Mặt sau`,
									// 	children: (
									// 		<div className="col-span-1">
									// 			<label className="text-[14px] font-[500] mb-1 inline-flex items-center">Nội dung mặt sau</label>
									// 			<Upload customRequest={(event) => uploadBackground(event.file, 'backside')} showUploadList={false}>
									// 				<Card hoverable className="" cover={backside ? <img alt="example" src={backside} /> : ''}>
									// 					<div className="w-full d-flex justify-center items-center font-base text-[primary] gap-3">
									// 						<BsFileImage size="24" />
									// 						<p className="font-base">{backside ? 'Thay đổi hình nền mặt sau' : 'Thêm hình nền mặt sau'}</p>
									// 					</div>
									// 				</Card>
									// 			</Upload>
									// 		</div>
									// 	)
									// }
								]}
								onChange={onChangeTabs}
							></Tabs> */}

							<div className="col-span-1 w-full inline-flex items-center justify-center gap-3">
								<PrimaryButton onClick={() => setOpen(true)} disable={loading} type="button" icon="eye" background="blue">
									Xem Trước
								</PrimaryButton>
								<PrimaryButton loading={loading} disable={loading} type="submit" icon={slug ? 'save' : 'add'} background="green">
									{slug ? 'Lưu chứng nhận' : 'Tạo mới chứng nhận'}
								</PrimaryButton>
							</div>
						</div>
					)}
				</Form>
			</Card>
			<ModalViewCertificateExam open={open} setOpen={setOpen} background={background} content={watchContent} backside={backside} />
		</div>
	)
}

export default UpdateCertificate
