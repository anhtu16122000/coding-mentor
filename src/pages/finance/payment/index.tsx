import React, { useEffect, useState } from 'react'
import RestApi from '~/api/RestApi'
import { MainLayout } from '~/common'
import PayForm from '~/common/components/Finance/Payment/pay'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNostis } from '~/common/utils'
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

const initParamters = {
	pageSize: PAGE_SIZE,
	branchIds: null,
	pageIndex: 1,
	search: '',
	fromDate: null,
	toDate: null,
	type: 0
}

const PaymentManagementPage = () => {
	const [loading, setLoading] = React.useState(true)
	const [totalPage, setTotalPage] = React.useState(1)
	const [data, setData] = React.useState([])
	const [sumPrice, setSumPrice] = React.useState({})
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
					{
						id: 3,
						title: 'Đăng ký lớp dạy kèm' + ` (${res?.data?.typeTutorial})`,
						value: res?.data?.typeTutorial
					},
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
			width: 100,
			render: (value, item) => {
				if (value == 1) {
					return (
						<>
							<div className="font-[600] mb-[4px]">Mã: {item?.Code}</div>
							<span className="tag blue !ml-[-1px]">{item?.TypeName}</span>
						</>
					)
				}

				if (value == 2) {
					return (
						<>
							<div className="font-[600] mb-[4px]">Mã: {item?.Code}</div>
							<span className="tag green !ml-[-1px]">{item?.TypeName}</span>
						</>
					)
				}

				if (value == 3) {
					return (
						<>
							<div className="font-[600] mb-[4px]">Mã: {item?.Code}</div>
							<span className="tag yellow !ml-[-1px]">{item?.TypeName}</span>
						</>
					)
				}

				return (
					<>
						<div className="font-[600] mb-[4px]">Mã: {item?.Code}</div>
						<span className="tag gray !ml-[-1px]">{item?.TypeName}</span>
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
			width: 100,
			render: (value, item) => {
				if (!value) {
					return ''
				}

				return (
					<>
						{item?.DiscountCode && (
							<p className="text-[#000]">
								Mã: <div className="inline font-[600]">{item?.DiscountCode}</div>
							</p>
						)}
						<p className="text-[#000]">
							Số tiền: <div className="inline font-[600]">{parseToMoney(item?.Reduced)}</div>
						</p>

						{!!item?.UsedMoneyReserve && (
							<p className="text-[#000]">
								Tiền bảo lưu: <div className="inline font-[600]">{parseToMoney(item?.UsedMoneyReserve)}</div>
							</p>
						)}
					</>
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

	const handleSelecStatus = (status: number) => {
		if (statusSelected !== status) {
			setStatusSelected(status)
			setFilter({ ...filters, type: status })
		}
	}

	const scrollContainer = document.getElementById('tabcomp-custom-container-scroll-horizontal')

	scrollContainer?.addEventListener('wheel', (evt) => {
		evt.preventDefault()
		scrollContainer.scrollLeft += evt.deltaY
	})

	return (
		<>
			<Head>
				<title>{appConfigs.appName} | Quản lý thanh toán</title>
			</Head>

			<ExpandTable
				currentPage={filters.pageIndex}
				totalPage={totalPage && totalPage}
				getPagination={(page: number) => setFilter({ ...filters, pageIndex: page })}
				loading={{ type: 'GET_ALL', status: loading }}
				dataSource={data}
				columns={
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
										</div>
									)
								}
						  ]
						: columns
				}
				sumPrice={is(user).admin || is(user).teacher || is(user).manager || is(user).accountant || is(user).academic ? sumPrice : null}
				TitleCard={
					<div className="w-full flex items-center justify-between">
						<div className="flex items-center">
							{(is(user).admin || is(user).teacher || is(user).manager || is(user).accountant || is(user).academic) && (
								<Filters filters={filters} onReset={() => setFilter(initParamters)} onSubmit={(e) => setFilter({ ...e })} />
							)}
							<Select
								placeholder="Loại thanh toán"
								className="primay-input min-w-[210px] ml-[8px] !h-[36px]"
								defaultValue={0}
								onChange={(e) => handleSelecStatus(e)}
							>
								{billStatus.map((item, index) => {
									return (
										<Select.Option key={item?.id} value={item?.id}>
											{item?.title}
										</Select.Option>
									)
								})}
							</Select>
						</div>

						{(is(user).admin || is(user).teacher || is(user).manager || is(user).accountant || is(user).academic) && (
							<PaymentForm onRefresh={getData} />
						)}
					</div>
				}
				expandable={expandedRowRender}
			/>
		</>
	)
}

PaymentManagementPage.Layout = MainLayout
export default PaymentManagementPage
