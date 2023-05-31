import React from 'react'

const ProClassInfoItem = (props) => {
	const { title, value } = props

	return (
		<div className="class-info-item">
			{title}: <div className="info-value">{value || ''}</div>
		</div>
	)
}

export default ProClassInfoItem
