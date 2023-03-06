import { Checkbox, Collapse, Skeleton } from 'antd'
import React, { useState } from 'react'
import { FiArrowDownCircle, FiArrowUpCircle } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { VideoCourseSectionApi } from '~/api/course/video-course/video-course-section'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import IconButton from '../../Primary/IconButton'
import ModalAddSection from './ModalAddSection'
import VideoCourseSectionContent from './VideoCourseSectionContent'

const SectionVideo = (props) => {
	const { section, getSection, setLessonSelected, isChangePositionSection, setOpenMenuCourse } = props
	const user = useSelector((state: RootState) => state.user.information)
	const [isChangePositionLesson, setIsChangePositionLesson] = useState(false)
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [activeID, setActiveID] = useState(null)
	const router = useRouter()

	const onUpdateSection = async (data) => {
		setIsLoading({ type: 'SUBMIT_SECTION', status: true })
		try {
			let res = await VideoCourseSectionApi.update({ Id: Number(data.Id), Name: data.Name })
			if (res.status == 200) {
				getSection()
				ShowNoti('success', res.data.message)
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
			let res = await VideoCourseSectionApi.delete(data.Id)
			if (res.status == 200) {
				getSection()
				ShowNoti('success', res.data.message)
			}
			return true
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'SUBMIT_SECTION', status: false })
		}
	}

	const onChangePositionSection = async (item, itemChangeTo) => {
		setIsLoading({ type: 'CHANGE_POSITION', status: true })
		try {
			let res = await VideoCourseSectionApi.updateIndex({
				Items: [
					{ Id: itemChangeTo.Id, Index: item.Index },
					{ Id: item.Id, Index: itemChangeTo.Index }
				]
			})
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				getSection()
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'CHANGE_POSITION', status: false })
		}
	}

	const onFinish = async (data) => {
		setIsLoading({ type: 'SUBMIT_SECTION', status: true })
		try {
			let res = await VideoCourseSectionApi.add({ VideoCourseId: Number(router.query.slug), Name: data.Name })
			if (res.status == 200) {
				getSection()
			}
			return true
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'SUBMIT_SECTION', status: false })
		}
	}

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

	return (
		<>
			{!!section ? (
				<div className="video-course-section scrollbar antd-custom-wrap">
					<Collapse
						className={`${user?.RoleId === '1' ? 'collapse-wrap-admin' : 'collapse-wrap'}`}
						defaultActiveKey={['0']}
						collapsible="header"
						expandIconPosition={'end'}
						onChange={() => {}}
					>
						{section.map((item, index) => {
							return (
								<Collapse.Panel
									header={
										<div className="flex mt-2">
											{user?.RoleId == '3' && <Checkbox disabled={true} onChange={(data) => {}} checked={item.isCompleted}></Checkbox>}
											<div className="flex flex-col">
												<span className="ml-2 font-bold text-tw-primary in-1-line">{item.Name}</span>
												<span className="ml-2 text-[12px] text-[#838383] in-1-line">{item.Minute} phút</span>
											</div>
										</div>
									}
									key={index}
									extra={
										user?.RoleId === '1' && (
											<>
												{isChangePositionSection ? (
													<div className="flex justify-center items-center">
														<button
															className={`text-2xl mr-2 m-2 ${
																index == 0 ? 'cursor-not-allowed  text-tw-disable' : 'cursor-pointer  text-tw-green'
															}`}
															onClick={() => onChangePositionSection(item, section[index - 1])}
															disabled={index == 0}
														>
															<FiArrowUpCircle />
														</button>
														<button
															className={`text-2xl mr-2 m-2  ${
																index == section.length - 1 ? 'cursor-not-allowed  text-tw-disable' : 'cursor-pointer text-tw-red'
															}`}
															onClick={() => onChangePositionSection(item, section[index + 1])}
															disabled={index == section.length - 1}
														>
															<FiArrowDownCircle />
														</button>
													</div>
												) : (
													<div className="flex justify-center items-center">
														<IconButton
															className="!mt-[6px]"
															type="button"
															icon="exchange"
															color="yellow"
															onClick={() => setIsChangePositionLesson(!isChangePositionLesson)}
															tooltip="Đổi vị trí bài học"
														/>
														<ModalAddSection item={item} mode="edit" isLoading={isLoading} onSubmit={onUpdateSection} />
														<ModalAddSection item={item} mode="remove" isLoading={isLoading} onSubmit={onRemoveSection} />
													</div>
												)}
											</>
										)
									}
								>
									{
										<VideoCourseSectionContent
											activeID={activeID}
											disabledAll={index == 0 ? false : !section[index - 1].isCompleted}
											setActiveID={setActiveID}
											User={user}
											Item={item}
											isChangePositionLesson={isChangePositionLesson}
											setLessonSelected={setLessonSelected}
											sectionIndex={index}
											getSection={getSection}
											setOpenMenuCourse={setOpenMenuCourse}
										/>
									}
								</Collapse.Panel>
							)
						})}
					</Collapse>

					{(isAcademic() || isAdmin() || isManager()) && (
						<div className="flex gap-2 justify-center items-center p-4">
							<ModalAddSection mode="add" isLoading={isLoading} onSubmit={onFinish} />
						</div>
					)}
				</div>
			) : (
				<div className="px-4 py-2">
					<Skeleton active />
				</div>
			)}
		</>
	)
}

export default SectionVideo
