import { Card } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import MainLayout from '~/common/components/MainLayout'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { ShowNoti } from '~/common/utils'
import { scheduleApi } from '~/api/schedule'
import { branchApi } from '~/api/branch'
import { useDispatch } from 'react-redux'
import { setBranch } from '~/store/branchReducer'
import moment from 'moment'
import ScheduleCalendar from '~/common/components/Schedule/ScheduleCalendar'
import PopoverSearch from '~/common/components/Schedule/PopoverSearch'
import Lottie from 'react-lottie-player'

import loadingJson from '~/common/components/json/loading-calendar.json'
import { userInformationApi } from '~/api/user'

const Schedule = () => {
	const thisCalendar = useRef(null)
	const branch = useSelector((state: RootState) => state.branch.Branch)
	const [teachers, setTeachers] = useState([])
	const [listSchedule, setListSchedule] = useState([])
	const [timeStamp, setTimeStamp] = useState(0)
	const [isLoading, setIsLoading] = useState(false)
	const [paramsSearch, setParamsSearch] = useState({ teacherIds: '', branchIds: '', from: null, to: null })
	const dispatch = useDispatch()
	const user = useSelector((state: RootState) => state.user.information)

	const getAllTeacher = async () => {
		try {
			const ROLE_TEACHER = 2
			const res = await userInformationApi.getByRole(ROLE_TEACHER)
			if (res.status === 200) {
				setTeachers(res.data.data)
			}
			if (res.status === 204) {
				setTeachers([])
			}
		} catch (err) {
			ShowNoti('error', err)
		}
	}

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

	const getAllBranch = async () => {
		try {
			let res = await branchApi.getAll()
			if (res.status == 200) {
				dispatch(setBranch(res.data.data))
			}
			if (res.status == 204) {
				dispatch(setBranch([]))
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	useEffect(() => {
		if (isAdmin() || isManager() || isAcademic()) {
			getAllTeacher()
		}
	}, [])

	useEffect(() => {
		if ((isAdmin() || isManager() || isAcademic()) && branch.length === 0) {
			getAllBranch()
		}
	}, [branch])

	useEffect(() => {
		if (!!paramsSearch.from && !!paramsSearch.to) {
			getAllSchedule(paramsSearch)
		}
	}, [paramsSearch])

	const userInformation = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return userInformation?.RoleId == 1
	}

	function isTeacher() {
		return userInformation?.RoleId == 2
	}

	function isManager() {
		return userInformation?.RoleId == 4
	}

	function isStdent() {
		return userInformation?.RoleId == 3
	}

	function isAcademic() {
		return userInformation?.RoleId == 7
	}

	return (
		<div className="wrapper-class-schedule wrapper-calendar">
			<Card
				extra={
					(isAdmin() || isManager() || isAcademic()) && (
						<PopoverSearch setParamsSearch={setParamsSearch} teachers={teachers} isLoading={isLoading} />
					)
				}
			>
				<FullCalendar
					ref={thisCalendar}
					plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
					initialView="dayGridMonth"
					droppable={true}
					selectable={true}
					selectMirror={true}
					weekends={true}
					events={listSchedule}
					eventsSet={(data) => setTimeStamp(new Date().getTime())}
					eventChange={(data) => console.log('DATA: ', data)}
					datesSet={(data) => {
						let DATA_GET = { ...paramsSearch, from: moment(data.start).format(), to: moment(data.end).format() }
						setParamsSearch(DATA_GET)
					}}
					locale="vi"
					headerToolbar={{ start: 'prev today next', center: 'title', end: 'dayGridMonth,timeGridWeek' }}
					buttonText={{ today: 'Hôm nay', month: 'Tháng', week: 'Tuần', day: 'Ngày' }}
					allDaySlot={false}
					titleFormat={{ month: 'numeric', year: 'numeric', day: 'numeric' }}
					dayHeaderFormat={{ weekday: 'long' }}
					firstDay={1}
					eventContent={(eventInfo) => <ScheduleCalendar dataRow={eventInfo} onRefresh={getAllSchedule} />}
				/>

				<div className="wrapper-status">
					<div className="wrapper-tag">
						<div className="bg-[#fb862d] w-[20px] h-[20px] rounded-[4px] mr-[8px]"></div>
						<span>Chưa học</span>
					</div>
					<div className="wrapper-tag">
						<div className="bg-[#59b96c] w-[20px] h-[20px] rounded-[4px] mr-[8px] ml-[8px]"></div>
						<span>Đã học</span>
					</div>
				</div>

				{isLoading && (
					<div className="overlay-calendar">
						<Lottie loop animationData={loadingJson} play className="w-52" />
					</div>
				)}
			</Card>
		</div>
	)
}

Schedule.Layout = MainLayout
export default Schedule
