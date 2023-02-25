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
export const TabDiscountHistory: React.FC<ITabBill> = ({ StudentDetail }) => {
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const initParameters = { studentIds: StudentDetail?.UserInformationId, pageIndex: 1, pageSize: PAGE_SIZE }
	const [apiParameters, setApiParameters] = useState(initParameters)
	const [totalRow, setTotalRow] = useState(1)
	const [dataTable, setDataTable] = useState([])
	const [currentPage, setCurrentPage] = useState(1)

	const getDiscountHistory = async (params) => {
		try {
			setIsLoading({ type: 'GET_ALL', status: true })
			const res = await billApi.getDiscountHistory(params)
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
			getDiscountHistory(apiParameters)
		}
	}, [StudentDetail])

	const columns = [
		{
			title: 'Mã khuyến mãi',
			width: 150,
			dataIndex: 'DiscountCode'
		},

		{
			title: 'Tiền khuyến mãi',
			width: 150,
			dataIndex: 'Reduced',
			render: (text) => <>{parseToMoney(text)}</>
		},

		{
			title: 'Loại',
			width: 150,
			dataIndex: 'TypeName'
		}
	]

	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber
		setCurrentPage(pageNumber)
		setApiParameters({
			...apiParameters,
			// ...listFieldSearch,
			pageIndex: pageIndex
		})
	}

	return (
		<>
			<ExpandTable
				currentPage={currentPage}
				totalPage={totalRow && totalRow}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={isLoading}
				// addClass="basic-header"
				dataSource={dataTable}
				columns={columns}
				// expandable={expandedRowRender}
				// isResetKey={isResetKey}
			/>
		</>
	)
}
