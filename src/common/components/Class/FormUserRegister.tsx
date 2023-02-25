import { Form, Input, Select } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { billApi } from '~/api/bill'
import { userInformationApi } from '~/api/user'
import { ShowNoti } from '~/common/utils'
import Avatar from '../Avatar'

const FormUserRegister = (props) => {
	const router = useRouter()
	const { form, setClasses, isReset } = props
	const [students, setStudents] = useState([])
	const [userInfo, setUserInfo] = useState<IUserInformation>()

	useEffect(() => {
		!!isReset && setUserInfo(null)
	}, [isReset])

	const getAllStudent = async () => {
		try {
			const ROLE_STUDENT = 3
			const res = await userInformationApi.getAll({ roleIds: ROLE_STUDENT })
			if (res.status == 200) {
				setStudents(res.data.data)
			}
			if (res.status == 204) {
				setStudents([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const handleGetStudent = async (data) => {
		const getStudent = students.find((student) => student.UserInformationId == data)
		form.setFieldsValue({ StudentId: getStudent?.UserInformationId })
		setUserInfo(getStudent)
		if (!!form.getFieldValue('BranchId')) {
			try {
				// Tham số 1: branchId
				// Tham số 2: studentId
				const res = await billApi.getClassAvailable({
					studentId: data,
					branchId: form.getFieldValue('BranchId')
				})
				if (res.status == 200) {
					setClasses(res.data.data)
				}
				if (res.status == 204) {
					setClasses([])
				}
			} catch (err) {
				ShowNoti('error', err.message)
			}
		}
	}

	useEffect(() => {
		getAllStudent()
	}, [])

	useEffect(() => {
		if (router?.query?.userId) {
			handleGetStudent(router?.query?.userId)
		}
	}, [router?.query?.userId, students])

	return (
		<div className="form-user-register">
			<div className="grid grid-cols-2 gap-x-4">
				<div className="col-span-2">
					<Form.Item label="">
						<Avatar className="w-[62px] h-[62px] object-fill rounded-lg" uri={!!userInfo?.Avatar ? userInfo?.Avatar : null} />
					</Form.Item>
				</div>

				<div className="col-span-1">
					<Form.Item label="Học viên" name="StudentId">
						<Select
							onChange={handleGetStudent}
							showSearch
							allowClear
							optionFilterProp="children"
							className="primary-input"
							placeholder="Chọn học viên"
							value={!!userInfo?.UserInformationId ? userInfo?.UserInformationId : null}
						>
							{students.map((student) => {
								return (
									<Select.Option key={student.UserInformationId} value={student.UserInformationId}>
										{student.FullName} - {student.UserCode}
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
