import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Input, Modal, Spin, Tooltip } from 'antd'
import React, { useState } from 'react'
import { Edit } from 'react-feather'
// import { useForm } from 'react-hook-form'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
// import * as yup from 'yup'
import SelectField from '~/common/components/FormControl/SelectField'
import InputMoneyField from '~/common/components/FormControl/InputNumberField'

const StaffSalaryConfig = (props) => {
	const { roles, dataStaff, showAdd, setUpdateSalary, rowData, setParamsRole, _onSubmitStaff, showIcon, isLoading } = props
	const [isModalVisible, setIsModalVisible] = useState(false)

	// const schema = yup.object().shape({
	// 	Role: yup.number().nullable(),
	// 	UserInformationID: yup.number().nullable(),
	// 	Salary: yup.number().nullable(),
	// 	Note: yup.string().nullable(),
	// 	Style: yup.number().nullable()
	// })
	// const defaultValuesInit = {
	// 	Role: null,
	// 	UserInformationID: null,
	// 	Salary: null,
	// 	Style: 1,
	// 	Note: ''
	// }
	// const form = useForm({
	// 	defaultValues: defaultValuesInit,
	// 	resolver: yupResolver(schema)
	// })

	const [form] = Form.useForm()

	const onSubmit = (data: any) => {
		console.log('Data: ', data)
		if (typeof data.Salary == 'string') {
			data.Salary = Number(data.Salary.replace(/\$\s?|(,*)/g, ''))
		}
		let res = _onSubmitStaff(data)
		res.then(function (rs: any) {
			if (rs && rs.status == 200) {
				setIsModalVisible(false)
				form.resetFields()
			}
		})
	}

	return (
		<>
			{showIcon && (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsModalVisible(true)
						setUpdateSalary({ type: 'update', SalaryID: rowData.SalaryID })
					}}
				>
					<Tooltip title="Cập nhật">
						<Edit />
					</Tooltip>
				</button>
			)}
			{showAdd && (
				<button
					className="btn btn-warning add-new"
					onClick={() => {
						setIsModalVisible(true)
						setUpdateSalary({ type: 'add', SalaryID: null })
					}}
				>
					<MdAddCircleOutline size={18} className="mr-2" />
					Thêm mới
				</button>
			)}
			{/*  */}
			<Modal
				title={<>{showAdd ? 'Thêm Lương Nhân Viên' : 'Cập Nhật Lương Nhân Viên'}</>}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							{showAdd ? (
								<>
									<div className="col-12">
										<SelectField
											// form={form}
											label="Chọn chức vụ"
											name="Role"
											optionList={roles}
											isLoading={isLoading.status === 'GET_ALL' && isLoading.loading}
											placeholder="Chọn chức vụ"
											onChangeSelect={(value) => {
												if (value === undefined) {
													setParamsRole(0)
												} else {
													setParamsRole(value)
												}
											}}
										/>
									</div>
									<div className="col-12">
										<SelectField
											// form={form}
											label="Nhân viên"
											name="UserInformationID"
											optionList={dataStaff}
											isLoading={isLoading.status === 'GET_ALL' && isLoading.loading}
											placeholder="Chọn nhân viên"
											isRequired
											// rules={[{ required: true, message: 'Bạn không được để trống' }]}
										/>
									</div>
								</>
							) : (
								<div className="col-12">
									<Form.Item label="Ghi chú" name="Note">
										<Input placeholder="Note" className="primary-input" allowClear={true} />
									</Form.Item>
								</div>
							)}
						</div>
						{/*  */}
						<div className="row">
							<div className="col-12">
								<SelectField
									// form={form}
									name="Style"
									label="Loại"
									optionList={[{ title: 'Tính lương theo tháng', value: 1 }]}
									isLoading={isLoading.status === 'GET_ALL' && isLoading.loading}
									isRequired
								/>
							</div>
						</div>
						{/*  */}
						{/*  */}
						<div className="row">
							<div className="col-12">
								{/* form={form} */}
								<InputMoneyField label="Mức Lương" name="Salary" placeholder="Nhập mức lương" isRequired />
							</div>
						</div>
						{/*  */}
						<div className="row ">
							<div className="col-12">
								<button
									type="submit"
									className="btn btn-primary w-100"
									disabled={props.isLoading.type == 'ADD_DATA' && props.isLoading.status}
								>
									<MdSave size={18} className="mr-2" />
									Lưu
									{props.isLoading.type == 'ADD_DATA' && props.isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}

export default StaffSalaryConfig
