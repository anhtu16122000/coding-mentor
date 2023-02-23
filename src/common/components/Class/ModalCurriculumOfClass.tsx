import { Form, Modal, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import PrimaryButton from '~/common/components/Primary/Button'
import IconButton from '~/common/components/Primary/IconButton'
import InputTextField from '../FormControl/InputTextField'

export interface IModalCurriculumOfClassCRUD {
	mode: 'add' | 'edit' | 'delete'
	dataRow?: object
	isLoading: boolean
	onSubmit: Function
}

export default function ModalCurriculumOfClassCRUD(props: IModalCurriculumOfClassCRUD) {
	const { mode, dataRow, isLoading, onSubmit } = props
	const [visible, setVisible] = useState(false)
	const [form] = Form.useForm()
	const { TabPane } = Tabs
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

		onSubmit(data).then((res) => {
			if (res && res.status === 200) {
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
				<PrimaryButton
					background="green"
					type="button"
					children={<span>Thêm chủ đề</span>}
					icon="add"
					onClick={() => {
						onOpen()
					}}
				/>
			)}
			{mode == 'edit' && (
				<IconButton
					type="button"
					icon={'edit'}
					color="green"
					onClick={() => {
						onOpen()
					}}
					tooltip="Sửa chủ đề"
				/>
			)}

			{mode == 'delete' && (
				<IconButton
					type="button"
					icon={'remove'}
					color="red"
					onClick={() => {
						onOpen()
					}}
					tooltip="Xóa chủ đề"
				/>
			)}
			<Modal
				footer={null}
				open={visible}
				onCancel={() => {
					onClose()
				}}
				title={mode == 'add' ? 'Thêm chủ đề' : mode == 'edit' ? 'Cập nhật chủ đề' : 'Xóa chủ đề'}
				width={mode != 'delete' ? 600 : 400}
			>
				<Form form={form} layout="vertical" onFinish={_onSubmit}>
					<div className="grid grid-cols-2 gap-x-4 antd-custom-wrap">
						{mode == 'delete' && (
							<div className="col-span-2 mb-4 text-center">
								<p>Bạn xác nhận muốn xóa chủ đề này?</p>
							</div>
						)}
						{mode != 'delete' && (
							<>
								<div className="col-span-2">
									<InputTextField
										label="Tên chủ đề"
										name="Name"
										placeholder="Nhập tên chủ đề"
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
