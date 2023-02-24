import { Form, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { staffSalaryApi } from '~/api/staff-salary'
import InputNumberField from '~/common/components/FormControl/InputNumberField'
import SelectField from '~/common/components/FormControl/SelectField'
import TextBoxField from '~/common/components/FormControl/TextBoxField'
import PrimaryButton from '~/common/components/Primary/Button'
import IconButton from '~/common/components/Primary/IconButton'
import { ShowNoti } from '~/common/utils'

type IModalSalary = {
	dataRow?: any
	onRefresh?: Function
}
export const ModalSalaryCRUD: React.FC<IModalSalary> = ({ dataRow, onRefresh }) => {
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
			const res = await staffSalaryApi.update(data)
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

		const DATA_SUBMIT = { ...data }

		console.log('--- DATA SUBMIT: ', DATA_SUBMIT)

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
				title="Cập nhật lương"
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
				width={800}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={_onSubmit}>
						<div className="grid grid-cols-2 gap-x-4 antd-custom-wrap">
							<div className="col-span-2">
								<InputNumberField name="Deduction" label="Trừ tạm ứng" placeholder="Nhập trừ tạm ứng" isRequired />
							</div>

							<div className="col-span-2">
								<InputNumberField name="Bonus" label="Thưởng" placeholder="Nhập thưởng" isRequired />
							</div>

							<div className="col-span-2">
								<SelectField
									label="Trạng thái"
									name="Status"
									optionList={[
										{ title: 'Chưa chốt', value: 1 },
										{ title: 'Đã chốt', value: 2 },
										{ title: 'Đã thanh toán', value: 3 }
									]}
									placeholder=""
								/>
							</div>

							<div className="col-span-2">
								<TextBoxField name="Note" label="Ghi chú" />
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}
