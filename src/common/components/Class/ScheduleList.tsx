import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { scheduleApi } from '~/api/schedule'

export const ScheduleList = () => {
	const router = useRouter()
	const initParameters = { classId: router.query.class }
	const [apiParameters, setApiParameters] = useState(initParameters)
	const [data, setData] = useState([])
	const [loading, setLoading] = useState(false)

	const getSchedule = async (params) => {
		try {
			setLoading(true)
			const res = await scheduleApi.getAll(params)
			if (res.status === 200) {
				setData(res.data.data)
			}
			if (res.status === 204) {
				setData([])
			}
		} catch (error) {
			setLoading(true)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (router?.query?.class) {
			getSchedule(apiParameters)
		}
	}, [router?.query?.class])

	return (
		<div className="ScheduleList">
			<div className="content">
				{data &&
					data?.length > 0 &&
					data?.map((item, index) => (
						<>
							<div className="schedule-item">
								<div className="top">{index + 1}</div>
								<div className="time">
									<div className="date">{moment(item?.StartTime).format('MM/DD')}</div>
									<div className="hour">
										{moment(item?.StartTime).format('HH:mm')} - {moment(item?.EndTime).format('HH:mm')}
									</div>
								</div>
							</div>
						</>
					))}
			</div>
		</div>
	)
}
