import { Divider, Form, Modal, Select } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { districtApi, wardApi } from '~/api/area'
import * as yup from 'yup'
import InputTextField from '~/common/components/FormControl/InputTextField'
import SelectField from '~/common/components/FormControl/SelectField'
import { ShowNoti } from '~/common/utils'
import { parseSelectArray } from '~/common/utils/common'
import { RootState } from '~/store'
import { customerAdviseApi } from '~/api/customer'
import CustomerModalConfirm from './CustomerModalConfirm'
import { formNoneRequired, formRequired } from '~/common/libs/others/form'
import { userInformationApi } from '~/api/user'
import DatePickerField from '../FormControl/DatePickerField'
import UploadImageField from '../FormControl/UploadImageField'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'
import RestApi from '~/api/RestApi'

const CustomerAdviseForm = React.memo((props: any) => {
	const { source, learningNeed, purpose, sale, branch, refPopover } = props
	const { customerStatus, rowData, listTodoApi, setTodoApi, isStudent, className } = props

	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [existCustomer, setExistCustomer] = useState(false)
	const [dataSubmit, setDataSubmit] = useState([])
	const [districts, setDistricts] = useState([])
	const [wards, setWards] = useState([])

	const area = useSelector((state: RootState) => state.area.Area)

	const [jobs, setJobs] = useState([])
	const theInformation = useSelector((state: RootState) => state.user.information)
	function isSaler() {
		return theInformation?.RoleId == 5
	}
	const getJobs = async () => {
		try {
			const res = await RestApi.get<any>('job', { pageIndex: 1, pageSize: 99999 })
			if (res.status === 200) {
				setJobs(res.data.data)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const convertAreaSelect = useMemo(() => {
		return parseSelectArray(area, 'Name', 'Id')
	}, [area])

	// -----  HANDLE ALL IN FORM -------------

	const [form] = Form.useForm()
	let schema = yup.object().shape({
		FullName: yup.string().required('Bạn không được để trống'),
		Mobile: yup.string().required('Bạn không được để trống'),
		Email: yup.string().required('Bạn không được để trống')
	})

	const yupSync = {
		async validator({ field }, value) {
			await schema.validateSyncAt(field, { [field]: value })
		}
	}

	const checkExistCustomer = async (data) => {
		try {
			if (rowData) {
				onSubmit(data)
			} else {
				const res = await customerAdviseApi.checkExist({ mobile: data.Mobile, email: data.Email })
				if (res.data.data) {
					setDataSubmit(data)
					setExistCustomer(res.data.data)
				} else {
					onSubmit(data)
				}
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	// SUBMI FORM
	const onSubmit = async (data: any) => {
		try {
			setIsLoading(true)
			let DATA_SUBMIT = null
			if (rowData) {
				if (isStudent) {
					DATA_SUBMIT = {
						...rowData,
						...data,
						RoleId: 3,
						customerId: rowData.Id,
						SaleId: isSaler() ? Number(theInformation.UserInformationId) : data.SaleId
					}
				} else {
					DATA_SUBMIT = { ...rowData, ...data, SaleId: isSaler() ? Number(theInformation.UserInformationId) : data.SaleId }
				}
			} else {
				DATA_SUBMIT = { ...data, SaleId: isSaler() ? Number(theInformation.UserInformationId) : data.SaleId }
			}

			const res = await (rowData?.Id
				? isStudent
					? userInformationApi.add(DATA_SUBMIT)
					: customerAdviseApi.update(DATA_SUBMIT)
				: customerAdviseApi.add(DATA_SUBMIT))
			if (res.status === 200) {
				setTodoApi(listTodoApi)
				form.resetFields()
				setIsModalVisible(false)
				ShowNoti('success', res.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (isModalVisible) {
			getJobs()
			if (rowData) {
				if (isStudent) {
					form.setFieldsValue({ Password: '123456' })
					form.setFieldsValue({ BranchIds: !!rowData.BranchId ? parseInt(rowData.BranchId) : null })
				}
				!!rowData.AreaId && getDistrictByArea(rowData.AreaId)
				!!rowData.DistrictId && getWardByDistrict(rowData.DistrictId)
				form.setFieldsValue(rowData)
				form.setFieldsValue({ AreaId: !!rowData.AreaId ? parseInt(rowData.AreaId) : null })
				form.setFieldsValue({ SourceId: !!rowData.SourceId ? parseInt(rowData.SourceId) : null })
				form.setFieldsValue({ PurposeId: !!rowData.PurposeId ? parseInt(rowData.PurposeId) : null })
				form.setFieldsValue({ LearningNeedId: !!rowData.LearningNeedId ? parseInt(rowData.LearningNeedId) : null })
				form.setFieldsValue({ SaleId: !!rowData.SaleId ? parseInt(rowData.SaleId) : null })
				form.setFieldsValue({ BranchId: !!rowData.BranchId ? parseInt(rowData.BranchId) : null })
				form.setFieldsValue({ CustomerStatusId: !!rowData.CustomerStatusId ? parseInt(rowData.CustomerStatusId) : null })
				form.setFieldsValue({ DistrictId: !!rowData.DistrictId ? parseInt(rowData.DistrictId) : null })
				form.setFieldsValue({ WardId: !!rowData.WardId ? parseInt(rowData.WardId) : null })
			}
		}
	}, [isModalVisible])

	const getDistrictByArea = async (areaId) => {
		try {
			const response = await districtApi.getAllByArea(areaId)
			if (response.status === 200) {
				const convertDistrict = parseSelectArray(response.data.data, 'Name', 'Id')
				setDistricts(convertDistrict)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	const getWardByDistrict = async (districtId) => {
		try {
			const response = await wardApi.getAllByDistrict(districtId)
			if (response.status === 200) {
				const convertWard = parseSelectArray(response.data.data, 'Name', 'Id')
				setWards(convertWard)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	const handleSelect = async (name, value) => {
		if (name === 'AreaId') {
			form.setFieldValue('DistrictId', null)
			form.setFieldValue('WardId', null)
			getDistrictByArea(value)
		}
		if (name === 'DistrictId') {
			getWardByDistrict(value)
			form.setFieldValue('WardId', null)
		}
	}

	function removeContaining(arr) {
		return arr.filter((person) => person?.value !== 2)
	}

	function onClickCreate() {
		toggle()
		if (!!refPopover) {
			refPopover.current.close()
		}
	}

	function toggle() {
		setIsModalVisible(!isModalVisible)
	}

	return (
		<>
			{rowData ? (
				isStudent ? (
					<IconButton tooltip="Tạo học viên" icon="login" color="green" type="button" onClick={toggle} />
				) : (
					<IconButton type="button" color="yellow" tooltip="Cập nhật" icon="edit" onClick={toggle} />
				)
			) : (
				<PrimaryButton className={className} background="green" icon="add" type="button" onClick={onClickCreate}>
					Thêm mới
				</PrimaryButton>
			)}

			<Modal
				title={rowData ? (isStudent ? 'Chuyển học viên' : 'Cập nhật thông tin khách hàng') : 'Thêm khách hàng'}
				open={isModalVisible}
				onCancel={toggle}
				footer={null}
				width={800}
				centered
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={checkExistCustomer}>
						<div className="row">
							{isStudent && (
								<>
									<div className="col-12">
										<UploadImageField name="Avatar" label="Hình ảnh" form={form} />
									</div>
									<div className="col-md-6 col-12">
										<InputTextField name="UserName" label="Tên đăng nhập" isRequired={true} rules={formRequired} />
									</div>
									<div className="col-md-6 col-12">
										<InputTextField name="Password" label="Mật khẩu" isRequired={true} rules={formRequired} />
									</div>
								</>
							)}

							<div className="col-md-6 col-12">
								<InputTextField name="FullName" label="Họ tên" isRequired={true} rules={[yupSync]} />
							</div>

							<div className="col-md-6 col-12">
								<InputTextField name="Mobile" label="Số điện thoại" isRequired={true} rules={[yupSync]} />
							</div>
						</div>

						<div className="w-full grid grid-cols-2 gap-x-4">
							<Form.Item name="JobId" className="col-span-1" label="Công việc" rules={formNoneRequired}>
								<Select className="primary-input" placeholder="Chọn công việc">
									{jobs.map((item) => {
										return (
											<Select.Option key={item.Id} value={item.Id}>
												{item.Name}
											</Select.Option>
										)
									})}
								</Select>
							</Form.Item>

							<div className="col-span-1">
								<InputTextField name="Email" label="Email" isRequired={true} rules={[yupSync]} />
							</div>
						</div>

						<div className="row">
							{isStudent && (
								<>
									<div className="col-md-6 col-12">
										<DatePickerField mode="single" name="DOB" label="Ngày sinh" />
									</div>
									<div>
										<SelectField
											className="col-12"
											label="Giới tính"
											name="Gender"
											placeholder="Chọn giới tính"
											optionList={[
												{ value: 0, title: 'Khác' },
												{ value: 1, title: 'Nam' },
												{ value: 2, title: 'Nữ' }
											]}
										/>
									</div>
								</>
							)}
						</div>

						<Divider className="col-span-4" orientation="center">
							Địa chỉ
						</Divider>
						<div className="row">
							<div className="col-md-6 col-12">
								<SelectField
									name="AreaId"
									label="Tỉnh/Thành phố"
									optionList={convertAreaSelect}
									isRequired={false}
									onChangeSelect={(value) => handleSelect('AreaId', value)}
								/>
							</div>

							<div className="col-md-6 col-12">
								<SelectField
									name="DistrictId"
									label="Quận/Huyện"
									optionList={districts}
									isRequired={false}
									onChangeSelect={(value) => handleSelect('DistrictId', value)}
								/>
							</div>

							<div className="col-md-6 col-12">
								<SelectField name="WardId" label="Phường/Xã" optionList={wards} isRequired={false} />
							</div>

							<div className="col-md-6 col-12">
								<InputTextField name="Address" label="Địa chỉ" isRequired={false} />
							</div>
						</div>
						<Divider className="col-span-4" orientation="center">
							Thông tin học
						</Divider>
						<div className="row">
							<div className={`${rowData ? (isStudent ? 'col-md-12 col-12' : 'col-md-6 col-12') : 'col-12'}`}>
								<SelectField
									placeholder="Chọn trung tâm"
									name={isStudent ? 'BranchIds' : 'BranchId'}
									label="Trung tâm"
									optionList={branch}
									isRequired
									rules={formRequired}
								/>
							</div>

							{rowData && !isStudent && (
								<div className="col-md-6 col-12">
									<SelectField
										placeholder="Chọn tình trạng tư vấn"
										name="CustomerStatusId"
										label="Tình trạng tư vấn"
										optionList={removeContaining(customerStatus)}
									/>
								</div>
							)}
						</div>

						<div className="row">
							<div className="col-md-6 col-12">
								<SelectField placeholder="Chọn nhu cầu học" name="LearningNeedId" label="Nhu cầu học" optionList={learningNeed} />
							</div>
							<div className="col-md-6 col-12">
								<SelectField placeholder="Chọn mục đích học" name="PurposeId" label="Mục đích học" optionList={purpose} />
							</div>
							<div className="col-md-6 col-12">
								<SelectField name="SourceId" label="Nguồn" placeholder="Chọn nguồn" optionList={source} />
							</div>
							{!isSaler() && (
								<div className="col-md-6 col-12">
									<SelectField name="SaleId" label="Tư vấn viên" placeholder="Chọn tư vấn viên" optionList={sale} />
								</div>
							)}
						</div>

						<div className="row mt-3">
							<div className="col-12 flex-all-center">
								<PrimaryButton background="blue" type="submit" icon="save" disable={isLoading} loading={isLoading}>
									Lưu
								</PrimaryButton>
							</div>
						</div>
					</Form>
				</div>
			</Modal>

			{existCustomer && (
				<CustomerModalConfirm
					confirmExistCustomer={existCustomer}
					setConfirmExistCustomer={setExistCustomer}
					onSubmit={onSubmit}
					dataSubmit={dataSubmit}
				/>
			)}
		</>
	)
})

export default CustomerAdviseForm
