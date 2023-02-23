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
import { AddToClass, RefundForm } from '~/common/components/Student/Registration'
import { userInfoColumn } from '~/common/libs/columns/user-info'
import Filters from '~/common/components/Student/Filters'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

const url = 'ClassRegistration'

const initFilters = { PageSize: PAGE_SIZE, PageIndex: 1, Search: '' }

const RegistrationPage = () => {
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

	const expandedRowRender = (item) => {
		return <div>Ghi chú: {item?.Note}</div>
	}

	function gotoClass(params) {
		Router.push(`/class/list-class/detail/?class=${params.ClassId}`)
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

	function viewStudentDetails(params) {
		Router.push({
			pathname: '/info-course/student/detail',
			query: { StudentID: params?.StudentId }
		})
	}

	function handleColumn(value, item) {
		if (isSaler()) return ''

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
			title: 'Trung tâm',
			dataIndex: 'BranchName',
			className: 'font-[600]',
			width: 200
		},
		{
			title: 'Chương trình',
			dataIndex: 'ProgramName',
			width: 160,
			render: (value, item) => <div className="font-[600] text-[#000]">{value}</div>
		},
		{
			title: 'Số tiền',
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
					{value == 2 && <span className="tag green">{item?.StatusName}</span>}
					{value == 3 && <span className="tag blue">{item?.StatusName}</span>}
					{value == 4 && <span className="tag red">{item?.StatusName}</span>}
				</p>
			)
		},
		{
			title: 'Ngày đăng ký',
			dataIndex: 'CreatedOn',
			width: 160,
			render: (value, item) => <p className="font-[400]">{moment(value).format('DD/MM/YYYY HH:mm')}</p>
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
				<title>{appConfigs.appName} | Học viên bảo lưu</title>
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
							showBranch
							showProgram
							statusList={[
								{ value: 1, title: 'Chờ xếp lớp' },
								{ value: 2, title: 'Đã xếp lớp' },
								{ value: 3, title: 'Đã hoàn tiền' }
							]}
							filters={filters}
							onSubmit={(event) => setFilter(event)}
							onReset={() => setFilter(initFilters)}
						/>
						<Input.Search
							className="primary-search max-w-[300px] ml-[8px]"
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

RegistrationPage.Layout = MainLayout
export default RegistrationPage
