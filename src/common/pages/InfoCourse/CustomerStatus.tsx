import { Popover } from 'antd'
import React, { useRef } from 'react'
import { TiArrowSortedDown } from 'react-icons/ti'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

const CustomerStatus = (props) => {
	const { item, onUpdate } = props

	const thisRef = useRef(null)

	const customerStatus = useSelector((state: RootState) => state.customerStatus.CustomerStatus)

	function getColor() {
		const thisIndex = customerStatus.findIndex((status) => status?.Id == item?.CustomerStatusId)

		if (thisIndex > -1) {
			return customerStatus[thisIndex]?.ColorCode
		}

		return ''
	}

	const content = (
		<div className="flex flex-col items-start cursor-pointer">
			{customerStatus
				.filter((thisItem) => thisItem?.Type == 2)
				.map((status, index) => {
					return (
						<div
							key={`slec-${index}`}
							onClick={() => {
								onUpdate(status?.Id, status?.Name)
								thisRef.current.close()
							}}
							className="px-[8px] py-[2px] rounded-[4px] in-1-line hover:opacity-90 font-[500]"
							style={{
								background: status?.ColorCode || '#c7c7c7',
								color: status?.ColorCode == '#FBC02D' || !status?.ColorCode ? '#000' : '#fff',
								marginTop: index == 0 ? 0 : 8
							}}
						>
							{status?.Name}
						</div>
					)
				})}
		</div>
	)

	return (
		<>
			<Popover
				ref={thisRef}
				content={content}
				title={null}
				className="cursor-pointer"
				trigger="click"
				placement="left"
				overlayClassName="show-arrow"
			>
				<div className="flex justify-start">
					<div
						className="px-[8px] py-[2px] rounded-[4px] hover:opacity-90 font-[500]"
						style={{ background: getColor() || '#c7c7c7', color: getColor() == '#FBC02D' || !getColor() ? '#000' : '#fff' }}
					>
						{item?.CustomerStatusName}
						<TiArrowSortedDown className="text-[14px] ml-[4px]" />
					</div>
				</div>
			</Popover>
		</>
	)
}

export default CustomerStatus
