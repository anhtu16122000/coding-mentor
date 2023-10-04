import { Input } from 'antd'
import React, { useEffect } from 'react'
import RestApi from '~/api/RestApi'
import { MainLayout } from '~/common'
import { PrimaryTooltip, StudentNote } from '~/common/components'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNostis } from '~/common/utils'
import Head from 'next/head'
import appConfigs from '~/appConfig'
import Router from 'next/router'
import { ImWarning } from 'react-icons/im'
import { ButtonChange, ButtonEye } from '~/common/components/TableButton'
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
			if (res?.status == 200) {
				setData(res?.data?.data)
				setTotalPage(res?.data?.totalRow)
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

	function viewStudentDetails(params) {
		Router.push({
			pathname: '/info-course/student/detail',
			query: { StudentID: params?.StudentId }
		})
	}

	const theInformation = useSelector((state: RootState) => state.user?.information)

	function isSaler() {
		return theInformation?.RoleId == 5
	}

	function handleColumn(value, item) {
		if (isSaler()) return ''

		function showReserve() {
			if (item?.TotalMonth == 0 && item?.TotalLesson == 0) {
				// Chưa đóng tiền trước hoặc đã học hết
				return false
			}

			if (item?.TotalMonth > 0) {
				if (item?.RemainingMonth == 0) {
					return false
				}
			}

			if (item?.TotalLesson > 0) {
				if (item?.RemainingLesson == 0) {
					return false
				}
			}

			return true
		}

		function showChange() {
			if (item?.TotalMonth == 0 || (item?.TotalMonth > 0 && item?.RemainingMonth == 0)) {
				return true
			}

			return false
		}

		return (
			<div className="flex item-center">
				<PrimaryTooltip content="Thông tin học viên" place="left" id={`view-st-${item?.Id}`}>
					<ButtonEye onClick={() => viewStudentDetails(item)} className="" />
				</PrimaryTooltip>

				{item?.ClassType !== 3 && (
					<>
						{showChange() ? <ChangeClass item={item} onRefresh={getData} /> : <ButtonChange className="ml-[16px] opacity-0" />}
						{showReserve() && <ReserveForm item={item} onRefresh={getData} />}
					</>
				)}
			</div>
		)
	}

	const columns = [
		userInfoColumn,
		{
			width: 280,
			title: 'Liên hệ',
			dataIndex: 'Mobile',
			render: (a, item) => (
				<div>
					<p>
						<div className="font-[500] inline-block">Điện thoại:</div> {a}
					</p>
					<div>
						<div className="font-[500] inline-block">Email:</div> {item?.Email}
					</div>
				</div>
			)
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
			title: 'Lớp',
			dataIndex: 'ClassName',
			width: 170,
			render: (value, item) => {
				return (
					<div className="flex justify-start">
						<PrimaryTooltip className="flex items-center" id={`class-tip-${item?.Id}`} content={'Xem lớp: ' + value} place="top">
							<Link href={`/class/list-class/detail/?class=${item.ClassId}`}>
								<a>
									<div className="max-w-[150px] in-1-line cursor-pointer font-[500] text-[#1976D2] hover:text-[#1968b7] hover:underline">
										{value}
									</div>
								</a>
							</Link>
						</PrimaryTooltip>
					</div>
				)
			}
		},
		{
			title: 'Loại lớp',
			dataIndex: 'ClassType',
			width: 110,
			render: (value, item) => (
				<p className="font-[600]">
					{value == 1 && <span className="tag green">{item?.ClassTypeName}</span>}
					{value == 2 && <span className="tag yellow">{item?.ClassTypeName}</span>}
					{value == 3 && <span className="tag blue">{item?.ClassTypeName}</span>}
				</p>
			)
		},
		{
			title: 'Thông tin học',
			dataIndex: 'ClassType',
			width: 150,
			render: (value, item) => {
				if (item?.TotalMonth > 0) {
					return (
						<div>
							<div className="font-[600] ml-[-1px] pb-[3px]">
								{item?.PaymentType == 1 && <span className="tag green">{item?.PaymentTypeName}</span>}
								{item?.PaymentType == 2 && <span className="tag blue">{item?.PaymentTypeName}</span>}
							</div>

							<div className="">Đã thanh toán: {item?.TotalMonth} tháng</div>
							<div className="">Còn lại: {item?.RemainingMonth} tháng</div>
						</div>
					)
				}

				if (item?.TotalLesson > 0) {
					return (
						<div>
							<div className="font-[600] ml-[-1px] pb-[3px]">
								{item?.PaymentType == 1 && <span className="tag green">{item?.PaymentTypeName}</span>}
								{item?.PaymentType == 2 && <span className="tag yellow">{item?.PaymentTypeName}</span>}
							</div>

							<div className="">Tổng: {item?.TotalLesson} buổi</div>
							<div className="">Còn lại: {item?.RemainingLesson} buổi</div>
						</div>
					)
				}
			}
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

	const expandedRowRender = (data) => {
		return (
			<div className="w-[1000px]">
				<StudentNote studentId={data?.StudentId} />
			</div>
		)
	}

	return (
		<>
			<Head>
				<title>{appConfigs.appName} | Học viên trong khoá</title>
			</Head>

			<ExpandTable
				currentPage={filters?.PageIndex}
				totalPage={totalPage && totalPage}
				getPagination={(page: number) => setFilter({ ...filters, PageIndex: page })}
				loading={{ type: 'GET_ALL', status: loading }}
				dataSource={data || []}
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
				expandable={expandedRowRender}
			/>
		</>
	)
}

StudentInClassPage.Layout = MainLayout
export default StudentInClassPage
