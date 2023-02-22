import { Tabs } from 'antd'
import React from 'react'
import { AiOutlineCalendar } from 'react-icons/ai'
import { RiContactsBook2Line, RiMarkPenLine, RiQuillPenLine, RiUserStarLine } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import CalendarClassEdit from './CalendarClassEdit'
import CalenderClassStudent from './CalendarClassStudent'
import CalenderClassTeacher from './CalendarClassTeacher'
import CalendarClassTutoringEdit from './CalendarClassTutoringEdit'
import { ListStudentInClass } from './ListStudentInClass'
import { RollUpPage } from './RollUpPage'
import { ScheduleList } from './ScheduleList'
import { StudentAssessment } from './StudentAssessment'

const itemsAdmin = ['Lịch học', 'Đánh giá học viên', 'Đánh giá giáo viên']
const itemsStudent = ['Lịch học']
const itemsTeacher = ['Lịch học']
const MenuClassTutoring = () => {
	const user = useSelector((state: RootState) => state.user.information)
	const getChildrenClassAdmin = (index) => {
		switch (index) {
			case 0:
				return <CalendarClassTutoringEdit />
			case 1:
				return <StudentAssessment />
			case 2:
				return <ScheduleList />
			case 3:
				return <RollUpPage />

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
						<RiQuillPenLine className="mr-3" size={20} /> <span>{item}</span>
					</div>
				)

			default:
				return 'Lịch học'
		}
	}

	const getChildrenClassStudent = (index) => {
		switch (index) {
			case 0:
				return <CalenderClassStudent />
			case 1:
				return <ListStudentInClass />
			default:
				return <CalenderClassStudent />
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
						<RiContactsBook2Line className="mr-3" /> <span>{item}</span>
					</div>
				)
			case 2:
				return <div className="label-tab">{item}</div>
			default:
				return 'Lịch học'
		}
	}

	const getChildrenClassTeacher = (index) => {
		switch (index) {
			case 0:
				return <CalenderClassTeacher />
			default:
				return <CalenderClassTeacher />
		}
	}
	const getLabelClassTeacher = (item, index) => {
		switch (index) {
			case 0:
				return (
					<div className="label-tab">
						<AiOutlineCalendar className="mr-3" /> <span>{item}</span>
					</div>
				)
			case 2:
				return <div className="label-tab">{item}</div>
			default:
				return 'Lịch học'
		}
	}
	return (
		<>
			{user.RoleId == 1 ? (
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

			{user.RoleId == 2 ? (
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

			{user.RoleId == 3 ? (
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
