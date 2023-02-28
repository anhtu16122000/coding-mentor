import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Card } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { scheduleApi } from '~/api/schedule'
import { ShowNoti } from '~/common/utils'
import moment from 'moment'
import { classApi } from '~/api/class'
import { useDispatch } from 'react-redux'
import Lottie from 'react-lottie-player'

import loadingJson from '~/common/components/json/loading-calendar.json'
import { setBreadcrumb } from '~/store/globalState'
import ScheduleCalendar from '../Schedule/ScheduleCalendar'
import ScheduleCalendarClass from '../Schedule/ScheduleCalendarClass'

const CalenderClassTeacher = () => {
	const router = useRouter()
	const [listSchedule, setListSchedule] = useState([])
	const [paramsSearch, setParamsSearch] = useState({ teacherIds: '', branchIds: '', from: null, to: null })
	const [infoClass, setInfoClass] = useState<IClass>()
	const [isLoading, setIsLoading] = useState(false)
	const { slug } = router.query
	const [timeStamp, setTimeStamp] = useState(0)
	const thisCalendar = useRef(null)
	const dispatch = useDispatch()

	const getClassId = async () => {
		try {
			const res = await classApi.getByID(slug)
			if (res.status === 200) {
				setInfoClass(res.data.data)
				dispatch(setBreadcrumb({ name: res.data.data.Name }))
			}
			if (res.status === 204) {
				setInfoClass(null)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	useEffect(() => {
		if (!!slug) {
			getClassId()
		}
	}, [slug])

	const getAllSchedule = async (params) => {
		setIsLoading(true)
		try {
			const res = await scheduleApi.getAll(params)
			if (res.status === 200) {
				const newListSchedule = res.data.data.map((item, index) => {
					return {
						...item,
						start: moment(item.StartTime).format(),
						end: moment(item.EndTime).format(),
						title: `${moment(item.StartTime).format()} - ${moment(item.EndTime).format()}`
					}
				})
				setListSchedule(newListSchedule)
			}
			if (res.status === 204) {
				setListSchedule([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (!!paramsSearch.from && !!paramsSearch.to) {
			getAllSchedule(paramsSearch)
		}
	}, [paramsSearch])

	return (
		<div className="wrapper-calendar">
			<Card className="card-calendar" extra={null}>
				{!!slug ? (
					<FullCalendar
						ref={thisCalendar}
						plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
						initialView="dayGridMonth"
						droppable={true}
						selectable={true}
						selectMirror={true}
						weekends={true}
						events={listSchedule}
						eventsSet={(data) => {
							setTimeStamp(new Date().getTime())
						}}
						eventChange={(data) => {
							console.log('DATA: ', data)
						}}
						datesSet={(data) => {
							let DATA_GET = {
								...paramsSearch,
								from: moment(data.start).format(),
								to: moment(data.end).format()
							}
							setParamsSearch(DATA_GET)
						}}
						locale="vi"
						headerToolbar={{
							start: 'prev today next',
							center: 'title',
							end: 'dayGridMonth,timeGridWeek'
						}}
						buttonText={{
							today: 'Hôm nay',
							month: 'Tháng',
							week: 'Tuần',
							day: 'Ngày'
						}}
						allDaySlot={false}
						titleFormat={{ month: 'numeric', year: 'numeric', day: 'numeric' }}
						dayHeaderFormat={{ weekday: 'long' }}
						firstDay={1}
						eventContent={(eventInfo) => <ScheduleCalendarClass dataRow={eventInfo} />}
					/>
				) : null}
			</Card>
			{isLoading && (
				<div className="overlay-calendar">
					<Lottie loop animationData={loadingJson} play className="w-52" />
				</div>
			)}
		</div>
	)
}

export default CalenderClassTeacher
