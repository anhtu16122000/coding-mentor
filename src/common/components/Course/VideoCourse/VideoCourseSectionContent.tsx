import { Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'
import { VideoCourseSectionLessonApi } from '~/api/course/video-course/video-course-section-lesson'
import { ShowNoti } from '~/common/utils'
import ModalAddLesson from './ModalAddLesson'
import VideoLessionContent from './VideoCourseLessionContent'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

type IProps = {
	Item: IVideoCourseSection
	User: any
	activeID: number
	setActiveID: Function
	setLessonSelected: Function
	setOpenMenuCourse: Function
	sectionIndex: number
	disabledAll: boolean
	isChangePositionLesson: boolean
	getSection: Function
}

const VideoCourseSectionContent = (props: IProps) => {
	const { sectionIndex, isChangePositionLesson, disabledAll, getSection, setOpenMenuCourse } = props
	const { Item, User, activeID, setActiveID, setLessonSelected } = props

	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [lesson, setLesson] = useState<IVideoCourseSectionLesson[]>()

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

	useEffect(() => {
		if (!!lesson) {
			if (sectionIndex == 0) {
				setLessonSelected(lesson[0])
				lesson.length > 0 && setActiveID(lesson[0].Id)
			}
		}
	}, [lesson])

	const getContentSection = async () => {
		console.log('getContentSection')
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await VideoCourseSectionLessonApi.getBySectionID(Item.Id)
			if (res.status == 200) {
				setLesson(res.data.data)
			}
			if (res.status == 204) {
				setLesson([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	const onCompleted = async (data, id) => {
		try {
			console.log('onCompleted')
			let res = await VideoCourseSectionLessonApi.complete(id)
			if (res.status == 200) {
				await getContentSection()
				getSection()
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	const onChangePosition = async (item, itemChangeTo) => {
		setIsLoading({ type: 'CHANGE_POSITION', status: true })
		try {
			let res = await VideoCourseSectionLessonApi.updateIndex({
				Items: [
					{ Id: itemChangeTo.Id, Index: item.Index },
					{ Id: item.Id, Index: itemChangeTo.Index }
				]
			})
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				getContentSection()
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'CHANGE_POSITION', status: false })
		}
	}

	const onCompletedLesson = (data, itemID) => {
		onCompleted(data, itemID)
	}

	const renderContentSection = () => {
		return (
			<>
				{isLoading.type == 'GET_ALL' && isLoading.status ? (
					<Skeleton />
				) : (
					lesson?.map((item, index) => (
						<VideoLessionContent
							key={index}
							setLessonSelected={setLessonSelected}
							isChangePositionLesson={isChangePositionLesson}
							onUpdateSection={onUpdateSection}
							onRemoveSection={onRemoveSection}
							onCompletedLesson={onCompletedLesson}
							onChangePosition={onChangePosition}
							lesson={lesson}
							isLoading={isLoading}
							disabledAll={disabledAll}
							activeID={activeID}
							setActiveID={setActiveID}
							item={item}
							index={index}
							setOpenMenuCourse={setOpenMenuCourse}
						/>
					))
				)}
			</>
		)
	}

	useEffect(() => {
		getContentSection()
	}, [])

	const onFinish = async (data) => {
		setIsLoading({ type: 'SUBMIT_LESSON', status: true })
		try {
			let res = await VideoCourseSectionLessonApi.add({
				SectionId: Item.Id,
				Type: data.Type,
				Name: data.Name,
				FileType: data.FileType,
				VideoUrl: data.VideoUrl && data.VideoUrl,
				ExamId: data.ExamId && data.ExamId
			})
			if (res.status == 200) {
				getContentSection()
			}
			return true
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'SUBMIT_LESSON', status: false })
		}
	}

	const onUpdateSection = async (data) => {
		setIsLoading({ type: 'SUBMIT_SECTION', status: true })
		try {
			let res = await VideoCourseSectionLessonApi.update({
				Name: data.Name,
				VideoUrl: data.VideoUrl,
				ExamTopicId: data.VideoUrl,
				Id: data.Id,
				...data
			})
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				getContentSection()
				setLessonSelected(res.data.data)
			}
			return true
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'SUBMIT_SECTION', status: false })
		}
	}

	const onRemoveSection = async (data) => {
		setIsLoading({ type: 'SUBMIT_SECTION', status: true })
		try {
			let res = await VideoCourseSectionLessonApi.delete(data.Id)
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				getContentSection()
			}
			return true
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'SUBMIT_SECTION', status: false })
		}
	}

	return (
		<>
			<div>
				<div>{renderContentSection()}</div>

				{(isAdmin() || isManager() || isAcademic()) && <ModalAddLesson mode="add" isLoading={isLoading} onSubmit={onFinish} />}
			</div>
		</>
	)
}

export default memo(VideoCourseSectionContent)
