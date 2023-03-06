import { Tabs } from 'antd'
import React from 'react'
import { AiOutlineCalendar } from 'react-icons/ai'
import { CgTranscript } from 'react-icons/cg'
import { FiUserCheck } from 'react-icons/fi'
import { IoNotificationsOutline } from 'react-icons/io5'
import { RiContactsBook2Line, RiMarkPenLine, RiQuillPenLine, RiUserStarLine } from 'react-icons/ri'
import { VscFeedback, VscFolderLibrary } from 'react-icons/vsc'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import CalendarClassEdit from './CalendarClassEdit'
import CalenderClassStudent from './CalendarClassStudent'
import CalenderClassTeacher from './CalendarClassTeacher'
import CalendarClassTutoringEdit from './CalendarClassTutoringEdit'
import DocumentsPageInClass from './DocumentsPage'
import { LessonFeedbackPage } from './LessonFeedbackPage'
import { ListStudentInClass } from './ListStudentInClass'
import { NotificationInClassPage } from './NotificationInClassPage'
import { RateTeacher } from './RateTeacher'
import { RollUpPage } from './RollUpPage'
import { ScheduleList } from './ScheduleList'
import { StudentAssessment } from './StudentAssessment'

const itemsAdmin = ['Lịch học', 'Đánh giá học viên', 'Đánh giá giáo viên', 'Tài liệu', 'Thông báo', 'Phản hồi buổi học']
const itemsStudent = ['Lịch học', 'Đánh giá giáo viên', 'Tài liệu', 'Thông báo']
const itemsTeacher = ['Lịch học', 'Đánh giá học viên', 'Tài liệu', 'Thông báo', 'Phản hồi buổi học']
const MenuClassTutoring = () => {
	const user = useSelector((state: RootState) => state.user.information)
	const getChildrenClassAdmin = (index) => {
		switch (index) {
			case 0:
				return <CalendarClassTutoringEdit />
			case 1:
				return <StudentAssessment />
			case 2:
				return <RateTeacher />
			case 3:
				return <DocumentsPageInClass />
			case 4:
				return <NotificationInClassPage />
			case 5:
				return <LessonFeedbackPage />
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
						<RiMarkPenLine className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 2:
				return (
					<div className="label-tab">
						<RiUserStarLine className="mr-3" size={20} /> <span>{item}</span>
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
						<IoNotificationsOutline className="mr-3" size={20} /> <span>{item}</span>
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

			default:
				return 'Lịch học'
		}
	}

	const getChildrenClassStudent = (index) => {
		switch (index) {
			case 0:
				return <CalendarClassTutoringEdit />

			case 1:
				return <RateTeacher />
			case 2:
				return <DocumentsPageInClass />
			case 3:
				return <NotificationInClassPage />
			case 4:
				return <LessonFeedbackPage />
			default:
				return <CalendarClassEdit />
		}
	}
	const getLabelClassStudent = (item, index) => {
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
						<RiMarkPenLine className="mr-3" size={20} /> <span>{item}</span>
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
						<IoNotificationsOutline className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 4:
				return (
					<div className="label-tab">
						<CgTranscript className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)

			default:
				return 'Lịch học'
		}
	}

	const getChildrenClassTeacher = (index) => {
		switch (index) {
			case 0:
				return <CalendarClassTutoringEdit />
			case 1:
				return <StudentAssessment />
			case 2:
				return <RateTeacher />
			case 3:
				return <DocumentsPageInClass />
			case 4:
				return <NotificationInClassPage />
			case 5:
				return <LessonFeedbackPage />
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
						<RiMarkPenLine className="mr-3" size={20} /> <span>{item}</span>
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
						<IoNotificationsOutline className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 4:
				return (
					<div className="label-tab">
						<CgTranscript className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 5:
				return (
					<div className="label-tab">
						<FiUserCheck className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)
			case 6:
				return (
					<div className="label-tab">
						<VscFeedback className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)

			default:
				return 'Lịch học'
		}
	}
	return (
		<>
			{user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 5 || user?.RoleId == 6 || user?.RoleId == 7 || user?.RoleId == 8 ? (
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
		</>
	)
}

export default MenuClassTutoring
