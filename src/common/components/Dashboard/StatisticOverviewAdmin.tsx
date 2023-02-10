import { Card, Col, Row, Tooltip } from 'antd'
import React from 'react'
import { BsCalendarXFill, BsFillBookmarksFill } from 'react-icons/bs'
import { FiUsers } from 'react-icons/fi'
import { GiFamilyHouse, GiVikingLonghouse } from 'react-icons/gi'
import { MdList } from 'react-icons/md'

const StatisticOverviewAdmin = (props) => {
	const { statisticAll } = props
	const styleCard = [
		{
			background: '#1b73e8c4',
			Icon: <FiUsers className="ml-auto text-white text-4xl" />
		},
		{
			background: '#1b73e8c4',
			Icon: <MdList className="ml-auto text-white text-4xl" />
		},
		{
			background: '#1b73e8c4',
			Icon: <BsFillBookmarksFill className="ml-auto text-white text-4xl" />
		},
		{
			background: '#1b73e8c4',
			Icon: <GiFamilyHouse className="ml-auto text-white text-4xl" />
		},
		{
			background: '#1b73e8c4',
			Icon: <GiVikingLonghouse className="ml-auto text-white text-4xl" />
		},
		{
			background: '#1b73e8c4',
			Icon: <BsCalendarXFill className="ml-auto text-white text-4xl" />
		}
	]
	return (
		<Row gutter={24}>
			{statisticAll.map((statistic, index) => {
				return (
					<Col key={index} className="gutter-row mb-4 min-h-[102px] size-pd-16" xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
						<Card bordered={false} style={{ backgroundColor: `${styleCard[index].background}` }}>
							<Row gutter={8}>
								<Col className="gutter-row" span={20}>
									<h2 className="text-white font-medium text-3xl">{statistic.Count}</h2>
									<Tooltip placement="topLeft" title={`${statistic.Type}`}>
										<h3 className="leading-7 text-white font-medium py-2 text-lg">{statistic.Type}</h3>
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

export default StatisticOverviewAdmin
