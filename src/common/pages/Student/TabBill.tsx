import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { billApi } from '~/api/bill'
import PrimaryTable from '~/common/components/Primary/Table'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { parseToMoney } from '~/common/utils/common'
import { BillDetail } from './BillDetail'

type ITabBill = {
	StudentDetail: IUserResponse
}

let pageIndex = 1
export const TabBill: React.FC<ITabBill> = ({ StudentDetail }) => {
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const initParameters = { studentIds: StudentDetail?.UserInformationId, pageIndex: 1, pageSize: PAGE_SIZE }
	const [apiParameters, setApiParameters] = useState(initParameters)
	const [totalRow, setTotalRow] = useState(1)
	const [dataTable, setDataTable] = useState([])
	const [currentPage, setCurrentPage] = useState(1)

	const getBill = async (params) => {
		try {
			setIsLoading({ type: 'GET_ALL', status: true })
			const res = await billApi.getAll(params)
			if (res.status === 200) {
				setDataTable(res.data.data)
				setTotalRow(res.data.totalRow)
				setIsLoading({ type: 'GET_ALL', status: false })
			}
			if (res.status === 204) {
				setIsLoading({ type: 'GET_ALL', status: true })
				setDataTable([])
			}
		} catch (error) {
			setIsLoading({ type: 'GET_ALL', status: true })
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}
	useEffect(() => {
		if (StudentDetail) {
			getBill(apiParameters)
		}
	}, [StudentDetail])

	const columns = [
		{
			title: 'Ngày tạo',
			width: 100,
			dataIndex: 'CreatedOn',
			render: (text) => <>{moment(text).format('DD/MM/YYYY')}</>
		},
		{
			title: 'Mã',
			width: 100,
			dataIndex: 'Code'
		},
		{
			title: 'Tổng thanh toán',
			width: 150,
			dataIndex: 'TotalPrice',
			render: (text) => <>{parseToMoney(text)}</>
		},
		{
			title: 'Giảm giá',
			width: 150,
			dataIndex: 'Reduced',
			render: (text) => <>{parseToMoney(text)}</>
		},
		{
			title: 'Đã thanh toán',
			width: 150,
			dataIndex: 'Paid',
			render: (text) => <>{parseToMoney(text)}</>
		},
		{
			title: 'Số tiền còn lại',
			width: 150,
			dataIndex: 'Debt',
			render: (text) => <>{parseToMoney(text)}</>
		},
		{
			title: 'Hình thức',
			width: 150,
			dataIndex: 'PaymentMethodName'
		},
		{
			title: 'Loại',
			width: 150,
			dataIndex: 'TypeName'
		},
		{
			title: 'Ngày hẹn thanh toán',
			width: 180,
			dataIndex: 'PaymentAppointmentDate',
			render: (text) => <>{text ? moment(text).format('DD/MM/YYYY') : ''}</>
		},
		{
			title: 'Ngày hoàn thành',
			width: 180,
			dataIndex: 'CompleteDate',
			render: (text) => <>{text ? moment(text).format('DD/MM/YYYY') : ''}</>
		}
	]

	const expandedRowRender = (data) => {
		return (
			<>
				<BillDetail dataRow={data} />
			</>
		)
	}
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber
		setCurrentPage(pageNumber)
		setApiParameters({ ...apiParameters, pageIndex: pageIndex })
	}

	return (
		<>
			<ExpandTable
				currentPage={currentPage}
				totalPage={totalRow && totalRow}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={isLoading}
				dataSource={dataTable}
				columns={columns}
				expandable={expandedRowRender}
			/>
		</>
	)
}
