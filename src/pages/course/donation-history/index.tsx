import { Input } from 'antd'
import React, { useEffect } from 'react'
import RestApi from '~/api/RestApi'
import { MainLayout } from '~/common'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNostis } from '~/common/utils'
import BillDetails from '../../../common/components/Finance/BillDetails'
import moment from 'moment'
import Head from 'next/head'
import appConfigs from '~/appConfig'



const DonationHistorytPage = () => {
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
			const res = await RestApi.get<any>('HistoryDonate', filters)
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
			title: 'Mã học viên',
			dataIndex: 'UserCode',
			width: 110
		},
		{
			title: 'Học viên',
			dataIndex: 'FullName',
			width: 220,
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
					{value == 4 && <span className="tag grey">{item?.TypeName}</span>}
				</p>
			)
		},
		{
			title: 'Ngày',
			dataIndex: 'ModifiedOn',
			width: 160,
			render: (value, item) => <p>{moment(value).format('DD/MM/YYYY HH:mm')}</p>
		},
		{
			title: 'Người tặng',
			dataIndex: 'ModifiedBy',
			width: 220,
			render: (value, item) => <p className="font-[600] text-[#1E88E5]">{value}</p>
		}
	]

	return (
		<>
			<Head>
				<title>{appConfigs.appName} | Lịch sử tặng</title>
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
				expandable={expandedRowRender}
				showdata={''}
			/>
		</>
	)
}

DonationHistorytPage.Layout = MainLayout
export default DonationHistorytPage
