import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

const COLORS = ['#FD8A8A', '#FFD4B2', '#A8D1D1', '#9EA1D4', '#FF8042']

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5
	const x = cx + radius * Math.cos(-midAngle * RADIAN)
	const y = cy + radius * Math.sin(-midAngle * RADIAN)

	return (
		<text className="text-[black]" x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	)
}

const StatisticPie = (props) => {
	const { data } = props

	return (
		<PieChart width={600} height={300}>
			<Pie data={data} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={140} fill="#8884d8" dataKey="Value">
				{data.map((entry, index) => (
					<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
				))}
			</Pie>
		</PieChart>
	)
}

export default StatisticPie
