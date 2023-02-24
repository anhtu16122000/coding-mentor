import React, { useEffect, useState } from 'react'
import { AreaChart, CartesianGrid, ComposedChart, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export const StatisticClassNew = (props) => {
	const { data, titleBar, type } = props
	const [hideXAxis, setHideXAxis] = useState(false)

	const renderLegend = (props) => {
		const { payload } = props

		useEffect(() => {
			window.addEventListener('resize', (e) => {
				const element = e.target as Window
				if (element.innerWidth < 1380) {
					setHideXAxis(true)
				} else {
					setHideXAxis(false)
				}
			})
		}, [])

		return (
			<ul className={` relative top-[10px] text-center ${type == 1 ? 'text-[#9194ce]' : 'text-[#D44141]'}`}>
				{payload.map((entry, index) => (
					<li key={`item-${index}`}>
						<span className={`inline-block w-3 h-3 ${type == 1 ? 'bg-[#9194ce]' : 'bg-[#D44141]'} mr-2`}></span>
						{entry.value}
					</li>
				))}
			</ul>
		)
	}
	return (
		<>
			<ResponsiveContainer width="100%" height={280}>
				<LineChart width={500} height={500} data={data}>
					<CartesianGrid stroke="#f5f5f5" />
					{hideXAxis ? <XAxis hide dataKey="Name" /> : <XAxis dataKey="Name" />}
					<YAxis />
					<Tooltip />
					<Legend content={renderLegend} />
					<Line
						type="monotone"
						name={titleBar || 'Thông kê khóa học có nhiều sinh viên nhất'}
						dataKey="Value"
						stroke={type == 1 ? '#8884d8' : '#D44141'}
					/>
				</LineChart>
			</ResponsiveContainer>
		</>
	)
}
