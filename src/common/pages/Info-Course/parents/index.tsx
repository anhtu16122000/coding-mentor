import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { branchApi } from '~/api/branch'
import SortBox from '~/common/components/Elements/SortBox'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { parseSelectArray } from '~/common/utils/common'
import { ShowNostis, ShowNoti } from '~/common/utils'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { useDispatch } from 'react-redux'
import { setBranch } from '~/store/branchReducer'
import RestApi from '~/api/RestApi'
import { userInfoColumn } from '~/common/libs/columns/user-info'
import ParentsForm from '~/common/pages/Info-Course/parents/Create'
import { PrimaryTooltip } from '~/common/components'
import { ButtonRemove } from '~/common/components/TableButton'
import { Input, Popconfirm } from 'antd'
import Childs from './Childs'

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

const sortParams = [
	{
		dataSort: {
			sort: 1,
			sortType: true
		},
		text: 'Tên A - Z '
	},
	{
		dataSort: {
			sort: 1,
			sortType: false
		},
		text: 'Tên Z - A'
	}
]

let pageIndex = 1

export default function Parents(props) {
	const state = useSelector((state: RootState) => state)
	const dispatch = useDispatch()

	// BASE USESTATE TABLE
	const [dataSource, setDataSource] = useState<ITestCustomer[]>([])

	const listTodoApi = {
		pageSize: PAGE_SIZE,
		pageIndex: pageIndex,
		Genders: null,
		RoleIds: '8',
		Search: null,
		sort: 0,
		sortType: false
	}

	const [isLoading, setIsLoading] = useState(true)
	const [totalPage, setTotalPage] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [todoApi, setTodoApi] = useState(listTodoApi)

	// LIST FILTER
	const [dataFilter, setDataFilter] = useState(appointmenInitFilter)

	const userInformation = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return userInformation?.RoleId == 1
	}

	function isTeacher() {
		return userInformation?.RoleId == 2
	}

	function isSaler() {
		return userInformation?.RoleId == 5
	}

	function isManager() {
		return userInformation?.RoleId == 4
	}

	function isStdent() {
		return userInformation?.RoleId == 3
	}

	function isAcademic() {
		return userInformation?.RoleId == 7
	}

	useMemo(() => {
		if (state.branch.Branch.length > 0) {
			const convertDataBranch = parseSelectArray(state.branch.Branch, 'Name', 'Id')
			dataFilter[0].optionList = convertDataBranch
			setDataFilter([...dataFilter])
		}
	}, [state.branch])

	const getAllBranch = async () => {
		if (isAdmin() || isSaler() || isManager()) {
			try {
				const res = await branchApi.getAll({ pageSize: 99999 })
				if (res.status == 200) {
					dispatch(setBranch(res.data.data))
				} else {
					dispatch(setBranch([]))
				}
			} catch (err) {
				ShowNoti('error', err.message)
			}
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
			let res = await RestApi.get<any>('UserInformation', todoApi)
			if (res.status == 200) {
				setDataSource(res.data.data)
				setTotalPage(res.data.totalRow)
			}
			if (res.status == 204) {
				setDataSource([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
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

	async function deleteThis(params) {
		try {
			const res = await RestApi.delete('UserInformation', params)
			if (res.status == 200) {
				getDataSource()
				ShowNostis.success('Thành công')
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

	// GET PAGE_NUMBER
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber
		setCurrentPage(pageNumber)
		setTodoApi({ ...todoApi, pageIndex: pageIndex })
	}

	// USE EFFECT - FETCH DATA
	useEffect(() => {
		getDataSource()
	}, [todoApi])

	const expandedRowRender = (record) => {
		return (
			<div className="!w-[1200px]">
				<Childs rowData={record} />
			</div>
		)
	}

	const columns = [
		userInfoColumn,
		{
			title: 'Tên đăng nhập',
			dataIndex: 'UserName',
			width: 180,
			render: (a) => <p className="font-weight-primary">{a}</p>
		},
		{
			title: 'Điện thoại',
			dataIndex: 'Mobile',
			width: 120
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'DOB',
			width: 120,
			render: (value, record) => {
				return <p className="font-[600]">{!!value ? moment(value).format('DD/MM/YYYY') : ''}</p>
			}
		},
		{
			title: 'Giới tính',
			width: 90,
			dataIndex: 'Gender',
			render: (value, record) => (
				<>
					{value == 0 && <span className="tag gray">Khác</span>}
					{value == 1 && <span className="tag blue">Nam</span>}
					{value == 2 && <span className="tag green">Nữ</span>}
					{value == 3 && <span className="tag gray">Khác</span>}
				</>
			)
		},
		{
			title: '',
			render: (text, data, index) => {
				return (
					<div className="flex items-center">
						{(isAdmin() || isManager() || isTeacher() || isSaler() || isAcademic()) && (
							<ParentsForm defaultData={data} isEdit onRefresh={getDataSource} />
						)}

						{(isAdmin() || isManager() || isTeacher() || isSaler() || isAcademic()) && (
							<PrimaryTooltip id={`dele-${data?.UserInformationId}`} place="left" content="Xoá">
								<Popconfirm title="Xoá dữ liệu?" onConfirm={() => deleteThis(data?.UserInformationId)}>
									<ButtonRemove className="ml-[16px]" />
								</Popconfirm>
							</PrimaryTooltip>
						)}
					</div>
				)
			}
		}
	]

	return (
		<>
			<div className="test-customer">
				<ExpandTable
					currentPage={currentPage}
					totalPage={totalPage && totalPage}
					getPagination={(pageNumber: number) => getPagination(pageNumber)}
					loading={isLoading}
					dataSource={dataSource}
					columns={columns}
					TitleCard={
						<div className="extra-table">
							<Input.Search
								className="primary-search max-w-[250px] mr-[8px]"
								onChange={(event) => {
									if (event.target.value == '') {
										setTodoApi({ ...listTodoApi, pageIndex: 1, Search: '' })
									}
								}}
								onSearch={(event) => setTodoApi({ ...listTodoApi, pageIndex: 1, Search: event })}
								placeholder="Tìm kiếm"
							/>
							<SortBox handleSort={(value) => handleSort(value)} dataOption={sortParams} />
						</div>
					}
					Extra={
						<>
							{(isAdmin() || isSaler() || isManager() || isTeacher() || isAcademic()) && (
								<ParentsForm defaultData={null} onRefresh={getDataSource} />
							)}
						</>
					}
					expandable={expandedRowRender}
				/>
			</div>
		</>
	)
}
