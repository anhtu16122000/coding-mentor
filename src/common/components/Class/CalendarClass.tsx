import { Card, Popover } from 'antd'
import moment from 'moment'
import React, { useRef, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { classApi } from '~/api/class'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '../Primary/Button'
import CreateClassForm from './CreateClassForm'
import ModalReviewScheduleClass from './ModalReviewScheduleClass'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ChangeScheduleClass from './ChangeScheduleClass'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '~/store'
import { parseSelectArray } from '~/common/utils/common'
import {
	setDataChangeSchedule,
	setListCalendar,
	setLoadingCalendar,
	setPrevSchedule,
	setRoom,
	setShowModal,
	setTeacher
} from '~/store/classReducer'
import Lottie from 'react-lottie-player'

import loadingJson from '~/common/components/json/loading-calendar.json'
import ModalAddSchedule from './ModalAddSchedule'

const CalenderClass = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [timeStamp, setTimeStamp] = useState(0)
	const refPopoverWrapperBtn = useRef(null)
	const dataChangeSchedule = useSelector((state: RootState) => state.class.dataChangeSchedule)
	const listCalendar = useSelector((state: RootState) => state.class.listCalendar)
	const loadingCalendar = useSelector((state: RootState) => state.class.loadingCalendar)
	const thisCalendar = useRef(null)
	const dispatch = useDispatch()

	const getAllTeacherByBranchAndProgram = async (branchId, programId) => {
		setIsLoading(true)
		try {
			const res = await classApi.getAllTeacherWhenCreate({ branchId: branchId, programId: programId })
			if (res.status == 200) {
				const convertData = parseSelectArray(res.data.data, 'TeacherName', 'TeacherId')
				dispatch(setTeacher(convertData))
			}
			if (res.status == 204) {
				dispatch(setTeacher([]))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	const checkTeacherAvailable = async (params) => {
		try {
			const res = await classApi.checkTeacherAvailable(params)
			if (res.status === 200) {
				dispatch(setTeacher(res.data.data))
				return res.data.data
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const checkRoomAvailable = async (params) => {
		try {
			const res = await classApi.checkRoomAvailable(params)
			if (res.status == 200) {
				dispatch(setRoom(res.data.data))
				return res.data.data
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const onSubmit = async (data) => {
		setIsLoading(true)
		try {
			let dataDispatch = { ...data, StartDay: moment(data.StartDay).format() }

			dispatch(setDataChangeSchedule(dataDispatch))

			const res = await classApi.createLesson(data)
			if (res.status === 200) {
				ShowNoti('success', res.data?.message)

				thisCalendar.current.calendar.gotoDate(moment(res.data.data[0].StartTime).format())

				if (res.data.data.length > 0) {
					const newListCalendar = res.data.data.map((item, index) => {
						return {
							...item,
							Id: index,
							title: `${moment(item.StartTime).format('HH:mm')} - ${moment(item.EndTime).format('HH:mm')}`,
							start: item.StartTime,
							end: item.EndTime,
							TeachingFee: data?.TeachingFee
						}
					})
					dispatch(setListCalendar(newListCalendar))
				}
				return res
			}
			if (res.status === 204) {
				dispatch(setListCalendar([]))
				return res
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	const handleCreateClass = async () => {
		setIsLoading(true)
		const DATA_SUBMIT = {
			AcademicId: dataChangeSchedule.AcademicId,
			BranchId: dataChangeSchedule.BranchId,
			CurriculumId: dataChangeSchedule.CurriculumId,
			GradeId: dataChangeSchedule.GradeId,
			MaxQuantity: dataChangeSchedule.MaxQuantity,
			Name: dataChangeSchedule.Name,
			Price: dataChangeSchedule.Price,
			ProgramId: dataChangeSchedule.ProgramId,
			StartDay: moment(dataChangeSchedule.StartDay).format(),
			TeacherId: dataChangeSchedule.TeacherId,
			TeachingFee: dataChangeSchedule.TeachingFee,
			Thumbnail: dataChangeSchedule.Thumbnail,
			Type: dataChangeSchedule.Type,
			schedules: listCalendar
		}
		try {
			const res = await classApi.addClass(DATA_SUBMIT)
			if (res.status === 200) {
				ShowNoti('success', res.data.message)
				return res
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}
	const content = (
		<div className="flex-all-center flex-col gap-3">
			<CreateClassForm refPopoverWrapperBtn={refPopoverWrapperBtn} isOnline onSubmit={onSubmit} />
			<CreateClassForm refPopoverWrapperBtn={refPopoverWrapperBtn} onSubmit={onSubmit} />
			{listCalendar.length > 0 ? (
				<ModalAddSchedule
					checkTeacherAvailable={checkTeacherAvailable}
					checkRoomAvailable={checkRoomAvailable}
					refPopoverWrapperBtn={refPopoverWrapperBtn}
					className="w-full"
				/>
			) : null}
		</div>
	)

	const handleEventDrop = async (eventDropInfo) => {
		if (moment(eventDropInfo.event.start).format() >= moment(eventDropInfo.event.end).format()) {
			ShowNoti('error', 'Lịch học không hợp lệ')
		} else {
			dispatch(setLoadingCalendar(true))

			const checkExistSchedule = listCalendar.find((item) => {
				const start = moment(eventDropInfo.event.start).format()
				const end = moment(eventDropInfo.event.end).format()

				return (
					(moment(item.StartTime).format() === start ||
						moment(item.EndTime).format() === end ||
						(moment(item.EndTime).format() > start && moment(item.EndTime).format() <= end) ||
						(moment(item.StartTime).format() > start && moment(item.StartTime).format() < end)) &&
					item.Id !== eventDropInfo.event.extendedProps.Id
				)
			})

			if (!checkExistSchedule) {
				const newListCalendar = listCalendar.map((item) => {
					if (eventDropInfo.event.extendedProps.Id === item.Id) {
						return {
							...item,
							start: moment(eventDropInfo.event.start).format(),
							end: moment(eventDropInfo.event.end).format(),
							StartTime: moment(eventDropInfo.event.start).format(),
							EndTime: moment(eventDropInfo.event.end).format()
						}
					} else {
						return item
					}
				})

				dispatch(setListCalendar(newListCalendar))
				const listTeacher = await checkTeacherAvailable({
					branchId: dataChangeSchedule.BranchId,
					curriculumId: dataChangeSchedule.CurriculumId,
					startTime: moment(eventDropInfo.event.start).format(),
					endTime: moment(eventDropInfo.event.end).format()
				})
				let checkRoom = null
				if (!!eventDropInfo.event.extendedProps.RoomId) {
					const listRoom = await checkRoomAvailable({
						branchId: dataChangeSchedule.BranchId,
						startTime: moment(eventDropInfo.event.start).format(),
						endTime: moment(eventDropInfo.event.end).format()
					})
					checkRoom = listRoom.find((item) => item.RoomId === eventDropInfo.event.extendedProps.RoomId)
					if (!!checkRoom && !checkRoom?.Fit) {
						dispatch(
							setPrevSchedule({
								...eventDropInfo.oldEvent.extendedProps,
								start: moment(eventDropInfo.oldEvent.start).format(),
								end: moment(eventDropInfo.oldEvent.end).format(),
								title: eventDropInfo.oldEvent.title
							})
						)
						dispatch(setShowModal({ open: true, id: eventDropInfo.event.extendedProps.Id }))
						ShowNoti('error', checkRoom.Note)
						dispatch(setLoadingCalendar(false))
					}
				}

				const checkTeacher = listTeacher.find((item) => item.TeacherId === eventDropInfo.event.extendedProps.TeacherId)
				if (!!checkTeacher && !checkTeacher?.Fit) {
					dispatch(
						setPrevSchedule({
							...eventDropInfo.oldEvent.extendedProps,
							start: moment(eventDropInfo.oldEvent.start).format(),
							end: moment(eventDropInfo.oldEvent.end).format(),
							title: eventDropInfo.oldEvent.title
						})
					)
					dispatch(setShowModal({ open: true, id: eventDropInfo.event.extendedProps.Id }))
					dispatch(setLoadingCalendar(false))
					ShowNoti('error', checkTeacher.Note)
				}
				if (!checkTeacher || !checkRoom) {
					dispatch(
						setPrevSchedule({
							...eventDropInfo.oldEvent.extendedProps,
							start: moment(eventDropInfo.oldEvent.start).format(),
							end: moment(eventDropInfo.oldEvent.end).format(),
							title: eventDropInfo.oldEvent.title
						})
					)
					dispatch(setShowModal({ open: true, id: eventDropInfo.event.extendedProps.IdSchedule }))

					if (!!listCalendar && listCalendar.length > 0) {
						if (!checkTeacher) {
							ShowNoti('error', 'Giáo viên không tồn tại')
						}

						if (!!listCalendar[0]?.RoomId && !!checkTeacher) {
							ShowNoti('error', 'Phòng học không tồn tại')
						}
					}

					dispatch(setLoadingCalendar(false))
				} else if (parseInt(dataChangeSchedule?.Type) == 1 && !!checkTeacher && !!checkTeacher?.Fit && !!checkRoom && !!checkRoom?.Fit) {
					dispatch(setLoadingCalendar(false))
					ShowNoti('success', 'Đổi lịch thành công')
				} else if (parseInt(dataChangeSchedule?.Type) == 2 && !!checkTeacher && !!checkTeacher?.Fit) {
					dispatch(setLoadingCalendar(false))
					ShowNoti('success', 'Đổi lịch thành công')
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
				dispatch(setListCalendar(newListCalendar))
				ShowNoti('error', 'Buổi học này đã bị trùng lịch')
				dispatch(setLoadingCalendar(false))
			}
		}
	}

	const handleChangeInfo = async (data) => {}

	return (
		<div className="wrapper-calendar">
			<Card
				className="card-calendar"
				title="Sắp xếp lịch học"
				extra={
					<>
						<div className="wrapper-btn-create-class-desktop flex-all-center gap-3">
							<CreateClassForm refPopoverWrapperBtn={refPopoverWrapperBtn} isOnline onSubmit={onSubmit} />
							<CreateClassForm refPopoverWrapperBtn={refPopoverWrapperBtn} onSubmit={onSubmit} />
							{listCalendar.length > 0 ? (
								<ModalAddSchedule
									checkTeacherAvailable={checkTeacherAvailable}
									checkRoomAvailable={checkRoomAvailable}
									refPopoverWrapperBtn={refPopoverWrapperBtn}
								/>
							) : null}
						</div>
						<Popover
							ref={refPopoverWrapperBtn}
							className="popover-btn-create-class"
							placement="bottomLeft"
							content={content}
							title={null}
							trigger="click"
						>
							<PrimaryButton type="button" background="blue">
								<BsThreeDots />
							</PrimaryButton>
						</Popover>

						{listCalendar.length > 0 && (
							<>
								<ModalReviewScheduleClass
									isLoading={isLoading}
									handleCreateClass={handleCreateClass}
									listCalendar={listCalendar}
									dataChangeSchedule={dataChangeSchedule}
								/>
							</>
						)}
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
					editable={true}
					weekends={true}
					events={listCalendar}
					eventsSet={(data) => {
						setTimeStamp(new Date().getTime())
					}}
					eventChange={(data) => {}}
					locale="vi"
					headerToolbar={{
						start: 'prev today next',
						center: 'title',
						end: 'dayGridMonth,timeGridWeek' // end: 'dayGridMonth,timeGridWeek,timeGridDay'
					}}
					buttonText={{
						today: 'Hôm nay',
						month: 'Tháng',
						week: 'Tuần',
						day: 'Ngày'
					}}
					slotEventOverlap={false}
					allDaySlot={false}
					expandRows={true}
					titleFormat={{ month: 'numeric', year: 'numeric', day: 'numeric' }}
					dayHeaderFormat={{ weekday: 'long' }}
					firstDay={1}
					eventContent={(eventInfo) => (
						<ChangeScheduleClass
							dataRow={eventInfo}
							checkTeacherAvailable={checkTeacherAvailable}
							checkRoomAvailable={checkRoomAvailable}
							getAllTeacherByBranchAndProgram={getAllTeacherByBranchAndProgram}
							handleChangeInfo={handleChangeInfo}
						/>
					)}
					eventClick={(eventClickInfo) => {
						dispatch(
							setPrevSchedule({
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
			</Card>
			{loadingCalendar && (
				<div className="overlay-calendar">
					<Lottie loop animationData={loadingJson} play className="w-52" />
				</div>
			)}
		</div>
	)
}

export default CalenderClass
