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
import { userInfoColumn } from '~/common/libs/columns/user-info'
import Filters from '~/common/components/Student/Filters'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import Link from 'next/link'

const initFilters = { PageSize: PAGE_SIZE, PageIndex: 1, Search: '' }

const StudentInClassPage = () => {
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

	function gotoClass(params) {
		Router.push(`/class/list-class/detail/?class=${params.ClassId}`)
	}

	function viewStudentDetails(params) {
		Router.push({
			pathname: '/info-course/student/detail',
			query: { StudentID: params?.StudentId }
		})
	}

	const theInformation = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return theInformation?.RoleId == 1
	}

	function isTeacher() {
		return theInformation?.RoleId == 2
	}

	function isManager() {
		return theInformation?.RoleId == 4
	}

	function isStdent() {
		return theInformation?.RoleId == 3
	}

	function isSaler() {
		return theInformation.RoleId == 5
	}

	function handleColumn(value, item) {
		if (isSaler()) return ''

		return (
			<div className="flex item-center">
				<PrimaryTooltip content="Thông tin học viên" place="left" id={`view-st-${item?.Id}`}>
					<ButtonEye onClick={() => viewStudentDetails(item)} className="" />
				</PrimaryTooltip>

				{item?.ClassType !== 3 && (
					<>
						<ChangeClass item={item} onRefresh={getData} />
						<ReserveForm item={item} onRefresh={getData} />
					</>
				)}
			</div>
		)
	}

	const columns = [
		userInfoColumn,
		{
			title: 'Điện thoại',
			dataIndex: 'Mobile'
		},
		{
			title: 'Email',
			dataIndex: 'Email'
		},
		{
			title: 'Lớp',
			dataIndex: 'ClassName',
			width: 170,
			render: (value, item) => {
				return (
					<PrimaryTooltip className="flex items-center" id={`class-tip-${item?.Id}`} content={'Xem lớp: ' + value} place="top">
						<Link href={`/class/list-class/detail/?class=${item.ClassId}`}>
							<a>
								<div className="max-w-[150px] in-1-line cursor-pointer font-[500] text-[#1976D2] hover:text-[#1968b7] hover:underline">
									{value}
								</div>
							</a>
						</Link>
					</PrimaryTooltip>
				)
			}
		},
		{
			title: 'Loại học viên',
			dataIndex: 'Type',
			width: 120,
			render: (value, item) => (
				<p className="font-[600] text-[#E53935]">
					{value == 1 && <span className="tag green">{item?.TypeName}</span>}
					{value == 2 && <span className="tag yellow">{item?.TypeName}</span>}
					{value == 3 && <span className="tag blue">{item?.TypeName}</span>}
				</p>
			)
		},
		{
			title: 'Loại lớp',
			dataIndex: 'ClassType',
			width: 110,
			render: (value, item) => (
				<p className="font-[600] text-[#E53935]">
					{value == 1 && <span className="tag green">{item?.ClassTypeName}</span>}
					{value == 2 && <span className="tag yellow">{item?.ClassTypeName}</span>}
					{value == 3 && <span className="tag blue">{item?.ClassTypeName}</span>}
				</p>
			)
		},
		{
			title: 'Cảnh báo',
			dataIndex: 'Warning',
			align: 'center',
			width: 100,
			render: (value, item) => {
				if (!!value) {
					return <ImWarning size={18} className="text-[#EF6C00]" />
				}
				return ''
			}
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
					<div className="w-full flex items-center">
						<Filters
							showClass
							showSort
							showWarning
							filters={filters}
							onSubmit={(event) => setFilter(event)}
							onReset={() => setFilter(initFilters)}
						/>
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
			/>
		</>
	)
}

StudentInClassPage.Layout = MainLayout
export default StudentInClassPage
