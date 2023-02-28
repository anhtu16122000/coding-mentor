import { Tooltip } from 'antd'
import React, { useEffect } from 'react'
import RestApi from '~/api/RestApi'
import { MainLayout } from '~/common'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNostis } from '~/common/utils'
import moment from 'moment'
import Head from 'next/head'
import appConfigs from '~/appConfig'
import Avatar from '~/common/components/Avatar'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { FiCopy } from 'react-icons/fi'

const initFilters = { PageSize: PAGE_SIZE, PageIndex: 1, Search: '' }

const CodesPage = () => {
	const [loading, setLoading] = React.useState(true)
	const [totalPage, setTotalPage] = React.useState(1)
	const [data, setData] = React.useState([])
	const [filters, setFilter] = React.useState(initFilters)

	const user = useSelector((state: RootState) => state.user.information)

	useEffect(() => {
		getData()
	}, [filters])

	async function getData() {
		setLoading(true)
		try {
			const res = await RestApi.get<any>('VideoActiveCode', { ...filters, studentId: user?.UserInformationId })
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

	const columns = [
		{
			title: 'Thông tin',
			dataIndex: 'Code',
			width: 300,
			render: (value, item) => (
				<div className="flex items-center">
					<Avatar className="h-[40px] w-[40px] rounded-[4px] shadow-sm object-cover" uri={item?.Thumbnail} />
					<div className="ml-[16px]">
						<h2 className="text-[16px] font-[600]">{item?.ProductName}</h2>
					</div>
				</div>
			)
		},
		{
			title: 'Mã kích hoạt',
			dataIndex: 'ActiveCode',
			width: 170,
			render: (value, item) => (
				<Tooltip title="Sao chép" placement="right">
					<span
						className="tag blue is-button bold cursor-pointer"
						onClick={() => {
							navigator.clipboard.writeText(value || '')
							ShowNostis.success('Đã sao chép')
						}}
					>
						{value}
						<FiCopy size={14} className="ml-2" />
					</span>
				</Tooltip>
			)
		},
		{
			title: 'Trạng thái',
			dataIndex: 'IsUsed',
			aling: 'center',
			render: (value, data) => {
				return (
					<>
						{!value && <p className="tag blue">Chưa sử dụng</p>}
						{!!value && <p className="tag gray">Đã sử dụng</p>}
					</>
				)
			}
		},
		{
			title: 'Ngày duyệt',
			dataIndex: 'CreatedOn',
			width: 160,
			render: (value, item) => <div>{moment(value).format('DD/MM/YYYY HH:mm')}</div>
		},
		{
			title: 'Người duyệt',
			dataIndex: 'CreatedBy',
			width: 200,
			render: (value, item) => <p className="font-[600] text-[#1976D2]">{value}</p>
		}
	]

	return (
		<>
			<Head>
				<title>{appConfigs.appName} | Danh sách mã kích hoạt</title>
			</Head>

			<ExpandTable
				currentPage={filters.PageIndex}
				totalPage={totalPage && totalPage}
				getPagination={(page: number) => setFilter({ ...filters, PageIndex: page })}
				loading={{ type: 'GET_ALL', status: loading }}
				dataSource={data}
				columns={columns}
				TitleCard="Danh sách mã kích hoạt"
			/>
		</>
	)
}

CodesPage.Layout = MainLayout
export default CodesPage
