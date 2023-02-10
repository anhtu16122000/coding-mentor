import { Tabs } from 'antd'
import React from 'react'
import { AiOutlineCalendar } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import CalendarClassEdit from './CalendarClassEdit'
import CalenderClassStudent from './CalendarClassStudent'
import CalenderClassTeacher from './CalendarClassTeacher'

const itemsAdmin = ['Lịch học']
const itemsStudent = ['Lịch học']
const itemsTeacher = ['Lịch học']
const MenuClass = () => {
	const user = useSelector((state: RootState) => state.user.information)
	const getChildrenClassAdmin = (index) => {
		switch (index) {
			case 0:
				return <CalendarClassEdit />
			default:
				return <CalendarClassEdit />
		}
	}
	const getLabelClassAdmin = (item, index) => {
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

	const getChildrenClassStudent = (index) => {
		switch (index) {
			case 0:
				return <CalenderClassStudent />
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
					tabPosition="right"
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
					tabPosition="right"
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
					tabPosition="right"
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

export default MenuClass
