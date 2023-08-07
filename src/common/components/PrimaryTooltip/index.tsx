import React, { FC } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'

type TPrimaryTooltip = {
	id: string | number
	children: React.ReactNode
	content: string
	place: 'top' | 'bottom' | 'left' | 'right'
	className?: string
}

const PrimaryTooltip: FC<TPrimaryTooltip> = (props) => {
	const { id, children, content, place, className } = props

	return (
		<>
			<div className={className || '' + 'none-selection'} data-tooltip-id={'cc-tip-' + id + '' || ''}>
				{children}
			</div>
			<ReactTooltip id={`cc-tip-${id}`} place={place} content={content || ''} />
		</>
	)
}

export default PrimaryTooltip
