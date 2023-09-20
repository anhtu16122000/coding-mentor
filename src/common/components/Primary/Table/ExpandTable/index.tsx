import { Card, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { GiPayMoney, GiReceiveMoney, GiTakeMyMoney } from 'react-icons/gi'
import EmptyData from '~/common/components/EmptyData'
import { _format, log } from '~/common/utils'

const ExpandTable = (props) => {
	const [state, setState] = useState({ selectedRowKeys: [] })
	const [dataSource, setDataSource] = useState([])
	const [rowKeys, setRowKeys] = useState([{ currentPage: 1, listKeys: [] }])
	const [activeIndex, setActiveIndex] = useState(null)

	const closeAllExpandFunc = () => {
		setRowKeys([{ currentPage: 1, listKeys: [] }])
	}

	const selectRow = (record) => {
		const selectedRowKeys = []
		if (selectedRowKeys.indexOf(record.key) >= 0) {
			selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1)
		} else {
			selectedRowKeys.push(record.key)
		}
		setState({ selectedRowKeys })
	}

	const onSelectedRowKeysChange = (selectedRowKeys, selectRow) => {
		props?.onSelectRow(selectRow) && props?.onSelectRow(selectRow)
		setState({ selectedRowKeys })
	}

	const changePagination = (pageNumber, pageSize) => {
		if (!rowKeys.some((object) => object['currentPage'] == pageNumber)) {
			rowKeys.push({
				currentPage: pageNumber,
				listKeys: []
			})
		}
		setRowKeys([...rowKeys])
		if (typeof props?.getPagination != 'undefined') {
			props?.getPagination(pageNumber, pageSize)
		} else {
			return pageNumber
		}
	}

	const onExpand = (expand, record) => {
		if (typeof props?.handleExpand != 'undefined') {
			props?.handleExpand(record)
		}
	}

	const onShowSizeChange = (current, size) => {
		props?.onChangePageSize && props?.onChangePageSize(current, size)
	}

	const rowSelection = {
		selectedRowKeys: state?.selectedRowKeys,
		onChange: onSelectedRowKeysChange,
		hideSelectAll: false
	}

	useEffect(() => {
		if (props?.dataSource && props?.dataSource.length > 0) {
			let dataClone = [...props?.dataSource]

			dataClone.forEach((item, index) => {
				dataClone[index] = { ...item, key: index + '' }
			})

			setDataSource(dataClone)
		} else {
			setDataSource([])
		}
	}, [props?.dataSource])

	useEffect(() => {
		if (props?.closeAllExpand) {
			closeAllExpandFunc()
		}
	}, [props?.closeAllExpand])

	useEffect(() => {
		if (props?.isResetKey) {
			setState({ selectedRowKeys: [] })
		}
	}, [props?.isResetKey])

	const renderStatistical = () => {
		return (
			<div className="statistical-contain">
				<div className="item total-income">
					<div className="text">
						<div className="name">Tổng nợ</div>
						<div className="number">{_format.numberToPrice(props?.sumPrice?.sumDebt || 0)}₫</div>
					</div>
					<div className="icon">
						<GiReceiveMoney />
					</div>
				</div>

				<div className="item total-expense">
					<div className="text">
						<p className="name">Tổng thanh toán</p>
						<p className="number">{_format.numberToPrice(props?.sumPrice.sumPaid || 0)}₫</p>
					</div>
					<div className="icon">
						<GiPayMoney />
					</div>
				</div>

				<div className="item total-revenue">
					<div className="text">
						<p className="name">Tổng tiền</p>
						<p className="number">{_format.numberToPrice(props?.sumPrice.sumtotalPrice || 0)}₫</p>
					</div>
					<div className="icon">
						<GiTakeMyMoney />
					</div>
				</div>
			</div>
		)
	}

	const tempHeight = props?.height || window?.innerHeight - 295
	const realHeight = tempHeight < 300 ? 300 : tempHeight

	// console.log('---- CHẠY TỚI HÀM RENDER')

	return (
		<>
			<div className="wrap-table table-expand">
				<Card
					className={`cardRadius ${props?.addClass && props?.addClass} ${props?.Size ? props?.Size : ''}`}
					extra={props?.Extra}
					title={props?.TitleCard}
					style={props?.cardStyle}
				>
					{props?.children}

					{!!props?.sumPrice && renderStatistical()}

					{dataSource.length == 0 && <EmptyData loading={props?.loading?.status || props?.loading == true} />}

					{dataSource.length > 0 && (
						<Table
							loading={(props?.loading?.type == 'GET_ALL' && props?.loading?.status) || props?.loading == true}
							bordered={props?.haveBorder ? props?.haveBorder : false}
							scroll={{ x: 'max-content', y: realHeight || 200 }}
							columns={props?.columns || []}
							dataSource={dataSource || []}
							size="middle"
							onChange={!!props?.onChange ? props?.onChange : () => {}}
							pagination={{
								pageSize: 30,
								pageSizeOptions: ['30'],
								onShowSizeChange: onShowSizeChange,
								total: !!props?.totalPage ? props?.totalPage : 1,
								showTotal: () => <div className="font-weight-black">Tổng cộng: {props?.totalPage || 1}</div>,
								onChange: (pageNumber, pageSize) => changePagination(pageNumber, pageSize),
								current: props?.currentPage && props?.currentPage
							}}
							rowClassName={(record, index) =>
								index == activeIndex ? 'table-row-active' : index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
							}
							onRow={(record, index) => ({
								onClick: () => {
									selectRow(record)
									setActiveIndex(index)
								}
							})}
							rowSelection={props?.isSelect ? rowSelection : null}
							onExpand={onExpand}
							expandable={{
								expandedRowRender: props?.expandable,
								rowExpandable: (record) => record.name !== 'Not Expandable'
							}}
						/>
					)}
				</Card>
			</div>
		</>
	)
}

export default ExpandTable
