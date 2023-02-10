import React, { FC } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'

type TPrimaryTooltip = {
	id: string | number
	children: React.ReactNode
	content: string
	place: 'top' | 'bottom' | 'left' | 'right'
}

const PrimaryTooltip: FC<TPrimaryTooltip> = (props) => {
	const { id, children, content, place } = props

	return (
		<>
			<div id={id + '' || ''}>{children}</div>
			<ReactTooltip anchorId={`${id}`} place={place} content={content || ''} />
		</>
	)
}

export default PrimaryTooltip
