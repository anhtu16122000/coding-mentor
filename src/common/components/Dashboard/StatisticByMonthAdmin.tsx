import { Card, Col, Row, Tooltip } from 'antd'
import React from 'react'
import { BiLineChart, BiLineChartDown } from 'react-icons/bi'
import { BsFillBookmarkPlusFill } from 'react-icons/bs'
import { MdOutlineAppRegistration } from 'react-icons/md'

const StatisticByMonthAdmin = (props) => {
	const { statisticGetInMonth } = props
	const styleCard = [
		{
			Icon: <MdOutlineAppRegistration className="ml-auto text-4xl" />
		},
		{
			Icon: <BsFillBookmarkPlusFill className="ml-auto text-4xl" />
		}
	]
	return (
		<Row gutter={24}>
			{statisticGetInMonth.map((statistic, index) => {
				const isTrendDown = statistic.Note.includes('Giảm')
				return (
					<Col className="mb-4" key={index} xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
						<Card bordered={false} className={`h-full ${isTrendDown ? `bg-[#fdecef]` : `bg-[#ecfdec]`}`}>
							<Row gutter={8}>
								<Col className="gutter-row" span={20}>
									<Tooltip placement="topLeft" title={`${statistic.Note}`}>
										<h3 className={`${isTrendDown ? `text-[#ab1d38]` : `text-[#1dab32]`} leading-7 font-medium py-2 text-lg`}>
											{statistic.Type}
										</h3>
									</Tooltip>
									<div className="flex items-center">
										<h2 className={`${isTrendDown ? `text-[#ab1d38]` : `text-[#1dab32]`} font-medium text-3xl`}>{statistic.Count}</h2>
										{isTrendDown ? (
											<BiLineChartDown className={`text-3xl text-[#ab1d38] ml-4`} />
										) : (
											<BiLineChart className={`text-3xl text-[#1dab32]  ml-4`} />
										)}
									</div>
								</Col>
								<Col className={`${isTrendDown ? `text-[#ab1d38]` : `text-[#1dab32]`} gutter-row`} span={4}>
									{styleCard[index].Icon}
								</Col>
							</Row>
						</Card>
					</Col>
				)
			})}
		</Row>
	)
}

export default StatisticByMonthAdmin
