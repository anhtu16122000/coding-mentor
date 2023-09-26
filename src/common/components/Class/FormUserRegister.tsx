import { Form, Input, Select } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { billApi } from '~/api/business/bill'
import { userInformationApi } from '~/api/user/user'
import { ShowNoti } from '~/common/utils'
import Avatar from '../Avatar'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { formRequired } from '~/common/libs/others/form'

const FormUserRegister = (props) => {
	const { form, setClasses, isReset, setCurStudent, type } = props

	const router = useRouter()

	const [students, setStudents] = useState([])
	const [userInfo, setUserInfo] = useState<IUserInformation>()
	const [curBranch, setCurBranch] = useState(null)

	const userInformation = useSelector((state: RootState) => state.user.information)

	const branch = useSelector((state: RootState) => state.branch.Branch)

	const [routerStudent, setRouterStudent] = useState(null)

	useEffect(() => {
		!!isReset && setUserInfo(null)
	}, [isReset])

	useEffect(() => {
		if (routerStudent) {
			getStudentDetail(routerStudent)
		}
	}, [routerStudent])

	function handleSelectBranch(e) {
		form.setFieldValue('StudentId', null)
		setClasses([])
		setUserInfo(null)
		getAllStudent(e)
	}

	const getAllStudent = async (params?: any) => {
		const branchId = !!curBranch ? curBranch : userInformation?.RoleId == '1' ? null : userInformation.BranchIds

		try {
			const res = await userInformationApi.getAll({ roleIds: 3, branchIds: !params ? branchId : params })
			if (res.status == 200) {
				setStudents(res.data.data)
			} else {
				setStudents([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getStudentDetail = async (id) => {
		try {
			const res = await userInformationApi.getByID(id)
			if (res.status == 200) {
				setUserInfo(res.data.data)
				if (!!res.data.data?.BranchIds) {
					setCurBranch(parseInt(res.data.data?.BranchIds + ''))
					form.setFieldValue('BranchId', parseInt(res.data.data?.BranchIds + ''))
					getAllStudent(parseInt(res.data.data?.BranchIds + ''))
				}
			} else {
				setUserInfo(null)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const handleGetStudent = async (data?: any) => {
		!!setCurStudent && setCurStudent(data)

		// const getStudent = students.find((student) => student.UserInformationId == data)
		// form.setFieldsValue({ StudentId: getStudent?.UserInformationId })

		// setUserInfo(getStudent)

		try {
			const res = await billApi.getClassAvailable({ studentId: type == 1 ? data : null, branchId: curBranch, paymentType: type || 1 })
			if (res.status == 200) {
				setClasses(res.data.data)
			} else {
				setClasses([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	useEffect(() => {
		if (!!type && !!curBranch) {
			handleGetStudent()
		}
	}, [type])

	useEffect(() => {
		if (router?.query?.student) {
			form.setFieldValue('StudentId', parseInt(router?.query?.student + ''))
			setRouterStudent(parseInt(router?.query?.student + ''))
			setCurStudent(parseInt(router?.query?.student + ''))
		} else {
			form.setFieldValue('StudentId', null)
			setRouterStudent(null)
			setCurStudent(null)
			setCurBranch(null)
			form.setFieldValue('BranchId', null)
		}
	}, [router])

	return (
		<div className="form-user-register">
			<div className="grid grid-cols-2 gap-x-4">
				{/* <div className="col-span-2">
					<Form.Item label="">
						<Avatar className="w-[62px] h-[62px] object-fill rounded-lg" uri={!!userInfo?.Avatar ? userInfo?.Avatar : null} />
					</Form.Item>
				</div> */}

				<Form.Item className="col-span-1" required={true} rules={formRequired} label="Trung tâm" name="BranchId">
					<Select
						onChange={(e) => {
							form.setFieldsValue({ branchId: e })
							setCurBranch(e)
							handleSelectBranch(e)
						}}
						showSearch
						optionFilterProp="children"
						className="primary-input"
						placeholder="Chọn trung tâm"
					>
						{branch.map((item) => {
							return (
								<Select.Option key={item.Id} value={item.Id}>
									{item.Name}
								</Select.Option>
							)
						})}
					</Select>
				</Form.Item>

				<div className="col-span-1" />

				<div className="col-span-1">
					<Form.Item label="Học viên" name="StudentId">
						<Select
							onChange={handleGetStudent}
							showSearch
							allowClear
							disabled={!curBranch}
							optionFilterProp="children"
							className="primary-input"
							placeholder="Chọn học viên"
							value={!!userInfo?.UserInformationId ? userInfo?.UserInformationId : null}
						>
							{students.map((student) => {
								return (
									<Select.Option key={student.UserInformationId} value={student.UserInformationId}>
										[{student.UserCode}] - {student.FullName}
									</Select.Option>
								)
							})}
						</Select>
					</Form.Item>
				</div>
				<div className="col-span-1">
					<Form.Item label="Email" name="StudentId">
						<Select
							onChange={handleGetStudent}
							showSearch
							allowClear
							disabled={!curBranch}
							optionFilterProp="children"
							className="primary-input"
							placeholder="Chọn email"
							value={!!userInfo?.UserInformationId ? userInfo?.UserInformationId : null}
						>
							{students.map((student) => {
								return (
									<Select.Option key={student.UserInformationId} value={student.UserInformationId}>
										{student.Email}
									</Select.Option>
								)
							})}
						</Select>
					</Form.Item>
				</div>
				<div className="col-span-1">
					<Form.Item label="Số điện thoại" name="StudentId">
						<Select
							onChange={handleGetStudent}
							showSearch
							allowClear
							disabled={!curBranch}
							optionFilterProp="children"
							className="primary-input"
							placeholder="Chọn số điện thoại"
							value={!!userInfo?.UserInformationId ? userInfo?.UserInformationId : null}
						>
							{students.map((student) => {
								return (
									<Select.Option key={student.UserInformationId} value={student.UserInformationId}>
										{student.Mobile}
									</Select.Option>
								)
							})}
						</Select>
					</Form.Item>
				</div>

				<div className="col-span-1">
					<Form.Item label="Ngày sinh">
						<Input
							disabled
							placeholder="Ngày sinh"
							className="primary-input"
							value={!!userInfo?.DOB ? moment(userInfo?.DOB).format('DD/MM/YYYY') : null}
						/>
					</Form.Item>
				</div>
			</div>
		</div>
	)
}

export default FormUserRegister
