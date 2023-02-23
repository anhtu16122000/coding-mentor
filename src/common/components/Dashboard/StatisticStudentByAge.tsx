import React, { useEffect, useState } from 'react'
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts'

const StatisticStudentByAge = (props) => {
	const { data, titleBar } = props
	const [hideXAxis, setHideXAxis] = useState(false)

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

	const renderLegend = (props) => {
		const { payload } = props
		return (
			<ul className="relative top-[10px] text-center text-[#f492a0]">
				{payload.map((entry, index) => (
					<li key={`item-${index}`}>
						<span className="inline-block w-3 h-3 bg-[#f492a0] mr-2"></span>
						{entry.value}
					</li>
				))}
			</ul>
		)
	}

	return (
		<>
			<ResponsiveContainer width="100%" height={280}>
				<ComposedChart width={500} height={300} data={data}>
					<CartesianGrid stroke="#f5f5f5" />
					{hideXAxis ? <XAxis hide dataKey="Name" /> : <XAxis dataKey="Name" />}
					<YAxis />
					<Tooltip />
					<Legend content={renderLegend} />
					<Bar dataKey="Value" name={titleBar || 'Thống kê độ tuổi của học viên'} barSize={20} fill="#f492a0" />
				</ComposedChart>
			</ResponsiveContainer>
		</>
	)
}

export default StatisticStudentByAge
