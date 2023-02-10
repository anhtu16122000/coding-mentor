import React, { useEffect, useState } from 'react'
import { dashboardApi } from '~/api/dashboard'
import { Card, Col, Row } from 'antd'
import { RiArrowDownSLine } from 'react-icons/ri'

const onePercent = 4.21

function ItemFica({ params }) {
	const { item } = params

	const getColor = () => {
		return '#ecf4ff'
	}

	function getClass() {
		if (item?.Percent > 75) {
			return 'green'
		}
		if (item?.Percent > 50) {
			return 'yellow'
		}
		if (item?.Percent > 25) {
			return 'orange'
		}
		return 'red'
	}

	return (
		<Col className="gutter-row mb-4 min-h-[110px] size-pd-16" xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
			<Card bordered={false} className={`h-full`} style={{ backgroundColor: getColor() }}>
				<Row gutter={8}>
					<Col className="gutter-row" span={12}>
						<h2 className="text-[#1b73e8] font-[700] text-[20px] in-2-line">{item.Name}</h2>
						<h3 className={`text-[#1b73e8] font-medium text-lg leading-7 py-2 pb-1 ${getClass()}`}>
							Hoàn thành: {item?.Completed} / {item?.Lesson}
						</h3>
					</Col>
					<Col className="gutter-row inline-flex justify-end relative" span={12}>
						<div className="gauge-container">
							<svg className="gauge w-[80px] h-[80px]" viewBox="0 0 150 150">
								<circle className="rail" r="67" cx="75" cy="75" style={{ strokeDashoffset: 421 }} />
								<circle
									className={`progress ${getClass()}`}
									r="67"
									cx="75"
									cy="75"
									stroke-dasharray="420.97341558103227 420.97341558103227"
									style={{ strokeDashoffset: 421 - item?.Percent * onePercent }}
								/>
							</svg>
							<div className="w-[80px] h-[80px] absolute top-0 right-[4px] inline-flex items-center justify-center">
								<span className="text-[18px] text-[#1b73e8] font-[600] mt-[2px]">{parseInt(item?.Percent + '')}%</span>
							</div>
						</div>
					</Col>
				</Row>
			</Card>
		</Col>
	)
}

const LearningProgress = () => {
	const [data, setData] = useState([])

	useEffect(() => {
		getData()
	}, [])

	async function getData() {
		try {
			const response = await dashboardApi.getLearningDetails()
			if (response.status === 200) {
				setData(response.data.data)
			} else {
				setData([])
			}
		} catch (error) {}
	}

	const [show, setShow] = useState(false)

	return (
		<>
			{data.length > 0 && (
				<Card className="card-none-bottom" title={<h1 className="text-2xl font-medium">Tiến trình học</h1>}>
					<Row gutter={24}>
						{data.map((item, index) => {
							return (
								<>
									{index < 3 && !show && <ItemFica params={{ item: item, index: index }} />}
									{show && <ItemFica params={{ item: item, index: index }} />}
								</>
							)
						})}
					</Row>

					{data.length > 3 && (
						<div className="w-full inline-flex items-center justify-center none-selection">
							<div
								onClick={() => setShow(!show)}
								className="inline-flex flex-row items-center justify-center cursor-pointer text-[#205dcd] hover:text-[#387af5]"
							>
								<RiArrowDownSLine size={24} className={`duration-300 ${show && 'rotate-180'}`} />
								<span className="font-[500] duration-300">{show ? 'Ẩn bớt' : 'Xem thêm'}</span>
							</div>
						</div>
					)}
				</Card>
			)}
		</>
	)
}

export default LearningProgress
