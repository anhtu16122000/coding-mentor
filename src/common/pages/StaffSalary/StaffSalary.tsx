import React, { Fragment, useEffect, useState } from 'react'
import { Tooltip } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import moment from 'moment'
import { Trash } from 'react-feather'
import { staffApi } from '~/api/staff'
import { staffSalaryApi } from '~/api/staff-salary'
import SortBox from '~/common/components/Elements/SortBox'
import FilterStaffSalaryTable from '~/common/components/FilterTable/FilterStaffSalaryTable'
import StaffSalaryConfig from '~/common/components/StaffSalary/StaffSalaryConfig'
import PrimaryTable from '~/common/components/Primary/Table'
import FilterColumn from '~/common/components/FilterTable/Filter/FilterColumn'
// import { useWrap } from '~/src/context/wrap'
import { fmSelectArr } from '~/common/utils/common'
import { ShowNoti } from '~/common/utils'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { roleApi } from '~/api/user'

const StaffSalaryPage = () => {
	const [dataTable, setDataTable] = useState<IStaffSalary[]>([])

	const [dataDelete, setDataDelete] = useState({ SalaryID: null, Enable: null })
	const [roles, setRoles] = useState([])
	const [paramsRole, setParamsRole] = useState(0)
	const [dataStaff, setDataStaff] = useState([])
	// const { useAllRoles, useStaffRoles } = useWrap()
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [totalPage, setTotalPage] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [activeColumnSearch, setActiveColumnSearch] = useState('')
	const [updateSalary, setUpdateSalary] = useState({ type: '', SalaryID: null })

	let pageIndex = 1

	// SORT
	const dataOption = [
		{
			dataSort: {
				sort: 2,
				sortType: false
			},
			value: 3,
			text: 'Tên giảm dần'
		},
		{
			dataSort: {
				sort: 2,
				sortType: true
			},
			value: 4,
			text: 'Tên tăng dần '
		}
	]

	// PARAMS SEARCH
	let listField = {
		FullName: ''
	}

	// PARAMS API GETALL
	const listTodoApi = {
		pageSize: PAGE_SIZE,
		pageIndex: pageIndex,
		sort: null,
		sortType: null,
		RoleID: null,
		FullName: null,
		fromDate: null,
		toDate: null
	}

	const [todoApi, setTodoApi] = useState(listTodoApi)

	// GET DATA STAFFSALARY
	const getDataTable = () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		;(async () => {
			try {
				let res = await staffSalaryApi.getAll(todoApi)
				if (res.status == 204) {
					// showNoti('danger', 'Không có dữ liệu')
					setDataTable([])
				}
				if (res.status == 200) {
					setDataTable(res.data.data)
					setTotalPage(res.data.totalRow)
				}
			} catch (error) {
				ShowNoti('error', error.message)
			} finally {
				setIsLoading({ type: 'GET_ALL', status: false })
			}
		})()
	}

	// ADD DATA
	const _onSubmit = async (data: any) => {
		setIsLoading({ type: 'ADD_DATA', status: true })
		let res = null

		if (updateSalary.type == 'update') {
			try {
				res = await staffSalaryApi.update({ ...data, SalaryID: updateSalary.SalaryID, Enable: true })
				if (res.status === 200) {
					ShowNoti('success', res.data.message)
					getDataTable()
				}
			} catch (error) {
				ShowNoti('error', error.message)
			} finally {
				setIsLoading({ type: 'ADD_DATA', status: false })
			}
		} else {
			try {
				res = await staffSalaryApi.add(data)
				if (res?.status == 200) {
					ShowNoti('success', res.data.message)
					getDataTable()
				}
			} catch (error) {
				ShowNoti('error', error.message)
			} finally {
				setIsLoading({ type: 'ADD_DATA', status: false })
			}
		}

		return res
	}

	const afterPost = (value) => {
		ShowNoti('success', `${value} thành công`)
		setTodoApi({ ...listTodoApi, pageIndex: 1 })
		setCurrentPage(1)
	}

	// PAGINATION
	const getPagination = (pageNumber: number, pageSize: number) => {
		if (!pageSize) pageSize = 10
		pageIndex = pageNumber
		setCurrentPage(pageNumber)
		setTodoApi({ ...todoApi, pageIndex: pageIndex, pageSize: pageSize })
	}

	// ON SEARCH
	const compareField = (valueSearch, dataIndex) => {
		let newList = null
		Object.keys(listField).forEach(function (key) {
			if (key != dataIndex) {
				listField[key] = ''
			} else {
				listField[key] = valueSearch
			}
		})
		newList = listField
		return newList
	}

	const onSearch = (valueSearch, dataIndex) => {
		let clearKey = compareField(valueSearch, dataIndex)

		setTodoApi({ ...todoApi, pageIndex: 1, ...clearKey })

		setCurrentPage(pageIndex)
	}

	// DELETE
	const handleDelele = async () => {
		if (dataDelete) {
			setIsModalVisible(false)
			let res = null
			try {
				res = await staffSalaryApi.update(dataDelete)
				res.status === 200 && ShowNoti('success', 'Xóa thành công')
				if (dataTable.length === 1) {
					listTodoApi.pageIndex === 1
						? setTodoApi({ ...listTodoApi, pageIndex: 1 })
						: setTodoApi({ ...listTodoApi, pageIndex: listTodoApi.pageIndex - 1 })
					return
				}
				getDataTable()
			} catch (error) {
				ShowNoti('error', error.message)
			} finally {
				setIsLoading({ type: 'DELETE_DATA', status: false })
			}
		}
	}

	// HANDLE RESET
	const handleReset = () => {
		setActiveColumnSearch('')
		setTodoApi({ ...listTodoApi, pageIndex: 1 })
		setCurrentPage(1)
	}

	// HANDLE SORT
	const handleSort = async (option) => {
		let newTodoApi = { ...listTodoApi, sort: option.title.sort, sortType: option.title.sortType }
		setCurrentPage(1)
		setTodoApi(newTodoApi)
	}

	// HANDLE FILTER
	const _onFilterTable = (data) => {
		let newTodoApi =
			data.RoleID === 0
				? {
						...listTodoApi,
						pageIndex: 1,
						fromDate: data.fromDate,
						toDate: data.toDate
				  }
				: {
						...listTodoApi,
						pageIndex: 1,
						RoleID: data.RoleID,
						fromDate: data.fromDate,
						toDate: data.toDate
				  }
		setCurrentPage(1)
		setTodoApi(newTodoApi)
	}

	// COLUMNS TABLE
	const columns = [
		{
			title: 'Họ và tên',
			dataIndex: 'FullName',
			...FilterColumn('FullName', onSearch, handleReset, 'text'),
			className: activeColumnSearch === 'ID' ? 'active-column-search' : '',
			render: (text) => {
				return <p className="font-weight-black">{text}</p>
			}
		},
		{
			title: 'Email',
			dataIndex: 'Email'
		},
		{
			title: 'Role',
			dataIndex: 'RoleName'
		},
		{
			title: 'Mức lương',
			dataIndex: 'Salary',
			render: (salary) => {
				return <p className="font-weight-primary">{Intl.NumberFormat('ja-JP').format(salary)}</p>
			}
		},
		{
			title: 'Loại',
			dataIndex: 'StyleName'
		},
		{ title: 'Thêm bởi', dataIndex: 'CreatedBy' },
		{
			title: 'Thêm lúc',
			dataIndex: 'CreatedOn',
			render: (date) => moment(date).format('DD/MM/YYYY')
		},
		{
			render: (record) => (
				<>
					<StaffSalaryConfig
						showIcon={true}
						rowData={record}
						isLoading={isLoading}
						roles={roles}
						dataStaff={dataStaff}
						_onSubmitStaff={(data: any) => _onSubmit(data)}
						setUpdateSalary={setUpdateSalary}
					/>
					<Tooltip title="Xóa">
						<button
							className="btn btn-icon delete"
							onClick={() => {
								setIsModalVisible(true)
								setDataDelete({
									SalaryID: record.SalaryID,
									Enable: false
								})
							}}
						>
							<Trash />
						</button>
					</Tooltip>
				</>
			)
		}
	]

	const getRolesByType = async (roleType) => {
		try {
			let res = await roleApi.getRole(roleType)
			// res.status == 200 && roleType == 0 ? setRoles(res.data.data) : setStaffRoles(res.data.data)
			if (res.status === 200) {
				return res.data.data
			}
		} catch (error) {
			console.log('Lỗi lấy thông tin roles: ', error)
			ShowNoti('error', error.message)
		}
	}

	const getRoles = async (roleType) => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			// let res = await (roleType == 1 ? useAllRoles : useStaffRoles)
			let res = await (roleType == 1 ? getRolesByType(roleType) : getRolesByType(0))
			if (!!res) {
				let temp = fmSelectArr(res, 'Name', 'Id')
				setRoles([{ title: 'Tất cả', value: 0 }, ...temp])
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	const getDataStaff = () => {
		;(async () => {
			let res = null
			try {
				if (paramsRole === 0) {
					res = await staffApi.getAll({ selectAll: true })
					if (res.status == 200) {
						let temp = fmSelectArr(res.data.data, 'FullNameUnicode', 'UserInformationID')
						setDataStaff(temp)
					}
					if (res.status == 204) {
						setDataStaff([])
					}
				} else {
					res = await staffApi.getAll({ pageIndex: 1, pageSize: 99999, RoleID: paramsRole })
					if (res.status == 200) {
						let temp = fmSelectArr(res.data.data, 'FullNameUnicode', 'UserInformationID')
						setDataStaff(temp)
					}
					if (res.status == 204) {
						setDataStaff([])
					}
				}
			} catch (error) {
				ShowNoti('error', error.message)
			} finally {
			}
		})()
	}

	useEffect(() => {
		getDataTable()
		getRoles(1)
	}, [todoApi])

	// useEffect(() => {
	// 	getRoles(1)
	// }, [useAllRoles])

	useEffect(() => {
		getDataStaff()
	}, [paramsRole])
	return (
		<Fragment>
			<Modal
				title={'Xóa cấu hình lương nhân viên'}
				visible={isModalVisible}
				// onOk={() => handleDelele()}
				onCancel={() => setIsModalVisible(false)}
				footer={
					<>
						<button onClick={() => setIsModalVisible(false)} className="btn btn-outline mr-2">
							Hủy
						</button>
						<button onClick={() => handleDelele()} className="btn btn-danger">
							Xóa
						</button>
					</>
				}
			>
				<span className="text-base mb-4">Bạn có chắc chắn muốn xóa không ?</span>
			</Modal>
			<PrimaryTable
				// loading={isLoading}
				// currentPage={currentPage}
				// totalPage={totalPage && totalPage}
				// getPagination={getPagination}
				// addClass="basic-header"
				// TitlePage="Cấu hình lương"
				TitleCard={
					<div className="extra-table">
						<FilterStaffSalaryTable _onFilter={(value: any) => _onFilterTable(value)} _onHandleReset={handleReset} roles={roles} />
						<SortBox handleSort={(value) => handleSort(value)} dataOption={dataOption} />
					</div>
				}
				data={dataTable}
				columns={columns}
				Extra={
					<StaffSalaryConfig
						showAdd={true}
						roles={roles}
						dataStaff={dataStaff}
						isLoading={isLoading}
						_onSubmitStaff={(data: any) => _onSubmit(data)}
						setUpdateSalary={setUpdateSalary}
						setParamsRole={setParamsRole}
					/>
				}
			/>
		</Fragment>
	)
}

export default StaffSalaryPage
