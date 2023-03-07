import { Card, Table } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import EmptyData from '../../EmptyData'
import Popup from './MenuContext'

const PrimaryTable: FC<IPrimaryTable> = (props) => {
	const { columns, children, TitleCard, Extra, className, loading, bordered } = props
	const { total, current, expand, data, onExpand, onChangePage, menuContext, pageSize } = props

	const [dataSource, setDataSource] = useState([])
	const [rowKeys, setRowKeys] = useState([{ currentPage: 1, listKeys: [] }])
	const [currentPage, setCurrentPage] = useState(1)
	const [rowActivated, setActive] = useState(null)
	const [popupContextMenu, setPopupContextMenu] = useState({ record: null, visible: false, x: 0, y: 0 })

	const changePagination = (pageNumber, pageSize) => {
		setCurrentPage(pageNumber)
		if (!rowKeys.some((object) => object['currentPage'] == pageNumber)) {
			rowKeys.push({ currentPage: pageNumber, listKeys: [] })
		}

		setRowKeys([...rowKeys])

		if (typeof onChangePage != 'undefined') {
			onChangePage(pageNumber, pageSize)
		} else {
			return pageNumber
		}
	}

	const onChangeExpand = (expandedRows) => {
		setActive(parseInt(expandedRows[expandedRows.length - 1]))

		if (rowKeys.some((object) => object['currentPage'] == currentPage)) {
			let index = rowKeys.findIndex((item) => item.currentPage == currentPage)
			rowKeys[index].listKeys = expandedRows
		}

		setRowKeys([...rowKeys])
	}

	const returnRowKeys = () => {
		let rowK = null

		if (rowKeys.some((object) => object['currentPage'] == currentPage)) {
			rowK = rowKeys.find((item) => item.currentPage === currentPage).listKeys
		} else {
			rowK = []
		}

		if (rowK.length > 1) {
			rowK.splice(rowK.length - 2, 1)
		}

		return rowK
	}

	const _expand = (expand, record) => {
		if (typeof onExpand != 'undefined') {
			onExpand(record)
		}
	}

	useEffect(() => {
		if (data) {
			let dataClone = JSON.parse(JSON.stringify(data))
			dataClone.forEach((item, index) => {
				item.key = index.toString()
			})
			setDataSource(dataClone)
		}
	}, [data])

	const getHeight = () => {
		const elmnt = document.getElementsByClassName('app-content')
		return elmnt.length > 0 ? elmnt[0]?.clientHeight - 300 : 600
	}

	return (
		<div className="wrap-table">
			<Card className={`${className && className}`} title={TitleCard} extra={Extra}>
				{children}
				{dataSource.length == 0 && <EmptyData loading={loading} />}
				{dataSource.length > 0 && (
					<>
						<Table
							loading={loading}
							bordered={bordered}
							scroll={{ x: 'max-content', y: window.innerHeight - 295 }}
							columns={columns}
							dataSource={dataSource}
							size="middle"
							pagination={{
								pageSize: pageSize || 30,
								pageSizeOptions: ['30'],
								total: total && total,
								current: current && current,
								showTotal: () => total && <div className="font-weight-black">Tổng cộng: {total}</div>,
								onChange: (pageNumber, pageSize) => changePagination(pageNumber, pageSize)
							}}
							rowClassName={(record, index) => (index == rowActivated ? 'active' : index % 2 === 0 ? 'row-light' : 'row-dark')}
							onRow={(record, index) => ({
								onContextMenu: (e) => {
									if (menuContext) {
										e.preventDefault()
										if (!popupContextMenu.visible) {
											document.addEventListener(`click`, function onClickOutside() {
												setPopupContextMenu({ ...popupContextMenu, visible: false })
												document.removeEventListener(`click`, onClickOutside)
											})
										}
										setPopupContextMenu({ ...popupContextMenu, record, visible: true, x: e.clientX, y: e.clientY })
									} else {
										return null
									}
								},
								onClick: () => setActive(index)
							})}
							expandable={rowKeys[0].listKeys.length > 0 && expand}
							expandedRowRender={!expand ? undefined : (record, index, indent, expaned) => (expaned ? expand : null)}
							onExpandedRowsChange={onChangeExpand}
							onExpand={_expand}
							expandedRowKeys={returnRowKeys()}
						/>
						{menuContext && <Popup {...popupContextMenu} menuContext={menuContext} />}
					</>
				)}
			</Card>
		</div>
	)
}

export default PrimaryTable
