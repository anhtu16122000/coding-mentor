import { Form, Modal, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import InputTextField from '~/common/components/FormControl/InputTextField'
import TextBoxField from '~/common/components/FormControl/TextBoxField'
import PrimaryButton from '~/common/components/Primary/Button'
import IconButton from '~/common/components/Primary/IconButton'

export interface IModalFeedbackReplyCRUD {
	mode: 'add' | 'edit' | 'delete'
	dataRow?: IFeedbackStudentReply
	isLoading: boolean
	onSubmit: Function
}

export default function ModalFeedbackReplyCRUD(props: IModalFeedbackReplyCRUD) {
	const { mode, dataRow, isLoading, onSubmit } = props

	const [visible, setVisible] = useState(false)

	const [form] = Form.useForm()

	useEffect(() => {
		if (dataRow) {
			form.setFieldsValue(dataRow)
		}
	}, [dataRow])

	const onClose = () => {
		setVisible(false)
	}
	const onOpen = () => {
		setVisible(true)
	}

	const _onSubmit = (data) => {
		data.mode = mode
		if (!onSubmit) return

		if (dataRow) {
			data.Id = dataRow.Id
		}

		onSubmit(data).then((res) => {
			if (res?.status === 200) {
				form.resetFields()
				onClose()
			}
		})
	}

	useEffect(() => {
		if (dataRow) {
			form.setFieldsValue(dataRow)
		}
	}, [dataRow])

	return (
		<>
			{mode == 'add' && (
				<PrimaryButton background="green" type="button" icon="add" onClick={onOpen}>
					Thêm phản hổi
				</PrimaryButton>
			)}

			{mode == 'edit' && <IconButton type="button" icon={'edit'} color="green" onClick={onOpen} tooltip="Sửa phản hổi" />}

			{mode == 'delete' && <IconButton type="button" icon={'remove'} color="red" onClick={onOpen} tooltip="Xóa phản hổi" />}

			<Modal
				footer={null}
				open={visible}
				onCancel={onClose}
				title={mode == 'add' ? 'Thêm phản hổi' : mode == 'edit' ? 'Cập nhật phản hổi' : 'Xóa phản hổi'}
				width={mode != 'delete' ? 600 : 400}
			>
				<Form form={form} layout="vertical" onFinish={_onSubmit}>
					<div className="grid grid-cols-2 gap-x-4 antd-custom-wrap">
						{mode == 'delete' && (
							<div className="col-span-2 mb-4 text-center">
								<p>Bạn xác nhận muốn xóa phản hổi này?</p>
							</div>
						)}
						{mode != 'delete' && (
							<>
								<div className="col-span-2">
									<TextBoxField
										rows={5}
										label="Nội dung phản hồi"
										name="Content"
										placeholder="Nhập nội dung phản hồi"
										isRequired={true}
										rules={[{ required: true, message: 'Bạn không được để trống!' }]}
									/>
								</div>
							</>
						)}

						<div className="col-span-2 flex justify-center items-center">
							<PrimaryButton
								background={mode == 'add' ? 'green' : mode == 'edit' ? 'blue' : 'red'}
								type="submit"
								children={<span>{mode == 'add' ? 'Thêm' : mode == 'edit' ? 'Lưu' : 'Xác nhận'}</span>}
								icon={mode == 'add' ? 'add' : mode == 'edit' ? 'save' : 'remove'}
								loading={isLoading}
							/>
						</div>
					</div>
				</Form>
			</Modal>
		</>
	)
}
