import { Table } from 'antd'
import React, { useEffect, useState } from 'react'

const CourseVideoTable = (props) => {
	const [state, setState] = useState({ selectedRowKeys: [] })
	const [dataSource, setDataSource] = useState([])
	const [rowKeys, setRowKeys] = useState([{ currentPage: 1, listKeys: [] }])
	const [activeIndex, setActiveIndex] = useState(null)

	const selectRow = (record) => {
		const selectedRowKeys = []
		if (selectedRowKeys.indexOf(record.key) >= 0) {
			selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1)
		} else {
			selectedRowKeys.push(record.key)
		}
		setState({ selectedRowKeys })
	}

	const onSelectedRowKeysChange = (selectedRowKeys) => {
		setState({ selectedRowKeys })
	}

	const changePagination = (pageNumber, pageSize) => {
		if (!rowKeys.some((object) => object['currentPage'] == pageNumber)) {
			rowKeys.push({ currentPage: pageNumber, listKeys: [] })
		}
		setRowKeys([...rowKeys])
		if (typeof props.getPagination != 'undefined') {
			props.getPagination(pageNumber, pageSize)
		} else {
			return pageNumber
		}
	}

	const onShowSizeChange = (current, size) => {
		props.onChangePageSize && props.onChangePageSize(current, size)
	}

	const rowSelection = {
		selectedRowKeys: state.selectedRowKeys,
		onChange: onSelectedRowKeysChange,
		hideSelectAll: true
	}

	useEffect(() => {
		// if (props.TitlePage) {
		// 	getTitlePage(props.TitlePage)
		// }
		if (props.dataSource) {
			let dataClone = [...props.dataSource]
			dataClone.forEach((item, index) => {
				item.key = index.toString()
			})
			setDataSource(dataClone)
		}
	}, [props.dataSource])

	return (
		<>
			<div className="wrap-table table-expand">
				<Table
					loading={props.loading?.type == 'GET_ALL' && props.loading?.status}
					bordered={props.haveBorder ? props.haveBorder : false}
					scroll={{ x: 'max-content', y: window.innerHeight - 295 }}
					columns={props.columns}
					dataSource={dataSource}
					size="middle"
					pagination={{
						pageSize: 30,
						pageSizeOptions: ['30'],
						onShowSizeChange: onShowSizeChange,
						total: props.totalPage && props.totalPage,
						onChange: (pageNumber, pageSize) => changePagination(pageNumber, pageSize),
						current: props.currentPage && props.currentPage
					}}
					rowClassName={(record, index) =>
						index == activeIndex ? 'table-row-active' : index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
					}
					rowSelection={rowSelection}
					onRow={(record, index) => ({
						onClick: () => {
							selectRow(record)
							setActiveIndex(index)
						}
					})}
				/>
			</div>
		</>
	)
}

export default CourseVideoTable
