import { Form, Modal, Switch } from 'antd'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { notificationInClassApi } from '~/api/notification-in-class'
import { ShowNoti } from '~/common/utils'
import InputTextField from '../FormControl/InputTextField'
import TextBoxField from '../FormControl/TextBoxField'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'

type IModalNotificationInClass = {
	mode: 'add' | 'delete'
	onRefresh?: Function
}
export const ModalNotificationInClassCRUD: React.FC<IModalNotificationInClass> = ({ mode, onRefresh }) => {
	const router = useRouter()
	const [visible, setVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [form] = Form.useForm()
	const onClose = () => {
		setVisible(false)
	}
	const onOpen = () => {
		setVisible(true)
	}

	const handleCreate = async (data) => {
		try {
			setIsLoading(true)
			const res = await notificationInClassApi.add(data)
			if (res.status === 200) {
				onClose()
				onRefresh && onRefresh()
				setIsLoading(false)
				form.resetFields()
				ShowNoti('success', res.data.message)
			}
		} catch (error) {
			setIsLoading(true)
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	const _onSubmit = (data) => {
		if (mode === 'add') {
			const dataSubmit = {
				ClassId: router?.query?.class,
				...data
			}
			handleCreate(dataSubmit)
		}
	}
	return (
		<>
			{mode == 'add' && (
				<PrimaryButton
					background="green"
					type="button"
					children={<span>Thêm mới</span>}
					icon="add"
					onClick={() => {
						onOpen()
					}}
				/>
			)}

			{mode == 'delete' && (
				<>
					<div
						className="flex items-center cursor-pointer"
						onClick={() => {
							onOpen()
						}}
					>
						<IconButton type="button" icon={'remove'} color="red" className="" tooltip="Xóa" />
					</div>
				</>
			)}
			<Modal
				title="Tạo thông báo mới"
				open={visible}
				onCancel={onClose}
				width={500}
				footer={
					<>
						<PrimaryButton onClick={() => onClose()} background="red" icon="cancel" type="button">
							Huỷ
						</PrimaryButton>
						<PrimaryButton
							loading={isLoading}
							onClick={() => form.submit()}
							className="ml-2"
							background="blue"
							icon={mode !== 'delete' ? 'save' : 'remove'}
							type="button"
							children={mode !== 'delete' ? 'Lưu' : 'Xóa'}
						/>
					</>
				}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={_onSubmit}>
						<div className="grid grid-cols-2 gap-x-4 antd-custom-wrap">
							{mode == 'delete' && (
								<div className="col-span-2 mb-4 text-center text-[16px]">
									<p>Bạn có chắc muốn xóa?</p>
								</div>
							)}

							{mode != 'delete' && (
								<>
									<div className="col-span-2">
										<Form.Item name="IsSendMail" label="Gửi thông báo qua mail">
											<Switch />
										</Form.Item>
									</div>

									<div className="col-span-2">
										<InputTextField label="Thông báo" name="Title" placeholder="Nhập thông báo" />
									</div>
									<div className="col-span-2">
										<TextBoxField name="Content" label="Nội dung thông báo" placeholder="Nhập nội dung thông báo" />
									</div>
								</>
							)}
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}
