import React, { useEffect, useMemo, useState } from 'react'
import { customerAdviseApi } from '~/api/user/customer'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNostis, ShowNoti, log } from '~/common/utils'
import FilterTable from '~/common/utils/table-filter'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import CustomerAdviseForm from '~/common/components/Customer/CustomerAdviseForm'
import CustomerAdvisoryMail from '~/common/components/Customer/CustomerAdvisory/CustomerAdvisoryMail'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { useDispatch } from 'react-redux'
import { branchApi } from '~/api/manage/branch'
import { setBranch } from '~/store/branchReducer'
import { areaApi } from '~/api/area/area'
import { setArea } from '~/store/areaReducer'
import { sourceApi } from '~/api/configs/source'
import { is, parseSelectArray } from '~/common/utils/common'
import { learningNeedApi } from '~/api/configs/learning-needs'
import { purposeApi } from '~/api/configs/purpose'
import DeleteTableRow from '~/common/components/Elements/DeleteTableRow'
import { customerStatusApi } from '~/api/configs/customer-status'
import { setSource } from '~/store/sourceReducer'
import { setSaler } from '~/store/salerReducer'
import { setLearningNeed } from '~/store/learningNeedReducer'
import { setPurpose } from '~/store/purposeReducer'
import { setCustomerStatus } from '~/store/customerStatusReducer'
import moment from 'moment'
import { LeadNote } from '~/common/components'
import { userInformationApi } from '~/api/user/user'
import CustomerHeader from './CustomerHeader'
import CustomerStatus from './CustomerStatus'

const listTodoApi = {
	FullName: '',
	Code: '',
	customerStatusIds: null,
	branchIds: '',
	sort: 0,
	sortType: false,
	pageSize: PAGE_SIZE,
	pageIndex: 1
}

const CustomerAdvisory = () => {
	const [currentPage, setCurrentPage] = useState(1)
	const [dataCustomer, setDataCustomer] = useState<ICustomerAdvise[]>()
	const [totalRow, setTotalRow] = useState(0)
	const [isLoading, setIsLoading] = useState(false)

	const [todoApi, setTodoApi] = useState(listTodoApi)

	const userInfo = useSelector((state: RootState) => state.user.information)

	const dispatch = useDispatch()
	const state = useSelector((state: RootState) => state)

	const sale = useMemo(() => {
		if (state.saler.Saler.length > 0) {
			return parseSelectArray(state.saler.Saler, 'FullName', 'userInfoId')
		}
	}, [state.saler])

	const customerStatus = useMemo(() => {
		if (state.customerStatus.CustomerStatus.length > 0) {
			return parseSelectArray(state.customerStatus.CustomerStatus, 'Name', 'Id')
		}
	}, [state.customerStatus])

	const source = useMemo(() => {
		if (state.source.Source.length > 0) {
			return parseSelectArray(state.source.Source, 'Name', 'Id')
		}
	}, [state.source])

	const learningNeed = useMemo(() => {
		if (state.learningNeed.LearningNeed.length > 0) {
			return parseSelectArray(state.learningNeed.LearningNeed, 'Name', 'Id')
		}
	}, [state.learningNeed])

	const purpose = useMemo(() => {
		if (state.purpose.Purpose.length > 0) {
			return parseSelectArray(state.purpose.Purpose, 'Name', 'Id')
		}
	}, [state.purpose])

	const convertBranchSelect = useMemo(() => {
		if (state.branch.Branch.length > 0) {
			const data = parseSelectArray(state.branch.Branch, 'Name', 'Id')
			return data
		}
	}, [state.branch])

	const getAllBranch = async () => {
		try {
			const res = await branchApi.getAll({ pageSize: 99999 })
			if (res.status === 200) {
				dispatch(setBranch(res.data.data))
			} else {
				dispatch(setBranch([]))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getAllArea = async () => {
		try {
			const response = await areaApi.getAll({ pageSize: 99999 })
			if (response.status === 200) {
				dispatch(setArea(response.data.data))
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	const getAllCustomer = async () => {
		setIsLoading(true)
		try {
			const res = await customerAdviseApi.getAll(todoApi)
			if (res.status == 200) {
				setDataCustomer(res.data.data)
				setTotalRow(res.data.totalRow)
			} else {
				setDataCustomer([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	const getAllSource = async () => {
		try {
			const res = await sourceApi.getAll({ pageSize: 99999 })
			if (res.status === 200) {
				dispatch(setSource(res.data.data))
			}
			if (res.status === 204) {
				dispatch(setSource([]))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getAllSale = async () => {
		try {
			const res = await userInformationApi.getAll({ pageSize: 99999, roleIds: '5' })
			if (res.status === 200) {
				dispatch(setSaler(res.data.data))
			}
			if (res.status === 204) {
				dispatch(setSaler([]))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getAllLearningNeed = async () => {
		try {
			const res = await learningNeedApi.getAll({ pageSize: 99999 })
			if (res.status === 200) {
				dispatch(setLearningNeed(res.data.data))
			}
			if (res.status === 204) {
				dispatch(setLearningNeed([]))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getAllPurpose = async () => {
		try {
			const res = await purposeApi.getAll({ pageSize: 99999 })
			if (res.status === 200) {
				dispatch(setPurpose(res.data.data))
			}
			if (res.status === 204) {
				dispatch(setPurpose([]))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const [statusCount, setStatusCount] = useState([])

	const getStatusCount = async () => {
		try {
			const res = await customerStatusApi.count({ branchIds: todoApi?.branchIds })
			if (res.status == 200) {
				setStatusCount(res.data.data)
			} else {
				setStatusCount([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getLeadsStatus = async () => {
		try {
			const res = await customerStatusApi.getAll({ pageSize: 9999 })
			if (res.status == 200) {
				dispatch(setCustomerStatus(res.data.data))
			} else {
				dispatch(setCustomerStatus([]))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const handleDelete = async (id) => {
		try {
			const res = await customerAdviseApi.delete(id)
			if (res.status == 200) {
				ShowNoti('success', res.data.message)

				if (todoApi?.pageIndex == 1) {
					getAllCustomer()
				} else {
					setTodoApi(listTodoApi)
				}

				return res
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const handleFilter = (listFilter) => {
		setTodoApi({ ...listTodoApi, ...listFilter, pageIndex: 1 })
	}

	const handleSort = async (option) => {
		let newTodoApi = { ...todoApi, sort: option.sort, sortType: option.sortType }
		setCurrentPage(1), setTodoApi(newTodoApi)
	}

	const expandedRowRender = (data) => {
		return (
			<div className="w-[1000px]">
				<LeadNote setTodoApiCustomer={setTodoApi} listTodoApiCustomer={listTodoApi} customerID={data.Id} />
			</div>
		)
	}

	useEffect(() => {
		getStatusCount()

		if (state.area.Area.length == 0) {
			getAllArea()
		}

		if (state.branch.Branch.length == 0) {
			getAllBranch()
		}

		if (state.source.Source.length == 0) {
			getAllSource()
		}

		if (state.learningNeed.LearningNeed.length == 0) {
			getAllLearningNeed()
		}

		if (state.purpose.Purpose.length == 0) {
			getAllPurpose()
		}

		if (state.saler.Saler.length == 0) {
			getAllSale()
		}

		if (state.customerStatus.CustomerStatus.length == 0) {
			getLeadsStatus()
		}
	}, [])

	useEffect(() => {
		getAllCustomer()
		getStatusCount()
	}, [todoApi])

	async function putUpdateStatus(params, newList) {
		try {
			const res = await customerAdviseApi.update(params)
			if (res.status == 200) {
				ShowNostis.success('Thành công')
				setDataCustomer([...newList])
			}
		} catch (error) {
			ShowNostis.error('Cập nhật thất bại')
		} finally {
			getStatusCount()
		}
	}

	function handleUpdateStatus(item, params) {
		const thisIndex = dataCustomer.findIndex((thisItem) => thisItem.Id == item?.Id)

		if (thisIndex > -1) {
			const temp = [...dataCustomer]
			temp[thisIndex] = { ...temp[thisIndex], ...params }
			putUpdateStatus({ ...temp[thisIndex], ...params }, temp)
		}
	}

	function handleRefresh() {
		// console.log('---- handleRefresh: ', todoApi)

		if (todoApi?.pageIndex == 1) {
			getAllCustomer()
		} else {
			setTodoApi(listTodoApi)
		}
	}

	const columns = [
		{
			...FilterTable({
				type: 'search',
				dataIndex: 'FullName',
				handleSearch: (event) => setTodoApi({ ...listTodoApi, FullName: event }),
				handleReset: (event) => setTodoApi(listTodoApi)
			}),
			sorter: (befor, after, status) => {
				console.log('---- status: ', status)
			},
			width: 220,
			title: 'Thông tin',
			dataIndex: 'FullName',
			render: (a, item) => (
				<div>
					<p className="font-weight-primary">{a}</p>
					<p className="font-[500]">Mã: {item?.Code}</p>
				</div>
			)
		},
		{
			width: 250,
			title: 'Liên hệ',
			dataIndex: 'Mobile',
			render: (a, item) => (
				<div>
					<p>
						<div className="font-[500] inline-block">Điện thoại:</div> {a}
					</p>
					<p>
						<div className="font-[500] inline-block">Email:</div> {item?.Email}
					</p>
				</div>
			)
		},
		{
			width: 200,
			title: 'Trạng thái',
			dataIndex: 'CustomerStatusId',
			render: (id, item) => {
				return (
					<CustomerStatus
						onUpdate={(id, name) => {
							const temp = { CustomerStatusId: id, CustomerStatusName: name }
							handleUpdateStatus(item, temp)
						}}
						item={item}
					/>
				)
			}
		},
		{
			width: 180,
			title: 'Trung tâm',
			dataIndex: 'BranchId',
			render: (text, data) => <p className="font-semibold">{data.BranchName}</p>
		},
		{
			width: 200,
			title: 'Tư vấn viên',
			dataIndex: 'SaleId',
			render: (text, data) => <p className="font-semibold">{data.SaleName}</p>
		},
		{
			title: 'Khởi tạo',
			dataIndex: 'ModifiedOn',
			render: (date: any, item) => {
				return (
					<div>
						<div className="font-weight-primary">{item?.CreatedBy}</div>
						<div>{moment(item?.CreatedOn).format('HH:mm DD/MM/YYYY')}</div>
					</div>
				)
			}
		},
		{
			title: 'Cập nhật gần nhất',
			dataIndex: 'ModifiedOn',
			render: (date: any, item) => {
				return (
					<div>
						<div className="font-weight-primary">{item?.ModifiedBy}</div>
						<div>{moment(item?.ModifiedOn).format('HH:mm DD/MM/YYYY')}</div>
					</div>
				)
			}
		},
		{
			width: 160,
			title: 'Chức năng',
			dataIndex: '',
			fixed: 'right',
			responsive: ['md'],
			render: (text, data) => {
				return (
					<div className="d-flex align-items-center">
						{is(userInfo).admin && <DeleteTableRow text={`khách hàng ${data.FullName}`} handleDelete={() => handleDelete(data.Id)} />}

						<CustomerAdviseForm
							onRefresh={handleRefresh}
							source={source}
							learningNeed={learningNeed}
							purpose={purpose}
							sale={sale}
							branch={convertBranchSelect}
							customerStatus={customerStatus}
							rowData={data}
							listTodoApi={listTodoApi}
							setTodoApi={setTodoApi}
						/>

						<CustomerAdvisoryMail dataRow={data} listTodoApi={listTodoApi} setTodoApi={setTodoApi} />

						{/* {data.CustomerStatusId !== 2 && (
							<CustomerAdviseForm
								onRefresh={handleRefresh}
								isStudent={true}
								source={source}
								learningNeed={learningNeed}
								purpose={purpose}
								sale={sale}
								branch={convertBranchSelect}
								customerStatus={customerStatus}
								rowData={data}
								listTodoApi={listTodoApi}
								setTodoApi={setTodoApi}
							/>
						)} */}
							<CustomerAdviseForm
								onRefresh={handleRefresh}
								isStudent={true}
								source={source}
								learningNeed={learningNeed}
								purpose={purpose}
								sale={sale}
								branch={convertBranchSelect}
								customerStatus={customerStatus}
								rowData={data}
								listTodoApi={listTodoApi}
								setTodoApi={setTodoApi}
							/>
					</div>
				)
			}
		},
		{
			width: 160,
			title: 'Chức năng',
			dataIndex: '',
			responsive: ['xs'],
			render: (text, data) => {
				return (
					<div className="d-flex align-items-center">
						<DeleteTableRow text={`khách hàng ${data.FullName}`} handleDelete={() => handleDelete(data.Id)} />

						<CustomerAdviseForm
							source={source}
							learningNeed={learningNeed}
							purpose={purpose}
							sale={sale}
							branch={convertBranchSelect}
							customerStatus={customerStatus}
							rowData={data}
							listTodoApi={listTodoApi}
							setTodoApi={setTodoApi}
							onRefresh={handleRefresh}
						/>

						<CustomerAdvisoryMail dataRow={data} listTodoApi={listTodoApi} setTodoApi={setTodoApi} />

						<CustomerAdviseForm
							isStudent={true}
							isEntry={true}
							source={source}
							learningNeed={learningNeed}
							purpose={purpose}
							sale={sale}
							branch={convertBranchSelect}
							customerStatus={customerStatus}
							rowData={data}
							listTodoApi={listTodoApi}
							setTodoApi={setTodoApi}
							onRefresh={handleRefresh}
						/>
					</div>
				)
			}
		}
	]

	const formProps = {
		source: source,
		learningNeed: learningNeed,
		purpose: purpose,
		sale: sale,
		branch: convertBranchSelect,
		customerStatus: customerStatus,
		listTodoApi: listTodoApi,
		setTodoApi: setTodoApi,
		onRefresh: getAllCustomer
	}

	function calculateStatusCountSum(arr) {
		let sum = 0

		for (let i = 0; i < arr.length; i++) {
			if (arr[i].hasOwnProperty('StatusCount')) {
				sum += arr[i].StatusCount
			}
		}

		return sum
	}

	const curStatus = todoApi.customerStatusIds

	return (
		<div className="info-course-customer">
			<ExpandTable
				currentPage={todoApi.pageIndex}
				totalPage={totalRow && totalRow}
				getPagination={(page) => setTodoApi({ ...todoApi, pageIndex: page })}
				loading={isLoading}
				TitlePage="Danh sách khách hàng"
				TitleCard={<CustomerHeader onRefresh={getAllCustomer} formProps={formProps} onFilter={handleFilter} />}
				dataSource={dataCustomer}
				height={window.innerHeight - 340}
				columns={columns}
				expandable={expandedRowRender}
				onChange={(event, x, sort) => {
					const isUp = sort?.order == 'ascend'
					const isDown = sort?.order == 'descend'
					const sType = isUp ? true : isDown ? false : null

					if (sType !== todoApi.sortType) {
						handleSort({ sort: 1, sortType: sType })
					}
				}}
			>
				<div className="mb-[4px] flex flex-wrap items-start none-selection cursor-pointer">
					<div
						onClick={() => setTodoApi({ ...todoApi, customerStatusIds: null })}
						className={`leads-status-filter`}
						style={{
							background: curStatus == null ? '#fff' : '#000',
							borderColor: curStatus == null ? '#000' : '#fff',
							borderWidth: curStatus == null ? 1 : 0,
							color: curStatus == null ? '#000' : '#fff',
							height: 23
						}}
					>
						Tất cả ({calculateStatusCountSum(statusCount) || 0})
					</div>

					{statusCount.map((status, index) => {
						const activated = curStatus == status?.Id
						const thisColor = status?.ColorCode || '#c7c7c7'

						return (
							<div
								key={`slec-${index}`}
								onClick={() => setTodoApi({ ...todoApi, customerStatusIds: status?.Id })}
								className={`leads-status-filter`}
								style={{
									background: activated ? '#fff' : thisColor,
									borderColor: activated ? thisColor : '#fff',
									borderWidth: activated ? 1 : 0,
									color: activated ? thisColor : thisColor == '#FBC02D' ? '#000' : '#fff',
									height: 23
								}}
							>
								{status?.Name} ({status?.StatusCount})
							</div>
						)
					})}
				</div>
			</ExpandTable>
		</div>
	)
}

export default CustomerAdvisory
