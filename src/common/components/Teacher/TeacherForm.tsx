import { DeploymentUnitOutlined, MailOutlined, WhatsAppOutlined } from '@ant-design/icons'
import { yupResolver } from '@hookform/resolvers/yup'
import { Divider, Form, Modal, Spin, Tooltip } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Edit } from 'react-feather'
import { useForm } from 'react-hook-form'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
import * as yup from 'yup'
import UploadFileField from '~/common/components/FormControl/UploadFileField'
import DatePickerField from '~/common/components/FormControl/DatePickerField'
import InputPassField from '~/common/components/FormControl/InputPassField'
import InputTextField from '~/common/components/FormControl/InputTextField'
import SelectField from '~/common/components/FormControl/SelectField'
import UploadImageField from '~/common/components/FormControl/UploadImageField'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
// import { useWrap } from '~/src/context/wrap'

const TeacherForm = (props) => {
	const {
		handleCreateTeacher,
		isUpdate,
		handleUpdateTeacher,
		updateObj,
		isLoading,
		indexUpdateObj,
		isClearForm,
		optionStatusList,
		optionGenderList,
		optionAreaSystemList,
		handleFetchDistrict,
		handleFetchWard,
		optionBranchList,
		handleFetchBranch
	} = props
	const { areaList, districtList, wardList } = optionAreaSystemList
	const [isModalVisible, setIsModalVisible] = useState(false)
	// const { userInformation } = useWrap()
	const { information: userInformation } = useSelector((state: RootState) => state.user)

	const openModal = () => {
		setIsModalVisible(true)
		handleFetchBranch && handleFetchBranch(updateObj?.AreaID)
		if (isUpdate && updateObj && updateObj.AreaID) {
			if (handleFetchBranch) {
			}
			if (handleFetchDistrict) {
				handleFetchDistrict(updateObj.AreaID)
			}
			if (handleFetchWard && updateObj.DistrictID) {
				handleFetchWard(updateObj.DistrictID)
			}
		}
	}
	const closeModal = () => setIsModalVisible(false)
	// const schemaBase = yup.object().shape({
	// 	UserName: yup.string().nullable().required('Bạn không được để trống'),
	// 	Branch: yup.array().min(1, 'Bạn phải chọn ít nhất 1 trung tâm').required('Bạn không được để trống'),
	// 	AreaID: yup.array().nullable().min(1, 'Bạn phải chọn ít nhất 1 Tỉnh/thành phố'),
	// 	FullNameUnicode: yup.string().required('Bạn không được để trống'),
	// 	Email: yup.string().email('Email không đúng định dạng').required('Bạn không được để trống'),
	// 	Mobile: yup
	// 		.string()
	// 		.nullable()
	// 		.matches(/(\+84|0)\d{9,10}/, 'Số điện thoại không đúng định dạng')
	// 		.required('Bạn không được để trống')
	// })
	// const schemaUpdate = yup.object().shape({
	// 	DistrictID: yup.number().nullable(),
	// 	WardID: yup.number().nullable(),
	// 	HouseNumber: yup.string().nullable(),
	// 	Avatar: yup.string().nullable(),
	// 	DOB: yup.string().nullable(),
	// 	Gender: yup.number().nullable().oneOf([0, 1, 2]),
	// 	CMND: yup.string().nullable(),
	// 	CMNDDate: yup.string().nullable(),
	// 	CMNDRegister: yup.string().nullable(),
	// 	Extension: yup.string().nullable(),
	// 	StatusID: yup.number().nullable().oneOf([0, 1]),
	// 	Password: yup.string().nullable(),
	// 	Mobile: yup
	// 		.string()
	// 		.nullable()
	// 		.matches(/(\+84|0)\d{9,10}/, 'Số điện thoại không đúng định dạng')
	// 		.required('Bạn không được để trống')
	// })

	// const schema = isUpdate ? schemaBase.concat(schemaUpdate) : schemaBase

	// const defaultValuesInit = {
	// 	AreaID: null,
	// 	Branch: undefined,
	// 	FullNameUnicode: '',
	// 	UserCode: null,
	// 	LinkFaceBook: '',
	// 	Jobdate: moment().format('YYYY/MM/DD'),
	// 	Email: '',
	// 	Mobile: '',
	// 	Address: '',
	// 	DistrictID: null,
	// 	WardID: null,
	// 	HouseNumber: '',
	// 	Avatar: '',
	// 	DOB: '',
	// 	Gender: 0,
	// 	CMND: '',
	// 	CMNDDate: '',
	// 	CMNDRegister: '',
	// 	Extension: '',
	// 	StatusID: 1,
	// 	Password: '',
	// 	ContractOfStaff: null, //file hợp đồng
	// 	DegreeOfStaff: null, //file bằng cấp
	// 	BankAccountNumber: null,
	// 	BankAccountHolderName: null,
	// 	BankBranch: null,
	// 	UserName: null
	// }

	// const form = useForm({
	// 	defaultValues: defaultValuesInit,
	// 	resolver: yupResolver(schema)
	// })

	const [form] = Form.useForm()

	// Get file
	const getFile = (file, type) => {
		switch (type) {
			case 'contract':
				form.setFieldValue('ContractOfStaff', file)
				break
			case 'degree':
				form.setFieldValue('DegreeOfStaff', file)
				break
			default:
				break
		}
	}

	useEffect(() => {
		if (isUpdate && updateObj) {
			form.resetFields({
				...updateObj,
				Branch: updateObj.Branch.map((obj) => obj.ID)
			})
		}
	}, [updateObj])

	useEffect(() => {
		isClearForm && form.resetFields()
	}, [isClearForm])

	const checkHandleFetchBranch = (value) => {
		if (!handleFetchBranch) return
		form.setFieldValue('Branch', undefined)
		form.setFieldValue('DistrictID', null)
		form.setFieldValue('WardID', null)
		handleFetchBranch(value)
	}
	const checkHandleFetchDistrict = (value) => {
		if (!handleFetchDistrict) return
		handleFetchDistrict(value)
	}
	const checkHandleFetchWard = (value) => {
		if (!handleFetchWard) return
		form.setFieldValue('WardID', null)
		handleFetchWard(value)
	}
	const teacherSwitchFunc = (data) => {
		switch (isUpdate) {
			case true:
				if (!handleUpdateTeacher) return
				handleUpdateTeacher(data, indexUpdateObj).then((res) => {
					if (res && res.status === 200) {
						closeModal()
					}
				})
				break
			case false:
				if (!handleCreateTeacher) return
				handleCreateTeacher(data).then((res) => {
					if (res && res.status === 200) {
						closeModal()
					}
				})
				break
			default:
				break
		}
	}

	return (
		<>
			{isUpdate ? (
				<button className="btn btn-icon edit" onClick={openModal}>
					<Tooltip title="Cập nhật">
						<Edit />
					</Tooltip>
				</button>
			) : (
				<button className="btn btn-warning add-new" onClick={openModal}>
					<MdAddCircleOutline size={18} className="mr-2" />
					Thêm mới
				</button>
			)}
			<Modal
				style={{ top: isUpdate ? 20 : 100 }}
				title={isUpdate ? 'Cập nhật giáo viên' : 'Thêm giáo viên'}
				visible={isModalVisible}
				onCancel={closeModal}
				footer={
					isUpdate ? (
						<div className="row">
							<div className="col-12 d-flex justify-content-center">
								<button
									type="submit"
									className="btn btn-primary w-100"
									onClick={teacherSwitchFunc}
									disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
								>
									<MdSave size={18} className="mr-2" />
									Cập nhật
									{isLoading.type === 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					) : null
				}
				className={`${isUpdate && 'modal-scroll'} modal-50`}
			>
				<div className="box-form">
					<Form layout="vertical" onFinish={teacherSwitchFunc}>
						{isUpdate ? (
							<div className="row">
								<div className="col-12">
									<div className="info-modal">
										<div className="info-modal-avatar">
											<UploadImageField label="" style={{ marginBottom: 0 }} form={form} name="Avatar" />
										</div>
										<div className="info-modal-content">
											{isUpdate && (
												<div className="box-info-modal">
													<p className="name">{updateObj.FullNameUnicode}</p>
													<p className="detail">
														<span className="icon role">
															<DeploymentUnitOutlined />
														</span>
														<span className="text">{updateObj.Branch.map((b) => b.BranchName).join(', ')}</span>
													</p>
													<p className="detail">
														<span className="icon mobile">
															<WhatsAppOutlined />
														</span>
														<span className="text">{updateObj.Mobile}</span>
													</p>
													<p className="detail">
														<span className="icon email">
															<MailOutlined />
														</span>
														<span className="text">{updateObj.Email}</span>
													</p>
												</div>
											)}
										</div>
									</div>
								</div>
								<div className="col-12">
									<Divider orientation="center">Thông tin cơ bản</Divider>
								</div>
								<div className="col-md-6 col-12">
									<InputTextField name="UserName" label="Tên đăng nhập" disabled={true} />
								</div>
								<div className="col-md-6 col-12">
									<InputPassField name="Password" label="Mật khẩu" placeholder="Nhập mật khẩu" />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField name="Email" label="Email" placeholder="Nhập email" isRequired={true} />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField name="FullNameUnicode" label="Họ và tên" placeholder="Nhập họ và tên" isRequired={true} />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField name="UserCode" label="Mã giáo viên" placeholder="Nhập mã giáo viên" />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField name="Mobile" label="Số điện thoại" placeholder="Nhập số điện thoại" isRequired={true} />
								</div>
								<div className="col-md-6 col-12">
									<DatePickerField mode="single" name="DOB" label="Ngày sinh" placeholder="Chọn ngày sinh" />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField name="CMND" label="Số CMND" placeholder="Nhập số CMND" />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField name="CMNDRegister" label="Nơi cấp CMND" placeholder="Nhập nơi cấp CMND" />
								</div>
								<div className="col-md-6 col-12">
									<DatePickerField mode="single" name="CMNDDate" label="Ngày cấp CMND" placeholder="Chọn ngày cấp CMND" />
								</div>
								<div className="col-md-6 col-12">
									<SelectField name="Gender" label="Giới tính" optionList={optionGenderList} placeholder="Chọn giới tính" />
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										disabled={userInformation?.RoleId === 1 ? false : true}
										name="StatusID"
										label="Trạng thái hoạt động"
										optionList={optionStatusList}
										placeholder="Chọn trạng thái hoạt động"
									/>
								</div>

								<div className="col-12">
									<Divider orientation="center">Địa chỉ</Divider>
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										isRequired={false}
										name="AreaID"
										label="Tỉnh/Thành phố"
										optionList={areaList}
										onChangeSelect={(value) => {
											checkHandleFetchBranch(value)
											checkHandleFetchDistrict(value)
										}}
										placeholder="Chọn tỉnh/thành phố"
									/>
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										name="DistrictID"
										label="Quận/Huyện"
										optionList={districtList}
										onChangeSelect={checkHandleFetchWard}
										isLoading={isLoading.type === 'FETCH_DATA_BY_AREA' && isLoading.status}
										placeholder="Chọn quận/huyện"
									/>
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										name="WardID"
										label="Phường/Xã"
										optionList={wardList}
										isLoading={isLoading.type === 'FETCH_WARD_BY_DISTRICT' && isLoading.status}
										placeholder="Chọn phường/xã"
									/>
								</div>
								<div className="col-md-6 col-12">
									<InputTextField name="Extension" label="Mô tả thêm" placeholder="Nhập mô tả thêm" />
								</div>
								<div className="col-12">
									<InputTextField name="HouseNumber" label="Số nhà/Tên đường" placeholder="Nhập số nhà/tên đường" />
								</div>
								<div className="col-12">
									<Divider orientation="center">Khác</Divider>
								</div>
								<div className="col-md-6 col-12">
									<Form.Item label="Hợp đồng">
										{/* <UploadFile getFile={(file) => getFile(file, 'contract')} /> */}
										<UploadFileField label="" form={form} name="contract" />
										{updateObj?.ContractOfStaff && (
											<a href={updateObj?.ContractOfStaff} className="link-upload">
												File hợp đồng
											</a>
										)}
									</Form.Item>
								</div>
								<div className="col-md-6 col-12">
									<Form.Item label="Bằng cấp">
										{/* <UploadFile url={updateObj?.DegreeOfStaff} getFile={(file) => getFile(file, 'degree')} /> */}
										<UploadFileField name="degree" label="" form={form} />
										{updateObj?.ContractOfStaff && (
											<a href={updateObj?.ContractOfStaff} className="link-upload">
												File hợp đồng
											</a>
										)}
									</Form.Item>
								</div>

								<div className="col-12 mb-4">
									<p className="font-weight-primary-red">*Lưu ý: Upload tối đa 100Mb</p>
								</div>

								<div className="col-md-6 col-12">
									<SelectField
										name="Branch"
										label="Trung tâm"
										mode="multiple"
										optionList={optionBranchList}
										isLoading={isLoading.type === 'FETCH_DATA_BY_AREA' && isLoading.status}
										placeholder="Chọn trung tâm"
									/>
								</div>
								<div className="col-md-6 col-12">
									<DatePickerField
										mode="single"
										isRequired={false}
										name="Jobdate"
										label="Ngày nhận việc"
										placeholder="Chọn ngày nhận việc"
									/>
								</div>

								<div className="col-md-6 col-12">
									<InputTextField name="LinkFaceBook" label="Link Facebook" placeholder="Nhập link facebook" />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField name="Address" label="Địa chỉ" placeholder="Nhập địa chỉ" />
								</div>

								{/** ==== Thông tin ngân hàng  ====*/}
								<div className="col-12">
									<Divider orientation="center">Thông tin ngân hàng</Divider>
								</div>
								<div className="col-md-12 col-12">
									<InputTextField name="Bank" label="Tên ngân hàng" />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField name="BankAccountHolderName" label="Tên chủ thẻ" />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField name="BankAccountNumber" label="Số tài khoản" />
								</div>
								<div className="col-md-12 col-12">
									<InputTextField name="BankBranch" label="Chi nhánh ngân hàng" />
								</div>
							</div>
						) : (
							<div className="row">
								<div className="col-md-6 col-12">
									<SelectField
										name="AreaID"
										label="Tỉnh/thành phố"
										optionList={areaList}
										onChangeSelect={checkHandleFetchBranch}
										placeholder="Chọn tỉnh/thành phố"
										isRequired={true}
									/>
									<InputTextField name="UserName" label="Tên đăng nhập" placeholder="Nhập tên đăng nhập" isRequired={true} />
									<InputTextField name="FullNameUnicode" label="Họ và tên" placeholder="Nhập họ và tên" isRequired={true} />
									<InputTextField name="Email" label="Email" placeholder="Nhập email" isRequired={true} />
									{/* <DateField  name="Jobdate" label="Ngày nhận việc" placeholder="Chọn ngày nhận việc" isRequired={true} /> */}
								</div>
								<div className="col-md-6 col-12">
									<SelectField
										name="Branch"
										label="Trung tâm"
										mode="multiple"
										optionList={optionBranchList}
										isLoading={isLoading.type === 'FETCH_DATA_BY_AREA' && isLoading.status}
										placeholder="Chọn trung tâm"
										isRequired={true}
									/>
									<InputTextField name="Mobile" label="Số điện thoại" placeholder="Nhập số điện thoại" isRequired={true} />
									<InputTextField name="LinkFaceBook" label="Link Facebook" placeholder="Nhập link facebook" />
									<DatePickerField
										mode="single"
										name="Jobdate"
										label="Ngày nhận việc"
										placeholder="Chọn ngày nhận việc"
										isRequired={true}
									/>
								</div>
								<div className="col-12">
									<InputTextField name="Address" label="Địa chỉ" placeholder="Nhập địa chỉ" />
								</div>
								<div className="col-md-6 col-12">
									<Form.Item label="Hợp đồng">
										{/* <UploadFile getFile={(file) => getFile(file, 'contract')} /> */}
										<UploadFileField label="" name="contract" form={form} />
										{updateObj?.ContractOfStaff && (
											<a href={updateObj?.ContractOfStaff} className="link-upload">
												File hợp đồng
											</a>
										)}
									</Form.Item>
								</div>
								<div className="col-md-6 col-12">
									<Form.Item label="Bằng cấp">
										{/* <UploadFile url={updateObj?.DegreeOfStaff} getFile={(file) => getFile(file, 'degree')} /> */}
										<UploadFileField label="" name="degree" form={form} />
										{updateObj?.ContractOfStaff && (
											<a href={updateObj?.ContractOfStaff} className="link-upload">
												File hợp đồng
											</a>
										)}
									</Form.Item>
								</div>

								<div className="col-12 mb-4">
									<p className="font-weight-primary-red">*Lưu ý: Upload tối đa 100Mb</p>
								</div>

								{/** ==== Thông tin ngân hàng  ====*/}
								<div className="col-12">
									<Divider orientation="center">Thông tin ngân hàng</Divider>
								</div>
								<div className="col-md-12 col-12">
									<InputTextField name="Bank" label="Tên ngân hàng" />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField name="BankAccountHolderName" label="Tên chủ thẻ" />
								</div>
								<div className="col-md-6 col-12">
									<InputTextField name="BankAccountNumber" label="Số tài khoản" />
								</div>
								<div className="col-md-12 col-12">
									<InputTextField name="BankBranch" label="Chi nhánh ngân hàng" />
								</div>
								<div className="col-12 mt-3">
									<button type="submit" className="btn btn-primary w-100" disabled={isLoading.type === 'ADD_DATA' && isLoading.status}>
										Thêm mới
										{isLoading.type === 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
									</button>
								</div>
							</div>
						)}
					</Form>
				</div>
			</Modal>
		</>
	)
}
export default TeacherForm
