import { Card, Col, Row, Tooltip } from 'antd'
import React from 'react'
import { BsCalendarXFill } from 'react-icons/bs'
import { FiUsers } from 'react-icons/fi'
import { GiFamilyHouse, GiVideoConference, GiVikingLonghouse } from 'react-icons/gi'

const StatisticOverviewTeacher = (props) => {
	const { overviewTeacher } = props
	const styleCard = [
		{
			background: '#1b73e8c4',
			Icon: <FiUsers className="ml-auto text-white text-4xl" />
		},
		{
			background: '#1b73e8c4',
			Icon: <GiVikingLonghouse className="ml-auto text-white text-4xl" />
		},
		{
			background: '#1b73e8c4',
			Icon: <GiFamilyHouse className="ml-auto text-white text-4xl" />
		},
		{
			background: '#1b73e8c4',
			Icon: <BsCalendarXFill className="ml-auto text-white text-4xl" />
		},
		{
			background: '#1b73e8c4',
			Icon: <GiVideoConference className="ml-auto text-white text-4xl" />
		}
	]
	return (
		<Row gutter={24}>
			{overviewTeacher.map((statistic, index) => {
				return (
					<Col className="gutter-row mb-4 min-h-[110px] size-pd-16" xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
						<Card
							bordered={false}
							style={{ backgroundColor: `${styleCard[index].background}` }}
							className={`shadow-[0_8px_30px_rgb(0,0,0,0.12)] h-full`}
						>
							<Row gutter={8}>
								<Col className="gutter-row" span={20}>
									<h2 className="text-white font-medium text-3xl">{statistic.Count}</h2>
									<Tooltip placement="topLeft" title={`${statistic.Type}`}>
										<h3 className="text-white font-medium text-lg py-2 leading-7">{statistic.Type}</h3>
									</Tooltip>
								</Col>
								<Col className="gutter-row" span={4}>
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

export default StatisticOverviewTeacher
