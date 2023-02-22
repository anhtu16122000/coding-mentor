import { Modal, Form, Divider } from 'antd'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { userInformationApi } from '~/api/user'
import { parseJwt, ShowNoti } from '~/common/utils'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import { setArea } from '~/store/areaReducer'
import { areaApi, districtApi, wardApi } from '~/api/area'
import * as yup from 'yup'
import IconButton from '../Primary/IconButton'
import moment from 'moment'
import PrimaryButton from '../Primary/Button'
import { accountApi } from '~/api/account'
import { setUser } from '~/store/userReducer'
import { setAuthData, setAuthLoading } from '~/store/authReducer'
import SelectField from '../FormControl/SelectField'
import { parseSelectArray } from '~/common/utils/common'
import UploadImageField from '../FormControl/UploadImageField'
import InputTextField from '~/common/components/FormControl/InputTextField'
import InputPassField from '../FormControl/InputPassField'
import DatePickerField from '../FormControl/DatePickerField'
import { branchApi } from '~/api/branch'
import { setBranch } from '~/store/branchReducer'
import TextBoxField from '../FormControl/TextBoxField'

const CreateUser: FC<ICreateNew> = (props) => {
	const { onRefresh, isEdit, defaultData, isStudent, isChangeInfo, className, onOpen, roleStaff, source, purpose, sale, learningNeed } =
		props
	const [form] = Form.useForm()

	const [districts, setDistricts] = useState([])
	const [wards, setWards] = useState([])
	const [loading, setLoading] = useState(false)

	const [isModalVisible, setIsModalVisible] = useState(false)

	const user = useSelector((state: RootState) => state.user.information)
	const area = useSelector((state: RootState) => state.area.Area)
	const branch = useSelector((state: RootState) => state.branch.Branch)

	const convertAreaSelect = useMemo(() => {
		return parseSelectArray(area, 'Name', 'Id')
	}, [area])

	const convertBranchSelect = useMemo(() => {
		return parseSelectArray(branch, 'Name', 'Id')
	}, [branch])

	const dispatch = useDispatch()

	let schema = yup.object().shape({
		FullName: yup.string().required('Bạn không được để trống'),
		UserName: yup.string().required('Bạn không được để trống'),
		RoleId: yup.string().required('Bạn không được để trống'),
		Email: yup.string().email('Email nhập sai cú pháp').required('Bạn không được để trống'),
		Mobile: yup.string().required('Bạn không được để trống'),
		Gender: yup.string().required('Bạn không được để trống'),
		BranchIds: yup.mixed().required('Bạn không được để trống')
	})

	const yupSync = {
		async validator({ field }, value) {
			await schema.validateSyncAt(field, { [field]: value })
		}
	}

	const getAllBranch = async () => {
		try {
			const res = await branchApi.getAll({ pageSize: 99999 })
			if (res.status === 200) {
				dispatch(setBranch(res.data.data))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getAllArea = async () => {
		try {
			const response = await areaApi.getAll({ pageSize: 99999 })
			if (response.status === 200) {
				dispatch(setArea(response.data.data))
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	useEffect(() => {
		if (isModalVisible && area.length == 0) {
			getAllArea()
		}
		if (isModalVisible && !!onOpen) {
			onOpen()
		}
		if (isModalVisible && branch.length == 0) {
			getAllBranch()
		}
		if (!isEdit && !isChangeInfo) {
			form.setFieldsValue({ Password: '123456' })
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

	const postEditUser = async (param) => {
		try {
			const response = await userInformationApi.update(param)
			if (response.status === 200) {
				ShowNoti('success', response.data.message)
				const res = await accountApi.newToken()
				if (res.status === 200) {
					const token = res?.data?.Token || ''
					const user = parseJwt(token) || ''
					const userData = { token: token, user: user }

					await localStorage.setItem('userData', JSON.stringify(userData))
					await localStorage.setItem('token', token)

					dispatch(setUser(user))
					dispatch(setAuthData(user))
					dispatch(setAuthLoading(false))
				}
				if (!!onRefresh) {
					onRefresh()
					setIsModalVisible(false)
				}
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	const postNewUser = async (param) => {
		console.log(param)
		try {
			const response = await userInformationApi.add(param)
			if (response.status === 200) {
				if (!!onRefresh) {
					onRefresh()
					form.resetFields()
					setIsModalVisible(false)
					ShowNoti('success', response.data.message)
				}
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	const onFinish = async (values) => {
		const DATA_SUBMIT = {
			...values,
			DOB: !!values.DOB ? new Date(values.DOB) : undefined,
			RoleId: isStudent ? 3 : values.RoleId,
			BranchIds: values.BranchIds
				? isStudent
					? !!values.BranchIds?.length
						? values.BranchIds.join(',')
						: values.BranchIds
					: values.BranchIds.join(',')
				: ''
		}
		console.log('DATA_SUBMIT: ', !isEdit ? DATA_SUBMIT : { ...DATA_SUBMIT, UserInformationId: defaultData.UserInformationId })
		setLoading(true)
		if (DATA_SUBMIT.Mobile.match(/^[0-9]+$/) !== null) {
			await (defaultData?.UserInformationId
				? postEditUser({ ...DATA_SUBMIT, UserInformationId: defaultData.UserInformationId })
				: postNewUser(DATA_SUBMIT))
		} else {
			ShowNoti('error', 'Số điện thoại không hợp lệ')
			setLoading(false)
		}
	}

	function openEdit() {
		form.setFieldsValue({ ...defaultData })
		form.setFieldsValue({ Password: '' })
		form.setFieldsValue({ Gender: parseInt(defaultData.Gender) })
		form.setFieldsValue({ AreaId: !!defaultData.AreaId ? parseInt(defaultData.AreaId) : null })
		form.setFieldsValue({ WardId: !!defaultData.WardId ? parseInt(defaultData.WardId) : null })
		form.setFieldsValue({ DistrictId: !!defaultData.DistrictId ? parseInt(defaultData.DistrictId) : null })
		if (isStudent && isEdit) {
			form.setFieldsValue({ SourceId: !!defaultData.SourceId ? defaultData.SourceId : null })
			form.setFieldsValue({ LearningNeedId: !!defaultData.LearningNeedId ? defaultData.LearningNeedId : null })
			form.setFieldsValue({ SaleId: !!defaultData.SaleId ? defaultData.SaleId : null })
			form.setFieldsValue({ PurposeId: !!defaultData.PurposeId ? defaultData.PurposeId : null })
		}
		!!defaultData?.DOB && form.setFieldsValue({ DOB: moment(defaultData.DOB) })
		if (defaultData.BranchIds) {
			const convertDataBranchIds = defaultData.BranchIds.split(',')
				.map((item) => parseInt(item))
				.filter((value) => !!value)
			form.setFieldsValue({ BranchIds: convertDataBranchIds })
		}
		getDistrictByArea(defaultData.AreaId)
		getWardByDistrict(defaultData.DistrictId)
		setIsModalVisible(true)
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

	return (
		<>
			{!!!isEdit && !isChangeInfo && (
				<PrimaryButton className={className} onClick={() => setIsModalVisible(true)} type="button" background="green" icon="add">
					Tạo mới
				</PrimaryButton>
			)}

			{/* Edit Buttom */}
			{!!isEdit && <IconButton onClick={openEdit} type="button" background="transparent" color="yellow" icon="edit" tooltip="Cập nhật" />}

			{!!isChangeInfo && (
				<div className="inner-function" onClick={openEdit}>
					<div className="icon">
						<img src="/icons/profile-circle.svg" />
					</div>
					<div className="function-name">Thông tin</div>
				</div>
			)}

			<Modal
				centered
				title={isEdit ? 'Cập nhật thông tin' : isChangeInfo ? 'Thay đổi thông tin' : 'Thêm người dùng mới'}
				width={800}
				open={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={
					<>
						<PrimaryButton onClick={() => setIsModalVisible(false)} background="red" icon="cancel" type="button">
							Huỷ
						</PrimaryButton>
						{!isChangeInfo && (
							<PrimaryButton loading={loading} onClick={() => form.submit()} className="ml-2" background="blue" icon="save" type="button">
								Lưu
							</PrimaryButton>
						)}
						{!!isChangeInfo && (defaultData.RoleId == 1 || defaultData.RoleId == 2) && (
							<PrimaryButton loading={loading} onClick={() => form.submit()} className="ml-2" background="blue" icon="save" type="button">
								Lưu
							</PrimaryButton>
						)}
						{!!isChangeInfo && defaultData.RoleId == 3 && (
							<PrimaryButton loading={loading} onClick={() => form.submit()} className="ml-2" background="blue" icon="save" type="button">
								Gửi yêu cầu thay đổi
							</PrimaryButton>
						)}
					</>
				}
			>
				<Form form={form} layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
					<div className="grid grid-cols-4 gap-x-4">
						<div className="col-span-4">
							<UploadImageField form={form} label="Hình đại diện" name="Avatar" />
						</div>
						<InputTextField
							className={isChangeInfo ? 'col-span-4' : 'col-span-2'}
							label="Họ tên"
							name="FullName"
							isRequired
							rules={[yupSync]}
						/>

						<InputTextField className={'col-span-2'} label="Tên đăng nhập" name="UserName" isRequired rules={[yupSync]} />

						{!isEdit && !isStudent && !isChangeInfo && (
							<SelectField className="col-span-2" label="Chức vụ" name="RoleId" isRequired rules={[yupSync]} optionList={roleStaff} />
						)}

						<SelectField
							className="col-span-2"
							label="Giới tính"
							name="Gender"
							isRequired
							rules={[yupSync]}
							optionList={[
								{ value: 0, title: 'Nữ' },
								{ value: 1, title: 'Nam' },
								{ value: 2, title: 'Khác' }
							]}
						/>
						<InputTextField className="col-span-2" label="Địa chỉ Email" name="Email" isRequired rules={[yupSync]} />
						<InputTextField className="col-span-2" label="Số điện thoại" name="Mobile" isRequired rules={[yupSync]} />
						<DatePickerField className="col-span-2" label="Ngày sinh" name="DOB" mode="single" format="DD/MM/YYYY" />

						{!isChangeInfo && isEdit && user.RoleId == 1 && (
							<SelectField
								className="col-span-2"
								label="Trạng thái"
								name="StatusId"
								optionList={[
									{ value: 0, title: 'Hoạt động' },
									{ value: 1, title: 'Khóa' }
								]}
							/>
						)}

						{user.RoleId == 1 && isEdit ? (
							<InputPassField className="col-span-2" label="Mật khẩu" name="Password" />
						) : (
							<InputTextField className="col-span-2" label="Mật khẩu" name="Password" />
						)}

						<TextBoxField name="Extension" label="Giới thiệu thêm" className="col-span-4" />

						<Divider className="col-span-4" orientation="center">
							Địa chỉ
						</Divider>
						{isStudent ? (
							<SelectField
								className="col-span-4 antd-custom-wrap"
								name="BranchIds"
								label="Trung tâm"
								isRequired
								rules={[yupSync]}
								optionList={convertBranchSelect}
							/>
						) : (
							<SelectField
								className="col-span-4 antd-custom-wrap"
								mode="multiple"
								name="BranchIds"
								label="Trung tâm"
								isRequired
								rules={[yupSync]}
								optionList={convertBranchSelect}
							/>
						)}

						<InputTextField className="col-span-2" label="Địa chỉ" name="Address" />
						<SelectField
							className="col-span-2"
							label="Tỉnh / Thành phố"
							name="AreaId"
							optionList={convertAreaSelect}
							onChangeSelect={(value) => handleSelect('AreaId', value)}
						/>
						<SelectField
							className="col-span-2"
							label="Quận / Huyện"
							name="DistrictId"
							optionList={districts}
							onChangeSelect={(value) => handleSelect('DistrictId', value)}
						/>
						<SelectField className="col-span-2" label="Phường / Xã" name="WardId" optionList={wards} />
						{isStudent && (
							<>
								<Divider className="col-span-4" orientation="center">
									Thông tin học
								</Divider>
								<SelectField
									className="col-span-2"
									label="Nguồn khách hàng"
									name="SourceId"
									optionList={source}
									onChangeSelect={(value) => handleSelect('LearningNeedId', value)}
								/>
								<SelectField
									className="col-span-2"
									label="Nhu cầu học"
									name="LearningNeedId"
									optionList={learningNeed}
									onChangeSelect={(value) => handleSelect('LearningNeedId', value)}
								/>
								<SelectField
									className="col-span-2"
									label="Tư vấn viên"
									name="SaleId"
									optionList={sale}
									onChangeSelect={(value) => handleSelect('SaleId', value)}
								/>
								<SelectField
									className="col-span-2"
									label="Mục đích học"
									name="PurposeId"
									optionList={purpose}
									onChangeSelect={(value) => handleSelect('PurposeId', value)}
								/>
							</>
						)}
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default CreateUser
