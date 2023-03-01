import { Form, Modal, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import PrimaryButton from '~/common/components/Primary/Button'
import IconButton from '~/common/components/Primary/IconButton'
import { parseStringToNumber } from '~/common/utils/common'
import InputNumberField from '../../FormControl/InputNumberField'
import InputTextField from '../../FormControl/InputTextField'
import SelectField from '../../FormControl/SelectField'
import SelectFieldSearch from '../../FormControl/SelectFieldSearch'
import TextBoxField from '../../FormControl/TextBoxField'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

export interface IIncomeExpenseManagementModalCRUDProps {
	mode: 'add' | 'edit' | 'delete'
	dataRow?: IPaymentSession
	isLoading?: { type: string; status: boolean }
	onSubmit: Function
	handleSearchForOptionList: Function
	handleLoadOnScrollForOptionList: Function
	dataOption?: any
	optionStudent?: any
}

export default function IncomeExpenseManagementModalCRUD(props: IIncomeExpenseManagementModalCRUDProps) {
	const { optionStudent, dataRow, isLoading, onSubmit } = props
	const { mode, dataOption, handleSearchForOptionList, handleLoadOnScrollForOptionList } = props

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
		data.Mode = mode
		data.Value = data.Value ? parseStringToNumber(data.Value) : null
		if (mode == 'delete') {
			data.Id = dataRow.Id
		}
		if (!onSubmit) return

		onSubmit(data).then((res) => {
			if (res) {
				if (res == 200) {
					onClose()
					if (mode == 'add') {
						form.resetFields()
					}
				}
			}
		})
	}

	useEffect(() => {
		if (dataRow) {
			form.setFieldsValue(dataRow)
		}
	}, [dataRow])

	const theInformation = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return theInformation?.RoleId == 1
	}

	function isTeacher() {
		return theInformation?.RoleId == 2
	}

	function isManager() {
		return theInformation?.RoleId == 4
	}

	function isStdent() {
		return theInformation?.RoleId == 3
	}

	function isAccountant() {
		return theInformation?.RoleId == 6
	}

	return (
		<>
			{(isAdmin() || isAccountant()) && mode == 'add' && (
				<PrimaryButton background="green" type="button" children={<span>Thêm phiếu</span>} icon="add" onClick={() => onOpen()} />
			)}

			{mode == 'edit' && <IconButton type="button" icon={'edit'} color="green" onClick={() => onOpen()} className="Sửa phiếu" tooltip="" />}

			{/* {(isAdmin() || isAccountant()) && mode == 'delete' && (
				<IconButton type="button" icon={'remove'} color="red" onClick={() => onOpen()} className="" tooltip="Xóa phiếu" />
			)} */}

			<Modal
				footer={null}
				open={visible}
				onCancel={() => onClose()}
				title={mode == 'add' ? 'Thêm phiếu' : mode == 'edit' ? 'Cập nhật phiếu' : 'Xóa phiếu'}
				width={mode != 'delete' ? 800 : 400}
			>
				<Form form={form} layout="vertical" onFinish={_onSubmit}>
					<div className="grid grid-cols-2 gap-x-4 antd-custom-wrap">
						{mode == 'delete' && (
							<div className="col-span-2 mb-4 text-center">
								<p>Bạn xác nhận muốn xóa phiếu này?</p>
							</div>
						)}

						{mode != 'delete' && (
							<>
								<div className="col-span-2">
									<SelectField
										optionList={dataOption.branch}
										label="Chi nhánh"
										name="BranchId"
										placeholder="Chọn chi nhánh"
										isRequired={true}
										rules={[{ required: true, message: 'Bạn không được để trống!' }]}
									/>
								</div>
								<div className="col-span-1">
									<SelectFieldSearch
										onSearch={(data) => {
											handleSearchForOptionList(data, 'student')
										}}
										onScroll={() => {
											handleLoadOnScrollForOptionList('student')
										}}
										optionList={optionStudent}
										label="Học viên"
										name="UserId"
										placeholder="Chọn học viên"
										isRequired={true}
										rules={[{ required: true, message: 'Bạn không được để trống!' }]}
									/>
								</div>
								<div className="col-span-1">
									<SelectField
										optionList={dataOption.payment_method}
										label="Phương thức thanh toán"
										name="PaymentMethodId"
										placeholder="Chọn phương thức thanh toán"
										isRequired={true}
										rules={[{ required: true, message: 'Bạn không được để trống!' }]}
									/>
								</div>
								<div className="col-span-1">
									<SelectField
										optionList={[
											{ title: 'Thu', value: 1 },
											{ title: 'Chi', value: 2 }
										]}
										label="Loại phiếu"
										name="Type"
										placeholder="Chọn loại phiếu"
										isRequired={true}
										rules={[{ required: true, message: 'Bạn không được để trống!' }]}
									/>
								</div>
								<div className="col-span-1">
									<InputNumberField
										label="Giá trị thanh toán"
										name="Value"
										placeholder="Nhập giá trị thanh toán"
										isRequired={true}
										rules={[{ required: true, message: 'Bạn không được để trống!' }]}
									/>
								</div>
								<div className="col-span-1">
									<TextBoxField rows={4} label="Lý do thanh toán" name="Reason" placeholder="Nhập lý do thanh toán" />
								</div>
								<div className="col-span-1">
									<TextBoxField rows={4} label="Ghi chú" name="Note" placeholder="Nhập ghi chú" />
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
