import React, { FC } from 'react'
import htmlParser from '~/common/components/HtmlParser'

type TGroupContent = {
	is: any
	curGroup: any
}

const GroupContent: FC<TGroupContent> = (props) => {
	const { is, curGroup } = props

	return (
		<>
			{!is.typing && !is.drag && <div className="mb-[16px]">{htmlParser(curGroup?.Content)}</div>}

			{(is.drag || is.typing) && (
				<div className="typing-drag-23-content">
					<div className="mb-[16px]">{htmlParser(curGroup?.Content)}</div>
				</div>
			)}
		</>
	)
}

export default GroupContent
