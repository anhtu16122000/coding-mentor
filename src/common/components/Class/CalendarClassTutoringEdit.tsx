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

const CalendarClassTutoringEdit = () => {
	const router = useRouter()
	const listCalendar = useSelector((state: RootState) => state.class.listCalendarEdit)
	const isEditSchedule = useSelector((state: RootState) => state.class.isEditSchedule)
	const paramsSchedule = useSelector((state: RootState) => state.class.paramsSchedule)
	const loadingCalendar = useSelector((state: RootState) => state.class.loadingCalendar)
	const infoClass = useSelector((state: RootState) => state.class.infoClass)
	const { slug } = router.query
	const [timeStamp, setTimeStamp] = useState(0)
	const thisCalendar = useRef(null)
	const [loadingCheckTeacher, setLoadingCheckTeacher] = useState(false)
	const dispatch = useDispatch()
	const [dataTutoring, setDataTutoring] = useState(null)

	const getTutoring = async () => {
		try {
			const res = await classApi.getClassTutoringCurriculum()
			if (res.status === 200) {
				console.log(res)

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
			getTutoring()
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

	const handleEventDrop = async (eventDropInfo) => {
		if (moment(eventDropInfo.event.start).format() >= moment(eventDropInfo.event.end).format()) {
			ShowNoti('error', 'Lịch học không hợp lệ')
		} else {
			dispatch(setLoadingCalendar(true))
			const checkExistSchedule = listCalendar.find((item) => {
				return (
					(moment(item.StartTime).format() === moment(eventDropInfo.event.start).format() ||
						moment(item.EndTime).format() === moment(eventDropInfo.event.end).format() ||
						(moment(item.EndTime).format() > moment(eventDropInfo.event.start).format() &&
							moment(item.EndTime).format() <= moment(eventDropInfo.event.end).format()) ||
						(moment(item.StartTime).format() > moment(eventDropInfo.event.start).format() &&
							moment(item.StartTime).format() < moment(eventDropInfo.event.end).format())) &&
					item.IdSchedule !== eventDropInfo.event.extendedProps.IdSchedule
				)
			})
			if (!checkExistSchedule) {
				const listTeacher = await checkTeacherAvailable({
					scheduleId: eventDropInfo.event.extendedProps.IdSchedule,
					branchId: infoClass?.BranchId,
					curriculumId: infoClass?.CurriculumId,
					startTime: moment(eventDropInfo.event.start).format(),
					endTime: moment(eventDropInfo.event.end).format()
				})
				let checkRoom = null
				if (!!eventDropInfo.event.extendedProps.RoomId) {
					const listRoom = await checkRoomAvailable({
						scheduleId: eventDropInfo.event.extendedProps.IdSchedule,
						branchId: infoClass?.BranchId,
						startTime: moment(eventDropInfo.event.start).format(),
						endTime: moment(eventDropInfo.event.end).format()
					})
					checkRoom = listRoom.find((item) => item.RoomId === eventDropInfo.event.extendedProps.RoomId)
					if (!!checkRoom && !checkRoom?.Fit) {
						dispatch(
							setPrevScheduleEdit({
								...eventDropInfo.oldEvent.extendedProps,
								start: moment(eventDropInfo.oldEvent.start).format(),
								end: moment(eventDropInfo.oldEvent.end).format(),
								title: eventDropInfo.oldEvent.title
							})
						)
						dispatch(setShowModalEdit({ open: true, id: eventDropInfo.event.extendedProps.IdSchedule }))
						ShowNoti('error', checkRoom.Note)
						dispatch(setLoadingCalendar(false))
					}
				}

				const checkTeacher = listTeacher.find((item) => item.TeacherId === eventDropInfo.event.extendedProps.TeacherId)
				if (!!checkTeacher && !checkTeacher?.Fit) {
					dispatch(
						setPrevScheduleEdit({
							...eventDropInfo.oldEvent.extendedProps,
							start: moment(eventDropInfo.oldEvent.start).format(),
							end: moment(eventDropInfo.oldEvent.end).format(),
							title: eventDropInfo.oldEvent.title
						})
					)
					dispatch(setShowModalEdit({ open: true, id: eventDropInfo.event.extendedProps.IdSchedule }))
					ShowNoti('error', checkTeacher.Note)
					dispatch(setLoadingCalendar(false))
				}

				if (!checkTeacher || !checkRoom) {
					dispatch(
						setPrevScheduleEdit({
							...eventDropInfo.oldEvent.extendedProps,
							start: moment(eventDropInfo.oldEvent.start).format(),
							end: moment(eventDropInfo.oldEvent.end).format(),
							title: eventDropInfo.oldEvent.title
						})
					)
					dispatch(setShowModalEdit({ open: true, id: eventDropInfo.event.extendedProps.IdSchedule }))
					ShowNoti('error', !!checkTeacher ? 'Phòng học không tồn tại' : 'Giáo viên không tồn tại')
					dispatch(setLoadingCalendar(false))
				} else if (parseInt(infoClass?.Type?.toString()) == 1 && !!checkTeacher && !!checkTeacher?.Fit && !!checkRoom && !!checkRoom?.Fit) {
					handleUpdateSchedule(eventDropInfo)
				} else if (parseInt(infoClass?.Type?.toString()) == 2 && !!checkTeacher && !!checkTeacher?.Fit) {
					handleUpdateSchedule(eventDropInfo)
				}
			} else {
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
				ShowNoti('error', 'Buổi học này đã bị trùng lịch')
				dispatch(setLoadingCalendar(false))
			}
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
						<ModalAddScheduleToturingEdit
							checkTeacherAvailable={checkTeacherAvailable}
							checkRoomAvailable={checkRoomAvailable}
							getListSchedule={getListSchedule}
							paramsSchedule={paramsSchedule}
							loadingCheckTeacher={loadingCheckTeacher}
						/>
					</>
				}
				title={
					<>
						<div className="custom-show-tutoring-curriculum">
							<div className="item">
								Buổi học:{' '}
								<span>
									{dataTutoring?.Booked}/{dataTutoring?.Lesson}
								</span>
							</div>
							<div className="item">
								Thời gian: <span>{dataTutoring?.Time}/buổi</span>
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
						droppable={true}
						selectable={true}
						selectMirror={true}
						editable={isEditSchedule}
						weekends={true}
						events={listCalendar}
						eventsSet={(data) => setTimeStamp(new Date().getTime())}
						eventChange={(data) => {}}
						datesSet={(data) => {
							getListSchedule({ from: moment(data.start).format(), to: moment(data.end).format(), classId: slug })
							dispatch(setParamsSchedule({ from: moment(data.start).format(), to: moment(data.end).format(), classId: slug }))
						}}
						locale="vi"
						headerToolbar={{ start: 'prev today next', center: 'title', end: 'dayGridMonth,timeGridWeek,timeGridDay' }}
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
						eventDrop={(eventDropInfo) => {
							handleEventDrop(eventDropInfo)
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
