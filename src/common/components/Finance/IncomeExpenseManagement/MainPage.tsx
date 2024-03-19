import moment from 'moment'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { GiPayMoney, GiReceiveMoney, GiTakeMyMoney } from 'react-icons/gi'
import { branchApi } from '~/api/manage/branch'
import { paymentMethodsApi } from '~/api/business/payment-method'
import { paymentSessionApi } from '~/api/business/payment-session'
import { userInformationApi } from '~/api/user/user'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { _format } from '~/common/utils/format'
import FilterBaseVer2 from '../../Elements/FilterBaseVer2'
import IconButton from '../../Primary/IconButton'
import PrimaryTable from '../../Primary/Table'
import PrimaryTag from '../../Primary/Tag'
import IncomeExpenseManagementModalCRUD from './ModalCRUD'
import DeleteManagement from './DeleteManagement'
import DateFilter from '~/common/primary-components/DateFilter'
import { Select } from 'antd'
import TagByChao from '~/common/primary-components/Tag'
import { TiWarning } from 'react-icons/ti'
import { IconBcRevenue, IconBcWallet } from '~/common/primary-components/Icon'
import SuperFilter from '~/common/primary-components/SuperFilter'
import CashFlowFilter from './Filter'

export interface IIncomeExpenseManagementPageProps {}

const initialParams = {
	pageIndex: 1,
	pageSize: PAGE_SIZE,
	Type: null,
	search: '',
	fromDate: null,
	toDate: null
}

const initialParamsStudent = {
	pageIndex: 1,
	pageSize: PAGE_SIZE,
	FullName: '',
	RoleIds: 3,
	fromDate: null,
	toDate: null,
	Type: null
}

const initialFilter = [
	{
		name: 'Type',
		title: 'Loại phiếu',
		type: 'select',
		col: 'col-span-2',
		optionList: [
			{ title: 'Tất cả', value: null },
			{ title: 'Thu', value: 1 },
			{ title: 'Chi', value: 2 }
		]
	}
]

export default function IncomeExpenseManagementPage(props: IIncomeExpenseManagementPageProps) {
	const router = useRouter()

	const [dataSource, setDataSource] = useState<IPaymentSession[]>()
	const [dataStatistical, setDataStatistical] = useState({ income: 0, expense: 0, revenue: 0 })
	const [totalPage, setTotalPage] = useState(0)
	const [optionList, setOptionList] = useState({ branch: [], payment_method: [] })
	const [todoStudentOption, setTodoStudentOption] = useState(initialParamsStudent)
	const [optionStudent, setStudentOption] = useState<{ title: string; value: any }[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [filterList, setFilterList] = useState([])
	const [todoApi, setTodoApi] = useState(initialParams)

	const getDataPayment = async () => {
		setIsLoading(true)
		try {
			let res = await paymentSessionApi.getAll(todoApi)
			if (res.status == 200) {
				// @ts-ignore
				setDataStatistical({ income: res.data.totalIncome, expense: res.data.totalExpense, revenue: res.data.totalRevenue })
				setDataSource(res.data.data)
				setTotalPage(res.data.totalRow)
			}
			if (res.status == 204) {
				setDataStatistical({ income: 0, expense: 0, revenue: 0 })
				setDataSource([])
				setTotalPage(0)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		getDataPayment()
	}, [todoApi])

	const columns = [
		{
			width: 270,
			title: 'Trung tâm',
			dataIndex: 'BranchName',
			render: (text, item) => {
				return (
					<>
						<div className="text-[#000] font-[600] in-1-line">{text}</div>

						<div className="mt-[4px]">
							Người tạo: <div className="text-[#D21320] font-[500] inline">{item?.CreatedBy}</div>
						</div>

						<div>
							Thời gian: <div className="text-[#D21320] font-[500] inline">{moment(item.CreatedOn).format('HH:mm DD/MM/YYYY')}</div>
						</div>
					</>
				)
			}
		},
		{
			title: 'Học viên',
			width: 220,
			dataIndex: 'FullName',
			render: (text, item) => {
				return (
					<>
						<p className="text-[#000] font-[600] in-1-line">{text}</p>
						<div>
							Mã HV: <div className="text-[#D21320] font-[500] inline">{item?.UserCode}</div>
						</div>
					</>
				)
			}
		},
		{
			title: 'Giá trị',
			width: 250,
			dataIndex: 'Value',
			render: (text, item) => {
				return (
					<>
						<div className={`font-[600] ${item?.Type == 1 ? 'text-tw-green' : 'text-tw-red'}`}>
							{item?.Type == 1 ? '+' : '-'}
							{_format.numberToPrice(text)} VND
						</div>

						<div>
							Phương thức:{' '}
							<div className={`${item?.PaymentMethodName ? 'text-[#D21320]' : 'text-[red]'} font-[500] inline`}>
								{item?.PaymentMethodName || 'Không rõ'}
							</div>
						</div>
					</>
				)
			}
		},
		{
			title: 'Loại',
			width: 100,
			dataIndex: 'TypeName',
			render: (text, item) => {
				if (item.Type == 1) {
					return <TagByChao background="green">{text}</TagByChao>
				}

				if (item.Type == 2) {
					return <TagByChao background="red">{text}</TagByChao>
				}

				return <TagByChao>{text}</TagByChao>
			}
		},
		{
			title: 'Lý do',
			width: 200,
			dataIndex: 'Reason',
			render: (text) => {
				return <p className="">{text}</p>
			}
		},
		{
			title: 'Ghi chú',
			width: 200,
			dataIndex: 'Note',
			render: (text) => {
				return <p className="">{text}</p>
			}
		},
		{
			title: '',
			width: 8 - 0,
			fixed: 'right',
			dataIndex: 'Actions',
			render: (text, item) => {
				return (
					<div className="flex gap-x-4 justify-start items-center">
						<IconButton
							type="button"
							icon="print"
							color="blue"
							onClick={() => {
								router.push({
									pathname: '/finance/cash-flow/print',
									query: { payment: item.Id }
								})
							}}
							placementTooltip="left"
							className=""
							tooltip="In phiếu"
						/>
						<IncomeExpenseManagementModalCRUD
							handleLoadOnScrollForOptionList={handleLoadOnScrollForOptionList}
							handleSearchForOptionList={handleSearchForOptionList}
							optionStudent={optionStudent}
							dataOption={optionList}
							mode="delete"
							dataRow={item}
							onSubmit={onSubmit}
						/>
						<DeleteManagement defaultData={item} onRefresh={getDataPayment} />
					</div>
				)
			}
		}
	]

	const getOptionStudent = async () => {
		try {
			let res = await userInformationApi.getAll(todoStudentOption)
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

	const getInfoOptions = async () => {
		try {
			const [branchResponse, paymentMethodResponse] = await Promise.all([
				branchApi.getAll({ pageIndex: 1, pageSize: 99999 }),
				paymentMethodsApi.getAll({ pageIndex: 1, pageSize: 99999 })
			])

			let tempOption = { branch: [], student: [], payment_method: [] }
			let tempFilter = []

			if (branchResponse.status == 200) {
				let temp = []
				branchResponse.data.data.forEach((data) => temp.push({ title: data.Name, value: data.Id }))
				tempOption.branch = temp

				tempFilter.push({
					name: 'BranchIds',
					title: 'Trung tâm',
					type: 'select',
					col: 'col-span-2',
					optionList: temp
				})
			}

			if (paymentMethodResponse.status == 200) {
				let temp = []
				paymentMethodResponse.data.data.forEach((data) => temp.push({ title: data.Name, value: data.Id }))
				tempOption.payment_method = temp
			}

			setOptionList(tempOption)
			setFilterList([...initialFilter, ...tempFilter])
		} catch (err) {}
	}

	useEffect(() => {
		getInfoOptions()
	}, [])

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

	const handleFilter = (data) => {
		setTodoApi({
			...todoApi,
			...data,
			FromDate: data?.Created?.[0] ? Math.round(new Date(data?.Created?.[0]).setHours(0, 0, 0) / 1000) : null,
			ToDate: data?.Created?.[1] ? Math.round(new Date(data?.Created?.[1]).setHours(23, 59, 59, 999) / 1000) : null
		})
	}

	const onSubmit = async (data) => {
		setIsLoading(true)
		try {
			let res = data.Mode == 'add' ? await paymentSessionApi.add(data) : await paymentSessionApi.delete(data.Id)
			if (res.status == 200) {
				getDataPayment()
				ShowNoti('success', res.data.message)
				return res.status
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	const [filterVisible, setFilterVisible] = useState<boolean>(false)

	return (
		<>
			<div className="grid grid-cols-1 w650:grid-cols-3 gap-[8px] mb-[8px]">
				<div className="col-span-1 bg-[#fff] flex border-[1px] border-[#eaedf3] rounded-[8px] gap-[8px] p-[8px]">
					<div className="w-[40px] h-[40px] w700:w-[50px] w700:h-[50px] rounded-[8px] flex items-center justify-center bg-[#E3F2FD]">
						<div className="scale-75 w700:scale-100">
							<IconBcWallet size={26} color="#1E88E5" />
						</div>
					</div>

					<div className="flex-1">
						<div className="font-[600] text-[12px] w700:text-[14px] text-[#000]">Tổng thu</div>
						<div className="font-bold text-[16px] w700:text-[20px] text-[#1E88E5] mt-[-2px]">
							{_format.numberToPrice(dataStatistical.income || 0)}₫
						</div>
					</div>
				</div>

				<div className="col-span-1 bg-[#fff] flex border-[1px] border-[#eaedf3] rounded-[8px] gap-[8px] p-[8px]">
					<div className="w-[40px] h-[40px] w700:w-[50px] w700:h-[50px] rounded-[8px] flex items-center justify-center bg-[#E0F2F1]">
						<div className="scale-75 w700:scale-100">
							<IconBcRevenue color="#009688" size={32} />
						</div>
					</div>

					<div className="flex-1">
						<div className="font-[600] text-[12px] w700:text-[14px] text-[#000]">Lợi nhuận</div>
						<div className="font-bold text-[16px] w700:text-[20px] text-[#009688] mt-[-2px]">
							{_format.numberToPrice(dataStatistical.revenue || 0)}₫
						</div>
					</div>
				</div>

				<div className="col-span-1 bg-[#fff] flex border-[1px] border-[#eaedf3] rounded-[8px] gap-[8px] p-[8px]">
					<div className="w-[40px] h-[40px] w700:w-[50px] w700:h-[50px] rounded-[8px] flex items-center justify-center bg-[#FBE9E7]">
						<div className="scale-75 w700:scale-100">
							<TiWarning color="#E53935" size={32} />
						</div>
					</div>

					<div className="flex-1">
						<div className="font-[600] text-[12px] w700:text-[14px] text-[#000]">Tổng chi</div>
						<div className="font-bold text-[16px] w700:text-[20px] text-[#E53935] mt-[-2px]">
							{_format.numberToPrice(dataStatistical.expense || 0)}₫
						</div>
					</div>
				</div>
			</div>

			<SuperFilter visible={filterVisible} style={{ marginBottom: 8 }}>
				<CashFlowFilter key="filter-v3" filters={todoApi} setFilter={setTodoApi} />
			</SuperFilter>

			<PrimaryTable
				columns={columns}
				data={dataSource}
				total={totalPage}
				onChangePage={(event: number) => setTodoApi({ ...todoApi, pageIndex: event })}
				loading={isLoading}
				TitleCard={
					<div className="flex items-start gap-[16px] w-full">
						<div className="flex flex-1 gap-[8px]">
							<DateFilter
								useISOString
								showYesterday={false}
								onSubmit={(e) => setTodoApi({ ...todoApi, fromDate: e?.start, toDate: e?.end })}
							/>
							<SuperFilter isButton visible={filterVisible} onClickButton={() => setFilterVisible(!filterVisible)} />{' '}
						</div>

						<IncomeExpenseManagementModalCRUD
							mode="add"
							handleSearchForOptionList={handleSearchForOptionList}
							handleLoadOnScrollForOptionList={handleLoadOnScrollForOptionList}
							onSubmit={onSubmit}
							optionStudent={optionStudent}
							dataOption={optionList}
						/>
					</div>
				}
			/>
		</>
	)
}
