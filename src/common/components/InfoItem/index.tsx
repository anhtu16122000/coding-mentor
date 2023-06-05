import React, { useEffect, useState } from 'react'

const InfoItem = (props: { title: string; value: any }) => {
	const { title, value } = props

	return (
		<div className="class-info-item">
			{title}: <div className="info-value">{value || ''}</div>
		</div>
	)
}

export function Counting(props) {
	const [count, setCount] = useState(0)

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (count < props.endValue) {
				setCount(count + 1)
			}
		}, 10)

		return () => clearInterval(intervalId)
	}, [count, props.endValue])

	return <>{count}</>
}

export default InfoItem
