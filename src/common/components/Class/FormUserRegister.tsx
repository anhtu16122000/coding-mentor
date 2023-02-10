import { Divider, Form, Input, Select, Switch } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { billApi } from '~/api/bill'
import { userInformationApi } from '~/api/user'
import { ShowNoti } from '~/common/utils'
import AvatarComponent from '../AvatarComponent'

const FormUserRegister = (props) => {
	const { form, setClasses } = props
	const [students, setStudents] = useState([])
	const [userInfo, setUserInfo] = useState<IUserInformation>()
	const getAllStudent = async () => {
		try {
			const ROLE_STUDENT = 3
			const res = await userInformationApi.getAll({ roleIds: ROLE_STUDENT })
			if (res.status === 200) {
				setStudents(res.data.data)
			}
			if (res.status === 204) {
				setStudents([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const handleGetStudent = async (data) => {
		const getStudent = students.find((student) => student.UserInformationId === data)
		form.setFieldsValue({ StudentId: getStudent.UserInformationId })
		setUserInfo(getStudent)
		if (!!form.getFieldValue('BranchId')) {
			try {
				// Tham số 1: branchId
				// Tham số 2: studentId
				const res = await billApi.getClassAvailable({
					studentId: data,
					branchId: form.getFieldValue('BranchId')
				})
				if (res.status === 200) {
					setClasses(res.data.data)
				}
				if (res.status === 204) {
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
	return (
		<div className="form-user-register">
			{/* <Form layout="vertical"> */}
			<div className="grid grid-cols-2 gap-x-4">
				<div className="col-span-2">
					<Form.Item label="">
						<AvatarComponent className="w-20 h-20 object-fill rounded-lg" url={!!userInfo?.Avatar ? userInfo?.Avatar : null} type="user" />
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
				<Divider className="col-span-2">Địa chỉ</Divider>
				<div className="col-span-1">
					<Form.Item label="Tỉnh/Thành phố">
						<Input
							disabled
							placeholder="Tỉnh/Thành phố"
							className="primary-input"
							value={!!userInfo?.AreaName ? userInfo?.AreaName : null}
						/>
					</Form.Item>
				</div>
				<div className="col-span-1">
					<Form.Item label="Quận/Huyện">
						<Input
							placeholder="Quận/Huyện"
							disabled
							className="primary-input"
							value={!!userInfo?.DistrictName ? userInfo?.DistrictName : null}
						/>
					</Form.Item>
				</div>
				<div className="col-span-1">
					<Form.Item label="Phường/Xã">
						<Input disabled placeholder="Phường/Xã" className="primary-input" value={!!userInfo?.WardName ? userInfo?.WardName : null} />
					</Form.Item>
				</div>
				<div className="col-span-1">
					<Form.Item label="Địa chỉ">
						<Input disabled placeholder="Địa chỉ" className="primary-input" value={!!userInfo?.Address ? userInfo?.Address : null} />
					</Form.Item>
				</div>
				<Divider className="col-span-2">Khác</Divider>
				<div className="col-span-1">
					<Form.Item label="Tư vấn viên">
						<Input disabled placeholder="Tư vấn viên" className="primary-input" value={!!userInfo?.SaleName ? userInfo?.SaleName : null} />
					</Form.Item>
				</div>
				<div className="col-span-1">
					<Form.Item label="Nguồn khách">
						<Input
							disabled
							placeholder="Nguồn khách"
							className="primary-input"
							value={!!userInfo?.SourceName ? userInfo?.SourceName : null}
						/>
					</Form.Item>
				</div>
				<div className="col-span-1">
					<Form.Item label="Mục đích học">
						<Input
							disabled
							placeholder="Mục đích học"
							className="primary-input"
							value={!!userInfo?.PurposeName ? userInfo?.PurposeName : null}
						/>
					</Form.Item>
				</div>
				<div className="col-span-1">
					<Form.Item label="Nhu cầu học">
						<Input
							disabled
							placeholder="Nhu cầu học"
							className="primary-input"
							value={!!userInfo?.LearningNeedName ? userInfo?.LearningNeedName : null}
						/>
					</Form.Item>
				</div>
			</div>
			{/* </Form> */}
		</div>
	)
}

export default FormUserRegister
