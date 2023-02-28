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
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import {
	setDataChangeScheduleEdit,
	setIsEditSchedule,
	setListCalendarEdit,
	setPrevScheduleEdit,
	setRoomEdit,
	setShowModalEdit,
	setTeacherEdit,
	setLoadingCalendar,
	setParamsSchedule,
	setInfoClass
} from '~/store/classReducer'
import Lottie from 'react-lottie-player'

import loadingJson from '~/common/components/json/loading-calendar.json'
import { setBreadcrumb } from '~/store/globalState'
import PrimaryButton from '~/common/components/Primary/Button'
import { scheduleAvailableApi } from '~/api/schedule-available'
import ModalAddScheduleAvailableEdit from './ModalAddScheduleAvailableEdit'
import ChangeScheduleAvailableClassEdit from './ChangeScheduleAvailableClassEdit'

const TeacherOpenCalendarPage = () => {
	const router = useRouter()
	const listCalendar = useSelector((state: RootState) => state.class.listCalendarEdit)
	const isEditSchedule = useSelector((state: RootState) => state.class.isEditSchedule)
	const paramsSchedule = useSelector((state: RootState) => state.class.paramsSchedule)
	const loadingCalendar = useSelector((state: RootState) => state.class.loadingCalendar)
	const { slug } = router.query
	const [timeStamp, setTimeStamp] = useState(0)
	const thisCalendar = useRef(null)
	const user = useSelector((state: RootState) => state.user.information)
	const dispatch = useDispatch()

	const getClassId = async () => {
		try {
			const res = await classApi.getByID(slug)
			if (res.status === 200) {
				dispatch(setInfoClass(res.data.data))
				dispatch(setBreadcrumb({ name: res.data.data.Name }))
			}
			if (res.status === 204) {
				dispatch(setInfoClass(null))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	useEffect(() => {
		dispatch(setIsEditSchedule(false))
	}, [])

	useEffect(() => {
		if (!!slug) {
			getClassId()
		}
	}, [slug])

	const getListSchedule = async (params) => {
		try {
			const res = await scheduleAvailableApi.getAll(params)
			if (res.status === 200) {
				// dispatch(setDataChangeScheduleEdit({ CurriculumId: infoClass?.CurriculumId, BranchId: infoClass?.BranchId }))
				const newListCalendar = res.data.data.map((item, index) => {
					return {
						...item,
						IdSchedule: item.Id,
						id: item.Id,
						Id: index,
						title: `${moment(item.StartTime).format('HH:mm')} - ${moment(item.EndTime).format('HH:mm')}`,
						start: item.StartTime,
						end: item.EndTime
					}
				})
				dispatch(setListCalendarEdit(newListCalendar))
			}
			if (res.status === 204) {
				dispatch(setListCalendarEdit([]))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const handleUpdateSchedule = async (eventDropInfo) => {
		try {
			let DATA_SUBMIT = {
				RoomId: eventDropInfo.event.extendedProps.RoomId,
				StartTime: moment(eventDropInfo.event.start).format(),
				EndTime: moment(eventDropInfo.event.end).format(),
				TeacherId: eventDropInfo.event.extendedProps.TeacherId,
				Id: eventDropInfo.event.extendedProps.IdSchedule
			}
			const res = await scheduleApi.update(DATA_SUBMIT)
			if (res.status === 200) {
				getListSchedule(paramsSchedule)
				ShowNoti('success', res.data.message)
			}
		} catch (err) {
			const newListCalendar = [...listCalendar]
			newListCalendar[eventDropInfo.oldEvent.extendedProps.Id] = {
				...newListCalendar[eventDropInfo.oldEvent.extendedProps.Id],
				StartTime: moment(eventDropInfo.oldEvent.start).format(),
				EndTime: moment(eventDropInfo.oldEvent.end).format(),
				end: moment(eventDropInfo.oldEvent.end).format(),
				start: moment(eventDropInfo.oldEvent.start).format(),
				title: `${moment(eventDropInfo.oldEvent.start).format('HH:mm')} - ${moment(eventDropInfo.oldEvent.end).format('HH:mm')}`
			}
			dispatch(setListCalendarEdit(newListCalendar))
			ShowNoti('error', err.message)
		} finally {
			setTimeout(() => {
				dispatch(setLoadingCalendar(false))
			}, 500)
		}
	}

	return (
		<div className="wrapper-calendar">
			<Card
				className="card-calendar"
				extra={
					<>
						<PrimaryButton background="yellow" type="button" icon="edit" onClick={() => dispatch(setIsEditSchedule(!isEditSchedule))}>
							{isEditSchedule ? 'Hủy' : 'Chỉnh sửa'}
						</PrimaryButton>
						<ModalAddScheduleAvailableEdit getListSchedule={getListSchedule} paramsSchedule={paramsSchedule} />
					</>
				}
			>
				<FullCalendar
					ref={thisCalendar}
					plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
					initialView="dayGridMonth"
					droppable={true}
					selectable={true}
					selectMirror={true}
					editable={isEditSchedule}
					weekends={true}
					events={listCalendar}
					eventsSet={(data) => {
						setTimeStamp(new Date().getTime())
					}}
					eventChange={(data) => {
						console.log('DATA: ', data)
					}}
					datesSet={(data) => {
						getListSchedule({ from: moment(data.start).format(), to: moment(data.end).format() })
						dispatch(setParamsSchedule({ from: moment(data.start).format(), to: moment(data.end).format() }))
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
					eventContent={(eventInfo) => <ChangeScheduleAvailableClassEdit dataRow={eventInfo} getListSchedule={getListSchedule} />}
					eventClick={(eventClickInfo) => {
						dispatch(
							setPrevScheduleEdit({
								...eventClickInfo.event.extendedProps,
								start: moment(eventClickInfo.event.start).format(),
								end: moment(eventClickInfo.event.end).format(),
								title: eventClickInfo.event.title
							})
						)
					}}
				/>
			</Card>
			{loadingCalendar && (
				<div className="overlay-calendar">
					<Lottie loop animationData={loadingJson} play className="w-52" />
				</div>
			)}
		</div>
	)
}

export default TeacherOpenCalendarPage
