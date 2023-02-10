import { Card, Form } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { certificateConfigApi } from '~/api/certificate/certificate-config'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '~/common/components/Primary/Button'

interface IContent {
	title: string
	name: string
	titleSub: string
	recognize: string
	Content: string
	successEnglish: string
	successVietNam: string
	courseEnglish: string
	courseVietNam: string
	director: string
	role: string
}

const CertificateExam = () => {
	// const [certificateExam, setCertificateExam] = useState([])
	const [contentCertificate, setContentCertificate] = useState<IContent>()
	const [loading, setLoading] = useState(false)
	const [form] = Form.useForm()

	// const getGuide = async () => {
	// 	try {
	// 		const response = await certificateConfigApi.getGuide()
	// 		if (response.status === 200) {
	// 			setCertificateExam(response.data.data)
	// 		}
	// 	} catch (error) {
	// 		ShowNoti('error', error.message)
	// 	}
	// }

	const getData = async () => {
		try {
			const response = await certificateConfigApi.getData()
			if (response.status === 200) {
				setContentCertificate(JSON.parse(response.data.data.Content))
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	useEffect(() => {
		// getGuide()
		getData()
	}, [])

	// const handleCopyTextGuide = (value) => {
	// 	navigator.clipboard.writeText(value)
	// 	ShowNoti('success', 'Đã sao chép')
	// }

	const onFinish = async (data) => {
		const dataContent = { Content: JSON.stringify(data) }
		setLoading(true)
		try {
			const response = await certificateConfigApi.setConfig(dataContent)
			if (response.status === 200) {
				getData()
				ShowNoti('success', response.data.message)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	// const content = (
	// 	<div>
	// 		{certificateExam.map((certificate, index) => {
	// 			return (
	// 				<div onClick={() => handleCopyTextGuide(certificate.split(':')[0])} className="mb-2 select-none" key={index}>
	// 					<Tooltip className="cursor-pointer" placement="left" title={'Nhấn để sao chép'}>
	// 						<span className="font-[700]">{`${certificate.split(':')[0]}:`}</span>
	// 						<span>{certificate.split(':')[1]}</span>
	// 					</Tooltip>
	// 				</div>
	// 			)
	// 		})}
	// 	</div>
	// )

	// const certificatePopover = (
	// 	<Popover overlayClassName="show-arrow" content={content} placement="bottomRight" trigger="hover">
	// 		<div className="none-selection cursor-pointer h-[36px] inline-flex px-3 items-center bg-[#0A89FF] hover:bg-[#157ddd] focus:bg-[#1576cf] text-[#fff] rounded-[6px]">
	// 			<Eye className="mr-2" size={16} />
	// 			<div>Xem mã hướng dẫn</div>
	// 		</div>
	// 	</Popover>
	// )

	useMemo(() => {
		if (contentCertificate) {
			form.resetFields()
			form.setFieldValue('title', `${contentCertificate.title}`)
			form.setFieldValue('name', `${contentCertificate.name}`)
			form.setFieldValue('titleSub', `${contentCertificate.titleSub}`)
			form.setFieldValue('recognize', `${contentCertificate.recognize}`)
			form.setFieldValue('Content', `${contentCertificate.Content}`)
			form.setFieldValue('successEnglish', `${contentCertificate.successEnglish}`)
			form.setFieldValue('successVietNam', `${contentCertificate.successVietNam}`)
			form.setFieldValue('courseEnglish', `${contentCertificate.courseEnglish}`)
			form.setFieldValue('courseVietNam', `${contentCertificate.courseVietNam}`)
			form.setFieldValue('director', `${contentCertificate.director}`)
			form.setFieldValue('role', `${contentCertificate.role}`)
		}
	}, [contentCertificate])

	return (
		<div className="container">
			{/* Add Guide Certificate */}
			{/* extra={certificatePopover} */}
			<Card>
				<Form
					layout="vertical"
					form={form}
					onFinish={onFinish}
					initialValues={{
						title: contentCertificate?.title,
						name: contentCertificate?.name,
						titleSub: contentCertificate?.titleSub,
						recognize: contentCertificate?.recognize,
						Content: contentCertificate?.Content,
						successEnglish: contentCertificate?.successEnglish,
						successVietNam: contentCertificate?.successVietNam,
						courseEnglish: contentCertificate?.courseEnglish,
						courseVietNam: contentCertificate?.courseVietNam,
						director: contentCertificate?.director,
						role: contentCertificate?.role
					}}
				>
					<div className="relative">
						{/* <img src="/images/template-certificate.png" /> */}
						<img src="/images/certificateTemplate.png" />
						<div className="absolute -top-[7%] tablet:top-[3%] laptop:top-[5%] left-2/4 -translate-x-[50%] -translate-y-[10%] w-[90%]">
							<Form.Item name="title">
								<input
									placeholder="CERTIFICATE"
									className="font-Montserrat w-full pt-5 pb-2 text-[13px] tablet:text-[30px] laptop:text-[52px] font-normal text-center bg-transparent placeholder:text-[#000] focus:outline-none"
								/>
							</Form.Item>
						</div>
						<div className="absolute top-[9.5%] tablet:top-[15%] laptop:top-[17%] left-2/4 -translate-x-[50%] -translate-y-[10%] w-[90%]">
							<Form.Item name="name">
								<input
									placeholder="CHỨNG CHỈ HOÀN THÀNH KHÓA HỌC"
									className="font-Montserrat w-full text-[4px] tablet:text-[10px] laptop:text-[16px] font-medium text-center bg-transparent placeholder:text-[#000] focus:outline-none"
								/>
							</Form.Item>
						</div>
						<div className="absolute top-[18%] tablet:top-[23%] laptop:top-[24.5%] left-2/4 -translate-x-[50%] -translate-y-[10%] w-[90%]">
							<Form.Item name="titleSub">
								<input
									placeholder="This certificates that"
									className="font-Montserrat w-full text-[5px] tablet:text-[12px] laptop:text-2xl font-medium text-center bg-transparent placeholder:text-[#000] focus:outline-none"
								/>
							</Form.Item>
						</div>
						<div className="absolute top-[18.5%] tablet:top-[25.5%] laptop:top-[27.4%] left-2/4 -translate-x-[50%] -translate-y-[10%] w-[90%]">
							<Form.Item name="recognize">
								<input
									placeholder="Công nhận"
									className="font-Montserrat italic w-full text-[5px] tablet:text-[12px] laptop:text-[20px] font-medium text-center bg-transparent placeholder:text-[#000] focus:outline-none"
								/>
							</Form.Item>
						</div>
						<div className="absolute bottom-[45%] tablet:bottom-[48%] laptop:bottom-[50%] left-2/4 -translate-x-[50%] -translate-y-[10%] w-[90%]">
							<Form.Item name="Content">
								<input
									placeholder="{TenHocVien}"
									className="w-full pt-5 pb-2 text-[10px] tablet:text-[20px] laptop:text-5xl font-medium text-[#ab1d38] text-center bg-transparent placeholder:text-[#ab1d38] focus:outline-none"
									disabled
								/>
							</Form.Item>
						</div>
						<div className="absolute top-[37.5%] tablet:top-[47%] laptop:top-[49.5%] left-2/4 -translate-x-[50%] -translate-y-[10%] w-[90%]">
							<Form.Item name="successEnglish">
								<input
									placeholder="Has successfully completed"
									className="font-Montserrat w-full text-[5px] tablet:text-[12px] laptop:text-[19px] font-medium text-center bg-transparent placeholder:text-[#000] focus:outline-none"
								/>
							</Form.Item>
						</div>
						<div className="absolute top-[40.5%] tablet:top-[50%] laptop:top-[52.5%] left-2/4 -translate-x-[50%] -translate-y-[10%] w-[90%]">
							<Form.Item name="successVietNam">
								<input
									placeholder="Đã hoàn thành khóa học"
									className="font-Montserrat italic w-full text-[5px] tablet:text-[12px] laptop:text-[19px] font-medium text-center bg-transparent placeholder:text-[#000] focus:outline-none"
								/>
							</Form.Item>
						</div>
						<div className="absolute top-[49.5%] tablet:top-[60%] laptop:top-[62.5%] left-2/4 -translate-x-[50%] -translate-y-[10%] w-[90%]">
							<Form.Item name="courseEnglish">
								<input
									placeholder="DIGITAL TRAINING"
									className="text-[#ab1d38] w-full text-[5px] tablet:text-[13px] laptop:text-[20px] font-bold text-center bg-transparent placeholder:text-[#ab1d38] focus:outline-none"
								/>
							</Form.Item>
						</div>
						<div className="absolute top-[52%] tablet:top-[63%] laptop:top-[65.7%] left-2/4 -translate-x-[50%] -translate-y-[10%] w-[90%]">
							<Form.Item name="courseVietNam">
								<input
									placeholder="KỸ NĂNG BÁN HÀNG THỜI KỸ THUẬT SỐ"
									className="italic text-[#ab1d38] w-full text-[5px] tablet:text-[13px] laptop:text-[20px] font-bold text-center bg-transparent placeholder:text-[#ab1d38] focus:outline-none"
								/>
							</Form.Item>
						</div>
						<div className="absolute bottom-[4%] tablet:bottom-[13%] laptop:bottom-[15%] left-2/4 -translate-x-[50%] -translate-y-[20%] w-[90%]">
							<Form.Item name="director">
								<input
									className="w-full pt-4 pb-2 text-[6px] tablet:text-[15px] laptop:text-3xl font-medium uppercase text-center bg-transparent focus:outline-none placeholder:text-tw-black"
									placeholder="Nhập tên giám đốc"
								/>
							</Form.Item>
						</div>
						<div className="absolute bottom-[11%] tablet:bottom-[12.5%] laptop:bottom-[13.3%] left-2/4 -translate-x-[50%] -translate-y-[10%] w-[90%]">
							<Form.Item name="role">
								<input
									className="w-full text-[5px] tablet:text-[12px] laptop:text-[21px] text-center bg-transparent font-medium tracking-tight placeholder:text-[#000] focus:outline-none"
									placeholder="Project Director - Giám đốc dự án"
								/>
							</Form.Item>
						</div>
						<div className="w-full inline-flex items-center justify-center">
							<PrimaryButton loading={loading} disable={loading} type="submit" icon="save" background="blue">
								Lưu chứng chỉ
							</PrimaryButton>
						</div>
					</div>
				</Form>
			</Card>
		</div>
	)
}

export default CertificateExam
