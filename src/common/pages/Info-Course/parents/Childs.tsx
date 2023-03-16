import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { branchApi } from '~/api/branch'
import { parseSelectArray } from '~/common/utils/common'
import { ShowNostis, ShowNoti } from '~/common/utils'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { useDispatch } from 'react-redux'
import { setBranch } from '~/store/branchReducer'
import RestApi from '~/api/RestApi'
import { userInfoColumn } from '~/common/libs/columns/user-info'
import PrimaryTable from '~/common/components/Primary/Table'
import AddChildForm from './AddChild'
import { ButtonRemove } from '~/common/components/TableButton'
import { PrimaryTooltip } from '~/common/components'
import { Popconfirm } from 'antd'

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

let pageIndex = 1

export default function Childs(props) {
	const state = useSelector((state: RootState) => state)
	const dispatch = useDispatch()

	// BASE USESTATE TABLE
	const [dataSource, setDataSource] = useState<ITestCustomer[]>([])

	const listTodoApi = {
		pageSize: PAGE_SIZE,
		pageIndex: pageIndex,
		Genders: null,
		RoleIds: '3',
		Search: null,
		sort: 0,
		sortType: false
	}

	const [isLoading, setIsLoading] = useState(false)
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
			let res = await RestApi.get<any>('UserInformation', { ...todoApi, parentIds: props?.rowData?.UserInformationId })
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

	async function removeStudent(params) {
		const DATA_SUBMIT = {
			UserInformationId: params,
			ParentId: 0
		}

		try {
			const response = await RestApi.put('UserInformation', DATA_SUBMIT)
			if (response.status == 200) {
				ShowNostis.success('Thành công')
				getDataSource()
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
			title: 'Email',
			dataIndex: 'Email'
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
					{value == 0 && <span className="tag yellow">Khác</span>}
					{value == 1 && <span className="tag blue">Nam</span>}
					{value == 2 && <span className="tag green">Nữ</span>}
				</>
			)
		},
		{
			title: '',
			dataIndex: 'Gender',
			render: (value, record) => (
				<>
					<PrimaryTooltip id={`dele-${record?.UserInformationId}`} place="left" content="Xoá">
						<Popconfirm title="Xoá dữ liệu?" onConfirm={() => removeStudent(record?.UserInformationId)}>
							<ButtonRemove className="ml-[16px]" />
						</Popconfirm>
					</PrimaryTooltip>
				</>
			)
		}
	]

	return (
		<PrimaryTable
			className="w-[1176px]"
			current={currentPage}
			total={totalPage && totalPage}
			onChangePage={(pageNumber: number) => getPagination(pageNumber)}
			loading={isLoading}
			data={dataSource}
			columns={columns}
			Extra={
				<>
					{(isAdmin() || isSaler() || isManager() || isTeacher() || isAcademic()) && (
						<AddChildForm parent={props?.rowData} onRefresh={getDataSource} />
					)}
				</>
			}
		/>
	)
}
