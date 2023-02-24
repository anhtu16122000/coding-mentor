import React from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts'
import { _format } from '~/common/utils'

const StatisticPositiveAndNegativeChart = (props) => {
	const { data, titleBar } = props

	return (
		<ResponsiveContainer width="100%" height={280}>
			<BarChart
				width={500}
				height={300}
				data={data}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="Name" />
				<YAxis />
				<Tooltip />
				<Legend />
				<ReferenceLine y={0} stroke="#000" />
				<Bar dataKey="Value" name={titleBar || 'Thông kê khóa học có nhiều sinh viên nhất'} fill="#599F50" />
			</BarChart>
		</ResponsiveContainer>
	)
}

export default StatisticPositiveAndNegativeChart
