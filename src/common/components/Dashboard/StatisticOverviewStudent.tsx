import { Card, Col, Row, Tooltip } from 'antd'
import React from 'react'
import { BiBookBookmark } from 'react-icons/bi'
import { BsBookFill, BsBookHalf, BsFillPatchQuestionFill } from 'react-icons/bs'
import { GiVikingLonghouse } from 'react-icons/gi'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

const StatisticOverviewStudent = (props) => {
	const { overviewStudent } = props

	const user = useSelector((state: RootState) => state.user.information)

	const styleCard = [
		{
			background: '#1b73e8c4',
 			Icon: <GiVikingLonghouse className="ml-auto text-white text-4xl" />
		},
		{
			background: '#1b73e8c4',
			Icon: <BsBookHalf className="ml-auto text-white text-4xl" />
		},
		{
			background: '#1b73e8c4',
			Icon: <BiBookBookmark className="ml-auto text-white text-4xl" />
		},
		{
			background: '#1b73e8c4',
			Icon: <BsBookFill className="ml-auto text-white text-4xl" />
		},
		{
			background: '#1b73e8c4',
			Icon: <BsFillPatchQuestionFill className="ml-auto text-white text-4xl" />
		}
	]

	return (
		<Row gutter={24}>
			{overviewStudent.map((statistic, index) => {
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
										<h3 className="text-white font-medium text-lg leading-7 py-2">{statistic.Type}</h3>
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

export default StatisticOverviewStudent
