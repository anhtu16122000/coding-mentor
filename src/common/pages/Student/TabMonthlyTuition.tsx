import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { monthlyTuitionApi } from '~/api/user/monthly-tuition'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'

import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { RiBillLine } from 'react-icons/ri'
import { PrimaryTooltip } from '~/common/components'
import Router from 'next/router'
import { encode } from '~/common/utils/common'

export const TabMonthlyTuition = ({ StudentDetail }) => {
	const [filters, setFilters] = useState({ studentId: StudentDetail?.UserInformationId, pageIndex: 1, pageSize: PAGE_SIZE })
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
		if (StudentDetail?.UserInformationId) {
			getData(filters)
		}
	}, [StudentDetail, filters])

	// BillId: 1238
	// ClassId: 1075
	// ClassName: 'F8191'
	// CreatedBy: 'Nguyễn Chaos'
	// CreatedOn: '2023-09-26T17:51:20.347'
	// Enable: true
	// Id: 42
	// ModifiedBy: 'Nguyễn Chaos'
	// ModifiedOn: '2023-09-26T17:51:20.347'
	// Month: 9
	// Status: 2
	// StatusName: 'Đã thanh toán'
	// StudentCode: 'HV00069'
	// StudentId: 1292
	// StudentName: 'Bùi Thị Trang'
	// Year: 2023

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

	return (
		<ExpandTable
			currentPage={filters?.pageIndex}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => setFilters({ ...filters, pageIndex: pageNumber })}
			loading={isLoading}
			dataSource={dataTable}
			columns={columns}
			TitleCard={<div className="extra-table"></div>}
			Extra={<></>}
		/>
	)
}
