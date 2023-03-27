import { Card, Form, Pagination, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { branchApi } from '~/api/branch'
import { classApi } from '~/api/class'
import { userInformationApi } from '~/api/user'
import ClassList from '~/common/components/Class/ClassList'
import { ClassListContent } from '~/common/components/Class/ClassListContent'
import FilterBase from '~/common/components/Elements/FilterBase'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { parseSelectArray } from '~/common/utils/common'
import { RootState } from '~/store'
import { setBranch } from '~/store/branchReducer'

const listTodoApi = {
	name: null,
	status: null,
	branchIds: null,
	pageSize: PAGE_SIZE,
	pageIndex: 1,
	sort: 0,
	sortType: false,
	studentId: null
}

let listFieldFilter = {
	pageIndex: 1,
	pageSize: PAGE_SIZE,
	name: null,
	status: null,
	branchIds: null
}

const ListClass = () => {
	const [form] = Form.useForm()
	const [dataFilter, setDataFilter] = useState([
		{
			name: 'name',
			title: 'Tên lớp học',
			col: 'col-md-6 col-12',
			type: 'text',
			placeholder: 'Nhập tên lớp học',
			value: null
		},
		{
			name: 'status',
			title: 'Trạng thái',
			col: 'col-md-6 col-12',
			type: 'select',
			placeholder: 'Chọn trạng thái',
			value: null,
			optionList: [
				{ value: 1, title: 'Sắp diễn ra' },
				{ value: 2, title: 'Đang diễn ra' },
				{ value: 3, title: 'Kết thúc' }
			]
		},
		{
			name: 'branchIds',
			title: 'Trung tâm',
			col: 'col-12',
			type: 'select',
			mode: 'multiple',
			placeholder: 'Chọn trung tâm',
			value: null,
			optionList: []
		}
	])

	const [todoApi, setTodoApi] = useState(listTodoApi)
	const [listClass, setListClass] = useState<IClass[]>([])
	const [totalRow, setTotalRow] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const state = useSelector((state: RootState) => state)
	const [current, setCurrent] = useState(1)
	const dispatch = useDispatch()
	const [tabStatus, setTabStatus] = useState(null)
	const userInformation = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return userInformation?.RoleId == 1
	}

	function isTeacher() {
		return userInformation?.RoleId == 2
	}

	function isStdent() {
		return userInformation?.RoleId == 3
	}

	const getAllClass = async () => {
		setIsLoading(true)
		try {
			const res = await classApi.getAll(todoApi)
			if (res.status === 200) {
				if (userInformation?.RoleId === '8') {
					if (todoApi.studentId && todoApi.studentId !== '') {
						setListClass(res.data.data)
						setTotalRow(res.data.totalRow)
					} else {
						setListClass([])
						setTotalRow(0)
					}
				} else {
					setListClass(res.data.data)
					setTotalRow(res.data.totalRow)
				}
			}
			if (res.status === 204) {
				setListClass([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	const getAllBranch = async () => {
		if (isAdmin()) {
			try {
				const res = await branchApi.getAll()
				if (res.status === 200) {
					dispatch(setBranch(res.data.data))
				}
				if (res.status === 204) {
					dispatch(setBranch([]))
				}
			} catch (err) {
				ShowNoti('error', err.message)
			}
		}
	}

	const handleFilter = (listFilter) => {
		setTabStatus(null)
		let newListFilter = { ...listFieldFilter }
		listFilter.forEach((item, index) => {
			let key = item.name
			Object.keys(newListFilter).forEach((keyFilter) => {
				if (keyFilter == key) {
					newListFilter[key] = item.value
				}
				if (key === 'status') {
					setTabStatus(item.value)
				}
			})
		})
		setTodoApi({
			...todoApi,
			...newListFilter,
			branchIds: !!newListFilter.branchIds ? newListFilter.branchIds.join(',') : '',
			pageIndex: 1
		})
	}
	const [apiParametersStudent, setApiParametersStudent] = useState({
		PageSize: 9999,
		PageIndex: 1,
		RoleIds: '3',
		parentIds: userInformation?.RoleId == '8' ? userInformation.UserInformationId.toString() : ''
	})
	const [students, setStudents] = useState<{ label: string; value: string }[]>([])

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

	const handleReset = () => {
		setTabStatus(null)
		setTodoApi({ ...listTodoApi })
	}
	const handleChangeStudent = (val) => {
		if (val) {
			setTodoApi({ ...todoApi, studentId: val })
		} else {
			setTodoApi(listTodoApi)
		}
	}

	useEffect(() => {
		if (state.branch.Branch.length === 0) {
			getAllBranch()
		}
		if (userInformation?.RoleId === '8') {
			getUsers(apiParametersStudent)
		}
	}, [])

	useEffect(() => {
		if (state.branch.Branch.length > 0) {
			const convertData = parseSelectArray(state.branch.Branch, 'Name', 'Id')
			dataFilter[2].optionList = convertData
			setDataFilter([...dataFilter])
		}
	}, [state])

	useEffect(() => {
		getAllClass()
	}, [todoApi])
	useEffect(() => {
		if (students && students?.length > 0) {
			setTodoApi({ ...todoApi, studentId: students[0].value })
			form.setFieldValue('student', students[0].value)
		}
	}, [students])

	const getPagination = (pageNumber: number) => {
		setCurrent(pageNumber)
		setTodoApi({
			...todoApi,
			// ...listFieldSearch,
			pageIndex: pageNumber
		})
	}

	const showTotal = () => totalRow && <div className="font-weight-black">Tổng cộng: {totalRow}</div>

	const hanskeChangeTab = (val) => {
		setTabStatus(val)
		setTodoApi({ ...todoApi, status: val })
	}
	return (
		<div className="wrapper-class">
			<div className="row">
				<div className="col-12">
					<div className="wrap-table">
						<Card
							title={
								<>
									<div className="list-action-table">
										<FilterBase dataFilter={dataFilter} handleFilter={handleFilter} handleReset={handleReset} />
									</div>
									<div className="list-action-button">
										<div onClick={() => hanskeChangeTab(1)} className={`item ${tabStatus == 1 ? 'active' : ''}`}>
											Sắp diễn ra
										</div>
										<div onClick={() => hanskeChangeTab(2)} className={`item  ${tabStatus == 2 ? 'active' : ''}`}>
											Đang diễn ra
										</div>
										<div onClick={() => hanskeChangeTab(3)} className={`item  ${tabStatus == 3 ? 'active' : ''}`}>
											Kết thúc
										</div>
									</div>
								</>
							}
							extra={
								userInformation?.RoleId === '8' ? (
									<Form form={form}>
										<Form.Item name="student">
											<Select
												allowClear
												className="w-[200px]"
												onChange={handleChangeStudent}
												options={students}
												placeholder="Chọn học viên"
											/>
										</Form.Item>
									</Form>
								) : (
									''
								)
							}
						>
							<div className="course-list-content">
								<ClassListContent
									totalRow={totalRow}
									isLoading={isLoading}
									dataSource={listClass}
									setTodoApi={setTodoApi}
									listTodoApi={listTodoApi}
									todoApi={todoApi}
									getAllClass={getAllClass}
								/>
								{/* <ClassList
									totalRow={totalRow}
									isLoading={isLoading}
									dataSource={listClass}
									setTodoApi={setTodoApi}
									listTodoApi={listTodoApi}
									todoApi={todoApi}
									getAllClass={getAllClass}
								/> */}
								<div className="custom-pagination">
									<Pagination
										size="small"
										current={current}
										onChange={(pageNumber) => getPagination(pageNumber)}
										total={totalRow}
										pageSize={PAGE_SIZE}
										showTotal={showTotal}
									/>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ListClass
