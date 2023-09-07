import React from 'react'
import { StylePaymentStatusContainer, StylePaymentStatusItem, StylePaymentStatusTotal } from './index.styled'
import { TabCompData } from './type'


type TabCompProps = {
	data: TabCompData[]
	selected: number
	handleSelected: (_value) => void
}

const TabComp = (props: TabCompProps) => {
	const { data, selected, handleSelected } = props
	return (
		<StylePaymentStatusContainer>
			{data?.map((_item) => (
				<StylePaymentStatusItem checked={_item.id === selected} onClick={() => handleSelected(_item.id)}>
					{_item.title} <StylePaymentStatusTotal> ({_item.value})</StylePaymentStatusTotal>
				</StylePaymentStatusItem>
			))}
		</StylePaymentStatusContainer>
	)
}

export default TabComp
