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
	toDate: null
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
							Người tạo: <div className="text-[#1b73e8] font-[500] inline">{item?.CreatedBy}</div>
						</div>

						<div>
							Thời gian: <div className="text-[#1b73e8] font-[500] inline">{moment(item.CreatedOn).format('HH:mm DD/MM/YYYY')}</div>
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
							Mã HV: <div className="text-[#1b73e8] font-[500] inline">{item?.UserCode}</div>
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
							<div className={`${item?.PaymentMethodName ? 'text-[#1b73e8]' : 'text-[red]'} font-[500] inline`}>
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
									pathname: '/finance/income-expense-management/print-payment-session',
									query: { paymentID: item.Id, Name: item.TypeName }
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

	const renderStatistical = () => {
		return (
			<div className="statistical-contain">
				<div className="item total-revenue">
					<div className="text">
						<p className="name">Tổng thu</p>
						<p className="number">{_format.numberToPrice(dataStatistical.income)}₫</p>
					</div>
					<div className="icon">
						<GiReceiveMoney />
					</div>
				</div>
				<div className="item total-income">
					<div className="text">
						<p className="name">Tổng chi</p>
						<p className="number">{_format.numberToPrice(dataStatistical.expense)}₫</p>
					</div>
					<div className="icon">
						<GiPayMoney />
					</div>
				</div>
				<div className="item total-expense">
					<div className="text">
						<p className="name">Lợi nhuận</p>
						<p className="number">{_format.numberToPrice(dataStatistical.revenue)}₫</p>
					</div>
					<div className="icon">
						<GiTakeMyMoney />
					</div>
				</div>
			</div>
		)
	}

	return (
		<>
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

							<FilterBaseVer2 handleFilter={handleFilter} dataFilter={filterList} handleReset={() => setTodoApi({ ...initialParams })} />
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
			>
				{dataSource && renderStatistical()}
			</PrimaryTable>
		</>
	)
}
