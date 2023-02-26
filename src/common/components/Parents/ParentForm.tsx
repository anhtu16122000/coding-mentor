import { MailOutlined, WhatsAppOutlined } from '@ant-design/icons'
import { yupResolver } from '@hookform/resolvers/yup'
import { Divider, Form, Modal, Spin, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { Edit } from 'react-feather'
// import { useForm } from 'react-hook-form'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
// import * as yup from 'yup'
// import { districtApi, wardApi } from '~/src/apiBase'
import { districtApi, wardApi } from '~/api/area'
import UploadImageField from '~/common/components/FormControl/UploadImageField'
import DatePickerField from '~/common/components/FormControl/DatePickerField'
import InputPassField from '~/common/components/FormControl/InputPassField'
import InputTextField from '~/common/components/FormControl/InputTextField'
import SelectField from '~/common/components/FormControl/SelectField'
import TextBoxField from '~/common/components/FormControl/TextBoxField'
import { RootState } from '~/store'
import { useSelector } from 'react-redux'
import { ShowNoti } from '~/common/utils'
// import { useWrap } from '~/src/context/wrap'
let returnSchema = {}
let schema = null
interface listData {
	Area: Array<Object>
	DistrictID: Array<Object>
	WardID: Array<Object>
	Role: Array<Object>
	Branch: Array<Object>
	Purposes: Array<Object>
	SourceInformation: Array<Object>
	Parent: Array<Object>
	Counselors: Array<Object>
}

const optionGender = [
	{
		value: 0,
		title: 'Khác'
	},
	{
		value: 1,
		title: 'Nam'
	},
	{
		value: 2,
		title: 'Nữ'
	}
]

const ParentsForm = (props) => {
	const { rowData, listDataForm, onSubmit, isLoading, rowID, getIndex, index, onSubmitSalary } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const { information: userInformation } = useSelector((state: RootState) => state.user)
	// const { showNoti } = useWrap()
	const showModal = () => {
		setIsModalVisible(true)
		rowID && getIndex(index)
	}
	// const { userInformation } = useWrap()

	const [loadingSelect, setLoadingSelect] = useState({
		status: false,
		name: ''
	})
	const [listData, setListData] = useState<listData>(listDataForm)
	const [imageUrl, setImageUrl] = useState(null)
	const [disableCenter, setDisableCenter] = useState(false)
	const [statusAdd, setStatusAdd] = useState('add-staff')
	const [dataStaff, setDataStaff] = useState(null)
	const [submitSalary, setSubmitSalary] = useState(true)

	const makeNewData = (data, name) => {
		let newData = null
		switch (name) {
			case 'Area':
				newData = data.map((item) => ({
					title: item.AreaName,
					value: item.AreaID
				}))
				break
			case 'DistrictID':
				newData = data.map((item) => ({
					title: item.DistrictName,
					value: item.ID
				}))
				break
			case 'WardID':
				newData = data.map((item) => ({
					title: item.WardName,
					value: item.ID
				}))
				break
			case 'Branch':
				newData = data.map((item) => ({
					title: item.BranchName,
					value: item.ID
				}))
				break
			case 'Job':
				newData = data.map((item) => ({
					title: item.JobName,
					value: item.JobID
				}))
				break
			case 'Purposes':
				newData = data.map((item) => ({
					title: item.PurposesName,
					value: item.PurposesID
				}))
				break
			case 'Parent':
				newData = data.map((item) => ({
					title: item.FullNameUnicode,
					value: item.UserInformationID
				}))
				break
			case 'SourceInformation':
				newData = data.map((item) => ({
					title: item.SourceInformationName,
					value: item.SourceInformationID
				}))
				break
			case 'Counselors':
				newData = data.map((item) => ({
					title: item.FullNameUnicode,
					value: item.UserInformationID
				}))
				break
			default:
				break
		}

		return newData
	}

	const getDataTolist = (data: any, name: any) => {
		let newData = makeNewData(data, name)

		Object.keys(listData).forEach(function (key) {
			if (key == name) {
				listData[key] = newData
			}
		})
		setListData({ ...listData })
	}

	const getDataWithID = async (ID, name) => {
		console.log('NAME is: ', name)

		let res = null
		setLoadingSelect({
			status: true,
			name: name
		})
		try {
			switch (name) {
				case 'DistrictID':
					res = await districtApi.getAll({
						AreaID: ID,
						pageIndex: 1,
						pageSize: 100
					})
					break
				case 'WardID':
					res = await wardApi.getAll({
						DistrictID: ID,
						pageIndex: 1,
						pageSize: 100
					})
					break
				default:
					break
			}

			res.status == 200 && getDataTolist(res.data.data, name)
			// res.status == 204 && showNoti('danger', name + ' không có dữ liệu')
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoadingSelect({
				status: false,
				name: name
			})
		}
	}

	// ----- HANDLE CHANGE - AREA ----------
	const handleChange_select = (value, name) => {
		console.log('Value is: ', value)

		if (name == 'DistrictID') {
			form.setFieldValue('WardID', null)

			listData.DistrictID = []
			listData.WardID = []
			setListData({ ...listData })
		}
		form.setFieldValue(name, null)
		getDataWithID(value, name)
	}

	// -----  HANDLE ALL IN FORM -------------
	// const defaultValuesInit = {
	// 	FullNameUnicode: null,
	// 	UserCode: null,
	// 	LinkFaceBook: null,
	// 	Email: '',
	// 	Mobile: null,
	// 	AreaID: null, //int id Tỉnh / Thành phố
	// 	DistrictID: null, //int id Quận/Huyện
	// 	WardID: null, //int id Phường/Xã
	// 	HouseNumber: null, //Nhập số nhà tên đường
	// 	Address: null, //bỏ trống - chỉ nhập khi khách hàng có địa chỉ không cụ thể
	// 	Avatar: null, //Lưu link file hình
	// 	DOB: null, //ngày sinh
	// 	// Jobdate: null,
	// 	Gender: null, //int 0-Nữ 1-Nam 2-Khác
	// 	CMND: null, //int số CMND
	// 	CMNDDate: null, //Ngày làm
	// 	CMNDRegister: null, //Nơi làm CMND
	// 	Extension: null, //giới thiệu thêm
	// 	Branch: undefined, //string : id của trung tâm - LƯU Ý NẾU TỪ 2 TRUNG TÂM TRỞ LÊN THÌ NHẬP(ID,ID,ID)
	// 	// RoleID: null, //int mã công việc
	// 	StatusID: null,
	// 	Password: null,
	// 	UserName: null
	// }

	// ;(function returnSchemaFunc() {
	// 	returnSchema = { ...defaultValuesInit }
	// 	Object.keys(returnSchema).forEach(function (key) {
	// 		switch (key) {
	// 			case 'UserName':
	// 				returnSchema[key] = yup.string().nullable().required('Bạn không được để trống')
	// 				break
	// 			case 'Email':
	// 				returnSchema[key] = yup.string().email('Email nhập sai cú pháp').required('Bạn không được để trống')
	// 				break
	// 			case 'FullNameUnicode':
	// 				returnSchema[key] = yup.string().nullable().required('Bạn không được để trống')
	// 				break
	// 			case 'Mobile':
	// 				returnSchema[key] = yup
	// 					.string()
	// 					.nullable()
	// 					.matches(/(\+84|0)\d{9,10}/, 'Số điện thoại không đúng định dạng')
	// 					.required('Bạn không được để trống')
	// 				break
	// 			case 'CounselorsID':
	// 				returnSchema[key] = yup.mixed().required('Bạn không được để trống')
	// 				break
	// 			case 'Branch':
	// 				if (!disableCenter) {
	// 					returnSchema[key] = yup.array().required('Bạn không được để trống')
	// 				}

	// 				break
	// 			default:
	// 				break
	// 		}
	// 	})

	// 	schema = yup.object().shape(returnSchema)
	// })()

	// const form = useForm({
	// 	defaultValues: defaultValuesInit,
	// 	resolver: yupResolver(schema)
	// })

	const [form] = Form.useForm()

	// ----------- SUBMI FORM ------------
	const onSubmitForm = (data: any) => {
		console.log('DATA staff: ', data)

		let res = onSubmit(data)
		res.then(function (rs: any) {
			if (rs) {
				if (rs.status == 200) {
					if (!rowData) {
						form.resetFields()
						setImageUrl('')
					}
					setIsModalVisible(false)
				}
			}
		})
	}

	const changeVisible = () => {
		if (isModalVisible) {
			setIsModalVisible(false)
			setStatusAdd('add-staff')
		}
	}

	useEffect(() => {
		if (isModalVisible) {
			if (rowData) {
				let arrBranch = []
				let cloneRowData = { ...rowData }
				cloneRowData.Branch.forEach((item, index) => {
					arrBranch.push(item.ID)
				})
				cloneRowData.Branch = arrBranch
				cloneRowData.Password = ''

				form.resetFields(cloneRowData)
				cloneRowData.AreaID && getDataWithID(cloneRowData.AreaID, 'DistrictID')
				cloneRowData.DistrictID && getDataWithID(cloneRowData.DistrictID, 'WardID')
				setImageUrl(cloneRowData.Avatar)
			} else {
				form.setFieldValue('StatusID', 0)
			}
		}
	}, [isModalVisible])

	return (
		<>
			{rowID ? (
				<button className="btn btn-icon edit" onClick={showModal}>
					<Tooltip title="Cập nhật">
						<Edit />
					</Tooltip>
				</button>
			) : (
				<button className="btn btn-warning add-new" onClick={showModal}>
					<MdAddCircleOutline size={18} className="mr-2" />
					Thêm mới
				</button>
			)}

			<Modal
				style={{ top: 20 }}
				title={statusAdd == 'add-staff' ? (rowID ? 'Cập nhật phụ huynh' : 'Tạo mới phụ huynh') : 'Thêm lương cho phụ huynh'}
				visible={isModalVisible}
				footer={
					statusAdd == 'add-staff' ? (
						<div className="row">
							<div className="col-12 d-flex justify-content-center">
								<div style={{ paddingRight: 5 }}>
									<button
										type="button"
										className="btn btn-primary w-100"
										onClick={onSubmitForm}
										disabled={isLoading.type === 'ADD_DATA' && isLoading.status}
									>
										<MdSave size={18} className="mr-2" />
										Lưu phụ huynh
										{isLoading.type === 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
									</button>
								</div>
							</div>
						</div>
					) : null
				}
				onCancel={() => setIsModalVisible(false)}
				className={`${statusAdd == 'add-staff' ? 'modal-50 modal-scroll' : ''}`}
			>
				<div className="box-form form-staff">
					<Form form={form} layout="vertical">
						<div className="row">
							{/** ==== Thông tin cơ bản  ====*/}
							<div className="col-12">
								<div className="info-modal">
									<div className="info-modal-avatar">
										{/* <AvatarBase imageUrl={imageUrl} getValue={(value) => form.setValue('Avatar', value)} /> */}
										<UploadImageField name="Avatar" label="" form={form} />
									</div>
									<div className="info-modal-content">
										{rowData && (
											<div className="box-info-modal">
												<p className="name">{rowData.FullNameUnicode}</p>
												<p className="detail">
													<span className="icon mobile">
														<WhatsAppOutlined />
													</span>
													<span className="text">{rowData.Mobile}</span>
												</p>
												<p className="detail">
													<span className="icon email">
														<MailOutlined />
													</span>
													<span className="text">{rowData.Email}</span>
												</p>
											</div>
										)}
									</div>
								</div>
							</div>
							<div className="col-12">
								<Divider orientation="center">Thông tin cơ bản</Divider>
							</div>
							{rowID && (
								<div className="col-md-6 col-12">
									<InputTextField name="UserName" label="Tên đăng nhập" disabled={true} />
								</div>
							)}
							{rowID && (
								<div className="col-md-6 col-12">
									<InputPassField name="Password" label="Mật khẩu" placeholder="Nhập mật khẩu" />
								</div>
							)}

							<div className="col-md-6 col-12">
								<InputTextField name="UserName" label="Tên đăng nhập" placeholder="Nhập tên đăng nhập" isRequired={true} />
							</div>

							<div className="col-md-6 col-12">
								<InputTextField name="Email" label="Email" placeholder="Nhập email" isRequired={true} />
							</div>

							<div className="col-md-6 col-12">
								<InputTextField name="FullNameUnicode" label="Họ và tên" placeholder="Nhập họ và tên" isRequired={true} />
							</div>
							{rowID && (
								<div className="col-md-6 col-12">
									<InputTextField name="UserCode" label="Mã phụ huynh" placeholder="Nhập mã phụ huynh" isRequired={true} />
								</div>
							)}
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
								<SelectField name="Gender" label="Giới tính" optionList={optionGender} placeholder="Chọn giới tính" />
							</div>

							<div className="col-md-6 col-12">
								<SelectField
									disabled={!rowID ? true : userInformation?.RoleId === 1 ? false : true}
									name="StatusID"
									label="Trạng thái hoạt động"
									optionList={[
										{
											value: 0,
											title: 'Hoạt động'
										},
										{
											value: 1,
											title: 'Khóa'
										}
									]}
									placeholder="Chọn trạng thái hoạt động"
								/>
							</div>

							{/** ==== Địa chỉ  ====*/}
							<div className="col-12">
								<Divider orientation="center">Địa chỉ</Divider>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									// form={form}
									name="AreaID"
									label="Tỉnh / Thành phố"
									// optionList={listData.Area}
									optionList={[{ title: 'Giáo viên', value: 1 }]}
									onChangeSelect={
										(value) => handleChange_select(value, 'DistrictID') // Select Area to load District
									}
									placeholder="Chọn tỉnh / Thành phố"
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									isLoading={loadingSelect.name == 'DistrictID' && loadingSelect.status}
									// form={form}
									name="DistrictID"
									label="Quận/Huyện"
									// optionList={listData.DistrictID}
									optionList={[{ title: 'Giáo viên', value: 1 }]}
									onChangeSelect={
										(value) => handleChange_select(value, 'WardID') // Select District to load Ward
									}
									placeholder="Chọn quận/huyện"
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									isLoading={loadingSelect.name == 'WardID' && loadingSelect.status}
									// form={form}
									name="WardID"
									label="Phường/Xã"
									// optionList={listData.WardID}
									optionList={[{ title: 'Giáo viên', value: 1 }]}
									placeholder="Chọn phường/xã"
								/>
							</div>
							<div className="col-md-6 col-12">
								<InputTextField name="Address" label="Mô tả thêm" placeholder="Nhập mô tả thêm" />
							</div>
							<div className="col-md-12 col-12">
								<InputTextField name="HouseNumber" label="Số nhà/tên đường" placeholder="Nhập số nhà/tên đường" />
							</div>
							{/** ==== Khác  ====*/}
							<div className="col-12">
								<Divider orientation="center">Khác</Divider>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									isLoading={loadingSelect.name == 'Branch' && loadingSelect.status}
									mode="multiple"
									// form={form}
									name="Branch"
									label="Trung tâm"
									// optionList={listData.Branch}
									optionList={[{ title: 'Giáo viên', value: 1 }]}
									disabled={disableCenter}
									placeholder="Chọn trung tâm"
									isRequired={true}
								/>
							</div>
							<div className="col-md-6 col-12">
								<InputTextField name="LinkFaceBook" label="Link Facebook" placeholder="Nhập link facebook" />
							</div>
							<div className="col-12">
								<TextBoxField name="Extension" label="Giới thiệu thêm" rows={4} placeholder="Nhập giới thiệu thêm" />
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}

export default ParentsForm
