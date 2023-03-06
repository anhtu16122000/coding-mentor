import { Input } from 'antd'
import React, { useEffect, useState } from 'react'
import RestApi from '~/api/RestApi'
import { MainLayout } from '~/common'
import { PrimaryTooltip } from '~/common/components'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNostis } from '~/common/utils'
import { parseToMoney } from '~/common/utils/common'
import moment from 'moment'
import Head from 'next/head'
import appConfigs from '~/appConfig'
import Avatar from '~/common/components/Avatar'
import Router from 'next/router'
import { ButtonEye } from '~/common/components/TableButton'
import { AddToClass, RefundForm } from '~/common/components/Student/Reserved'
import { userInfoColumn } from '~/common/libs/columns/user-info'
import Filters from '~/common/components/Student/Filters'

const initFilters = { PageSize: PAGE_SIZE, PageIndex: 1, Search: '' }

const ChangedPage = () => {
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
			const res = await RestApi.get<any>('ClassChange', filters)
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
		return <div>Ghi chú: {item?.Note}</div>
	}

	function gotoClass(params) {
		Router.push(`/class/list-class/detail/?class=${params.ClassId}`)
	}

	function viewStudentDetails(params) {
		Router.push({
			pathname: '/info-course/student/detail',
			query: { StudentID: params?.StudentId }
		})
	}

	function handleColumn(value, item) {
		return (
			<div className="flex item-center">
				<PrimaryTooltip content="Thông tin học viên" place="left" id={`view-st-${item?.Id}`}>
					<ButtonEye onClick={() => viewStudentDetails(item)} />
				</PrimaryTooltip>

				{item?.Status == 1 && (
					<>
						<AddToClass item={item} onRefresh={getData} />
						<RefundForm item={item} onRefresh={getData} />
					</>
				)}
			</div>
		)
	}

	const columns = [
		userInfoColumn,
		{
			title: 'Lớp cũ',
			dataIndex: 'OldClassName',
			width: 220,
			render: (value, item) => (
				<div className="ml-[8px]">
					<PrimaryTooltip className="flex items-center" id={`old-class-${item?.Id}`} content={'Xem lớp: ' + value} place="top">
						<a
							href={`/class/list-class/detail/?class=${item.OldClassId}`}
							className="max-w-[150px] in-1-line cursor-pointer font-[500] text-[#1976D2] hover:text-[#1968b7] hover:underline"
						>
							{value}
						</a>
					</PrimaryTooltip>
					<h3 className="text-[14px] font-[400]">{parseToMoney(item?.OldPrice)}</h3>
				</div>
			)
		},
		{
			title: 'Lớp mới',
			dataIndex: 'NewClassName',
			width: 220,
			render: (value, item) => (
				<div className="ml-[8px]">
					<PrimaryTooltip className="flex items-center" id={`new-class-${item?.Id}`} content={'Xem lớp: ' + value} place="top">
						<a
							href={`/class/list-class/detail/?class=${item.NewClassId}`}
							className="max-w-[150px] in-1-line cursor-pointer font-[500] text-[#1976D2] hover:text-[#1968b7] hover:underline"
						>
							{value}
						</a>
					</PrimaryTooltip>
					<h3 className="text-[14px] font-[400]">{parseToMoney(item?.NewPrice)}</h3>
				</div>
			)
		},
		{
			title: 'Trung tâm',
			dataIndex: 'BranchName',
			className: 'font-[600]',
			width: 220
		},
		{
			title: 'Ngày chuyển',
			dataIndex: 'CreatedOn',
			width: 160,
			render: (value, item) => <div>{moment(value).format('DD/MM/YYYY HH:mm')}</div>
		},
		{
			title: 'Người tạo',
			dataIndex: 'CreatedBy',
			width: 200,
			render: (value, item) => <p className="font-[600] text-[#1976D2]">{value}</p>
		},
		{
			title: '',
			dataIndex: 'Type',
			width: 60,
			fixed: 'right',
			render: handleColumn
		}
	]

	// function isSaler() {
	// 	return userInformation?.RoleId == 5
	// }

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
					<div className="w-full flex items-center">
						<Filters showBranch filters={filters} onSubmit={(event) => setFilter(event)} onReset={() => setFilter(initFilters)} />
						<Input.Search
							className="primary-search max-w-[250px] ml-[8px]"
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
		</>
	)
}

ChangedPage.Layout = MainLayout
export default ChangedPage
