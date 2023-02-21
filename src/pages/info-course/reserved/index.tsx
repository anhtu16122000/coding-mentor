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
import Router from 'next/router'
import { IoMdOpen } from 'react-icons/io'
import { ImWarning } from 'react-icons/im'
import { ButtonEye } from '~/common/components/TableButton'
import { ChangeClass, ReserveForm } from '~/common/components/Student/StudentInClass'
import PrimaryEditor from '~/common/components/Editor'
import { AddToClass, RefundForm } from '~/common/components/Student/Reserved'

const ReservedPage = () => {
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
			const res = await RestApi.get<any>('ClassReserve', filters)
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
				<ButtonEye onClick={() => viewStudentDetails(item)} className="" />

				{item?.Status == 1 && (
					<>
						<AddToClass item={item} onRefresh={getData} />
						<RefundForm item={item} onRefresh={getData} />
					</>
				)}

				{item?.Status == 4 && (
					<>
						<RefundForm item={item} onRefresh={getData} />
					</>
				)}
			</div>
		)
	}

	const columns = [
		{
			title: 'Học viên',
			dataIndex: 'Code',
			render: (value, item) => (
				<div className="flex items-center">
					<Avatar className="h-[40px] w-[40px] rounded-[4px]" uri={item?.Avatar} />
					<div className="ml-[8px]">
						<h2 className="text-[16px] font-[600]">{item?.FullName}</h2>
						<h3 className="text-[14px] font-[400]">{item?.UserCode}</h3>
					</div>
				</div>
			)
		},
		{
			title: 'Trung tâm',
			dataIndex: 'BranchName',
			width: 200
		},
		{
			title: 'Số tiền bảo lưu',
			dataIndex: 'Price',
			width: 130,
			render: (value, item) => <p className="font-[600] text-[#1976D2]">{parseToMoney(value)}</p>
		},
		{
			title: 'Trạng thái',
			dataIndex: 'Status',
			width: 120,
			render: (value, item) => (
				<p className="font-[600] text-[#E53935]">
					{value == 1 && <span className="tag yellow">{item?.StatusName}</span>}
					{value == 2 && <span className="tag blue">{item?.StatusName}</span>}
					{value == 3 && <span className="tag green">{item?.StatusName}</span>}
					{value == 4 && <span className="tag red">{item?.StatusName}</span>}
				</p>
			)
		},
		{
			title: 'Ngày bảo lưu',
			dataIndex: 'CreatedOn',
			width: 160,
			render: (value, item) => <div>{moment(value).format('DD/MM/YYYY HH:mm')}</div>
		},
		{
			title: 'Hạn bảo lưu',
			dataIndex: 'Expires',
			width: 120,
			render: (value, item) => <p className="font-[400]">{moment(value).format('DD/MM/YYYY')}</p>
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
			width: 60,
			fixed: 'right',
			render: handleColumn
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
				expandable={expandedRowRender}
			/>
		</>
	)
}

ReservedPage.Layout = MainLayout
export default ReservedPage
