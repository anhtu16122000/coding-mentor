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
import Head from 'next/head'
import appConfigs from '~/appConfig'
import AvatarComponent from '~/common/components/AvatarComponent'
import Avatar from '~/common/components/Avatar'

const StudentInClassPage = () => {
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
			const res = await RestApi.get<any>('StudentInClass', filters)
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
			title: 'Học viên',
			dataIndex: 'Code',
			render: (value, item) => (
				<div className="flex items-center">
					<Avatar className="h-[40px] w-[40px]" uri={item?.Avatar} />
					<div className="ml-[8px]">
						<h2 className="text-[16px] font-[600]">{item?.FullName}</h2>
						<h3 className="text-[14px] font-[400]">{item?.UserCode}</h3>
					</div>
				</div>
			)
		},
		{
			title: 'Điện thoại',
			dataIndex: 'Mobile',
			width: 116
		},
		{
			title: 'Email',
			dataIndex: 'Email',
			width: 140
		},
		{
			title: 'Loại',
			dataIndex: 'Type',
			width: 180,
			render: (value, item) => (
				<p className="font-[600] text-[#E53935]">
					{value == 1 && <span className="tag green">{item?.TypeName}</span>}
					{value == 2 && <span className="tag yellow">{item?.TypeName}</span>}
					{value == 3 && <span className="tag blue">{item?.TypeName}</span>}
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
		<>
			<Head>
				<title>{appConfigs.appName} | Học viên trong khoá</title>
			</Head>

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
			/>
		</>
	)
}

StudentInClassPage.Layout = MainLayout
export default StudentInClassPage
