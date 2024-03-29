import { Collapse, Popover, Tooltip } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { AiOutlineCalendar } from 'react-icons/ai'
import PrimaryButton from '../Primary/Button'
import ZoomManager from '../Zoom/ZoomManager'
import { UserOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Avatar from '../Avatar'
import { log } from '~/common/utils'

const ScheduleCalendar = (props) => {
	const { dataRow, onRefresh } = props
	const router = useRouter()
	const [openIds, setOpenIds] = useState(null)

	const getStatusSchedule = () => {
		switch (dataRow.event.extendedProps.Status) {
			case 1:
				return '!rounded-md !bg-[#FFF]'
			case 2:
				return '!rounded-md !bg-[#FFF]'
		}
	}

	const getStatusSchedulePoppover = () => {
		switch (dataRow.event.extendedProps.Status) {
			case 1:
				return '!rounded-md !bg-[#FFF] !border-2 !border-solid !border-[#fb862d] '
			case 2:
				return '!rounded-md !bg-[#FFF] !border-2 !border-solid !border-[#43b413] '
		}
	}

	const getStatusScheduleTime = () => {
		switch (dataRow.event.extendedProps.Status) {
			case 1:
				return '!rounded px-1 py-[2px]  !text-[12px] !bg-[#fb862d] !text-[#FFF] '
			case 2:
				return '!rounded px-1 py-[2px]  !text-[12px] !bg-[#43b413] !text-[#FFF] '
		}
	}

	const getStatusScheduleTag = () => {
		switch (dataRow.event.extendedProps.Status) {
			case 1:
				return '!border-2 !border-solid !border-[#fb862d] !text-[#fb862d] !bg-[#FFF] !rounded-md'
			case 2:
				return '!border-2 !border-solid !border-[#43b413] !text-[#43b413] !bg-[#FFF] !rounded-md'
		}
	}

	function isActive() {
		return dataRow.event.extendedProps.Status == 1 ? true : false
	}

	const thisEvent = dataRow.event.extendedProps

	// log.Yellow('thisEvent', thisEvent)

	return (
		<>
			<div className="wrapper-schedule wrapper-schedule-calender relative ">
				<div className={`${getStatusScheduleTag()}`}>
					<Popover
						trigger="click"
						content={
							<div className={`wrapper-content-schedule`}>
								<p>
									<span className="title">Lớp:</span>{' '}
									<Link href={`/class/list-class/detail/?class=${dataRow.event.extendedProps.ClassId}`}>
										<a className="font-medium hover:underline">{dataRow.event.extendedProps.ClassName}</a>
									</Link>
								</p>
								<p>
									<span className="title">GV:</span> {dataRow.event.extendedProps.TeacherName}
								</p>
								{!!dataRow.event.extendedProps?.RoomId && (
									<p>
										<span className="title">Phòng:</span> {dataRow.event.extendedProps.RoomName}
									</p>
								)}

								<p>
									<span className="title">Ghi chú:</span>
									<span className="whitespace-pre-line ml-1">{dataRow.event.extendedProps.Note}</span>
								</p>

								<ZoomManager data={dataRow.event.extendedProps} onRefresh={onRefresh} />
							</div>
						}
					>
						<button
							className={`${getStatusSchedule()}  !bg-white !text-[#fff] font-semibold  w-full p-[6px] flex justify-start items-center gap-2`}
						>
							<span className={`calendar-event time ${thisEvent?.Status == 1 ? 'orange' : 'green'}`}>
								{moment(thisEvent.StartTime).format('HH:mm')}
							</span>

							<span className={`calendar-event time ${thisEvent?.Status == 1 ? 'orange' : 'green'}`}>
								{moment(thisEvent.EndTime).format('HH:mm')}
							</span>
							<Avatar
								disabled
								className="w-[24px] h-[24px] rounded-full object-cover border-[1px] border-[#dcdcdc]"
								uri={dataRow.event.extendedProps?.TeacherAvatar}
							/>
						</button>
					</Popover>
				</div>
			</div>

			<Popover
				content={
					<>
						<span className="title">Ca: </span>
						<span>{moment(dataRow.event.start).format('HH:mm')}</span> <span className="mx-1">-</span>
						<span>{moment(dataRow.event.end).format('HH:mm')}</span>
						<div className="wrapper-content-schedule">
							<p>
								<span className="title">Lớp:</span> {dataRow.event.extendedProps.ClassName}
							</p>
							<p>
								<span className="title">Trạng thái:</span> {dataRow.event.extendedProps.StatusName}
							</p>
							<p>
								<span className="title">Ngày bắt đầu:</span> {moment(dataRow.event.start).format('DD/MM/YYYY')}
							</p>
							<p>
								<span className="title">Ngày kết thúc:</span> {moment(dataRow.event.end).format('DD/MM/YYYY')}
							</p>
							<p>
								<span className="title">GV:</span> {dataRow.event.extendedProps.TeacherName}
							</p>
							{!!dataRow.event.extendedProps.RoomId && (
								<p>
									<span className="title">Phòng:</span> {dataRow.event.extendedProps.RoomName}
								</p>
							)}
							<p>
								<span className="title">Ghi chú:</span>
								<span className="whitespace-pre-line ml-1">{dataRow.event.extendedProps.Note}</span>
							</p>

							<ZoomManager isPopover data={dataRow.event.extendedProps} onRefresh={onRefresh} />
						</div>
					</>
				}
				title="Thông tin buổi học"
				trigger="click"
			>
				<div className="wrapper-schedule wrapper-schedule-tablet">
					<button
						className={`${getStatusSchedulePoppover()} !bg-white !text-[#FFF] font-semibold  w-full p-[6px] flex justify-start gap-2`}
					>
						<span className={`${getStatusScheduleTime()}`}>{moment(dataRow.event.start).format('HH:mm')}</span>{' '}
						<span className={`${getStatusScheduleTime()}`}>{moment(dataRow.event.end).format('HH:mm')}</span>
					</button>
				</div>
				<div className="wrapper-schedule wrapper-schedule-mobile">
					<button className={`btn-edit-title ${getStatusSchedule()}`}>
						<AiOutlineCalendar className={`${getStatusScheduleTime()} !text-[26px] p-0`} />
					</button>
				</div>
			</Popover>
		</>
	)
}

export default ScheduleCalendar
