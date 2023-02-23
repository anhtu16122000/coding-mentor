import { Form, Modal, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import InputNumberField from '~/common/components/FormControl/InputNumberField'
import InputTextField from '~/common/components/FormControl/InputTextField'
import SelectField from '~/common/components/FormControl/SelectField'
import SelectFieldSearch from '~/common/components/FormControl/SelectFieldSearch'
import TextBoxField from '~/common/components/FormControl/TextBoxField'
import PrimaryButton from '~/common/components/Primary/Button'
import IconButton from '~/common/components/Primary/IconButton'
import { _format } from '~/common/utils'

export interface IModalRefundCRUD {
	mode: 'add' | 'edit' | 'delete'
	dataRow?: IRefund
	isLoading: boolean
	onSubmit: Function
	dataOption?: { branch: { title: string; value: any }[]; paymentMethod: { title: string; value: any }[] }
	handleSearchForOptionList?: Function
	handleLoadOnScrollForOptionList?: Function
	optionStudent?: any
}

export default function ModalRefundCRUD(props: IModalRefundCRUD) {
	const { mode, dataRow, isLoading, onSubmit, dataOption, optionStudent, handleSearchForOptionList, handleLoadOnScrollForOptionList } =
		props
	const [visible, setVisible] = useState(false)
	const [form] = Form.useForm()
	const { TabPane } = Tabs
	const [typeRefund, setTypeRefund] = useState(1)

	useEffect(() => {
		if (dataRow) {
			form.setFieldsValue(dataRow)
			setTypeRefund(dataRow.Type)
		} else {
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

		if (mode == 'add') {
			data.Type = 1
			data.ClassRegistrationId = 0
			data.ClassReserveId = 0
			data.PaymentApproveId = 0
			data.Price = _format.priceToNumber(data.Price)
		}

		if (data.mode != 'add') {
			data.Id = dataRow ? dataRow.Id : null
		}

		if (dataRow) {
			data.Id = dataRow.Id
		}

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
					children={<span>Thêm yêu cầu hoàn tiền</span>}
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
					tooltip="Sửa yêu cầu hoàn tiền"
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
					tooltip="Xóa yêu cầu hoàn tiền"
				/>
			)}
			<Modal
				footer={null}
				open={visible}
				onCancel={() => {
					onClose()
				}}
				title={mode == 'add' ? 'Thêm yêu cầu hoàn tiền' : mode == 'edit' ? 'Cập nhật yêu cầu hoàn tiền' : 'Xóa yêu cầu hoàn tiền'}
				width={mode == 'delete' || mode == 'edit' ? 400 : 800}
			>
				<Form form={form} layout="vertical" onFinish={_onSubmit}>
					<div className="grid grid-cols-2 gap-x-4 antd-custom-wrap">
						{mode == 'delete' && (
							<div className="col-span-2 mb-4 text-center">
								<p>Bạn xác nhận muốn xóa yêu cầu hoàn tiền này?</p>
							</div>
						)}

						{mode == 'edit' && (
							<>
								<div className="col-span-2">
									<SelectField
										name="Status"
										label="Trạng thái yêu cầu"
										optionList={[
											{ title: 'Chờ duyệt', value: 1 },
											{ title: 'Đã duyệt', value: 2 },
											{ title: 'Hủy', value: 3 }
										]}
										rules={[{ required: true, message: 'Không được bỏ trống' }]}
									/>
								</div>
							</>
						)}

						{mode == 'add' && (
							<>
								<div className="col-span-2 w500:col-span-1">
									<SelectField
										name="BranchId"
										label="Trung tâm"
										isRequired={true}
										rules={[{ required: true, message: 'Không được bỏ trống' }]}
										optionList={dataOption.branch}
										placeholder="Chọn trung tâm"
									/>
								</div>
								<div className="col-span-2 w500:col-span-1">
									<SelectField
										name="PaymentMethodId"
										label="Phương thức thanh toán"
										optionList={dataOption.paymentMethod}
										placeholder="Chọn phương thức thanh toán"
										isRequired={true}
										rules={[{ required: true, message: 'Không được bỏ trống' }]}
									/>
								</div>
								<div className="col-span-2 w500:col-span-1">
									<InputNumberField
										name="Price"
										label="Số tiền hoàn lại"
										isRequired={true}
										rules={[{ required: true, message: 'Không được bỏ trống' }]}
										placeholder="Nhập số tiền cần hoàn"
									/>
								</div>

								<div className="col-span-2 w500:col-span-1">
									<SelectFieldSearch
										onSearch={(data) => {
											handleSearchForOptionList(data, 'student')
										}}
										onScroll={() => {
											handleLoadOnScrollForOptionList('student')
										}}
										optionList={optionStudent}
										label="Học viên"
										name="StudentId"
										placeholder="Chọn học viên"
										isRequired={true}
										rules={[{ required: true, message: 'Bạn không được để trống!' }]}
									/>
								</div>

								<div className="col-span-2">
									<TextBoxField rows={4} name="Note" label="Ghi chú" placeholder="Nhập ghi chú" />
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
