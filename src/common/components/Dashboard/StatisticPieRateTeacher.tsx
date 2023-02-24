import { useState } from 'react'
import { AiFillStar } from 'react-icons/ai'
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts'

const COLORS = ['#FD8A8A', '#EF8B43', '#D44141', '#0262DB', '#599F50']

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, Value }) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5
	const x = cx + radius * Math.cos(-midAngle * RADIAN)
	const y = cy + radius * Math.sin(-midAngle * RADIAN)

	return (
		<text className="text-[black]" x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
			{Value}
		</text>
	)
}

const renderActiveShape = (props) => {
	const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, Value, Name } = props
	const sin = Math.sin(-RADIAN * midAngle)
	const cos = Math.cos(-RADIAN * midAngle)
	const sx = cx + (outerRadius + 10) * cos
	const sy = cy + (outerRadius + 10) * sin
	const mx = cx + (outerRadius + 15) * cos
	const my = cy + (outerRadius + 30) * sin
	const ex = mx + (cos >= 0 ? 1 : -1) * 5
	const ey = my
	const textAnchor = cos >= 0 ? 'start' : 'end'

	return (
		<g>
			<text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
				{payload.name}
			</text>
			<Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
			<Sector
				cx={cx}
				cy={cy}
				startAngle={startAngle}
				endAngle={endAngle}
				innerRadius={outerRadius + 6}
				outerRadius={outerRadius + 10}
				fill={fill}
			/>
			<path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
			<circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
			<text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
				{` ${Name} sao`}
			</text>
			<text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
				{`(Đánh giá ${Value})`}
			</text>
		</g>
	)
}

const StatisticPieRateTeacher = (props) => {
	const [activeIndex, setActiveIndex] = useState(0)
	const { data } = props
	const onPieEnter = (_, index) => {
		setActiveIndex(index)
	}
	return (
		<PieChart width={550} height={400}>
			<Pie
				activeIndex={activeIndex}
				onMouseEnter={onPieEnter}
				data={data}
				cx="50%"
				cy="50%"
				activeShape={renderActiveShape}
				labelLine={false}
				label={renderCustomizedLabel}
				innerRadius={70}
				outerRadius={140}
				fill="#8884d8"
				dataKey="Valuenn"
			>
				{data.map((entry, index) => (
					<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
				))}
			</Pie>
		</PieChart>
	)
}

export default StatisticPieRateTeacher
