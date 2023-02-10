import { Popover, Tooltip } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React from 'react'
import { AiOutlineCalendar } from 'react-icons/ai'
import PrimaryButton from '../Primary/Button'

const ScheduleCalendarClass = (props) => {
	const { dataRow } = props
	const router = useRouter()
	const getStatusSchedule = () => {
		switch (dataRow.event.extendedProps.Status) {
			case 1:
				return '!bg-tw-secondary'
			case 2:
				return '!bg-tw-disable'
			case 3:
				return '!bg-tw-primary'
		}
	}
	return (
		<>
			<div className="wrapper-schedule">
				<Tooltip title={dataRow.event.extendedProps.StatusName} placement="top">
					<button className={`btn-edit-title ${getStatusSchedule()}`}>
						<span>{moment(dataRow.event.start).format('HH:mm')}</span> <span className="mx-1">-</span>
						<span>{moment(dataRow.event.end).format('HH:mm')}</span>
					</button>

					<div className="wrapper-content-schedule">
						<p>
							<span className="title">Lớp:</span> {dataRow.event.extendedProps.ClassName}
						</p>
						<p>
							<span className="title">GV:</span> {dataRow.event.extendedProps.TeacherName}
						</p>
						{!!dataRow.event.extendedProps.RoomId ? (
							<p>
								<span className="title">Phòng:</span> {dataRow.event.extendedProps.RoomName}
							</p>
						) : null}
						<p>
							<span className="title">Ghi chú:</span>
							<span className="whitespace-pre-line ml-1">{dataRow.event.extendedProps.Note}</span>
						</p>
					</div>
				</Tooltip>
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
							{!!dataRow.event.extendedProps.RoomId ? (
								<p>
									<span className="title">Phòng:</span> {dataRow.event.extendedProps.RoomName}
								</p>
							) : null}
							<p>
								<span className="title">Ghi chú:</span>
								<span className="whitespace-pre-line ml-1">{dataRow.event.extendedProps.Note}</span>
							</p>
						</div>
					</>
				}
				title="Thông tin buổi học"
				trigger="click"
			>
				<div className="wrapper-schedule wrapper-schedule-tablet">
					<button className={`btn-edit-title ${getStatusSchedule()}`}>
						<span>{moment(dataRow.event.start).format('HH:mm')}</span> <span className="mx-1">-</span>
						<span>{moment(dataRow.event.end).format('HH:mm')}</span>
					</button>
				</div>
				<div className="wrapper-schedule wrapper-schedule-mobile">
					<button className={`btn-edit-title ${getStatusSchedule()}`}>
						<AiOutlineCalendar />
					</button>
				</div>
			</Popover>
		</>
	)
}

export default ScheduleCalendarClass
