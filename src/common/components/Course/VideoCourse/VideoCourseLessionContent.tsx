import { Checkbox } from 'antd'
import React, { useState } from 'react'
import { FiArrowDownCircle, FiArrowUpCircle } from 'react-icons/fi'
import { HiOutlineBookOpen } from 'react-icons/hi'
import { VscPlayCircle } from 'react-icons/vsc'
import { useSelector } from 'react-redux'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import PreviewExercise from '../../Exercise/Preview'
import ModalAddLesson from './ModalAddLesson'
import ModalShowFile from './ModalShowFile'
import PrimaryTooltip from '../../PrimaryTooltip'

type IProps = {
	item: any
	index: any
	disabledAll: any
	lesson: any
	activeID: any
	setActiveID: any
	setLessonSelected: any
	onChangePosition: any
	isLoading: any
	onUpdateSection: any
	onRemoveSection: any
	onCompletedLesson: any
	isChangePositionLesson: any
	setOpenMenuCourse: Function
}

const VideoLessionContent = (props: IProps) => {
	const { item, index, disabledAll, lesson, activeID, setActiveID, setLessonSelected, setOpenMenuCourse } = props
	const { isChangePositionLesson, onChangePosition, isLoading, onUpdateSection, onRemoveSection, onCompletedLesson } = props

	const user = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return user?.RoleId == 1
	}

	function isTeacher() {
		return user?.RoleId == 2
	}

	function isManager() {
		return user?.RoleId == 4
	}

	function isStdent() {
		return user?.RoleId == 3
	}

	function isAccountant() {
		return user?.RoleId == 6
	}

	function isAcademic() {
		return user?.RoleId == 7
	}

	const [visiblePreview, setVisiblePreview] = useState(false)

	function getDisable() {
		if (user?.RoleId == 1) {
			return 'cursor-pointer'
		} else {
			if (disabledAll) {
				return true
			} else {
				return index - 1 < 0 ? false : lesson[index - 1].isCompleted ? false : true ? 'cursor-not-allowed' : 'cursor-pointer'
			}
		}
	}

	function openPreview(item) {
		if (!!item?.ExamId) {
			setVisiblePreview(true)
		} else {
			setActiveID(item.Id)
			setLessonSelected(item)
		}
		setOpenMenuCourse(false)
	}

	function isActive() {
		return activeID == item.Id
	}

	return (
		<>
			{!!item?.ExamId && (
				<PreviewExercise
					LessonVideoId={item?.Id}
					slug={item?.ExamId}
					name={item.Name}
					visible={visiblePreview}
					setVisible={() => setVisiblePreview(false)}
				/>
			)}

			<div
				className={`video-section-container group ${isActive() ? 'bg-[#d0d8e4]' : 'bg-[#fff]'} ${getDisable()}`}
				onClick={() => {
					if (isAdmin() || isTeacher() || isManager() || isAcademic()) {
						openPreview(item)
					} else {
						if (disabledAll ? disabledAll : index - 1 < 0 ? false : lesson[index - 1].isCompleted ? false : true) {
							ShowNoti('warning', 'Bạn chưa hoàn thành bài học ở trên')
						} else {
							openPreview(item)
						}
					}
				}}
			>
				<PrimaryTooltip className="flex-1" id={`pr-tip-${item.Id}`} place="top" content={item.Name}>
					<div className={`video-section-body ${activeID == item.Id ? 'text-[#151515] font-bold' : 'text-tw-black'}`}>
						<span className="my-auto">{item.Type == 1 ? <VscPlayCircle size={22} /> : <HiOutlineBookOpen size={20} />}</span>
						<div className="flex-1 ml-[8px]">
							<span className="video-section-title">{item.Name}</span>
							{item.Type == 1 && <span className="video-section-time">{item.Minute} phút</span>}
						</div>
					</div>
				</PrimaryTooltip>

				<div className="flex justify-end align-center">
					{(isAdmin() || isManager() || isAcademic()) && (
						<>
							{isChangePositionLesson ? (
								<>
									<button
										className={`text-2xl mr-2 m-2 ${index == 0 ? 'cursor-not-allowed  text-tw-disable' : 'cursor-pointer  text-tw-green'}`}
										onClick={() => onChangePosition(item, lesson[index - 1])}
										disabled={index == 0}
									>
										<FiArrowUpCircle />
									</button>
									<button
										className={`text-2xl mr-2 m-2  ${
											index == lesson.length - 1 ? 'cursor-not-allowed  text-tw-disable' : 'cursor-pointer text-tw-red'
										}`}
										onClick={() => onChangePosition(item, lesson[index + 1])}
										disabled={index == lesson.length - 1}
									>
										<FiArrowDownCircle />
									</button>
								</>
							) : (
								<div className="flex justify-center items-center">
									{!item?.ExamId && <ModalShowFile lessonID={item.Id} UserID={user?.RoleId} />}
									{!item?.ExamId && <ModalAddLesson item={item} mode="edit" isLoading={isLoading} onSubmit={onUpdateSection} />}
									<ModalAddLesson item={item} mode="remove" isLoading={isLoading} onSubmit={onRemoveSection} />
								</div>
							)}
						</>
					)}

					{user?.RoleId == '3' && (
						<div className="flex justify-center items-center">
							{!item?.ExamId && <ModalShowFile lessonID={item.Id} UserID={user?.RoleId} />}
							{!item?.ExamId && (
								<Checkbox
									disabled={
										disabledAll
											? disabledAll
											: item.isCompleted
											? item.isCompleted
											: index - 1 < 0
											? false
											: lesson[index - 1].isCompleted
											? false
											: true
									}
									onChange={(data) => onCompletedLesson(data, item.Id)}
									checked={item.isCompleted}
								/>
							)}

							{item?.ExamId && item.isCompleted && (
								<Checkbox
									disabled={
										disabledAll
											? disabledAll
											: item.isCompleted
											? item.isCompleted
											: index - 1 < 0
											? false
											: lesson[index - 1].isCompleted
											? false
											: true
									}
									onChange={(data) => onCompletedLesson(data, item.Id)}
									checked={item.isCompleted}
								/>
							)}
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default React.memo(VideoLessionContent)
