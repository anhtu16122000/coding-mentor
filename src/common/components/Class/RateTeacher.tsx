import { Card, Rate, Select, Spin, Timeline } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FcClock } from 'react-icons/fc'
import { GiRoundStar } from 'react-icons/gi'
import { scheduleApi } from '~/api/schedule'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import PrimaryTag from '../Primary/Tag'

export const RateTeacher = () => {
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const initParametersSchedule = { classId: router.query.class }
	const [apiParametersSchedule, setApiParametersSchedule] = useState(initParametersSchedule)
	const [dataTable, setDataTable] = useState([])
	const getSchedule = async (params) => {
		try {
			setLoading(true)
			const res = await scheduleApi.getAll(params)
			if (res.status === 200) {
				setDataTable(res?.data?.data)
				setLoading(false)
			}
			if (res.status === 204) {
				setLoading(true)
				setDataTable([])
			}
		} catch (error) {
			setLoading(true)
		} finally {
			setLoading(false)
		}
	}

	const handleChangeRate = (data) => {
		alert('đang làm....')
	}
	console.log(dataTable)

	useEffect(() => {
		if (router?.query?.class) {
			getSchedule(apiParametersSchedule)
		}
	}, [router?.query?.class])
	return (
		<>
			<Card title="Đánh giá giáo viên">
				<Spin spinning={loading}>
					<Timeline mode="left">
						{dataTable &&
							dataTable?.length > 0 &&
							dataTable?.map((item, index) => (
								<Timeline.Item
									label={`[${moment(item?.StartTime).format('MM/DD')}] ${moment(item?.StartTime).format('HH:mm')} - ${moment(
										item?.EndTime
									).format('HH:mm')}`}
									key={index}
									dot={<FcClock />}
								>
									<div className="flex justify-between">
										<div>
											<PrimaryTag
												color={
													item?.StatusTutoring == 1
														? 'blue'
														: item?.StatusTutoring == 2
														? 'red'
														: item?.StatusTutoring == 3
														? 'green'
														: item?.StatusTutoring == 4
														? 'yellow'
														: item?.StatusTutoring == 5
														? 'disabled'
														: item?.StatusTutoring == 6
														? 'orange'
														: 'black'
												}
												children={item?.StatusTutoringName}
											/>
											<div className="mb-2 mt-2">
												{item?.TeacherName} - {item?.TeacherCode}
											</div>
											<div>
												<Rate
													defaultValue={item.RateTeacher}
													value={item.RateTeacher}
													onChange={() => handleChangeRate(item)}
													className="text-tw-yellow group-hover:cursor-pointer"
												/>
											</div>
										</div>
									</div>
								</Timeline.Item>
							))}
					</Timeline>
				</Spin>
			</Card>
		</>
	)
}
