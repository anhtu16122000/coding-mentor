import React, { useEffect, useState } from 'react'
import { studentInClassApi } from '~/api/student-in-class'
import CCSearch from '~/common/components/CCSearch'
import PrimaryTable from '~/common/components/Primary/Table'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import PrimaryTag from '~/common/components/Primary/Tag'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'

let pageIndex = 1
export const StudentWarningPage = () => {
	const [loading, setLoading] = useState({ type: '', status: false })
	const initParameters = { warning: true, search: null, sortType: null, pageIndex: 1, pageSize: PAGE_SIZE }
	const [apiParameters, setApiParameters] = useState(initParameters)
	const [totalRow, setTotalRow] = useState(1)
	const [dataTable, setDataTable] = useState([])
	const [currentPage, setCurrentPage] = useState(1)
	const getStudentInClass = async (params) => {
		try {
			setLoading({ type: 'GET_ALL', status: true })
			const res = await studentInClassApi.getAll(params)
			if (res.status === 200) {
				setDataTable(res.data.data)
				setTotalRow(res.data.totalRow)
				setLoading({ type: 'GET_ALL', status: false })
			}
			if (res.status === 204) {
				setLoading({ type: 'GET_ALL', status: true })
				setDataTable([])
			}
		} catch (error) {
			setLoading({ type: 'GET_ALL', status: true })
		} finally {
			setLoading({ type: 'GET_ALL', status: false })
		}
	}

	useEffect(() => {
		if (apiParameters) {
			getStudentInClass(apiParameters)
		}
	}, [apiParameters])
	const columns = [
		{
			title: 'Mã',
			width: 100,
			dataIndex: 'UserCode'
		},
		{
			title: 'Tên học viên',
			width: 200,
			dataIndex: 'FullName',
			render: (text) => <p className="font-semibold text-[#1b73e8]">{text}</p>
		},
		{
			title: 'Số điện thoại',
			width: 150,
			dataIndex: 'Mobile'
		},
		{
			title: 'Email',
			width: 200,
			dataIndex: 'Email'
		},
		{
			title: 'Lớp',
			width: 200,
			dataIndex: 'ClassName'
		},
		{
			title: 'Loại',
			width: 150,
			dataIndex: 'TypeName',
			render: (text, item) => (
				<>
					<PrimaryTag color={item?.Type == 1 ? 'green' : 'red'} children={text} />
				</>
			)
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
		<>
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
				// addClass="basic-header"
				dataSource={dataTable}
				columns={columns}
				expandable={expandedRowRender}

				// isResetKey={isResetKey}
			/>
		</>
	)
}
