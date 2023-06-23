import React from 'react'
import { useSelector } from 'react-redux'
import { classApi } from '~/api/class'
import FilterBase from '~/common/components/Elements/FilterBase'
import { RootState } from '~/store'

const ClassFilter = (props) => {
	const { filter, total, dataFilter, onFilter, onReset, onChangeTab } = props

	const statusData = useSelector((state: RootState) => state.class.statusData)

	return (
		<div className="flex items-center w3-animate-left">
			<div className="list-action-table">
				<FilterBase dataFilter={dataFilter} handleFilter={onFilter} handleReset={onReset} />
			</div>

			<div className="class-status-button none-selection max-w-[40vw] scrollable-h none-scrollbar text-[14px]">
				<div onClick={() => onChangeTab(null)} className={`item ${!filter?.status ? 'active' : ''}`}>
					Tất cả ({statusData?.closing + statusData?.upcoming + statusData?.opening})
				</div>
				<div onClick={() => onChangeTab(1)} className={`item ${filter?.status == 1 ? 'active' : ''}`}>
					Sắp diễn ra ({statusData?.upcoming})
				</div>
				<div onClick={() => onChangeTab(2)} className={`item  ${filter?.status == 2 ? 'active' : ''}`}>
					Đang diễn ra ({statusData?.opening})
				</div>
				<div onClick={() => onChangeTab(3)} className={`item  ${filter?.status == 3 ? 'active' : ''}`}>
					Kết thúc ({statusData?.closing})
				</div>
			</div>
		</div>
	)
}

export default ClassFilter
