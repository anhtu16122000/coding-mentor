import { Form, Modal } from 'antd'
import React, { useState, useEffect } from 'react'
import { Eye } from 'react-feather'
import { RiQuestionLine } from 'react-icons/ri'
import { formRequired } from '~/common/libs/others/form'
import InputText from '../../FormControl/InputTextField'
import PrimaryButton from '../../Primary/Button'
import IconButton from '../../Primary/IconButton'
import Lottie from 'react-lottie-player'

import deleteJson from '~/common/components/json/15120-delete.json'

type Props = {
	mode: string
	item?: IZoomConfig
	onFetchData: Function
	onSubmit: Function
	isLoading?: { type: string; status: boolean }
}

const ImageInstructions = (props) => {
	const [imageVisible, setImageVisible] = useState(false)
	const { step } = props
	return (
		<>
			<button
				type="button"
				className="border-2 border-tw-gray px-tw-2 h-[30px] mx-2 rounded-lg hover:text-tw-white hover:border-tw-primary hover:bg-tw-primary inline-flex items-center"
				onClick={() => setImageVisible(true)}
			>
				<Eye className="mr-2" size={16} />
				<div>Xem ảnh</div>
			</button>
			<Modal visible={imageVisible} onCancel={() => setImageVisible(false)} footer={null} width={1000}>
				{step === 1 && <img src="/images/zoomIns1.png" alt="img" style={{ width: '100%' }} />}
				{step === 2 && <img src="/images/zoomIns2.png" alt="img" style={{ width: '100%' }} />}
				{step === 3 && <img src="/images/zoomIns3.png" alt="img" style={{ width: '100%' }} />}
				{step === 4 && <img src="/images/zoomIns4.png" alt="img" style={{ width: '100%' }} />}
			</Modal>
		</>
	)
}

const renderTutorial = () => {
	return (
		<div className="grid-cols-1 ml-1">
			<div>
				1. Đăng kí tài khoản <b>Zoom Developer</b>
				<a href="https://marketplace.zoom.us/" target="_blank" style={{ paddingLeft: '5px', textDecoration: 'underline' }}>
					tại đây
				</a>
			</div>
			<ul>
				<li className="list-disc list-inside ml-5" style={{ marginBottom: 5 }}>
					Chọn <b>đăng ký / đăng nhập</b> bằng Google
					<ImageInstructions step={1} />
				</li>
			</ul>
			<div>
				2. Sau khi đăng nhập ➝ Chọn <b>"Develop"</b> góc trên bên trái ➝ <b>Build App</b> ➝ <b>Create App JWT</b>{' '}
				<ImageInstructions step={2} />
			</div>
			<ul>
				<li className="list-disc list-inside ml-5" style={{ marginBottom: 5 }}>
					Tại mục Information: nhập <b>App Name</b> và <b>Company Name</b>
					<ImageInstructions step={3} />
				</li>
				<li className="list-disc list-inside ml-5">
					Tại mục App Credentials: Sao chép <b>API Key</b> và <b>API Secret</b>
					<ImageInstructions step={4} />
				</li>
			</ul>
		</div>
	)
}

export default function ModalZoomConfig(props: Props) {
	const { mode, item, onFetchData, onSubmit, isLoading } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [showTutorial, setShowTutorial] = useState(false)

	const [form] = Form.useForm()

	const onOpenModal = () => {
		setIsModalVisible(true)
	}

	const onCloseModal = () => {
		console.log('item: ', item)

		setIsModalVisible(false)
	}

	useEffect(() => {
		if (item) {
			form.setFieldsValue(item)
		}
	}, [isModalVisible])

	const _onFinish = (data) => {
		data.mode = mode
		if (item) {
			data.Id = item.Id
		}
		if (onSubmit) {
			onSubmit(data).then((res) => {
				if (res?.status == 200) {
					onCloseModal()
					form.resetFields()
					onFetchData && onFetchData()
				}
			})
		}
	}

	return (
		<div>
			{mode == 'add' && (
				<PrimaryButton background="green" type="button" children={<span>Thêm cấu hình</span>} icon="add" onClick={() => onOpenModal()} />
			)}
			{mode == 'edit' && <IconButton type="button" icon={'edit'} color="green" onClick={() => onOpenModal()} tooltip="Sửa cấu hình" />}
			{mode == 'delete' && (
				<IconButton type="button" icon={'remove'} color="primary" onClick={() => onOpenModal()} tooltip="Xóa cấu hình" />
			)}
			<Modal
				title={mode == 'add' ? 'Thêm cấu hình Zoom' : mode == 'edit' ? 'Cập nhật cấu hình Zoom' : 'Xóa cấu hình Zoom'}
				visible={isModalVisible}
				onCancel={onCloseModal}
				footer={null}
				width={mode == 'delete' ? 440 : 800}
			>
				<Form form={form} layout="vertical" onFinish={_onFinish}>
					<div className="grid grid-flow-row antd-custom-wrap">
						{mode == 'delete' ? (
							<>
								<div className="grid-cols-1 flex flex-col items-center justify-center">
									<Lottie loop animationData={deleteJson} play className="w-[120px] mt-[-10px]" />
									<p className="text-center text-[16px] mt-3">
										Bạn muốn xóa tài khoản <span className="text-[red]">{item?.UserZoom}</span>
									</p>
								</div>
								<div className="grid-cols-1 flex justify-center mt-4">
									<PrimaryButton onClick={onCloseModal} className="!mr-3" background="primary" type="button" icon="cancel">
										Huỷ
									</PrimaryButton>
									<PrimaryButton
										background="red"
										type="submit"
										children={<span>Xóa</span>}
										icon="remove"
										loading={isLoading.type == 'SUBMIT' && isLoading.status}
									/>
								</div>
							</>
						) : (
							<>
								<div className="grid-cols-1">
									<InputText
										disabled={isLoading.type == 'SUBMIT' && isLoading.status}
										label="Tài khoản"
										name="UserZoom"
										placeholder="Nhập tài khoản"
										isRequired
										rules={formRequired}
									/>
								</div>

								<div className="grid-cols-1">
									<InputText
										disabled={isLoading.type == 'SUBMIT' && isLoading.status}
										label="API key"
										name="APIKey"
										placeholder="Nhập API key"
										isRequired
										rules={formRequired}
									/>
								</div>

								<div className="grid-cols-1">
									<InputText
										disabled={isLoading.type == 'SUBMIT' && isLoading.status}
										label="API secret"
										name="APISecret"
										placeholder="Nhập API secret"
										isRequired
										rules={formRequired}
									/>
								</div>

								<div className="grid-cols-1">
									<div
										className="font-bold text-tw-blue hover:text-[#1267b7] cursor-pointer w-fit flex gap-1 justify-center items-center mb-2"
										onClick={() => setShowTutorial(!showTutorial)}
									>
										<p>
											<RiQuestionLine size={20} />
										</p>
										<p>Hướng dẫn</p>
									</div>
								</div>

								{showTutorial && renderTutorial()}

								<div className="grid-cols-1 flex justify-center mt-4">
									<PrimaryButton
										onClick={onCloseModal}
										className="mr-3"
										background="red"
										type="button"
										children={<span>Hủy</span>}
										icon="cancel"
										loading={isLoading.type == 'SUBMIT' && isLoading.status}
									/>
									<PrimaryButton
										background="blue"
										type="submit"
										children={<span>Lưu</span>}
										icon="save"
										loading={isLoading.type == 'SUBMIT' && isLoading.status}
									/>
								</div>
							</>
						)}
					</div>
				</Form>
			</Modal>
		</div>
	)
}
