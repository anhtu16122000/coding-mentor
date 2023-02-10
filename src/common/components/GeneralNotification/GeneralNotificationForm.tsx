import { Card, Form, Switch } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { branchApi } from '~/api/branch'
import { generalNotificationApi } from '~/api/general-notification'
import { permissionApi } from '~/api/permission'
import { ShowNoti } from '~/common/utils'
import { parseSelectArray, parseSelectArrayUser } from '~/common/utils/common'
import { RootState } from '~/store'
import { setBranch } from '~/store/branchReducer'
import SelectField from '../FormControl/SelectField'
import InputTextField from '../FormControl/InputTextField'
import EditorField from '../FormControl/EditorField'
import PrimaryButton from '../Primary/Button'
import { userInformationApi } from '~/api/user'

const GeneralNotificationForm = (props) => {
	const { getAllGeneralNotifications } = props
	const branch = useSelector((state: RootState) => state.branch.Branch)
	const [form] = Form.useForm()
	const [allRole, setAllRole] = useState([])
	const [userSelect, setUserSelect] = useState([])
	const [selectAllUser, setSelectAllUser] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const dispatch = useDispatch()
	const convertBranchSelect = useMemo(() => {
		return parseSelectArray(branch, 'Name', 'Id')
	}, [branch])

	const getAllStaff = async () => {
		try {
			const res = await permissionApi.getRolePermission()
			if (res.status === 200) {
				const convertDataRoles = parseSelectArray(res.data.data, 'Name', 'Id')
				setAllRole(convertDataRoles)
			}
			if (res.status === 204) {
				setAllRole([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
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

	useEffect(() => {
		getAllStaff()
	}, [])

	useEffect(() => {
		if (branch.length === 0) {
			getAllBranch()
		}
	}, [branch])

	useEffect(() => {
		if (convertBranchSelect) {
			const defaultSelectBranch = convertBranchSelect.map((branch) => branch.value)
			form.setFieldsValue({ branchIds: defaultSelectBranch })
		}
	}, [convertBranchSelect])

	useEffect(() => {
		if (selectAllUser) {
			const defaultSelectAllUser = userSelect?.map((user) => {
				return user.value
			})
			form.setFieldsValue({ UserIds: defaultSelectAllUser })
		} else {
			form.setFieldsValue({ UserIds: [] })
		}
	}, [selectAllUser])

	const handleChangeSelect = async (name, value) => {
		setSelectAllUser(false)
		if (form.getFieldValue('branchIds')?.length > 0 && form.getFieldValue('roleIds')?.length > 0) {
			try {
				const DATA_SUBMIT = {
					branchIds: form.getFieldValue('branchIds').join(','),
					roleIds: form.getFieldValue('roleIds').join(',')
				}
				const res = await userInformationApi.getAll(DATA_SUBMIT)
				if (res.status === 200) {
					const convertDataUser = parseSelectArrayUser(res.data.data, 'FullName', 'UserCode', 'UserInformationId')
					setUserSelect(convertDataUser)
				}
				if (res.status === 204) {
					setUserSelect([])
				}
			} catch (err) {
				ShowNoti('error', err.message)
			}
		} else {
			setUserSelect([])
		}
	}

	const handleSelectAllUser = (checked) => {
		setSelectAllUser(checked)
	}

	const onSubmit = async (data) => {
		setIsLoading(true)
		try {
			const DATA_SUBMIT = {
				Content: data.Content,
				Title: data.Title,
				UserIds: data.UserIds.length > 0 ? data.UserIds.join(',') : '',
				IsSendMail: data.IsSendMail
			}
			const res = await generalNotificationApi.add(DATA_SUBMIT)
			if (res.status === 200) {
				setSelectAllUser(false)
				form.resetFields()
				getAllGeneralNotifications()
				ShowNoti('success', res.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}
	return (
		<>
			<Card title="Tạo thông báo">
				<Form layout="vertical" form={form} onFinish={onSubmit} initialValues={{ IsSendMail: false }}>
					<div className="grid gap-4 grid-cols-2">
						<SelectField
							className="col-span-1 antd-custom-wrap"
							label={`Trung tâm ${window?.innerWidth < 767 ? '' : '(Mặc định tất cả)'}`}
							name="branchIds"
							mode="multiple"
							optionList={convertBranchSelect}
							onChangeSelect={(value) => handleChangeSelect('branchIds', value)}
						/>
						<SelectField
							className="col-span-1 antd-custom-wrap"
							mode="multiple"
							name="roleIds"
							label="Chức vụ"
							optionList={allRole}
							onChangeSelect={(value) => handleChangeSelect('roleIds', value)}
						/>
					</div>
					<SelectField
						className="label-full"
						mode="multiple"
						name="UserIds"
						label={
							<div className="antd-custom-wrap ant-form-item-label flex items-center justify-between">
								<span>Tài khoản</span>
								<div>
									<span className="mr-2">Chọn tất cả</span>
									<Switch checked={selectAllUser} onChange={handleSelectAllUser} />
								</div>
							</div>
						}
						optionList={userSelect}
					/>
					<InputTextField name="Title" label="Tiêu đề" />
					<EditorField name="Content" label="Nội dung" onChangeEditor={(value) => form.setFieldsValue({ Content: value })} />
					<div className="antd-custom-wrap ant-form-item-label flex items-center justify-between">
						<div>
							<Form.Item name="IsSendMail">
								<Switch onChange={(checked) => form.setFieldsValue({ IsSendMail: checked })} />
								<label className="!ml-2">Gửi mail</label>
							</Form.Item>
						</div>
						<PrimaryButton background="blue" type="submit" icon="save" disable={isLoading} loading={isLoading}>
							Tạo ngay
						</PrimaryButton>
					</div>
				</Form>
			</Card>
		</>
	)
}

export default GeneralNotificationForm
