import React, { useEffect, useState } from 'react'
import RestApi from '~/api/RestApi'
import { MainLayout } from '~/common/index'
import PayForm from '~/common/components/Finance/Payment/pay'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNostis, _format } from '~/common/utils'
import { decode, is, parseToMoney } from '~/common/utils/common'
import BillDetails from '../../../common/components/Finance/BillDetails'
import moment from 'moment'
import Head from 'next/head'
import appConfigs from '~/appConfig'
import RefundForm from './Refund'
import PaymentForm from '~/common/components/Finance/Payment/Create'
import PaymentDetail from './PaymentDetail'
import { TabCompData } from '~/common/custom/TabComp/type'
import Filters from './Filters'
import { Select } from 'antd'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import PrimaryButton from '~/common/components/Primary/Button'
import DeletePayment from '~/common/components/Finance/Payment/DeletePayment'
import DateFilter from '~/common/primary-components/DateFilter'
import SuperFilter from '~/common/primary-components/SuperFilter'
import { branchApi } from '~/api/manage/branch'
import { userInformationApi } from '~/api/user/user'
import PaymentFilter from './Filters'
import { GiPayMoney, GiReceiveMoney, GiTakeMyMoney } from 'react-icons/gi'
import { TiWarning } from 'react-icons/ti'
import { IconBcRevenue, IconBcWallet } from '~/common/primary-components/Icon'
import TagByChao from '~/common/primary-components/Tag'

const initParamters = {
	pageSize: PAGE_SIZE,
	branchIds: null,
	pageIndex: 1,
	search: '',
	fromDate: null,
	toDate: null,
	type: 0,
	studentIds: null,
	status: null
}

const typeAllowDeleteIds = [1, 4, 5]

const PaymentManagementPage = () => {
	const [loading, setLoading] = React.useState(true)
	const [totalPage, setTotalPage] = React.useState(1)
	const [data, setData] = React.useState([])
	const [sumPrice, setSumPrice] = React.useState(null)
	const [filters, setFilter] = React.useState(initParamters)
	const [billStatus, setBillStatus] = useState<TabCompData[]>([])
	const [statusSelected, setStatusSelected] = useState<number>(0)

	const user = useSelector((state: RootState) => state.user.information)

	const router = useRouter()

	useEffect(() => {
		if (router?.asPath.includes('bill=')) {
			if (router?.query?.bill) {
				getData(parseInt(decode(router?.query?.bill) + ''))
			}
		} else {
			getData()
		}
	}, [filters, router])

	async function getData(bill?: number) {
		setLoading(true)

		try {
			const res = await RestApi.get('Bill', { ...filters, id: bill || null })

			if (res.status == 200) {
				setData(res.data.data)
				setTotalPage(res.data.totalRow)
				setSumPrice(res.data)

				setBillStatus([
					{
						id: 0,
						title: 'Tất cả' + ` (${res?.data?.typeAll})`,
						value: res?.data?.typeAll
					},
					{
						id: 1,
						title: 'Đăng ký học' + ` (${res?.data?.typeRegis})`,
						value: res?.data?.typeRegis
					},
					{
						id: 2,
						title: 'Mua dịch vụ' + ` (${res?.data?.typeService})`,
						value: res?.data?.typeService
					},
					// {
					// 	id: 3,
					// 	title: 'Đăng ký lớp dạy kèm' + ` (${res?.data?.typeTutorial})`,
					// 	value: res?.data?.typeTutorial
					// },
					{
						id: 4,
						title: 'Tạo thủ công' + ` (${res?.data?.typeManual})`,
						value: res?.data?.typeManual
					},
					{
						id: 5,
						title: 'Học phí hàng tháng' + ` (${res?.data?.typeMonthly})`,
						value: res?.data?.typeMonthly
					},
					{
						id: 6,
						title: 'Phí chuyển lớp' + ` (${res?.data?.typeClassChange})`,
						value: res?.data?.typeClassChange
					}
				])
			} else {
				setData([])
				setTotalPage(1)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	const expandedRowRender = (item) => {
		return <BillDetails bill={item} />
	}

	const columns = [
		{
			title: '',
			dataIndex: 'Type',
			render: (value, item) => {
				if (value == 1) {
					return (
						<>
							<div className="font-[600] mb-[4px]">Mã: {item?.Code}</div>
							<TagByChao background="blue">{item?.TypeName}</TagByChao>
						</>
					)
				}

				if (value == 2) {
					return (
						<>
							<div className="font-[600] mb-[4px]">Mã: {item?.Code}</div>
							<TagByChao background="green">{item?.TypeName}</TagByChao>
						</>
					)
				}

				if (value == 3) {
					return (
						<>
							<div className="font-[600] mb-[4px]">Mã: {item?.Code}</div>
							<TagByChao background="yellow">{item?.TypeName}</TagByChao>
						</>
					)
				}

				return (
					<>
						<div className="font-[600] mb-[4px]">Mã: {item?.Code}</div>
						<TagByChao background="dark">{item?.TypeName}</TagByChao>
					</>
				)
			}
		},
		{
			title: 'Người thanh toán',
			dataIndex: 'FullName',
			width: 220,
			render: (value, item) => {
				if (!value) {
					return ''
				}

				return (
					<>
						<p className="text-[#1E88E5] font-[600]">{value}</p>
						<p className="text-[#000]">
							Mã: <div className="inline font-[600]">{item?.UserCode}</div>
						</p>
					</>
				)
			}
		},
		{
			title: 'Thanh toán',
			dataIndex: 'Paid',
			render: (value, item) => {
				return (
					<>
						<p className="text-[#000]">
							Tổng: <div className="inline font-[700] text-[#1E88E5]">{parseToMoney(item?.TotalPrice)}</div>
						</p>
						<p className="text-[#000]">
							Đã thanh toán: <div className="inline font-[700] text-[#388E3C]">{parseToMoney(value)}</div>
						</p>
						<p className="text-[#000]">
							Chưa thanh toán: <div className="inline font-[700] text-[#E53935]">{parseToMoney(item?.Debt)}</div>
						</p>
					</>
				)
			}
		},
		{
			title: 'Giảm giá',
			dataIndex: 'Reduced',
			render: (value, item) => {
				return (
					<div className="min-w-[120px]">
						{item?.DiscountCode && (
							<p className="text-[#000]">
								Mã: <div className="inline font-[600]">{item?.DiscountCode}</div>
							</p>
						)}

						{!!item?.Reduced && (
							<p className="text-[#000]">
								Số tiền: <div className="inline font-[600]">{parseToMoney(item?.Reduced)}</div>
							</p>
						)}

						{!!item?.UsedMoneyReserve && (
							<p className="text-[#000]">
								Tiền bảo lưu: <div className="inline font-[600]">{parseToMoney(item?.UsedMoneyReserve)}</div>
							</p>
						)}
					</div>
				)
			}
		},
		{
			title: 'Kỳ tiếp theo',
			dataIndex: 'PaymentAppointmentDate',
			width: 130,
			render: (value, item) => <p>{!!value ? moment(value).format('DD/MM/YYYY') : ''}</p>
		},
		{
			title: 'Khởi tạo',
			dataIndex: 'CreatedOn',
			render: (date: any, item) => {
				return (
					<div>
						<div className="font-weight-primary">{item?.CreatedBy}</div>
						<div>{moment(item?.CreatedOn).format('HH:mm DD/MM/YYYY')}</div>
					</div>
				)
			}
		}
	]

	const theRealColumns =
		is(user).admin || is(user).teacher || is(user).manager || is(user).accountant || is(user).academic
			? [
					...columns,
					{
						title: '',
						dataIndex: 'Type',
						fixed: 'right',
						width: 60,
						render: (value, item) => (
							<div className="flex item-center">
								<PaymentDetail data={item} />
								<PayForm isEdit defaultData={item} onRefresh={getData} />
								{item?.Debt < 0 && <RefundForm onRefresh={getData} item={item} />}
								{typeAllowDeleteIds.includes(Number(item?.Type)) && <DeletePayment defaultData={item} onRefresh={getData} />}
							</div>
						)
					}
			  ]
			: columns

	const handleSelecStatus = (status: number) => {
		if (statusSelected !== status) {
			setStatusSelected(status)
			setFilter({ ...filters, type: status, pageIndex: 1 })
		}
	}

	const scrollContainer = document.getElementById('tabcomp-custom-container-scroll-horizontal')

	scrollContainer?.addEventListener('wheel', (evt) => {
		evt.preventDefault()
		scrollContainer.scrollLeft += evt.deltaY
	})

	// --
	const [branches, setBranches] = useState([])
	const [students, setStudents] = useState([])

	const [filterVisible, setFilterVisible] = useState<boolean>(false)

	useEffect(() => {
		getBranchs()
		getStudents()
	}, [])

	const getBranchs = async () => {
		try {
			const response = await branchApi.getAll({ pageIndex: 1, pageSize: 99999 })
			if (response.status == 200) {
				setBranches(response.data.data)
			} else {
				setBranches([])
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

	const getStudents = async () => {
		try {
			const response = await userInformationApi.getByRole(3)
			if (response.status == 200) {
				setStudents(response.data.data)
			} else {
				setStudents([])
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

	return (
		<>
			<Head>
				<title>{appConfigs.appName} | Quản lý thanh toán</title>
			</Head>

			<div className="grid grid-cols-1 w650:grid-cols-3 gap-[8px] mb-[8px]">
				<div className="col-span-1 bg-[#fff] flex border-[1px] border-[#eaedf3] rounded-[8px] gap-[8px] p-[8px]">
					<div className="w-[40px] h-[40px] w700:w-[50px] w700:h-[50px] rounded-[8px] flex items-center justify-center bg-[#E0F2F1]">
						<div className="scale-75 w700:scale-100">
							<IconBcRevenue color="#009688" size={32} />
						</div>
					</div>

					<div className="flex-1">
						<div className="font-[600] text-[12px] w700:text-[14px] text-[#000]">Tổng tiền</div>
						<div className="font-bold text-[16px] w700:text-[20px] text-[#009688] mt-[-2px]">
							{_format.numberToPrice(sumPrice?.sumtotalPrice || 0)}₫
						</div>
					</div>
				</div>

				<div className="col-span-1 bg-[#fff] flex border-[1px] border-[#eaedf3] rounded-[8px] gap-[8px] p-[8px]">
					<div className="w-[40px] h-[40px] w700:w-[50px] w700:h-[50px] rounded-[8px] flex items-center justify-center bg-[#E3F2FD]">
						<div className="scale-75 w700:scale-100">
							<IconBcWallet size={26} color="#1E88E5" />
						</div>
					</div>

					<div className="flex-1">
						<div className="font-[600] text-[12px] w700:text-[14px] text-[#000]">Đã thanh toán</div>
						<div className="font-bold text-[16px] w700:text-[20px] text-[#1E88E5] mt-[-2px]">
							{_format.numberToPrice(sumPrice?.sumPaid || 0)}₫
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
						<div className="font-[600] text-[12px] w700:text-[14px] text-[#000]">Tổng nợ</div>
						<div className="font-bold text-[16px] w700:text-[20px] text-[#E53935] mt-[-2px]">
							{_format.numberToPrice(sumPrice?.sumDebt || 0)}₫
						</div>
					</div>
				</div>
			</div>

			<SuperFilter visible={filterVisible} style={{ marginBottom: 8 }}>
				<PaymentFilter
					key="filter-v3"
					billStatus={billStatus}
					statusSelected={statusSelected}
					filters={filters}
					setFilter={setFilter}
					handleSelecStatus={handleSelecStatus}
				/>
			</SuperFilter>

			<ExpandTable
				currentPage={filters.pageIndex}
				totalPage={totalPage && totalPage}
				getPagination={(page: number) => setFilter({ ...filters, pageIndex: page })}
				loading={{ type: 'GET_ALL', status: loading }}
				dataSource={data}
				columns={theRealColumns}
				TitleCard={
					<div className="w-full flex items-start justify-between">
						<div className="flex items-start gap-[8px]">
							{!!router?.asPath.includes('bill=') && is(user).student && <>Thông tin thanh toán</>}

							{!!router?.asPath.includes('bill=') &&
								(is(user).admin || is(user).teacher || is(user).manager || is(user).accountant || is(user).academic) && (
									<PrimaryButton type="button" background="green" icon="file" onClick={() => router.push('/finance/payment')}>
										Xem tất cả
									</PrimaryButton>
								)}

							{!router?.asPath.includes('bill=') && (
								<>
									{(is(user).admin || is(user).teacher || is(user).manager || is(user).accountant || is(user).academic) && (
										<>
											<DateFilter
												useISOString
												showYesterday={false}
												onSubmit={(e) => setFilter({ ...filters, fromDate: e?.start, toDate: e?.end })}
											/>

											<SuperFilter isButton visible={filterVisible} onClickButton={() => setFilterVisible(!filterVisible)} />
										</>
									)}
								</>
							)}
						</div>

						{(is(user).admin || is(user).teacher || is(user).manager || is(user).accountant || is(user).academic) &&
							!router?.asPath.includes('bill=') && <PaymentForm onRefresh={getData} />}
					</div>
				}
				expandable={expandedRowRender}
			/>
		</>
	)
}

PaymentManagementPage.Layout = MainLayout
export default PaymentManagementPage
