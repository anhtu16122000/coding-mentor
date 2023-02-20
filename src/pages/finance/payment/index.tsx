import { Input, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { FaMoneyBill } from 'react-icons/fa'
import { GiReceiveMoney } from 'react-icons/gi'
import RestApi from '~/api/RestApi'
import { MainLayout } from '~/common'
import { PrimaryTooltip } from '~/common/components'
import PayForm from '~/common/components/Finance/Payment/pay'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNostis } from '~/common/utils'
import { parseToMoney } from '~/common/utils/common'
import BillDetails from '../../../common/components/Finance/BillDetails'
import moment from 'moment'
import PrimaryButton from '~/common/components/Primary/Button'
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai'

const PaymentManagementPage = () => {
	const [loading, setLoading] = React.useState(true)
	const [totalPage, setTotalPage] = React.useState(1)
	const [data, setData] = React.useState([])
	const [filters, setFilter] = React.useState({ PageSize: PAGE_SIZE, PageIndex: 1, Search: '' })

	useEffect(() => {
		getData()
	}, [filters])

	async function getData() {
		setLoading(true)
		try {
			const res = await RestApi.get<any>('Bill', filters)
			if (res.status == 200) {
				setData(res.data.data)
				setTotalPage(res.data.totalRow)
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
			render: (value, item) => <p className="font-[600] text-[#1E88E5]">{value}</p>
		},
		{
			title: 'Tổng số tiền',
			dataIndex: 'TotalPrice',
			width: 116,
			render: (value, item) => <p className="font-[600] text-[#000]">{parseToMoney(value)}</p>
		},
		{
			title: 'Đã thanh toán',
			dataIndex: 'Paid',
			width: 126,
			render: (value, item) => <p className="font-[600] text-[#388E3C]">{parseToMoney(value)}</p>
		},
		{
			title: 'Chưa thanh toán',
			dataIndex: 'Debt',
			width: 140,
			render: (value, item) => <p className="font-[600] text-[#E53935]">{parseToMoney(value)}</p>
		},
		{
			title: 'Phương thức',
			dataIndex: 'PaymentMethodName',
			width: 130
		},
		{
			title: 'Ngày',
			dataIndex: 'ModifiedOn',
			width: 160,
			render: (value, item) => <p>{moment(value).format('DD/MM/YYYY HH:mm')}</p>
		},
		{
			title: 'Kỳ tiếp theo',
			dataIndex: 'PaymentAppointmentDate',
			width: 130,
			render: (value, item) => <p>{!!value ? moment(value).format('DD/MM/YYYY') : ''}</p>
		},
		{
			title: 'Người tạo',
			dataIndex: 'ModifiedBy',
			width: 160,
			render: (value, item) => <p className="font-[600] text-[#1E88E5]">{value}</p>
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
				</p>
			)
		},
		{
			title: '',
			dataIndex: 'Type',
			width: 60,
			render: (value, item) => (
				<div className="flex item-center">
					<PayForm isEdit defaultData={item} onRefresh={getData} />
				</div>
			)
		}
	]

	return (
		<ExpandTable
			currentPage={filters.PageIndex}
			totalPage={totalPage && totalPage}
			getPagination={(page: number) => setFilter({ ...filters, PageIndex: page })}
			loading={{ type: 'GET_ALL', status: loading }}
			dataSource={data}
			columns={columns}
			TitleCard={
				<div className="w-full flex items-center justify-between">
					<Input.Search
						className="primary-search max-w-[300px]"
						onChange={(event) => {
							if (event.target.value == '') {
								setFilter({ ...filters, PageIndex: 1, Search: '' })
							}
						}}
						onSearch={(event) => setFilter({ ...filters, PageIndex: 1, Search: event })}
						placeholder="Tìm kiếm"
					/>
				</div>
			}
			expandable={expandedRowRender}
		/>
	)
}

PaymentManagementPage.Layout = MainLayout
export default PaymentManagementPage
