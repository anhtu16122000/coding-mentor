import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { monthlyTuitionApi } from '~/api/user/monthly-tuition'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'

import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { RiBillLine } from 'react-icons/ri'
import { PrimaryTooltip } from '~/common/components'
import Router, { useRouter } from 'next/router'
import { encode, is } from '~/common/utils/common'

export const TabMonthlyTuition = ({ StudentDetail }) => {
	const router = useRouter()

	const [filters, setFilters] = useState({ pageIndex: 1, pageSize: PAGE_SIZE })
	const [dataTable, setDataTable] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [totalPage, setTotalPage] = useState(null)

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

	useEffect(() => {
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

	return (
		<ExpandTable
			currentPage={filters?.pageIndex}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => setFilters({ ...filters, pageIndex: pageNumber })}
			loading={isLoading}
			dataSource={dataTable}
			columns={router.asPath.includes('class=') ? classColumns : columns}
		/>
	)
}
