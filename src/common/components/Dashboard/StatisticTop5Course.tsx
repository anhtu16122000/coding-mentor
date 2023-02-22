import { useEffect, useState } from 'react'
import { Bar, CartesianGrid, ComposedChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const StatisticTop5Course = (props) => {
	const { data, titleBar } = props

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
			<ul className="relative top-[10px] text-center text-[#9194ce]">
				{payload.map((entry, index) => (
					<li key={`item-${index}`}>
						<span className="inline-block w-3 h-3 bg-[#9194ce] mr-2"></span>
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
					<Bar dataKey="Value" name={titleBar || 'Thông kê khóa học có nhiều sinh viên nhất'} barSize={20} fill="#9194ce" />
				</ComposedChart>
			</ResponsiveContainer>
		</>
	)
}

export default StatisticTop5Course
