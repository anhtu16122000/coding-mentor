import { Form, Input, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { studentInClassApi } from '~/api/student-in-class'
import { userInformationApi } from '~/api/user'
import CCSearch from '~/common/components/CCSearch'
import IconButton from '~/common/components/Primary/IconButton'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import PrimaryTag from '~/common/components/Primary/Tag'
import { userInfoColumn } from '~/common/libs/columns/user-info'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { RootState } from '~/store'

let pageIndex = 1

export const StudentWarningPage = () => {
	const [form] = Form.useForm()
	const [loading, setLoading] = useState({ type: '', status: false })
	const userInformation = useSelector((state: RootState) => state.user.information)
	const initParameters = {
		warning: true,
		search: null,
		sortType: null,
		pageIndex: 1,
		pageSize: PAGE_SIZE,
		studentIds: '',
		parentIds: userInformation?.RoleId == '8' ? userInformation.UserInformationId.toString() : ''
	}
	const [apiParameters, setApiParameters] = useState(initParameters)
	const [totalRow, setTotalRow] = useState(1)
	const [dataTable, setDataTable] = useState([])
	const [currentPage, setCurrentPage] = useState(1)
	const [students, setStudents] = useState<{ label: string; value: string }[]>([])
	const [apiParametersStudent, setApiParametersStudent] = useState({
		PageSize: PAGE_SIZE,
		PageIndex: 1,
		RoleIds: '3',
		parentIds: userInformation?.RoleId == '8' ? userInformation.UserInformationId.toString() : ''
	})

	const getStudentInClass = async (params) => {
		try {
			setLoading({ type: 'GET_ALL', status: true })
			const res = await studentInClassApi.getAll(params)
			if (res.status == 200) {
				setDataTable(res.data.data)
				setTotalRow(res.data.totalRow)
			}
			if (res.status == 204) {
				setDataTable([])
			}
		} catch (error) {
			setLoading({ type: 'GET_ALL', status: true })
		} finally {
			setLoading({ type: 'GET_ALL', status: false })
		}
	}

	const getUsers = async (param) => {
		try {
			const response = await userInformationApi.getAll(param)
			if (response.status == 200) {
				let temp = []
				response.data.data?.forEach((item) => {
					temp.push({ label: `${item?.FullName} - ${item.UserCode}`, value: item.UserInformationId })
				})
				setStudents(temp)
			}
			if (response.status == 204) {
				setStudents([])
			}
		} catch (error) {
			console.error(error)
		} finally {
		}
	}

	const handleChangeStudent = (val) => {
		if (val) {
			setApiParameters({ ...apiParameters, studentIds: val?.toString() })
		} else {
			setApiParameters({ ...apiParameters, studentIds: '' })
		}
	}

	useEffect(() => {
		if (userInformation?.RoleId === '8') {
			if (apiParameters.studentIds) {
				getStudentInClass(apiParameters)
			}
		} else {
			if (apiParameters) {
				getStudentInClass(apiParameters)
			}
		}
	}, [apiParameters])

	useEffect(() => {
		if (userInformation?.RoleId === '8') {
			getUsers(apiParametersStudent)
		}
	}, [])

	useEffect(() => {
		if (students && students?.length > 0) {
			setApiParameters({ ...apiParameters, studentIds: students[0].value?.toString() })
			form.setFieldValue('student', students[0].value)
		}
	}, [students])

	const columns = [
		userInfoColumn,
		{
			title: 'Số điện thoại',
			dataIndex: 'Mobile'
		},
		{
			title: 'Email',
			dataIndex: 'Email'
		},
		{
			title: 'Lớp',
			dataIndex: 'ClassName'
		},
		{
			title: 'Loại',
			dataIndex: 'TypeName',
			render: (text, item) => (
				<>
					<PrimaryTag color={item?.Type == 1 ? 'green' : 'red'} children={text} />
				</>
			)
		}
	]

	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber
		setCurrentPage(pageNumber)
		setApiParameters({
			...apiParameters,
			pageIndex: pageIndex
		})
	}

	const expandedRowRender = (data) => {
		return <>Ghi chú: {data?.Note}</>
	}

	return (
		<>
			<ExpandTable
				currentPage={currentPage}
				totalPage={totalRow && totalRow}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={loading}
				TitleCard={
					<div className="flex-1">
						<Input.Search
							className="primary-search max-w-[250px]"
							onChange={(event) => {
								if (event.target.value == '') {
									setApiParameters({ ...apiParameters, pageIndex: 1, search: '' })
								}
							}}
							onSearch={(event) => setApiParameters({ ...apiParameters, pageIndex: 1, search: event })}
							placeholder="Tìm kiếm"
						/>
					</div>
				}
				Extra={
					userInformation?.RoleId === '8' ? (
						<>
							<Form form={form}>
								<Form.Item name={'student'}>
									<Select
										defaultValue={students[0]}
										allowClear
										className="w-[200px]"
										onChange={handleChangeStudent}
										options={students}
										placeholder="Chọn học viên"
									/>
								</Form.Item>
							</Form>
						</>
					) : (
						''
					)
				}
				dataSource={dataTable}
				columns={columns}
				expandable={expandedRowRender}
			/>
		</>
	)
}
