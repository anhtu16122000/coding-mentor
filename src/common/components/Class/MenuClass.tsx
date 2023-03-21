import { Tabs } from 'antd'
import React from 'react'
import { AiOutlineCalendar, AiOutlineQrcode } from 'react-icons/ai'
import { BsCalendar2Week, BsUiChecksGrid } from 'react-icons/bs'
import { CgTranscript } from 'react-icons/cg'
import { FiUserCheck } from 'react-icons/fi'
import { GiBlackBook } from 'react-icons/gi'
import { IoNotificationsOutline } from 'react-icons/io5'
import { MdAppRegistration } from 'react-icons/md'
import { RiContactsBook2Line, RiQuillPenLine } from 'react-icons/ri'
import { VscFeedback, VscFolderLibrary } from 'react-icons/vsc'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import CalendarClassEdit from './CalendarClassEdit'
import CalenderClassStudent from './CalendarClassStudent'
import CalenderClassTeacher from './CalendarClassTeacher'
import DocumentsPageInClass from './DocumentsPage'
import { LessonFeedbackPage } from './LessonFeedbackPage'
import { ListStudentInClass } from './ListStudentInClass'
import { NotificationInClassPage } from './NotificationInClassPage'
import { RollUpPage } from './RollUpPage'
import { RollUpStudent } from './RollUpStudent'
import { RollUpTeacherPage } from './RollUpTeacherPage'
import { ScheduleList } from './ScheduleList'
import { TranscriptPage } from './TranscriptPage'

const itemsAdmin = [
	'Lịch học',
	'Học viên',
	'Các buổi học',
	'Tài liệu',
	'Điểm danh',
	'Bảng điểm',
	'Điểm danh giáo viên',
	'Phản hồi buổi học',
	'Thông báo'
]

const itemsStudent = ['Lịch học', 'Các buổi học', 'Tài liệu', 'Bảng điểm', 'Điểm danh bằng QR']
const itemsTeacher = [
	'Lịch học',
	'Học viên',
	'Các buổi học',
	'Tài liệu',
	'Điểm danh',
	'Bảng điểm',
	'Điểm danh giáo viên',
	'Phản hồi buổi học',
	'Thông báo'
]
const itemsParent = ['Lịch học', 'Các buổi học', 'Điểm danh', 'Bảng điểm']

const MenuClass = () => {
	const user = useSelector((state: RootState) => state.user.information)

	const getChildrenClassAdmin = (index) => {
		switch (index) {
			case 0:
				return <CalendarClassEdit />
			case 1:
				return <ListStudentInClass />
			case 2:
				return <ScheduleList />
			case 3:
				return <DocumentsPageInClass />
			case 4:
				return <RollUpPage />
			case 5:
				return <TranscriptPage />
			case 6:
				return <RollUpTeacherPage />
			case 7:
				return <LessonFeedbackPage />
			case 8:
				return <NotificationInClassPage />
			default:
				return <CalendarClassEdit />
		}
	}

	const getLabelClassAdmin = (item, index) => {
		switch (index) {
			case 0:
				return (
					<div className="label-tab">
						<AiOutlineCalendar className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 1:
				return (
					<div className="label-tab">
						<RiContactsBook2Line className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 2:
				return (
					<div className="label-tab">
						<BsCalendar2Week className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 3:
				return (
					<div className="label-tab">
						<VscFolderLibrary className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 4:
				return (
					<div className="label-tab">
						<RiQuillPenLine className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 5:
				return (
					<div className="label-tab">
						<CgTranscript className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 6:
				return (
					<div className="label-tab">
						<FiUserCheck className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 7:
				return (
					<div className="label-tab">
						<VscFeedback className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 8:
				return (
					<div className="label-tab">
						<IoNotificationsOutline className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			default:
				return 'Lịch học'
		}
	}

	const getChildrenClassStudent = (index) => {
		switch (index) {
			case 0:
				return <CalendarClassEdit />
			case 1:
				return <ScheduleList />
			case 2:
				return <DocumentsPageInClass />
			case 3:
				return <TranscriptPage />
			case 4:
				return <RollUpStudent />
			default:
				return <CalendarClassEdit />
		}
	}

	const getLabelClassStudent = (item, index) => {
		switch (index) {
			case 0:
				return (
					<div className="label-tab">
						<AiOutlineCalendar className="mr-3" /> <span>{item}</span>
					</div>
				)
			case 1:
				return (
					<div className="label-tab">
						<BsCalendar2Week className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 2:
				return (
					<div className="label-tab">
						<VscFolderLibrary className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 3:
				return (
					<div className="label-tab">
						<CgTranscript className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 4:
				return (
					<div className="label-tab">
						<AiOutlineQrcode className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 5:
				return (
					<div className="label-tab">
						<VscFeedback className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 3:
				return <div className="label-tab">{item}</div>
			default:
				return 'Lịch học'
		}
	}

	const getChildrenClassTeacher = (index) => {
		switch (index) {
			case 0:
				return <CalendarClassEdit />
			case 1:
				return <ListStudentInClass />
			case 2:
				return <ScheduleList />
			case 3:
				return <DocumentsPageInClass />
			case 4:
				return <RollUpPage />
			case 5:
				return <TranscriptPage />
			case 6:
				return <RollUpTeacherPage />
			case 7:
				return <LessonFeedbackPage />
			case 8:
				return <NotificationInClassPage />
			default:
				return <CalendarClassEdit />
		}
	}

	const getLabelClassTeacher = (item, index) => {
		switch (index) {
			case 0:
				return (
					<div className="label-tab">
						<AiOutlineCalendar className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 1:
				return (
					<div className="label-tab">
						<RiContactsBook2Line className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 2:
				return (
					<div className="label-tab">
						<BsCalendar2Week className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 3:
				return (
					<div className="label-tab">
						<VscFolderLibrary className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 4:
				return (
					<div className="label-tab">
						<RiQuillPenLine className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 5:
				return (
					<div className="label-tab">
						<CgTranscript className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 6:
				return (
					<div className="label-tab">
						<FiUserCheck className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 7:
				return (
					<div className="label-tab">
						<VscFeedback className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 8:
				return (
					<div className="label-tab">
						<IoNotificationsOutline className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			default:
				return 'Lịch học'
		}
	}

	const getChildrenClassParent = (index) => {
		switch (index) {
			case 0:
				return <CalendarClassEdit />

			case 1:
				return <ScheduleList />

			case 2:
				return <RollUpPage />

			case 3:
				return <TranscriptPage />

			default:
				return <CalendarClassEdit />
		}
	}

	const getLabelClassParent = (item, index) => {
		switch (index) {
			case 0:
				return (
					<div className="label-tab">
						<AiOutlineCalendar className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 1:
				return (
					<div className="label-tab">
						<BsCalendar2Week className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 2:
				return (
					<div className="label-tab">
						<RiQuillPenLine className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 3:
				return (
					<div className="label-tab">
						<CgTranscript className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)

			default:
				return 'Lịch học'
		}
	}
	return (
		<>
			{user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 5 || user?.RoleId == 6 || user?.RoleId == 7 ? (
				<Tabs
					defaultActiveKey="0"
					tabPosition="left"
					items={itemsAdmin.map((item, index) => {
						return {
							label: getLabelClassAdmin(item, index),
							key: index.toString(),
							children: getChildrenClassAdmin(index)
						}
					})}
				/>
			) : null}

			{user?.RoleId == 2 ? (
				<Tabs
					defaultActiveKey="0"
					tabPosition="left"
					items={itemsTeacher.map((item, index) => {
						return {
							label: getLabelClassTeacher(item, index),
							key: index.toString(),
							children: getChildrenClassTeacher(index)
						}
					})}
				/>
			) : null}

			{user?.RoleId == 3 ? (
				<Tabs
					defaultActiveKey="0"
					tabPosition="left"
					items={itemsStudent.map((item, index) => {
						return {
							label: getLabelClassStudent(item, index),
							key: index.toString(),
							children: getChildrenClassStudent(index)
						}
					})}
				/>
			) : null}

			{user?.RoleId == 8 ? (
				<Tabs
					defaultActiveKey="0"
					tabPosition="left"
					items={itemsParent.map((item, index) => {
						return {
							label: getLabelClassParent(item, index),
							key: index.toString(),
							children: getChildrenClassParent(index)
						}
					})}
				/>
			) : null}
		</>
	)
}

export default MenuClass
