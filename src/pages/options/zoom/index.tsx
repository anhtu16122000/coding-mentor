import { Input, Popconfirm } from 'antd'
import React, { useEffect } from 'react'
import RestApi from '~/api/RestApi'
import { MainLayout } from '~/common'
import { PrimaryTooltip } from '~/common/components'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNostis } from '~/common/utils'
import moment from 'moment'
import Head from 'next/head'
import appConfigs from '~/appConfig'
import { ButtonRemove } from '~/common/components/TableButton'
import Filters from '~/common/components/Student/Filters'
import { ModalConfigZoom } from '~/common/components/Zoom'

const initFilters = { PageSize: PAGE_SIZE, PageIndex: 1, Search: '' }

const url = 'ZoomConfig'

const ZoomConfigsPage = () => {
	const [loading, setLoading] = React.useState(true)
	const [totalPage, setTotalPage] = React.useState(1)
	const [data, setData] = React.useState([])
	const [filters, setFilter] = React.useState(initFilters)

	useEffect(() => {
		getData()
	}, [filters])

	async function getData() {
		setLoading(true)
		try {
			const res = await RestApi.get<any>(url, filters)
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

	async function deleteThis(params) {
		setLoading(true)
		try {
			const res = await RestApi.delete(url, params)
			if (res.status == 200) {
				getData()
				ShowNostis.success('Thành công')
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	function handleColumn(value, item) {
		return (
			<div className="flex item-center">
				<PrimaryTooltip id={`sw-${item?.Id}`} place="right" content="Xoá">
					<Popconfirm title="Xoá cấu hình này?" onConfirm={() => deleteThis(item?.Id)}>
						<ButtonRemove />
					</Popconfirm>
				</PrimaryTooltip>
			</div>
		)
	}

	const columns = [
		{
			title: 'Tên',
			dataIndex: 'Name',
			width: 180,
			className: 'font-[500] text-[#1976D2]'
		},
		{
			title: 'AccountId',
			dataIndex: 'AccountId',
			className: 'font-[500]',
			width: 200
		},
		{
			title: 'ClientId',
			dataIndex: 'ClientId',
			className: 'font-[500]',
			width: 200
		},
		{
			title: 'ClientSecret',
			dataIndex: 'ClientSecret',
			className: 'font-[500]',
			width: 200
		},
		{
			title: 'Trạng thái',
			dataIndex: 'Active',
			width: 120,
			render: (value, item) => {
				if (!!value) {
					return <span className="tag green">Hoạt động</span>
				}
				return <span className="tag red">Dừng</span>
			}
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'CreatedOn',
			width: 160,
			render: (value, item) => <div>{moment(value).format('DD/MM/YYYY HH:mm')}</div>
		},
		{
			title: 'Người tạo',
			dataIndex: 'CreatedBy',
			width: 150,
			render: (value, item) => <p className="font-[600] text-[#1976D2]">{value}</p>
		},
		{
			title: '',
			dataIndex: 'Type',
			width: 50,
			fixed: 'right',
			render: handleColumn
		}
	]

	return (
		<>
			<Head>
				<title>{appConfigs.appName} | Học viên chuyển khoá</title>
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
						<div className="flex items-center">
							<Input.Search
								className="primary-search max-w-[250px]"
								onChange={(event) => {
									if (event.target.value == '') {
										setFilter({ ...filters, PageIndex: 1, Search: '' })
									}
								}}
								onSearch={(event) => setFilter({ ...filters, PageIndex: 1, Search: event })}
								placeholder="Tìm kiếm"
							/>
						</div>

						<ModalConfigZoom onRefresh={getData} />
					</div>
				}
			/>
		</>
	)
}

ZoomConfigsPage.Layout = MainLayout
export default ZoomConfigsPage
