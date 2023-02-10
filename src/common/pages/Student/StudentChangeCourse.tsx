import React, { useState, useEffect } from 'react'
import { Eye } from 'react-feather'
import { Tooltip } from 'antd'
import Link from 'next/link'
import SortBox from '~/common/components/Elements/SortBox'
import FilterColumn from '~/common/components/FilterTable/Filter/FilterColumn'
// import { studentChangeCourseApi, branchApi } from '~/src/apiBase'
import { branchApi } from '~/api/branch'
import { studentChangeCourseApi } from '~/api/course-of-student-change'
// import { useWrap } from '~/src/context/wrap'
import FilterBase from '~/common/components/Elements/FilterBase'
import PrimaryTable from '~/common/components/Primary/Table'
import { parseToMoney } from '~/common/utils/common'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
let pageIndex = 1

let listFieldSearch = {
	pageIndex: 1,
	FullNameUnicode: null
}

let listFieldFilter = {
	pageIndex: 1,
	CourseIDBefore: null,
	CourseIDAfter: null
}

const dataOption = [
	{
		dataSort: {
			sort: 0,
			sortType: true
		},
		text: 'Tên A-Z'
	},
	{
		dataSort: {
			sort: 0,
			sortType: false
		},
		text: 'Tên Z-A'
	}
]

export default function StudentChangeCourse() {
	const [dataCourse, setDataCourse] = useState<IBranch[]>()

	// ------ BASE USESTATE TABLE -------
	const [dataSource, setDataSource] = useState<IStudentOfChangeCourse[]>([])
	// const { showNoti, pageSize, userInformation } = useWrap()
	const { information: userInformation } = useSelector((state: RootState) => state.user)
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	})
	const [totalPage, setTotalPage] = useState(null)
	const [indexRow, setIndexRow] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)

	const listTodoApi = {
		pageSize: PAGE_SIZE,
		pageIndex: pageIndex,
		sort: null,
		sortType: null,
		CourseIDBefore: null,
		CourseIDAfter: null
	}
	const [todoApi, setTodoApi] = useState(listTodoApi)

	// ------ LIST FILTER -------
	const [dataFilter, setDataFilter] = useState([
		{
			name: 'BranchID',
			title: 'Trung tâm',
			col: 'col-12',
			type: 'select',
			optionList: null, // Gọi api xong trả data vào đây
			value: null
		}
	])

	// GET DATA SOURCE
	const getDataSource = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		})

		try {
			let res = await studentChangeCourseApi.getAll(todoApi)
			res.status == 200 && (setDataSource(res.data.data), setTotalPage(res.data.totalRow), ShowNoti('success', 'Thành công'))
			res.status == 204 && setDataSource([])
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			})
		}
	}

	console.log('Data Filter: ', dataFilter)

	// ------ SET DATA FUN ------
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

	// GET DATA SOURCE
	const getDataCenter = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		})

		try {
			let res = await branchApi.getAll({ pageIndex: 1, pageSize: 999999 })

			if (res.status == 200) {
				const newData = res.data.data.map((item) => ({
					title: item.Name,
					value: item.Id
				}))
				setDataCourse(res.data.data)
				setDataFunc('BranchID', newData)
				setTotalPage(res.data.totalRow)
			}

			res.status == 204 && setDataCourse([])
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			})
		}
	}

	// -------------- HANDLE FILTER ------------------
	const handleFilter = (listFilter) => {
		console.log('List Filter when submit: ', listFilter)

		let newListFilter = { ...listFieldFilter }
		listFilter.forEach((item, index) => {
			let key = item.name
			Object.keys(newListFilter).forEach((keyFilter) => {
				if (keyFilter == key) {
					newListFilter[key] = item.value
				}
			})
		})
		setTodoApi({ ...listTodoApi, ...newListFilter, pageIndex: 1 })
	}

	// --------------- HANDLE SORT ----------------------
	const handleSort = async (option) => {
		let newTodoApi = {
			...listTodoApi,
			pageIndex: 1,
			sort: option.title.sort,
			sortType: option.title.sortType
		}
		setCurrentPage(1), setTodoApi(newTodoApi)
	}

	// ------------ ON SEARCH -----------------------

	const checkField = (valueSearch, dataIndex) => {
		let newList = { ...listFieldSearch }
		Object.keys(newList).forEach(function (key) {
			console.log('key: ', key)
			if (key != dataIndex) {
				if (key != 'pageIndex') {
					newList[key] = null
				}
			} else {
				newList[key] = valueSearch
			}
		})

		return newList
	}

	const onSearch = (valueSearch, dataIndex) => {
		let clearKey = checkField(valueSearch, dataIndex)

		setTodoApi({
			...todoApi,
			...clearKey
		})
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
		setTodoApi({
			...listTodoApi,
			pageIndex: 1
		})
		setCurrentPage(1), resetListFieldSearch()
	}

	// -------------- GET PAGE_NUMBER -----------------
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber
		setCurrentPage(pageNumber)
		setTodoApi({
			...todoApi,
			...listFieldSearch,
			pageIndex: pageIndex
		})
	}

	// ============== USE EFFECT - FETCH DATA ===================
	useEffect(() => {
		getDataSource()
		getDataCenter()
	}, [todoApi])

	const columns =
		userInformation && userInformation?.RoleId !== 10
			? [
					{
						title: 'Học viên',
						dataIndex: 'FullNameUnicode',
						...FilterColumn('FullNameUnicode', onSearch, handleReset, 'text'),
						render: (nameStudent) => <p className="font-weight-primary">{nameStudent}</p>
					},
					{
						title: 'Khóa trước',
						dataIndex: 'CourseNameBefore',
						render: (course) => <p className="font-weight-black">{course}</p>
					},
					{
						title: 'Khóa sau',
						dataIndex: 'CourseNameAfter',
						render: (course) => <p className="font-weight-black">{course}</p>
					},
					{
						width: 150,
						title: 'Số tiền chênh lệch',
						dataIndex: 'AdditionalPayment',
						render: (course) => <p className="font-weight-black">{parseToMoney(course || 0)}</p>
					},
					{
						width: 150,
						title: 'Trung tâm',
						dataIndex: 'BranchName'
					},
					{
						width: 180,
						title: 'Ghi chú',
						dataIndex: 'Note'
					},
					{
						width: 150,
						title: 'Cam kết',
						dataIndex: 'Commitment'
					},
					{
						title: '',
						render: (data) => (
							<Link
								href={{
									pathname: '/customer/student/student-change-course/student-detail',
									query: { slug: data.UserInformationID }
								}}
							>
								<Tooltip title="Xem chi tiết">
									<button className="btn btn-icon exchange">
										<Eye />
									</button>
								</Tooltip>
							</Link>
						)
					}
			  ]
			: [
					{
						title: 'Học viên',
						dataIndex: 'FullNameUnicode',
						...FilterColumn('FullNameUnicode', onSearch, handleReset, 'text'),
						render: (nameStudent) => <p className="font-weight-primary">{nameStudent}</p>
					},
					{
						title: 'Khóa trước',
						dataIndex: 'CourseNameBefore',
						render: (course) => <p className="font-weight-black">{course}</p>
					},
					{
						title: 'Khóa sau',
						dataIndex: 'CourseNameAfter',
						render: (course) => <p className="font-weight-black">{course}</p>
					},
					{
						width: 150,
						title: 'Trung tâm',
						dataIndex: 'BranchName'
					},
					{
						width: 180,
						title: 'Ghi chú',
						dataIndex: 'Note'
					},
					{
						width: 150,
						title: 'Cam kết',
						dataIndex: 'Commitment'
					}
			  ]

	return (
		<PrimaryTable
			// currentPage={currentPage}
			// totalPage={totalPage && totalPage}
			// getPagination={(pageNumber: number) => getPagination(pageNumber)}
			// loading={isLoading}
			// addClass="basic-header"
			// TitlePage="Học viên chuyển khóa"
			data={dataSource}
			columns={columns}
			TitleCard={
				<div className="extra-table">
					<FilterBase dataFilter={dataFilter} handleFilter={(listFilter: any) => handleFilter(listFilter)} handleReset={handleReset} />
					<SortBox handleSort={(value) => handleSort(value)} dataOption={dataOption} />
				</div>
			}
		/>
	)
}
