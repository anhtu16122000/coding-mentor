import moment from 'moment'
import React, { useState } from 'react'
import PrimaryTable from '../Primary/Table'
import ExpandTable from '../Primary/Table/ExpandTable'
import PrimaryTag from '../Primary/Tag'

let pageIndex = 1
export const ListFeedback = (props) => {
	const { totalFeedback, dataTable, setTodo, initialFeedback, todo } = props
	const [currentPage, setCurrentPage] = useState(1)
	const columns = [
		{
			title: 'Ngày gửi',
			dataIndex: 'CreatedOn',
			render: (text) => <>{moment(text).format('DD-MM-YYYY')}</>
		},
		{
			title: 'Loại phản hồi',
			dataIndex: 'Title'
		},
		{
			title: 'Trạng thái',
			dataIndex: 'Status',
			render: (text, item) => (
				<>
					<PrimaryTag color={text == 1 ? 'blue' : text == 2 ? 'blue' : 'green'} children={item.StatusName} />
				</>
			)
		}
	]

	const expandedRowRender = (data) => {
		return <>Nội dung: {data?.Content}</>
	}

	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber
		setCurrentPage(pageNumber)
		setTodo({
			...todo,
			// ...listFieldSearch,
			pageIndex: pageIndex
		})
	}
	return (
		<>
			<ExpandTable
				currentPage={currentPage}
				totalPage={totalFeedback && totalFeedback}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				dataSource={dataTable}
				columns={columns}
				TitleCard={<h1 className="text-2xl font-medium">Danh sách phản hồi</h1>}
				expandable={expandedRowRender}
			/>
		</>
	)
}
