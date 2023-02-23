import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { tutoringFeeApi } from '~/api/tutoring-fee'
import CCSearch from '~/common/components/CCSearch'
import PrimaryTable from '~/common/components/Primary/Table'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import FilterTable from '~/common/utils/table-filter'
import { ModalSalaryTutoringConfigCRUD } from './ModalSalaryTutoringConfigCRUD'

let pageIndex = 1
export const SalaryTutoringConfigPage = () => {
	const initParameters = { fullName: '', userCode: '', pageIndex: 1, pageSize: PAGE_SIZE, search: '' }
	const [apiParameters, setApiParameters] = useState(initParameters)
	const [totalRow, setTotalRow] = useState(1)
	const [dataTable, setDataTable] = useState([])
	const [loading, setLoading] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)

	const getSalaryTutoringConfig = async (params) => {
		try {
			setLoading(true)
			const res = await tutoringFeeApi.getAll(params)
			if (res.status === 200) {
				setDataTable(res.data.data)
				setTotalRow(res.data.totalRow)
			}
			if (res.status === 204) {
				setDataTable([])
			}
		} catch (error) {
			setLoading(true)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (apiParameters) {
			getSalaryTutoringConfig(apiParameters)
		}
	}, [apiParameters])

	const columns = [
		{
			width: 160,
			title: 'Mã',
			dataIndex: 'TeacherCode',
			render: (text) => <p className="font-semibold">{text}</p>
		},
		{
			title: 'Họ tên',
			dataIndex: 'TeacherName',
			render: (text) => <p className="font-semibold text-[#1b73e8]">{text}</p>
		},
		{
			title: 'Mức lương',
			dataIndex: 'Fee',
			render: (text) => <>{Intl.NumberFormat('ja-JP').format(text)}</>
		},
		{
			title: 'Thêm lúc',
			dataIndex: 'CreatedOn',
			render: (date) => moment(date).format('DD/MM/YYYY')
		},
		{
			title: 'Chức năng',
			dataIndex: 'Action',
			render: (text, item) => {
				return (
					<div className="flex items-center">
						<ModalSalaryTutoringConfigCRUD mode="edit" onRefresh={() => getSalaryTutoringConfig(apiParameters)} dataRow={item} />
						<ModalSalaryTutoringConfigCRUD mode="delete" onRefresh={() => getSalaryTutoringConfig(apiParameters)} dataRow={item} />
					</div>
				)
			}
		}
	]

	const expandedRowRender = (data) => {
		return <>Ghi chú: {data?.Note}</>
	}

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
		<div className="salaryConfig-page-list">
			<ExpandTable
				currentPage={currentPage}
				totalPage={totalRow && totalRow}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={loading}
				TitleCard={
					<div className="extra-table">
						<div className="flex-1 max-w-[350px] mr-[16px]">
							<CCSearch onSubmit={(value) => setApiParameters({ ...apiParameters, search: value })} />
						</div>
					</div>
				}
				Extra={
					<>
						<ModalSalaryTutoringConfigCRUD mode="add" onRefresh={() => getSalaryTutoringConfig(apiParameters)} />
					</>
				}
				// addClass="basic-header"
				dataSource={dataTable}
				columns={columns}
				expandable={expandedRowRender}

				// isResetKey={isResetKey}
			/>
		</div>
	)
}
