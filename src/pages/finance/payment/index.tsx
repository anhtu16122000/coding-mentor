import { Input } from 'antd'
import React, { useEffect, useState } from 'react'
import RestApi from '~/api/RestApi'
import { MainLayout } from '~/common'
import PayForm from '~/common/components/Finance/Payment/pay'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNostis } from '~/common/utils'
import { parseToMoney } from '~/common/utils/common'
import BillDetails from '../../../common/components/Finance/BillDetails'
import moment from 'moment'
import Head from 'next/head'
import appConfigs from '~/appConfig'
import RefundForm from './Refund'
import PaymentForm from '~/common/components/Finance/Payment/Create'
import FilterBase from '~/common/components/Elements/FilterBase'
import { paymentMethodsApi } from '~/api/payment-method'
import PaymentDetail from './PaymentDetail'

const initParamters = { pageSize: PAGE_SIZE, pageIndex: 1, search: '', fromDate: null, toDate: null }
const PaymentManagementPage = () => {
	const [loading, setLoading] = React.useState(true)
	const [totalPage, setTotalPage] = React.useState(1)
	const [data, setData] = React.useState([])
	const [sumPrice, setSumPrice] = React.useState({})
	const [filters, setFilter] = React.useState(initParamters)

	const [dataFilter, setDataFilter] = React.useState([
		{
			name: 'date-range',
			title: 'Từ - đến',
			col: 'grid-cols-1',
			type: 'date-range'
		}
	])
	useEffect(() => {
		getData()
	}, [filters])

	let listFieldFilter = {
		pageIndex: 1,
		pageSize: PAGE_SIZE,
		fromDate: null,
		toDate: null
	}
	const handleFilter = (listFilter) => {
		let newListFilter = { ...listFieldFilter }
		listFilter.forEach((item, index) => {
			let key = item.name
			Object.keys(newListFilter).forEach((keyFilter) => {
				if (keyFilter == key) {
					newListFilter[key] = item.value
				}
			})
		})
		setFilter({ ...filters, ...newListFilter, pageIndex: 1 })
	}

	const handleReset = () => {
		setFilter({ ...initParamters })
	}

	async function getData() {
		setLoading(true)
		try {
			const res = await RestApi.get<any>('Bill', filters)
			if (res.status == 200) {
				setData(res.data.data)
				setTotalPage(res.data.totalRow)
				setSumPrice(res.data)
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
			title: 'Mã',
			dataIndex: 'Code',
			width: 100
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
			title: 'Khuyến mãi',
			dataIndex: 'DiscountCode',
			render: (value, item) => {
				if (!value) {
					return ''
				}

				return (
					<>
						<p className="text-[#000]">
							Mã: <div className="inline font-[600]">{value}</div>
						</p>
						<p className="text-[#000]">
							Số tiền: <div className="inline font-[600]">{parseToMoney(item?.Reduced)}</div>
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
							Tổng: <div className="inline font-[600] text-[#1E88E5]">{parseToMoney(item?.TotalPrice)}</div>
						</p>
						<p className="text-[#000]">
							Đã thanh toán: <div className="inline font-[600] text-[#388E3C]">{parseToMoney(value)}</div>
						</p>
						<p className="text-[#000]">
							Chưa thanh toán: <div className="inline font-[600] text-[#E53935]">{parseToMoney(item?.Debt)}</div>
						</p>
					</>
				)
			}
		},
		{
			title: 'Loại',
			dataIndex: 'Type',
			width: 180,
			render: (value, item) => (
				<p className="font-[600] text-[#E53935]">
					{value == 1 && <span className="tag blue">{item?.TypeName}</span>}
					{value == 2 && <span className="tag green">{item?.TypeName}</span>}
					{value == 3 && <span className="tag yellow">{item?.TypeName}</span>}
					{value == 4 && <span className="tag gray">{item?.TypeName}</span>}
				</p>
			)
		},
		{
			title: 'Kỳ tiếp theo',
			dataIndex: 'PaymentAppointmentDate',
			width: 130,
			render: (value, item) => <p>{!!value ? moment(value).format('DD/MM/YYYY') : ''}</p>
		},
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
				columns={columns}
				sumPrice={sumPrice}
				TitleCard={
					<div className="w-full flex items-center justify-between">
						<div className="flex items-center">
							<FilterBase dataFilter={dataFilter} handleFilter={handleFilter} handleReset={handleReset} />
							<Input.Search
								className="primary-search max-w-[300px]"
								onChange={(event) => {
									if (event.target.value == '') {
										setFilter({ ...filters, pageIndex: 1, search: '' })
									}
								}}
								onSearch={(event) => setFilter({ ...filters, pageIndex: 1, search: event })}
								placeholder="Tìm kiếm"
							/>
						</div>

						<PaymentForm onRefresh={getData} />
					</div>
				}
				expandable={expandedRowRender}
			/>
		</>
	)
}

PaymentManagementPage.Layout = MainLayout
export default PaymentManagementPage
