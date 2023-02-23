import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { branchApi } from '~/api/branch'
import { testAppointmentApi } from '~/api/test-appointment'
import FilterBase from '~/common/components/Elements/FilterBase'
import NotiModal from '~/common/components/Elements/NotiModal'
import SortBox from '~/common/components/Elements/SortBox'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import FilterColumn from '~/common/components/FilterTable/Filter/FilterColumn'
import { parseSelectArray, parseSelectArrayUser, parseToMoney } from '~/common/utils/common'
import ScoreModal from '~/common/components/Service/ScoreModal'
import TestUpdateStatus from '~/common/components/Service/TestUpdateStatus'
import { ShowNoti } from '~/common/utils'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import CancelTest from '~/common/components/Service/CancelTest'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { useDispatch } from 'react-redux'
import { setBranch } from '~/store/branchReducer'
import StudentForm from '~/common/components/Student/StudentForm'
import { examApi } from '~/api/exam'
import { userInformationApi } from '~/api/user'
import ExpandedRowAppointment from '~/common/components/Service/ExpandedRowAppointment'

const appointmenInitFilter = [
	{
		name: 'BranchIds',
		title: 'Trung tâm',
		col: 'col-md-12 col-12',
		type: 'select',
		mode: 'multiple',
		optionList: [],
		value: null
	},
	{
		name: 'Status',
		title: 'Trạng thái',
		col: 'col-md-12 col-12',
		type: 'select',
		mode: 'multiple',
		optionList: [
			{ value: 1, title: 'Chưa kiểm tra' },
			{ value: 2, title: 'Đã kiểm tra' }
		],
		value: null
	},
	{
		name: 'Type',
		title: 'Địa điểm làm bài',
		col: 'col-md-12 col-12',
		type: 'select',
		mode: 'multiple',
		optionList: [
			{ value: 1, title: 'Tại trung tâm' },
			{ value: 2, title: 'Làm bài trực tuyến' }
		],
		value: null
	}
]

const appointmenDataOption = [
	{
		dataSort: {
			sort: 1,
			sortType: true
		},
		text: 'Tên A - Z '
	},
	{
		dataSort: {
			sort: 0,
			sortType: false
		},
		text: 'Tên Z - A'
	},
	{
		dataSort: {
			sort: 0,
			sortType: true
		},
		text: 'Ngày hẹn A - Z'
	},
	{
		dataSort: {
			sort: 0,
			sortType: false
		},
		text: 'Ngày hẹn Z - A'
	}
]

let pageIndex = 1

let listFieldSearch = {
	pageIndex: 1,
	FullNameUnicode: null
}

let listFieldFilter = {
	pageIndex: 1,
	BranchIds: null, // lọc
	Status: null,
	Type: null
}

export default function ServiceAppointmentTest(props) {
	const state = useSelector((state: RootState) => state)
	const dispatch = useDispatch()
	const [isOpenNoti, setisOpenNoti] = useState(false)
	const [listStudent, setListStudent] = useState([])
	const [listTeacher, setListTeacher] = useState([])
	const [listExamination, setListExamination] = useState([])

	// BASE USESTATE TABLE
	const [dataSource, setDataSource] = useState<ITestCustomer[]>([])
	const listTodoApi = {
		pageSize: PAGE_SIZE,
		pageIndex: pageIndex,
		sort: 0,
		sortType: false,
		FullName: null,
		UserCode: null,
		BranchIds: null, // lọc
		Type: null,
		Status: null
	}
	const [isLoading, setIsLoading] = useState(false)
	const [totalPage, setTotalPage] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [todoApi, setTodoApi] = useState(listTodoApi)

	// LIST FILTER
	const [dataFilter, setDataFilter] = useState(appointmenInitFilter)

	useMemo(() => {
		if (state.branch.Branch.length > 0) {
			const convertDataBranch = parseSelectArray(state.branch.Branch, 'Name', 'Id')
			dataFilter[0].optionList = convertDataBranch
			setDataFilter([...dataFilter])
		}
	}, [state.branch])

	const getAllBranch = async () => {
		try {
			const res = await branchApi.getAll({ pageSize: 99999 })
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

	useEffect(() => {
		if (state.branch.Branch.length === 0) {
			getAllBranch()
		}
	}, [])

	// GET DATA SOURCE
	const getDataSource = async () => {
		setIsLoading(true)
		try {
			let res = await testAppointmentApi.getAll(todoApi)
			if (res.status === 200) {
				setDataSource(res.data.data)
				setTotalPage(res.data.totalRow)
			}
			if (res.status === 204) {
				setDataSource([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	// SET DATA FUN
	const setDataFunc = (name, data) => {
		dataFilter.every((item, index) => {
			if (item.name == name) {
				item.optionList = data
				return false
			}
			return true
		})
		setDataFilter([...dataFilter])
	}

	// AFTER SUBMIT
	const afterPost = (mes) => {
		setTodoApi({ ...listTodoApi, pageIndex: 1 })
		setCurrentPage(1)
	}

	// ON SUBMIT
	const _onSubmit = async (dataSubmit: any) => {
		setIsLoading(true)
		let res = null
		try {
			if (dataSubmit.ID) {
				res = await testAppointmentApi.update(dataSubmit)
				if (res.status == 200) {
					setTodoApi({ ...todoApi })
					ShowNoti('success', res.data.message)
				}
			} else {
				res = await testAppointmentApi.add(dataSubmit)
				res?.status == 200 && afterPost(res.data.message)
			}
		} catch (error) {
			console.log('error: ', error)
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
		return res
	}

	// HANDLE FILTER
	const handleFilter = (listFilter) => {
		let newListFilter = { ...listFieldFilter }
		listFilter.forEach((item, index) => {
			let key = item.name
			Object.keys(newListFilter).forEach((keyFilter) => {
				if (keyFilter == key) {
					newListFilter[key] = !!item.value ? item.value.join(',') : item.value
				}
			})
		})
		setTodoApi({ ...listTodoApi, ...newListFilter, pageIndex: 1 })
	}

	// HANDLE SORT
	const handleSort = async (option) => {
		let newTodoApi = {
			...listTodoApi,
			pageIndex: 1,
			sort: option.title.sort,
			sortType: option.title.sortType
		}
		setCurrentPage(1), setTodoApi(newTodoApi)
	}

	const onSearch = (valueSearch, dataIndex) => {
		setTodoApi({ ...todoApi, [dataIndex]: valueSearch })
	}

	// HANDLE RESET
	const resetListFieldSearch = () => {
		Object.keys(listFieldSearch).forEach(function (key) {
			if (key != 'pageIndex') {
				listFieldSearch[key] = null
			}
		})
	}

	const handleReset = () => {
		setTodoApi({ ...listTodoApi, pageIndex: 1 })
		setCurrentPage(1), resetListFieldSearch()
	}

	// GET PAGE_NUMBER
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber
		setCurrentPage(pageNumber)
		setTodoApi({ ...todoApi, pageIndex: pageIndex })
	}
	const getAllStudentAndTeacher = async () => {
		try {
			const res = await userInformationApi.getAll({ roleIds: '2,3' })
			if (res.status === 200) {
				const filterStudent = res.data.data.filter((student) => student.RoleId === 3)
				const filterTeacher = res.data.data.filter((teacher) => teacher.RoleId === 2)
				const convertDataTeacher = parseSelectArray(filterTeacher, 'FullName', 'UserInformationId')
				const convertDataStudent = parseSelectArrayUser(filterStudent, 'FullName', 'UserCode', 'UserInformationId')
				setListStudent(convertDataStudent)
				setListTeacher(convertDataTeacher)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}
	const getAllExamination = async () => {
		try {
			const res = await examApi.getAll({ pageSize: 9999, search: '', pageIndex: 1 })
			if (res.status === 200) {
				const convertDataExamination = parseSelectArray(res.data.data, 'Name', 'Id')
				setListExamination(convertDataExamination)
			}
			if (res.status === 204) {
				setListExamination([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}
	// USE EFFECT - FETCH DATA
	useEffect(() => {
		getDataSource()
	}, [todoApi])
	console.log('todoApi: ', todoApi)

	useEffect(() => {
		getAllStudentAndTeacher()
		getAllExamination()
	}, [])

	const expandedRowRender = (record) => {
		return <ExpandedRowAppointment rowData={record} />
	}

	const onUpdateData = () => {
		setTodoApi({ ...todoApi })
	}

	const columns = [
		{
			title: 'Mã',
			dataIndex: 'UserCode',
			width: 110
		},
		{
			title: 'Học viên',
			dataIndex: 'FullName',
			width: 180,
			render: (a) => <p className="font-weight-primary">{a}</p>,
			...FilterColumn('FullName', onSearch, handleReset, 'text')
		},
		{
			width: 200,
			title: 'Trung tâm',
			dataIndex: 'BranchName',
			render: (a) => <p className="font-weight-black">{a}</p>
		},
		{
			title: 'Thời gian',
			dataIndex: 'Time',
			render: (date: any) => moment(date).format('DD/MM/YYYY HH:mm')
		},
		{
			width: 200,
			title: 'Người hẹn',
			dataIndex: 'ModifiedBy'
		},
		{
			width: 200,
			title: 'Giáo viên',
			dataIndex: 'TeacherName'
		},
		{
			title: 'Trạng thái',
			dataIndex: 'Status',
			render: (status, data) => {
				if (status === 1) {
					return <p className="tag red">{data.StatusName}</p>
				}
				if (status === 2) {
					return <p className="tag blue">{data.StatusName}</p>
				}
			}
		},
		{
			align: 'right',
			title: 'Chức năng',
			fixed: 'right',
			responsive: ['md'],
			render: (text, data, index) => {
				return (
					<div onClick={(e) => e.stopPropagation()}>
						{/* {data.Status === 1 && (
							<Link href={{ pathname: '/course/register', query: { key: data.ID } }}>
								<Tooltip placement="top" title={'Đăng ký học'}>
									<a className="btn btn-icon menu">
										<Book size={20} />
									</a>
								</Tooltip>
							</Link>
						)} */}
						<TestUpdateStatus rowData={data} setTodoApi={setTodoApi} listTodoApi={listTodoApi} />
						<StudentForm
							rowData={data}
							listStudent={listStudent}
							listTeacher={listTeacher}
							listExamination={listExamination}
							setTodoApi={setTodoApi}
							listTodoApi={listTodoApi}
						/>
						{/* <ServiceTestCustomerForm
							getIndex={() => {}}
							index={index}
							rowData={data}
							rowID={data.ID}
							listData={listDataForm}
							isLoading={isLoading}
							_onSubmit={(data: any) => _onSubmit(data)}
							dataExam={dataExam}
						/> */}
						{/* {data.Status !== 2 && <TestAddExam dataExam={dataExam} dataRow={data} onFetchData={() => setTodoApi({ ...todoApi })} />} */}
						{data.Status == 1 && <CancelTest onUpdateData={onUpdateData} dataRow={data} />}
						{data.Type === 1 && <ScoreModal rowData={data} listTodoApi={listTodoApi} setTodoApi={setTodoApi} />}
					</div>
				)
			}
		},
		{
			align: 'right',
			title: 'Chức năng',
			responsive: ['xs'],
			render: (text, data, index) => {
				return (
					<div onClick={(e) => e.stopPropagation()}>
						{/* {data.Status === 1 && (
							<Link href={{ pathname: '/course/register', query: { key: data.ID } }}>
								<Tooltip placement="top" title={'Đăng ký học'}>
									<a className="btn btn-icon menu">
										<Book size={20} />
									</a>
								</Tooltip>
							</Link>
						)} */}
						<TestUpdateStatus rowData={data} setTodoApi={setTodoApi} listTodoApi={listTodoApi} />
						<StudentForm
							rowData={data}
							listStudent={listStudent}
							listTeacher={listTeacher}
							listExamination={listExamination}
							setTodoApi={setTodoApi}
							listTodoApi={listTodoApi}
						/>
						{/* <ServiceTestCustomerForm
							getIndex={() => {}}
							index={index}
							rowData={data}
							rowID={data.ID}
							listData={listDataForm}
							isLoading={isLoading}
							_onSubmit={(data: any) => _onSubmit(data)}
							dataExam={dataExam}
						/> */}
						{/* {data.Status !== 2 && <TestAddExam dataExam={dataExam} dataRow={data} onFetchData={() => setTodoApi({ ...todoApi })} />} */}
						{data.Status == 0 && <CancelTest onUpdateData={onUpdateData} dataRow={data} />}
						{data.Type === 1 && <ScoreModal rowData={data} listTodoApi={listTodoApi} setTodoApi={setTodoApi} />}
					</div>
				)
			}
		}
	]

	return (
		<>
			<NotiModal
				isOpen={isOpenNoti}
				isCancel={() => setisOpenNoti(false)}
				isOk={() => setisOpenNoti(false)}
				content="Chưa đến giờ làm đề test"
			/>
			<div className="test-customer">
				<ExpandTable
					currentPage={currentPage}
					totalPage={totalPage && totalPage}
					getPagination={(pageNumber: number) => getPagination(pageNumber)}
					loading={isLoading}
					// addClass="basic-header"
					// TitlePage="Danh sách khách hẹn test"
					dataSource={dataSource}
					columns={columns}
					Extra={
						<div className="extra-table">
							<FilterBase dataFilter={dataFilter} handleFilter={(listFilter: any) => handleFilter(listFilter)} handleReset={handleReset} />
							<SortBox handleSort={(value) => handleSort(value)} dataOption={appointmenDataOption} />
						</div>
					}
					TitleCard={
						<StudentForm
							listStudent={listStudent}
							listTeacher={listTeacher}
							listExamination={listExamination}
							setTodoApi={setTodoApi}
							listTodoApi={listTodoApi}
						/>
					}
					expandable={expandedRowRender}
				/>
			</div>
		</>
	)
}
