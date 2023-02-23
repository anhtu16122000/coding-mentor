import { Popover, Tooltip } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React from 'react'
import { AiOutlineCalendar } from 'react-icons/ai'
import PrimaryButton from '../Primary/Button'
import ZoomManager from '../Zoom/ZoomManager'

const ScheduleCalendar = (props) => {
	const { dataRow, onRefresh } = props
	const router = useRouter()

	const getStatusSchedule = () => {
		switch (dataRow.event.extendedProps.Status) {
			case 1:
				return '!bg-[#a2a2a2]'
			case 2:
				return '!bg-[#59b96c]'
		}
	}

	function isActive() {
		return dataRow.event.extendedProps.Status == 1 ? true : false
	}

	return (
		<>
			<div className="wrapper-schedule relative">
				<button
					onClick={() => router.push(`/class/list-class/detail/?class=${dataRow.event.extendedProps.ClassId}`)}
					className={`btn-edit-title ${getStatusSchedule()}`}
				>
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

export default ScheduleCalendar
