import { Col, Input, Row, Skeleton } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { branchApi } from '~/api/manage/branch'
import { paymentMethodsApi } from '~/api/business/payment-method'
import { refundApi } from '~/api/business/refund'
import { userInformationApi } from '~/api/user/user'
import FilterBaseVer2 from '~/common/components/Elements/FilterBaseVer2'
import PrimaryTable from '~/common/components/Primary/Table'
import PrimaryTag from '~/common/components/Primary/Tag'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti, _format } from '~/common/utils'
import { RootState } from '~/store'
import ModalRefundCRUD from './ModalRefundCRUD'
import appConfigs from '~/appConfig'
import Head from 'next/head'
import { parseToMoney } from '~/common/utils/common'
import { TabCompData } from '~/common/custom/TabComp/type'
import TabComp from '~/common/custom/TabComp'

export interface IRefundPageProps {}

const initialFilter = [
	{
		name: 'Type',
		title: 'Loại phiếu',
		type: 'select',
		col: 'col-span-2',
		optionList: [
			{ title: 'Tất cả', value: null },
			{ title: 'Hoàn tiền thủ công', value: 1 },
			{ title: 'Hoàn tiền bảo lưu', value: 2 },
			{ title: 'Hoàn tiền chờ xếp lớp', value: 3 },
			{ title: 'Hoàn tiền duyệt thanh toán ', value: 4 }
		]
	},
	{
		name: 'Status',
		title: 'Trạng thái',
		type: 'select',
		col: 'col-span-2',
		optionList: [
			{ title: 'Tất cả', value: null },
			{ title: 'Chờ duyệt', value: 1 },
			{ title: 'Đã duyệt', value: 2 },
			{ title: 'Hủy', value: 3 }
		]
	},
	{
		name: 'Dates',
		title: 'Từ - đến',
		type: 'date-range',
		col: 'col-span-2'
	}
]

export default function RefundPage(props: IRefundPageProps) {
	const initialParams = {
		pageIndex: 1,
		pageSize: PAGE_SIZE,
		search: '',
		Type: null,
		BranhIds: '',
		Status: '',
		FromDate: null,
		ToDate: null
	}
	const initialParamsStudent = { pageIndex: 1, pageSize: PAGE_SIZE, FullName: '', RoleIds: 3 }
	const [dataSource, setDataSource] = useState<IRefund[]>()
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [todoApi, setTodoApi] = useState(initialParams)
	const [optionList, setOptionList] = useState({ branch: [], paymentMethod: [] })
	const [totalRow, setTotalRow] = useState(0)
	const userInformation = useSelector((state: RootState) => state.user.information)
	const [todoStudentOption, setTodoStudentOption] = useState(initialParamsStudent)
	const [optionStudent, setStudentOption] = useState<{ title: string; value: any }[]>([])
	const [filterList, setFilterList] = useState([])
	const [totalMoney, setTotalMoney] = useState()
	const [resfundStatus, setResfundStatus] = useState<TabCompData[]>()
	const [statusSelected, setStatusSelected] = useState<number>(0)

	const theInformation = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return theInformation?.RoleId == 1
	}

	function isTeacher() {
		return theInformation?.RoleId == 2
	}

	function isManager() {
		return theInformation?.RoleId == 4
	}

	function isStdent() {
		return theInformation?.RoleId == 3
	}

	function isSaler() {
		return theInformation?.RoleId == 5
	}

	function isAccountant() {
		return theInformation?.RoleId == 6
	}

	function isAcademic() {
		return theInformation?.RoleId == 7
	}

	const getListRefund = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await refundApi.getAll(todoApi)
			if (res.status == 200) {
				const { totalPrice, AllState, Opened, Approved, Canceled }: any = res.data
				setDataSource(res.data.data)
				setTotalMoney(totalPrice)
				setTotalRow(res.data.totalRow)
				setResfundStatus([
					{
						id: 0,
						title: 'Tất cả',
						value: AllState
					},
					{
						id: 1,
						title: 'Chờ duyệt',
						value: Opened
					},
					{
						id: 2,
						title: 'Đã duyệt',
						value: Approved
					},
					{
						id: 3,
						title: 'Không duyệt',
						value: Canceled
					}
				])
			}
			if (res.status == 204) {
				setDataSource([])
				setTotalRow(0)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
		}
	}

	useEffect(() => {
		getListRefund()
	}, [todoApi])

	const _onSubmit = async (data) => {
		setIsLoading({ type: 'SUBMIT', status: true })
		try {
			let res
			if (data.mode == 'add') {
				res = await refundApi.add(data)
			}
			if (data.mode == 'edit') {
				res = await refundApi.update(data)
			}
			if (data.mode == 'delete') {
				res = await refundApi.delete(data.Id)
			}

			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				getListRefund()
				return res
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
		}
	}

	const getOptionList = async () => {
		try {
			const [branchResponse, paymentMethod] = await Promise.all([
				branchApi.getAll({ pageIndex: 1, pageSize: 99999 }),
				paymentMethodsApi.getAll({ pageIndex: 1, pageSize: 99999 })
			])

			let tempOption = { branch: [], paymentMethod: [] }
			let tempFilter = []

			if (branchResponse.status == 200) {
				let temp = []
				branchResponse.data.data.forEach((data) => temp.push({ title: data.Name, value: data.Id }))
				tempOption.branch = temp

				tempFilter.push({
					name: 'BranhIds',
					title: 'Trung tâm',
					mode: 'multiple',
					type: 'select',
					col: 'col-span-2',
					optionList: temp
				})
			}
			if (paymentMethod.status == 200) {
				let temp = []
				paymentMethod.data.data.forEach((data) => temp.push({ title: data.Name, value: data.Id }))
				tempOption.paymentMethod = temp
			}

			setFilterList([...initialFilter, ...tempFilter])
			setOptionList(tempOption)
		} catch (error) {}
	}

	useEffect(() => {
		getOptionList()
	}, [])

	const getOptionStudent = async () => {
		try {
			let res = await userInformationApi.getByRole(3)
			if (res.status == 200) {
				let temp = []
				res.data.data.forEach((item) => temp.push({ title: `${item.FullName}-${item.UserCode}`, value: item.UserInformationId }))
				setStudentOption(temp)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
		}
	}

	useEffect(() => {
		getOptionStudent()
	}, [todoStudentOption])

	const handleSearchForOptionList = (data, name) => {
		if (name == 'student') {
			if (!!data) {
				setTodoStudentOption({ ...todoStudentOption, FullName: data })
			} else {
				setTodoStudentOption(initialParamsStudent)
			}
		}
	}

	const handleLoadOnScrollForOptionList = (name) => {
		if (name == 'student') {
			setTodoStudentOption({ ...todoStudentOption, pageSize: (todoStudentOption.pageSize += 10) })
		}
	}

	const columns =
		isAdmin() || isAccountant()
			? [
					{
						title: 'Tên học viên',
						width: 200,
						dataIndex: 'FullName',
						render: (text, item) => (
							<>
								<p className="table-row-main-text">{text}</p>
								<p className="table-row-sub-text">{item.BranchName}</p>
								<p className="table-row-sub-text">Ngày tạo: {moment(item.CreatedOn).format('DD/MM/YYYY')}</p>
							</>
						)
					},
					{
						title: 'Số tiền yêu cầu',
						width: 200,
						dataIndex: 'Price',
						render: (text, item) => <p className="font-[600] text-[#D32F2F]">{_format.numberToPrice(text)} VND</p>
					},
					{
						title: 'Loại yêu cầu',
						width: 150,
						dataIndex: 'TypeName',
						render: (text, item) => (
							<>
								<p className="font-[600] text-[#E53935]">
									{item.Type == 1 && <span className="tag blue">{text}</span>}
									{item.Type == 2 && <span className="tag green">{text}</span>}
									{item.Type == 3 && <span className="tag yellow">{text}</span>}
									{item.Type == 4 && <span className="tag gray">{text}</span>}
								</p>
							</>
						)
					},
					{
						title: 'Ghi chú',
						width: 200,
						dataIndex: 'Note',
						render: (text, item) => (
							<>
								<p className="table-row-main-text">{text}</p>
							</>
						)
					},
					{
						title: 'Trạng thái',
						width: 200,
						dataIndex: 'StatusName',
						render: (text, item) => (
							<>
								<PrimaryTag children={text} color={`${item.Status == 1 ? 'disabled' : item?.Status == 2 ? 'green' : 'red'}`} />
							</>
						)
					},
					{
						title: '',
						width: 100,
						dataIndex: 'Action',
						render: (text, item) => (
							<>
								<ModalRefundCRUD
									mode="edit"
									dataRow={item}
									isLoading={isLoading.type == 'SUBMIT' && isLoading.status}
									onSubmit={_onSubmit}
									optionStudent={optionStudent}
									dataOption={optionList}
									handleSearchForOptionList={handleSearchForOptionList}
									handleLoadOnScrollForOptionList={handleLoadOnScrollForOptionList}
								/>
								<ModalRefundCRUD
									mode="delete"
									dataRow={item}
									isLoading={isLoading.type == 'SUBMIT' && isLoading.status}
									onSubmit={_onSubmit}
									optionStudent={optionStudent}
									dataOption={optionList}
									handleSearchForOptionList={handleSearchForOptionList}
									handleLoadOnScrollForOptionList={handleLoadOnScrollForOptionList}
								/>
							</>
						)
					}
			  ]
			: [
					{
						title: 'Tên học viên',
						width: 200,
						dataIndex: 'FullName',
						render: (text, item) => (
							<>
								<p className="table-row-main-text">{text}</p>
								<p className="table-row-sub-text">{item.BranchName}</p>
								<p className="table-row-sub-text">Ngày tạo: {moment(item.CreatedOn).format('DD/MM/YYYY')}</p>
							</>
						)
					},
					{
						title: 'Số tiền yêu cầu',
						width: 200,
						dataIndex: 'Price',
						render: (text, item) => <div className="font-[600] text-[#D32F2F]">{_format.numberToPrice(text)} VND</div>
					},
					{
						title: 'Loại yêu cầu',
						width: 200,
						dataIndex: 'TypeName',
						render: (text, item) => (
							<>
								<p className="font-[600] text-[#E53935]">
									{item.Type == 1 && <span className="tag blue">{text}</span>}
									{item.Type == 2 && <span className="tag green">{text}</span>}
									{item.Type == 3 && <span className="tag yellow">{text}</span>}
									{item.Type == 4 && <span className="tag gray">{text}</span>}
								</p>
							</>
						)
					},
					{
						title: 'Ghi chú',
						width: 200,
						dataIndex: 'Note',
						render: (text, item) => (
							<>
								<p className="table-row-main-text">{text}</p>
							</>
						)
					},
					{
						title: 'Trạng thái',
						width: 200,
						dataIndex: 'StatusName',
						render: (text, item) => (
							<>
								{item.Status == 1 && <PrimaryTag children={<>{item.StatusName}</>} color="disabled" />}
								{item.Status == 2 && <PrimaryTag children={<>{item.StatusName}</>} color="green" />}
								{item.Status == 3 && <PrimaryTag children={<>{item.StatusName}</>} color="red" />}
							</>
						)
					}
			  ]

	const handleFilter = (data) => {
		setTodoApi({
			...todoApi,
			Type: data?.Type,
			BranhIds: data.BranhIds ? data.BranhIds.toString() : '',
			Status: data.Status ? data.Status : '',
			FromDate: data?.Dates && data?.Dates?.length > 0 ? moment(data?.Dates[0].toDate()).format('YYYY/MM/DD') : null,
			ToDate: data?.Dates && data?.Dates?.length > 0 ? moment(data?.Dates[1].toDate()).format('YYYY/MM/DD') : null
		})
	}

	const handleSelecStatus = (_value: number) => {
		if (statusSelected !== _value) {
			setStatusSelected(_value)
			if (_value !== 0) {
				setTodoApi({ ...todoApi, Status: `${_value}` })
			} else {
				setTodoApi({ ...todoApi, Status: '' })
			}
		}
	}

	return (
		<>
			<Head>
				<title>{appConfigs.appName} | Danh sách hoàn tiền</title>
			</Head>
			<PrimaryTable
				loading={isLoading.type == 'GET_ALL' && isLoading.status}
				total={totalRow}
				onChangePage={(event: number) => setTodoApi({ ...initialParams, pageIndex: event })}
				TitleCard={
					<div className="flex justify-start items-center">
						<FilterBaseVer2 handleFilter={handleFilter} dataFilter={filterList} handleReset={() => setTodoApi({ ...initialParams })} />

						<TabComp data={resfundStatus} selected={statusSelected} handleSelected={handleSelecStatus} />
					</div>
				}
				data={dataSource}
				columns={columns}
				Extra={
					<>
						<div className="custom-footer-table">Tổng: {_format.numberToPrice(totalMoney || 0)} VND</div>

						{(isAdmin() || isManager() || isAccountant() || isSaler() || isTeacher()) && (
							<ModalRefundCRUD
								dataOption={optionList}
								mode="add"
								isLoading={isLoading.type == 'SUBMIT' && isLoading.status}
								onSubmit={_onSubmit}
								optionStudent={optionStudent}
								handleSearchForOptionList={handleSearchForOptionList}
								handleLoadOnScrollForOptionList={handleLoadOnScrollForOptionList}
							/>
						)}
					</>
				}
			/>
		</>
	)
}
