import React, { useEffect, useState } from 'react'
import {
	Area,
	AreaChart,
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'

export const StatisticRateTeacher = (props) => {
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
			<ul className={` relative top-[10px] text-center ${type == 1 ? 'text-[#0262DB]' : 'text-[#D44141]'}`}>
				{payload.map((entry, index) => (
					<li key={`item-${index}`}>
						<span className={`inline-block w-3 h-3 ${type == 1 ? 'bg-[#0262DB]' : 'bg-[#D44141]'} mr-2`}></span>
						{entry.value}
					</li>
				))}
			</ul>
		)
	}
	return (
		<>
			<ResponsiveContainer width="100%" height={400}>
				{/* <LineChart width={500} height={500} data={data}>
					<CartesianGrid stroke="#f5f5f5" />
					{hideXAxis ? <XAxis hide dataKey="Name" /> : <XAxis dataKey="Name" />}
					<YAxis />
					<Tooltip />
					<Legend content={renderLegend} />
					<Line
						type="monotone"
						name={titleBar || 'Thông kê khóa học có nhiều sinh viên nhất'}
						dataKey="Value"
						stroke={type == 1 ? '#0262DB' : '#D44141'}
					/>
				</LineChart> */}
				<AreaChart
					width={500}
					height={400}
					data={data}
					margin={{
						top: 10,
						right: 30,
						left: 0,
						bottom: 0
					}}
				>
					<CartesianGrid stroke="#f5f5f5" />
					{hideXAxis ? <XAxis hide dataKey="Name" /> : <XAxis dataKey="Name" />}
					<YAxis />
					<Tooltip />
					<Legend content={renderLegend} />
					<Area
						type="monotone"
						name={titleBar || 'Thông kê khóa học có nhiều sinh viên nhất'}
						dataKey="Value"
						stroke={type == 1 ? '#0262DB' : '#D44141'}
						fill={type == 1 ? '#0262DB' : '#D44141'}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</>
	)
}
