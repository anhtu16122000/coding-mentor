import { Input } from 'antd'
import React, { useEffect, useState } from 'react'
import { studentInClassApi } from '~/api/student-in-class'
import CCSearch from '~/common/components/CCSearch'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import PrimaryTag from '~/common/components/Primary/Tag'
import { userInfoColumn } from '~/common/libs/columns/user-info'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'

let pageIndex = 1

const initParameters = {
	warning: true,
	search: null,
	sortType: null,
	pageIndex: 1,
	pageSize: PAGE_SIZE
}

export const StudentWarningPage = () => {
	const [loading, setLoading] = useState({ type: '', status: false })

	const [apiParameters, setApiParameters] = useState(initParameters)
	const [totalRow, setTotalRow] = useState(1)
	const [dataTable, setDataTable] = useState([])
	const [currentPage, setCurrentPage] = useState(1)

	const getStudentInClass = async (params) => {
		try {
			setLoading({ type: 'GET_ALL', status: true })
			const res = await studentInClassApi.getAll(params)
			if (res.status == 200) {
				setDataTable(res.data.data)
				setTotalRow(res.data.totalRow)
			}
			if (res.status == 204) {
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
		userInfoColumn,
		{
			title: 'Số điện thoại',
			dataIndex: 'Mobile'
		},
		{
			title: 'Email',
			dataIndex: 'Email'
		},
		{
			title: 'Lớp',
			dataIndex: 'ClassName'
		},
		{
			title: 'Loại',
			dataIndex: 'TypeName',
			render: (text, item) => (
				<>
					<PrimaryTag color={item?.Type == 1 ? 'green' : 'red'} children={text} />
				</>
			)
		}
	]

	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber
		setCurrentPage(pageNumber)
		setApiParameters({
			...apiParameters,
			pageIndex: pageIndex
		})
	}

	const expandedRowRender = (data) => {
		return <>Ghi chú: {data?.Note}</>
	}

	return (
		<>
			<ExpandTable
				currentPage={currentPage}
				totalPage={totalRow && totalRow}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={loading}
				TitleCard={
					<div className="flex-1">
						<Input.Search
							className="primary-search max-w-[250px]"
							onChange={(event) => {
								if (event.target.value == '') {
									setApiParameters({ ...apiParameters, pageIndex: 1, search: '' })
								}
							}}
							onSearch={(event) => setApiParameters({ ...apiParameters, pageIndex: 1, search: event })}
							placeholder="Tìm kiếm"
						/>
					</div>
				}
				dataSource={dataTable}
				columns={columns}
				expandable={expandedRowRender}
			/>
		</>
	)
}
