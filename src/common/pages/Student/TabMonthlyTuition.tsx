import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { monthlyTuitionApi } from '~/api/user/monthly-tuition'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'

import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { RiBillLine } from 'react-icons/ri'
import { PrimaryTooltip } from '~/common/components'
import Router, { useRouter } from 'next/router'
import { encode, is, parseToMoney } from '~/common/utils/common'
import PrimaryButton from '~/common/components/Primary/Button'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { ShowNoti } from '~/common/utils'
import { DatePicker } from 'antd'

export const TabMonthlyTuition = ({ StudentDetail }) => {
	const router = useRouter()

	const [filters, setFilters] = useState({
		pageIndex: 1,
		month: new Date().getMonth() + 1,
		year: new Date().getFullYear(),
		pageSize: PAGE_SIZE
	})
	const [dataTable, setDataTable] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [totalPage, setTotalPage] = useState(null)
	const [valueDate, setValueDate] = useState(moment())

	const user = useSelector((state: RootState) => state.user.information)

	const getData = async (params) => {
		setIsLoading(true)
		try {
			const res = await monthlyTuitionApi.getAll(params)
			if (res.status == 200) {
				setDataTable(res.data.data)
				setTotalPage(res.data.totalRow)
			} else {
				setDataTable([])
				setTotalPage(0)
			}
		} catch (error) {
		} finally {
			setIsLoading(false)
		}
	}

	function apiHandler() {
		if (router.asPath.includes('class=')) {
			if (router?.query?.class) {
				getData({
					...filters,
					studentId: is(StudentDetail).student ? parseInt(StudentDetail?.UserInformationId) : null,
					classId: parseInt(router?.query?.class + '')
				})
			}
		} else if (StudentDetail?.UserInformationId) {
			getData({ ...filters, studentId: parseInt(StudentDetail?.UserInformationId) })
		}
	}

	useEffect(() => {
		apiHandler()
	}, [StudentDetail, filters, router])

	const columns = [
		{
			title: 'Lớp',
			dataIndex: 'ClassName',
			render: (value, item, index) => {
				return <div className="min-w-[100px] text-[#1b73e8] font-[600]">{value}</div>
			}
		},
		{
			title: 'Tháng',
			dataIndex: 'Month',
			align: 'center',
			render: (value, item, index) => {
				return <div className="min-w-[50px] text-[#000] font-[600]">{value}</div>
			}
		},
		{
			title: 'Năm',
			dataIndex: 'Year',
			align: 'center',
			render: (value, item, index) => {
				return <div className="min-w-[50px] text-[#000] font-[600]">{value}</div>
			}
		},
		{
			title: 'Số tiền',
			dataIndex: 'Price',
			render: (value, item, index) => {
				return <div className="min-w-[50px] text-[#000] font-[600]">{parseToMoney(value || 0)}</div>
			}
		},
		{
			title: 'Trạng thái',
			dataIndex: 'Status',
			render: (status, data) => {
				if (status == 1) {
					return <p className="tag red">{data.StatusName}</p>
				}
				if (status == 2) {
					return <p className="tag blue">{data.StatusName}</p>
				}
				return <p className="tag yellow">{data.StatusName}</p>
			}
		},
		{
			title: 'Khởi tạo',
			dataIndex: 'ModifiedOn',
			render: (date: any, item) => {
				return (
					<div>
						<div className="font-weight-primary">{item?.CreatedBy}</div>
						<div>{moment(item?.CreatedOn).format('HH:mm DD/MM/YYYY')}</div>
					</div>
				)
			}
		},
		{
			title: '',
			dataIndex: 'Id',
			fixed: 'right',
			align: 'center',
			render: (date: any, item) => {
				return (
					<>
						<PrimaryTooltip id={`bill-${item?.Id}`} place="left" content="Xem chi tiết">
							<div
								onClick={() =>
									Router.push({
										pathname: '/finance/payment/',
										query: { bill: encode(item?.BillId) }
									})
								}
								className="p-[2px] cursor-pointer"
							>
								<RiBillLine size={22} className="text-[#1b73e8]" />
							</div>
						</PrimaryTooltip>
					</>
				)
			}
		}
	]

	const classColumns = [
		{
			title: 'Học viên',
			dataIndex: 'Code',
			render: (value, item) => (
				<div className="flex items-center">
					<div className="ml-[8px]">
						<div className="text-[16px] font-[600]">{item?.StudentName}</div>
						<div className="text-[14px] font-[400]">{item?.StudentCode}</div>
					</div>
				</div>
			)
		},
		{
			title: 'Tháng',
			dataIndex: 'Month',
			align: 'center',
			render: (value, item, index) => {
				return <div className="min-w-[50px] text-[#000] font-[600]">{value}</div>
			}
		},
		{
			title: 'Năm',
			dataIndex: 'Year',
			align: 'center',
			render: (value, item, index) => {
				return <div className="min-w-[50px] text-[#000] font-[600]">{value}</div>
			}
		},
		{
			title: 'Số tiền',
			dataIndex: 'Price',
			render: (value, item, index) => {
				return <div className="min-w-[50px] text-[#000] font-[600]">{parseToMoney(value || 0)}</div>
			}
		},
		{
			title: 'Trạng thái',
			dataIndex: 'Status',
			render: (status, data) => {
				if (status == 1) {
					return <p className="tag red">{data.StatusName}</p>
				}
				if (status == 2) {
					return <p className="tag blue">{data.StatusName}</p>
				}
				return <p className="tag yellow">{data.StatusName}</p>
			}
		},
		{
			title: 'Khởi tạo',
			dataIndex: 'ModifiedOn',
			render: (date: any, item) => {
				return (
					<div>
						<div className="font-weight-primary">{item?.CreatedBy}</div>
						<div>{moment(item?.CreatedOn).format('HH:mm DD/MM/YYYY')}</div>
					</div>
				)
			}
		},
		{
			title: '',
			dataIndex: 'Id',
			fixed: 'right',
			align: 'center',
			render: (date: any, item) => {
				return (
					<>
						<PrimaryTooltip id={`bill-${item?.Id}`} place="left" content="Xem chi tiết">
							<div
								onClick={() =>
									Router.push({
										pathname: '/finance/payment/',
										query: { bill: encode(item?.BillId) }
									})
								}
								className="p-[2px] cursor-pointer"
							>
								<RiBillLine size={22} className="text-[#1b73e8]" />
							</div>
						</PrimaryTooltip>
					</>
				)
			}
		}
	]

	const [loading, setLoading] = useState<boolean>(false)
	const postingTuition = async () => {
		setLoading(true)
		try {
			const res = await monthlyTuitionApi.add({
				ClassId: parseInt(router?.query?.class + ''),
				Month: filters.month,
				Year: filters.year
			})
			if (res.status == 200) {
				ShowNoti('success', 'Thành công')
				apiHandler()
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setLoading(false)
		}
	}

	const handleFilterMonth = (data) => {
		setValueDate(data)
		setFilters({
			...filters,
			pageIndex: 1,
			month: new Date(data).getMonth() + 1,
			year: new Date(data).getFullYear()
		})
	}

	return (
		<ExpandTable
			currentPage={filters?.pageIndex}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => setFilters({ ...filters, pageIndex: pageNumber })}
			loading={isLoading}
			dataSource={dataTable}
			columns={router.asPath.includes('class=') ? classColumns : columns}
			TitleCard={
				<div className="flex items-center w-full">
					<div className="flex-1">
						<DatePicker
							className="primary-input mr-[8px]"
							onChange={handleFilterMonth}
							picker="month"
							placeholder="Chọn tháng"
							value={valueDate}
							format="MM-YYYY"
						/>
					</div>

					{is(user).admin && router.asPath.includes('class=') && (
						<PrimaryButton onClick={postingTuition} loading={loading} type="button" background="blue" icon="send">
							Gửi học phí
						</PrimaryButton>
					)}
				</div>
			}
		/>
	)
}
