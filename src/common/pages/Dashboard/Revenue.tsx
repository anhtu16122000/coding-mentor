import { Card, DatePicker, DatePickerProps, Tooltip as AndTip } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { staticsticalApi } from '~/api/statistic'
import { _format, log } from '~/common/utils'
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, LabelList, YAxis } from 'recharts'
import { parseToMoney, wait } from '~/common/utils/common'
import { MdCompareArrows } from 'react-icons/md'
import { IoMdClose } from 'react-icons/io'

const CustomizedLabel = (props: any) => {
	const { x, y, stroke, value } = props

	return (
		<text x={x} y={y} fill={stroke} fontSize={10} textAnchor="middle" className="font-[600]">
			{parseToMoney(value)}đ
		</text>
	)
}

const CustomizedAxisTick = (props: any) => {
	const { x, y, payload } = props

	return (
		<g transform={`translate(${x},${y})`}>
			<text className="text-[12px] font-[500]" x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-40)">
				Th {payload.value}
			</text>
		</g>
	)
}

const RevenueChart = () => {
	const [data, setData] = useState([])

	const [filters, setFilters] = useState({
		branchIds: '',
		year: moment().year()
	})

	useEffect(() => {
		getData()
	}, [filters])

	const getData = async () => {
		try {
			const res = await staticsticalApi.getRevenue(filters)
			if (res.status == 200) {
				let temp = []

				res.data.data.forEach((item) => {
					temp.push({ name: `${item.Name}`, current: item.Value, prev: item?.PreValue })
				})

				setData(temp)
			} else {
				setData([])
			}
		} catch (error) {}
	}

	const onChange: DatePickerProps['onChange'] = (value) => {
		setFilters((pre) => ({ ...pre, year: Number(moment(value).format('YYYY')) }))
	}

	function getChartWidth() {
		const thisBody = document.getElementById('revenue-body')
		return thisBody ? thisBody?.offsetWidth : 0
	}

	const [masterVisible, setMasterVisible] = useState<boolean>(true)
	const [visible, setVisible] = useState<boolean>(false)

	useEffect(() => {
		makeSomeNoise()
	}, [visible])

	async function makeSomeNoise() {
		setMasterVisible(false)
		await wait(10)
		setMasterVisible(true)
	}

	const CustomTooltip: any = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-[#fff] p-[16px] rounded-[4px] shadow-md border-[#dadada] border-[1px]">
					<div className="text-[16px] font-[600]">Tháng {payload[0]?.payload?.name}</div>
					<p className="text-[14px] font-[500] text-[#1b73e8]">Doanh thu hiện tại: {parseToMoney(payload[0]?.payload?.current)}</p>
					{visible && (
						<p className="text-[14px] font-[500] text-[#f51d92]">Doanh thu năm trước: {parseToMoney(payload[0]?.payload?.prev)}</p>
					)}
				</div>
			)
		}
		return null
	}

	const formatYAxis = (tick) => {
		if (Math.abs(tick) >= 1000000) {
			return `${(tick / 1000000).toFixed(0)}M`
		}
		if (Math.abs(tick) >= 9000) {
			return `${(tick / 1000).toFixed(0)}K`
		}
		return tick
	}

	const yMin = Math.min(...data.map((item) => item.value))
	const yMax = Math.max(...data.map((item) => item.value))

	return (
		<Card
			className="mt-4 shadow-sm w3-animate-right min-h-[450px]"
			title={
				<div className="flex items-center justify-between w-full">
					<div className="font-[500] mt-[2px]">Biểu đồ doanh thu</div>

					<div className="flex items-center none-selection">
						<DatePicker
							defaultValue={moment(new Date())}
							onChange={onChange}
							picker="year"
							allowClear={false}
							className="primary-input w-[100px]"
						/>

						<AndTip placement="right" id="the-revenue" title={visible ? 'Bỏ so sánh' : 'So sánh với năm trước'}>
							{!visible ? (
								<div
									onClick={() => setVisible(!visible)}
									className="bg-[#1b73e8] hover:bg-[#1566cf] active:bg-[#1b73e8] cursor-pointer h-[36px] w-[36px] flex items-center justify-center rounded-[6px] ml-[8px] text-[#fff]"
								>
									<MdCompareArrows size={20} />
								</div>
							) : (
								<div
									onClick={() => setVisible(!visible)}
									className="bg-[#f51d92] hover:bg-[#e01983] active:bg-[#f51d92] cursor-pointer h-[36px] w-[36px] flex items-center justify-center rounded-[6px] ml-[8px] text-[#fff]"
								>
									<IoMdClose size={20} />
								</div>
							)}
						</AndTip>
					</div>
				</div>
			}
		>
			<div className="w-full fucking-chart" id="revenue-body">
				{masterVisible && (
					<LineChart
						width={getChartWidth()}
						height={400}
						data={[...data]}
						margin={{
							top: 20,
							right: 20,
							left: 0,
							bottom: 0
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" height={60} tick={<CustomizedAxisTick />} />
						<YAxis tickFormatter={formatYAxis} domain={[yMin, yMax]} />

						<Tooltip content={<CustomTooltip />} />

						<Line type="monotone" dataKey="current" stroke="#1b73e8" strokeWidth={1.5}>
							<LabelList content={<CustomizedLabel />} />
						</Line>

						{visible && (
							<Line type="monotone" dataKey="prev" stroke="#f51d92" strokeWidth={1.5}>
								<LabelList content={<CustomizedLabel />} />
							</Line>
						)}
					</LineChart>
				)}
			</div>
		</Card>
	)
}

export default RevenueChart
