import React, { FC } from 'react'

const ContextItem: FC<{ Icon: React.ReactNode; title: string; onClick?: Function }> = ({ Icon, title, onClick }) => {
	return (
		<div
			onClick={(e) => {
				!!onClick && onClick(e)
			}}
			className="curriculum-detail-context-item"
		>
			{Icon}
			<div className="curriculum-detail-ct-item-title">{title}</div>
		</div>
	)
}

export default ContextItem
