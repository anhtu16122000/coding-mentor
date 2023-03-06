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
import PrimaryButton from '../Primary/Button'
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
import ModalAddScheduleToturingEdit from './ModalAddScheduleToturingEdit'
import ChangeScheduleClassTutoringEdit from './ChangeScheduleClassTutoringEdit'
import PrimaryTag from '../Primary/Tag'

const CalendarClassTutoringEdit = () => {
	const router = useRouter()
	const user = useSelector((state: RootState) => state.user.information)
	const listCalendar = useSelector((state: RootState) => state.class.listCalendarEdit)
	const isEditSchedule = useSelector((state: RootState) => state.class.isEditSchedule)
	const paramsSchedule = useSelector((state: RootState) => state.class.paramsSchedule)
	const loadingCalendar = useSelector((state: RootState) => state.class.loadingCalendar)
	const infoClass = useSelector((state: RootState) => state.class.infoClass)
	const { class: slug } = router.query
	const [timeStamp, setTimeStamp] = useState(0)
	const thisCalendar = useRef(null)
	const [loadingCheckTeacher, setLoadingCheckTeacher] = useState(false)
	const dispatch = useDispatch()
	const [dataTutoring, setDataTutoring] = useState(null)
	const [teacherData, setTeacherData] = useState([])
	const [totalPage, setTotalPage] = useState(0)

	function isSaler() {
		return user?.RoleId == 5
	}
	const getTutoring = async (classId) => {
		try {
			const res = await classApi.getClassTutoringCurriculum({ classId })
			if (res.status === 200) {
				setDataTutoring(res?.data?.data)
			}
			if (res.status === 204) {
				setDataTutoring(null)
			}
		} catch (error) {
			console.log(error)
		}
	}
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
			getTutoring(slug)
			getClassId()
		}
	}, [slug])

	const getListSchedule = async (params) => {
		try {
			const res = await scheduleApi.getAll(params)
			if (res.status === 200) {
				dispatch(setDataChangeScheduleEdit({ CurriculumId: infoClass?.CurriculumId, BranchId: infoClass?.BranchId }))
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
				getTutoring(slug)
			}
			if (res.status === 204) {
				dispatch(setListCalendarEdit([]))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const checkTeacherAvailable = async (params) => {
		try {
			setLoadingCheckTeacher(true)
			const res = await classApi.checkTeacherTutoringAvailable(params)
			if (res.status === 200) {
				dispatch(setTeacherEdit(res.data.data))
				setTeacherData(res.data.data)
				setTotalPage(res.data.totalRow)
				setLoadingCheckTeacher(false)
				return res.data.data
			}
			if (res.status === 204) {
				setLoadingCheckTeacher(true)
				dispatch(setTeacherEdit([]))
			}
		} catch (err) {
			setLoadingCheckTeacher(true)
			ShowNoti('error', err.message)
		} finally {
			setLoadingCheckTeacher(false)
		}
	}

	const checkRoomAvailable = async (params) => {
		try {
			const res = await classApi.checkRoomAvailable(params)
			if (res.status === 200) {
				dispatch(setRoomEdit(res.data.data))
				return res.data.data
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
						{user?.RoleId == 3 || user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7 ? (
							<>
								<PrimaryButton background="yellow" type="button" icon="edit" onClick={() => dispatch(setIsEditSchedule(!isEditSchedule))}>
									{isEditSchedule ? 'Hủy' : 'Chỉnh sửa'}
								</PrimaryButton>
								<ModalAddScheduleToturingEdit
									checkTeacherAvailable={checkTeacherAvailable}
									checkRoomAvailable={checkRoomAvailable}
									getListSchedule={getListSchedule}
									paramsSchedule={paramsSchedule}
									loadingCheckTeacher={loadingCheckTeacher}
									teacherData={teacherData}
									setTeacherData={setTeacherData}
									totalPage={totalPage}
								/>
							</>
						) : (
							''
						)}
					</>
				}
				title={
					<>
						<div className="custom-show-tutoring-curriculum">
							<div className="item">
								Đã đặt:{' '}
								<PrimaryTag
									color="disabled"
									children={`${dataTutoring?.Booked ? dataTutoring?.Booked : 0}/${dataTutoring?.Lesson ? dataTutoring?.Lesson : 0} buổi`}
								/>
							</div>
							<div className="item">
								Thời gian: <span className="text-tw-red font-semibold">{dataTutoring?.Time ? dataTutoring?.Time : 0} </span>phút/buổi
							</div>
						</div>
					</>
				}
			>
				{!!slug ? (
					<FullCalendar
						ref={thisCalendar}
						plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
						initialView="dayGridMonth"
						droppable={false}
						selectable={true}
						selectMirror={true}
						editable={false}
						weekends={true}
						events={listCalendar}
						eventsSet={(data) => setTimeStamp(new Date().getTime())}
						eventChange={(data) => {}}
						datesSet={(data) => {
							getListSchedule({ from: moment(data.start).format(), to: moment(data.end).format(), classId: slug })
							dispatch(setParamsSchedule({ from: moment(data.start).format(), to: moment(data.end).format(), classId: slug }))
						}}
						locale="vi"
						headerToolbar={{ start: 'prev today next', center: 'title', end: 'dayGridMonth,timeGridWeek' }}
						buttonText={{ today: 'Hôm nay', month: 'Tháng', week: 'Tuần', day: 'Ngày' }}
						allDaySlot={false}
						titleFormat={{ month: 'numeric', year: 'numeric', day: 'numeric' }}
						dayHeaderFormat={{ weekday: 'long' }}
						firstDay={1}
						eventContent={(eventInfo) => (
							<ChangeScheduleClassTutoringEdit
								dataRow={eventInfo}
								checkTeacherAvailable={checkTeacherAvailable}
								checkRoomAvailable={checkRoomAvailable}
								getListSchedule={getListSchedule}
								loadingCheckTeacher={loadingCheckTeacher}
							/>
						)}
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
				) : null}

				<div className=" flex items-center flex-wrap mt-[24px]">
					<div className="flex items-center">
						<div className="bg-[#0a89ff] w-[20px] h-[20px] rounded-[4px] mr-[8px]"></div>
						<span>Mới đặt</span>
					</div>
					<div className="flex items-center">
						<div className="bg-[#C94A4F] w-[20px] h-[20px] rounded-[4px] mr-[8px] ml-[20px]"></div>
						<span>Hủy</span>
					</div>
					<div className="flex items-center">
						<div className="bg-[#59b96c] w-[20px] h-[20px] rounded-[4px] mr-[8px] ml-[20px]"></div>
						<span>Đã học</span>
					</div>
					<div className="flex items-center">
						<div className="bg-[#FFBA0A] w-[20px] h-[20px] rounded-[4px] mr-[8px] ml-[20px]"></div>
						<span>Giáo viên vắng mặt</span>
					</div>
					<div className="flex items-center">
						<div className="bg-[#a2a2a2] w-[20px] h-[20px] rounded-[4px] mr-[8px] ml-[20px]"></div>
						<span>Sự cố kỹ thuật</span>
					</div>
					<div className="flex items-center">
						<div className="bg-[#ff7c38] w-[20px] h-[20px] rounded-[4px] mr-[8px] ml-[20px]"></div>
						<span>Giáo viên vào trễ</span>
					</div>
					<div className="flex items-center">
						<div className="bg-[#000] w-[20px] h-[20px] rounded-[4px] mr-[8px] ml-[20px]"></div>
						<span>Học viên vắng mặt</span>
					</div>
				</div>
			</Card>

			{loadingCalendar && (
				<div className="overlay-calendar">
					<Lottie loop animationData={loadingJson} play className="w-52" />
				</div>
			)}
		</div>
	)
}

export default CalendarClassTutoringEdit
