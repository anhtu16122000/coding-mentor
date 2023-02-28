import { Form, Modal, Switch } from 'antd'
import React, { useState } from 'react'
import { ShowNoti } from '~/common/utils'
import { timeLineApi } from '~/api/timeline'
import { useRouter } from 'next/router'
import PrimaryButton from '~/common/components/Primary/Button'
import IconButton from '~/common/components/Primary/IconButton'
import TextBoxField from '~/common/components/FormControl/TextBoxField'
import { feedbackStudentApi } from '~/api/feedbacks-student'
import InputTextField from '~/common/components/FormControl/InputTextField'

type IModalFeedback = {
	mode: 'add' | 'delete'
	dataRow?: any
	onRefresh?: Function
}
export const ModalFeedback: React.FC<IModalFeedback> = ({ mode, dataRow, onRefresh }) => {
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
			const res = await feedbackStudentApi.add(data)
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
		if (mode !== 'add') {
			data.Id = dataRow?.Id
		}
		if (mode === 'add') {
			const dataSubmit = {
				...data,
				IsIncognito: data?.IsIncognito ? data?.IsIncognito : false,
				IsPriority: data?.IsPriority ? data?.IsPriority : false
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
				title={mode === 'add' ? 'Thêm phản hồi' : 'Xác nhận xóa'}
				open={visible}
				onCancel={onClose}
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
				width={500}
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
										<Form.Item name="IsPriority" label="Ưu tiên">
											<Switch />
										</Form.Item>
									</div>
									<div className="col-span-2">
										<Form.Item name="IsIncognito" label="Gửi ẩn danh">
											<Switch />
										</Form.Item>
									</div>
									<div className="col-span-2">
										<InputTextField
											label="Tiêu đề"
											name="Title"
											isRequired
											rules={[{ required: true, message: 'Bạn không được để trống!' }]}
										/>
									</div>
									<div className="col-span-2">
										<TextBoxField
											name="Content"
											label="Nội dung phản hồi"
											isRequired
											rules={[{ required: true, message: 'Bạn không được để trống!' }]}
										/>
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
