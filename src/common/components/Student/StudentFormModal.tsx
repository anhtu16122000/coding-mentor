import { LoadingOutlined, MailOutlined, SearchOutlined, WhatsAppOutlined } from '@ant-design/icons'
import { yupResolver } from '@hookform/resolvers/yup'
import { Divider, Form, Modal, Spin, Tooltip } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Edit, RotateCcw, Settings } from 'react-feather'
import { useForm } from 'react-hook-form'
import { MdSave } from 'react-icons/md'
import * as yup from 'yup'
// import { districtApi, studentApi, userApi, userInformationApi, wardApi } from '~/src/apiBase'
import { districtApi, wardApi } from '~/api/area'
import { studentApi } from '~/api/student'
import { userInformationApi as userApi } from '~/api/user'
import UploadImageField from '~/common/components/FormControl/UploadImageField'
import DatePickerField from '~/common/components/FormControl/DatePickerField'
import InputTextField from '~/common/components/FormControl/InputTextField'
import SelectField from '~/common/components/FormControl/SelectField'
import TextBoxField from '~/common/components/FormControl/TextBoxField'
import TimePickerField from '~/common/components/FormControl/TimePickerField'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
// import { useWrap } from '~/src/context/wrap'
import { ShowNoti } from '~/common/utils'

let returnSchema = {}
let schema = null

interface listData {
	Area: Array<Object>
	DistrictID: Array<Object>
	WardID: Array<Object>
	Job: Array<Object>
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

const StudentFormModal = (props) => {
	const { dataRow, listDataForm, _handleSubmit, index, isInCourse } = props
	const router = useRouter()
	const url = router.pathname

	const [isStudentDetail, setIsStudentDetail] = useState(
		url.includes('student-list') || url.includes('student-detail') || url.includes('student-course')
	)
	const [isModalVisible, setIsModalVisible] = useState(false)
	// const { showNoti, userInformation } = useWrap()
	const { information: userInformation } = useSelector((state: RootState) => state.user)
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [imageUrl, setImageUrl] = useState(null)
	const [loadingSelect, setLoadingSelect] = useState({ status: false, name: '' })
	const [listData, setListData] = useState<listData>(listDataForm)
	const [valueEmail, setValueEmail] = useState()
	const [isSearch, setIsSearch] = useState(false)

	const showModal = () => {
		setIsModalVisible(true)
	}

	useEffect(() => {}, [listData])

	// ------------- ADD data to list --------------
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

	//  ----- GET DATA DISTRICT -------
	const getDataWithID = async (ID, name) => {
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
		if (name == 'DistrictID') {
			form.setValue('WardID', null)

			listData.DistrictID = []
			listData.WardID = []
			setListData({ ...listData })
		}
		form.setValue(name, null)
		getDataWithID(value, name)
	}

	// -----  HANDLE ALL IN FORM -------------
	const defaultValuesInit = {
		FullNameUnicode: null,
		UserCode: null,
		LinkFaceBook: null,
		Email: '',
		Mobile: null,
		AreaID: null, //int id Tỉnh / Thành phố
		DistrictID: null, //int id Quận/Huyện
		WardID: null, //int id Phường/Xã
		HouseNumber: null, //Nhập số nhà tên đường
		Address: null, //bỏ trống - chỉ nhập khi khách hàng có địa chỉ không cụ thể
		Avatar: null, //Lưu link file hình
		DOB: null, //ngày sinh
		Gender: null, //int 0-Nữ 1-Nam 2-Khác
		CMND: null, //int số CMND
		CMNDDate: null, //Ngày làm
		CMNDRegister: null, //Nơi làm CMND
		Extension: null, //giới thiệu thêm
		Branch: undefined, //string : id của trung tâm - LƯU Ý NẾU TỪ 2 TRUNG TÂM TRỞ LÊN THÌ NHẬP(ID,ID,ID)
		AcademicPurposesID: null, // int id mục đích học
		JobID: null, //int mã công việc
		SourceInformationID: null, //int id nguồn
		ParentsOf: null, //int id phụ huynh
		StatusID: null, //int id phụ huynh
		CounselorsID: null,
		AppointmentDate: null,
		ExamAppointmentTime: null,
		ExamAppointmentNote: null,
		UserName: null
	}

	;(function returnSchemaFunc() {
		returnSchema = { ...defaultValuesInit }
		Object.keys(returnSchema).forEach(function (key) {
			switch (key) {
				case 'Email':
					returnSchema[key] = yup.string().email('Email nhập sai cú pháp').required('Bạn không được để trống')
					break
				case 'Mobile':
					returnSchema[key] = yup
						.string()
						.matches(/(\+84|0)\d{9,10}/, 'Số điện thoại không đúng định dạng')
						.required('Bạn không được để trống')
					break
				case 'FullNameUnicode':
					returnSchema[key] = yup.string().typeError('Họ tên phải là chữ').required('Bạn không được để trống')
					break
				case 'CounselorsID':
					returnSchema[key] = yup.mixed()
					break
				case 'Branch':
					returnSchema[key] = yup.array()
				case 'AppointmentDate':
					if (!dataRow) {
						returnSchema[key] = yup.mixed()
					}
					break
				case 'ExamAppointmentTime':
					if (!dataRow) {
						returnSchema[key] = yup.mixed()
					}
					break
				default:
					// returnSchema[key] = yup.mixed().required("Bạn không được để trống");
					break
			}
		})

		schema = yup.object().shape(returnSchema)
	})()

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	})

	// ----------- SUBMI FORM ------------
	const onSubmit = async (data: any) => {
		let dataUpdate = {
			UserInformationID: data.UserInformationID,
			FullNameUnicode: data.FullNameUnicode,
			LinkFaceBook: data.LinkFaceBook,
			Email: data.Email,
			Mobile: data.Mobile,
			AreaID: data.AreaID,
			DistrictID: data.DistrictID,
			WardID: data.WardID,
			HouseNumber: data.HouseNumber,
			Address: data.Address,
			Avatar: data.Avatar,
			DOB: data.DOB,
			Gender: data.Gender,
			CMND: data.CMND,
			CMNDDate: data.CMNDDate,
			CMNDRegister: data.CMNDRegister,
			Extension: data.Extension,
			Branch: data.Branch.toString(),
			AcademicPurposesID: data.AcademicPurposesID,
			JobID: data.JobID,
			SourceInformationID: data.SourceInformationID,
			ParentsOf: data.ParentsOf,
			StatusID: data.StatusID,
			CounselorsID: data.CounselorsID,
			Password: data.Password,
			UserCode: data.UserCode,
			UserName: data.UserName
		}
		data.Branch = data.Branch.toString()

		setIsLoading({
			type: 'ADD_DATA',
			status: true
		})
		try {
			const response = await userApi.checkExistUserName({ UserInformationID: data.UserInformationID, UserName: data.UserName })
			if (response.status == 200) {
				if (response.data.data === false) {
					let res = null
					try {
						if (data.UserInformationID) {
							if (isSearch) {
								res = await studentApi.add(data)
							} else {
								res = await studentApi.update(dataUpdate)
								res?.status == 200 && _handleSubmit && _handleSubmit(data, index)
							}
						} else {
							res = await studentApi.add(data)
						}

						res?.status == 200 &&
							(ShowNoti('success', data.UserInformationID ? 'Cập nhật học viên thành công' : 'Tạo học viên thành công'),
							setIsModalVisible(false),
							!dataRow && !isSearch && (form.reset(defaultValuesInit), setImageUrl('')))
					} catch (error) {
						ShowNoti('error', error.message)
					} finally {
						setIsLoading({
							type: 'ADD_DATA',
							status: false
						})
					}
				} else {
					ShowNoti('error', 'Tên tài khoản đã được sử dụng')
					setIsLoading({
						type: 'ADD_DATA',
						status: false
					})
				}
			}
		} catch (err) {}
	}

	// Search Email to compare with data
	const searchValue = async () => {
		setIsLoading({
			type: 'SEARCH_EMAIL',
			status: true
		})
		try {
			let res = await studentApi.getAll({ Email: valueEmail })

			res?.status == 200 && (handleDataRow(res.data.data[0]), setIsSearch(true))
			res?.status == 204 && (form.reset(defaultValuesInit), setIsSearch(false), setImageUrl(''))
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({
				type: 'SEARCH_EMAIL',
				status: false
			})
		}
	}

	const [currentUser, setCurrentUser] = useState<any>({})

	const handleDataRow = (data) => {
		let cloneRowData = { ...data }

		let arrBranch = []
		cloneRowData.Branch.forEach((item, index) => {
			arrBranch.push(item.ID)
		})
		cloneRowData.Branch = [...arrBranch]

		form.reset(cloneRowData)
		cloneRowData.AreaID && getDataWithID(cloneRowData.AreaID, 'DistrictID')
		cloneRowData.DistrictID && getDataWithID(cloneRowData.DistrictID, 'WardID')
		setImageUrl(cloneRowData.Avatar)
	}

	const getUserByID = async () => {
		try {
			const response = await studentApi.getWithID(dataRow?.UserInformationID)
			console.log('response: ', response)
			if (response.status == 200) {
				setCurrentUser(response.data.data)
				handleDataRow(response.data.data)
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
	}

	useEffect(() => {
		if (isModalVisible) {
			if (dataRow) {
				if (!!isInCourse) {
					getUserByID()
				} else {
					handleDataRow(dataRow)
				}
			}
		}
	}, [isModalVisible])

	useEffect(() => {
		setListData(listDataForm)
	}, [listDataForm])

	return (
		<>
			<button className="btn btn-icon edit" onClick={showModal}>
				<Tooltip title={isInCourse ? 'Cập nhật học viên' : 'Cập nhật'}>
					{isInCourse ? (
						// <i className="fa fa-cogs" style={{ color: '#34c4a4', fontSize: 16 }} />
						<Settings />
					) : (
						// <i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16 }} />
						<Edit />
					)}
				</Tooltip>
			</button>

			<Modal
				style={{ top: 20 }}
				title="Cập nhật học viên"
				visible={isModalVisible}
				footer={
					<div className="row">
						<div className="col-12 d-flex justify-content-center">
							<div style={{ paddingRight: 5 }}>
								<button
									type="button"
									className="btn btn-primary w-100"
									onClick={form.handleSubmit(onSubmit)}
									disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
								>
									<MdSave size={18} className="mr-2" />
									Lưu học viên
									{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</div>
				}
				onCancel={() => setIsModalVisible(false)}
				className="modal-50 modal-scroll"
			>
				<div className="box-form form-staff">
					<Form layout="vertical">
						<div className="row">
							{/** ==== Thông tin cơ bản  ====*/}
							<div className="col-12">
								<div className="info-modal">
									<div className="info-modal-avatar">
										{/* <AvatarBase imageUrl={imageUrl} getValue={(value) => form.setValue('Avatar', value)} /> */}
										<UploadImageField label="" name="Avatar" form={form} />
									</div>
									<div className="info-modal-content">
										{dataRow && (
											<div className="box-info-modal">
												<p className="name">{dataRow.FullNameUnicode || currentUser?.FullNameUnicode}</p>
												<p className="detail">
													<span className="icon">
														<WhatsAppOutlined style={{ color: 'green' }} />
													</span>
													<span className="text">{dataRow.Mobile || currentUser?.Mobile}</span>
												</p>
												<p className="detail">
													<span className="icon email">
														<MailOutlined />
													</span>
													<span className="text">{dataRow.Email || currentUser?.Email}</span>
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
								<div className="search-box">
									<InputTextField
										// form={form}
										name="Email"
										label="Email"
										// handleChange={(value) => setValueEmail(value)}
										placeholder="Nhập email"
										isRequired={true}
									/>
									{!dataRow && (
										<button type="button" className="btn-search" onClick={searchValue}>
											{isLoading.type == 'SEARCH_EMAIL' && isLoading.status ? (
												<Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} />
											) : (
												<SearchOutlined />
											)}
										</button>
									)}
								</div>
							</div>
							<div className="col-md-6 col-12">
								<InputTextField name="UserName" label="Tên tài khoản" />
							</div>

							<div className="col-md-6 col-12">
								<InputTextField name="FullNameUnicode" label="Họ và tên" placeholder="Nhập họ và tên" isRequired={true} />
							</div>
							<div className="col-md-6 col-12">
								<InputTextField name="UserCode" label="Mã học viên" placeholder="Nhập mã học viên" isRequired={false} />
							</div>
							{/*  */}
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
								<DatePickerField mode="single" name="CMNDDate" label="Ngày cấp" placeholder="Chọn ngày cấp" />
							</div>
							<div className="col-md-6 col-12">
								<SelectField name="Gender" label="Giới tính" optionList={optionGender} placeholder="Chọn giới tính" />
							</div>
							<div className="col-md-6 col-12">
								<SelectField name="JobID" label="Công việc" optionList={[{ title: 'Giáo viên', value: 1 }]} placeholder="Chọn công việc" />
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									disabled={!dataRow ? true : userInformation?.RoleId === 1 ? false : true}
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
							{/*  */}
							<div className="col-md-6 col-12">
								<SelectField
									isLoading={loadingSelect.name == 'WardID' && loadingSelect.status}
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
							<div className="col-12">
								<InputTextField name="HouseNumber" label="Số nhà/tên đường" placeholder="Nhập số nhà/tên đường" />
							</div>
							{/** Hẹn Test */}
							<div className="col-12">
								<Divider orientation="center">{isStudentDetail ? 'Trung tâm' : 'Hẹn test'}</Divider>
							</div>
							<div className="col-12">
								<SelectField
									mode={dataRow ? 'multiple' : null}
									name="Branch"
									label="Trung tâm"
									// optionList={listData.Branch}
									optionList={[{ title: 'Giáo viên', value: 1 }]}
									placeholder="Chọn trung tâm"
								/>
							</div>
							{!isStudentDetail && (
								<>
									<div className="col-md-6 col-12">
										<TimePickerField
											disabled={isStudentDetail && true}
											name="ExamAppointmentTime"
											label="Giờ hẹn test"
											placeholder="Chọn giờ hẹn test"
										/>
									</div>
									<div className="col-md-6 col-12">
										<DatePickerField
											mode="single"
											disabled={isStudentDetail && true}
											name="AppointmentDate"
											label="Ngày hẹn test"
											placeholder="Chọn ngày hẹn test"
										/>
									</div>
									<div className="col-md-12 col-12 mb-5">
										<TextBoxField
											disabled={isStudentDetail && true}
											name="ExamAppointmentNote"
											label="Ghi chú"
											placeholder="Nhập ghi chú"
										/>
									</div>
								</>
							)}
							{/** ==== Khác  ====*/}
							<div className="col-12">
								<Divider orientation="center">Khác</Divider>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									name="AcademicPurposesID"
									label="Mục đích học"
									// optionList={listData.Purposes}
									optionList={[{ title: 'Giáo viên', value: 1 }]}
									placeholder="Chọn mục đich học"
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									name="ParentsOf"
									label="Phụ huynh học sinh"
									// optionList={listData.Parent}
									optionList={[{ title: 'Giáo viên', value: 1 }]}
									placeholder="Chọn phụ huynh học sinh"
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									name="SourceInformationID"
									label="Nguồn khách"
									// optionList={listData.SourceInformation}
									optionList={[{ title: 'Giáo viên', value: 1 }]}
									placeholder="Chọn nguồn khách"
								/>
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									disabled={userInformation && userInformation?.RoleId === 6}
									name="CounselorsID"
									label="Tư vấn viên"
									// optionList={listData.Counselors}
									optionList={[{ title: 'Giáo viên', value: 1 }]}
									placeholder="Chọn tư vấn viên"
								/>
							</div>
							<div className="col-12">
								<InputTextField name="LinkFaceBook" label="Link Facebook" placeholder="Nhập link facebook" />
							</div>
							<div className="col-12">
								<TextBoxField name="Extension" label="Giới thiệu thêm" placeholder="Nhập giới thiệu thêm" />
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}
export default StudentFormModal
