import React from 'react'
import FilterBase from '~/common/components/Elements/FilterBase'

const ClassFilter = (props) => {
	const { filter, total, dataFilter, onFilter, onReset, onChangeTab } = props

	return (
		<>
			<div className="list-action-table">
				<FilterBase dataFilter={dataFilter} handleFilter={onFilter} handleReset={onReset} />
			</div>
			<div className="class-status-button none-selection">
				<div onClick={() => onChangeTab(null)} className={`item ${!filter?.status ? 'active' : ''}`}>
					Tất cả
				</div>
				<div onClick={() => onChangeTab(1)} className={`item ${filter?.status == 1 ? 'active' : ''}`}>
					Sắp diễn ra
				</div>
				<div onClick={() => onChangeTab(2)} className={`item  ${filter?.status == 2 ? 'active' : ''}`}>
					Đang diễn ra
				</div>
				<div onClick={() => onChangeTab(3)} className={`item  ${filter?.status == 3 ? 'active' : ''}`}>
					Kết thúc
				</div>
			</div>
		</>
	)
}

export default ClassFilter
