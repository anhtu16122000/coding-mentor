import { Form, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { classApi } from '~/api/class'
import PrimaryButton from '~/common/components/Primary/Button'
import IconButton from '~/common/components/Primary/IconButton'
import { ShowNoti } from '~/common/utils'
import InputTextField from '~/common/components/FormControl/InputTextField'
import InputNumberField from '~/common/components/FormControl/InputNumberField'

type IModalTutoringConfig = {
	dataRow?: any
	onRefresh?: Function
}
export const ModalTutoringConfig: React.FC<IModalTutoringConfig> = ({ dataRow, onRefresh }) => {
	const [visible, setVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [form] = Form.useForm()
	const onClose = () => {
		setVisible(false)
	}
	const onOpen = () => {
		setVisible(true)
	}

	const handleUpdate = async (data) => {
		try {
			setIsLoading(true)
			const res = await classApi.updateClassTutoringConfig(data)
			if (res.status === 200) {
				onClose()
				onRefresh()
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
		data.Id = dataRow?.Id

		handleUpdate(data)
	}

	useEffect(() => {
		if (dataRow) {
			form.setFieldsValue(dataRow)
		}
	}, [dataRow])
	return (
		<>
			<div
				className="flex items-center cursor-pointer"
				onClick={() => {
					onOpen()
				}}
			>
				<IconButton type="button" icon={'edit'} color="green" className="Sửa" tooltip="Sửa" />
			</div>

			<Modal
				title="Cập nhật"
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
							icon="save"
							type="button"
							children="Lưu"
						/>
					</>
				}
				width={500}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={_onSubmit}>
						<div className="grid grid-cols-2 gap-x-4 antd-custom-wrap">
							<div className="col-span-2">
								<InputTextField name="Code" label="Mã" disabled />
							</div>
							<div className="col-span-2">
								<InputTextField name="Name" label="Thông tin" disabled />
							</div>
							<div className="col-span-2">
								<InputNumberField
									name="Value"
									label="Thời gian"
									placeholder="Nhập thời gian"
									isRequired
									rules={[{ required: true, message: 'Bạn không được để trống' }]}
								/>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}
