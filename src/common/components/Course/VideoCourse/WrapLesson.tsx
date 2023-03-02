import { Card, Empty, Tabs } from 'antd'
import React, { useState } from 'react'
import { RiExchangeLine } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import SectionVideo from './SectionVideo'
import VideoCourseDescription from './Tabs/Description'
import NotificationInVideoCourse from './Tabs/NotificationInVideoCourse'
import QuestionInCourse from './Tabs/QuestionInCourse'
import ReviewVideoCourse from './Tabs/ReviewVideoCourse'
import StudentListInCourse from './Tabs/StudentListInCourse'

const { TabPane } = Tabs

const WrapLesson = (props) => {
	const { lessonSelected, setLessonSelected, section, getSection, completedPercent, courseID } = props
	const { getCourseDetail, openMenuCourse, setOpenMenuCourse, courseDetail } = props

	const [onReloadReviewTab, setOnReloadReviewTab] = useState(0)
	const [isChangePositionSection, setIsChangePositionSection] = useState(false)

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

	return (
		<div className={`video-detail relative antd-custom-wrap flex justify-start align-center h-[calc(100vh_-_56px)] overflow-y-auto`}>
			<div className="desktop:w-3/4 w-full h-[calc(100vh_-_56px)] overflow-y-auto scrollbar">
				{!lessonSelected && (
					<div className="w-full">
						<Card className="m-[16px]">
							<div className="w-full h-[300px] all-center">
								<Empty />
							</div>
						</Card>

						<Card className="shadow-sm">
							<div className="smartphone:m-3 tablet:m-6 desktop:m-12">
								<Tabs
									type="card"
									onChange={(data) => {
										data == '5' && setOnReloadReviewTab(onReloadReviewTab + 1)
									}}
								>
									<TabPane tab="Giới thiệu" key="1">
										<VideoCourseDescription courseDetail={courseDetail} User={user} onFetchData={() => getCourseDetail()} />
									</TabPane>

									<TabPane tab="Hỏi đáp" key="2">
										<QuestionInCourse videoCourseID={Number(courseID)} />
									</TabPane>

									<TabPane tab="Thông báo" key="3">
										<NotificationInVideoCourse videoCourseID={Number(courseID)} />
									</TabPane>

									{(isAdmin() || isTeacher() || isManager() || isAcademic()) && (
										<TabPane tab="Học viên" key="4">
											<StudentListInCourse videoCourseID={Number(courseID)} />
										</TabPane>
									)}

									<TabPane tab="Đánh giá" key="5">
										<ReviewVideoCourse videoCourseID={Number(courseID)} onReloadReviewTab={onReloadReviewTab} />
									</TabPane>
								</Tabs>
							</div>
						</Card>
					</div>
				)}

				{!!lessonSelected && lessonSelected?.Type == 1 && (
					<div className="w-full">
						{lessonSelected.VideoUrl?.length > 0 && (
							<iframe
								className="w-full aspect-video"
								src={lessonSelected.VideoUrl}
								title="YouTube video player"
								frameBorder={0}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							/>
						)}

						{lessonSelected.VideoUrl?.length == 0 && (
							<Card className="m-[16px]">
								<div className="w-full h-[300px] all-center">
									<Empty />
								</div>
							</Card>
						)}

						<div className="smartphone:m-3 tablet:m-6 desktop:m-12 pt-6 text-2xl font-bold in-1-line">{lessonSelected.Name}</div>

						<div className="smartphone:m-3 tablet:m-6 desktop:m-12 pt-0">
							<Card className="shadow-sm">
								<Tabs
									type="card"
									onChange={(data) => {
										data == '5' && setOnReloadReviewTab(onReloadReviewTab + 1)
									}}
								>
									<TabPane tab="Giới thiệu" key="1">
										<VideoCourseDescription courseDetail={courseDetail} User={user} onFetchData={getCourseDetail} />
									</TabPane>
									<TabPane tab="Hỏi đáp" key="2">
										<QuestionInCourse videoCourseID={Number(courseID)} />
									</TabPane>
									<TabPane tab="Thông báo" key="3">
										<NotificationInVideoCourse videoCourseID={Number(courseID)} />
									</TabPane>
									{(isAdmin() || isTeacher() || isManager() || isAcademic()) && (
										<TabPane tab="Học viên" key="4">
											<StudentListInCourse videoCourseID={Number(courseID)} />
										</TabPane>
									)}
									<TabPane tab="Đánh giá" key="5">
										<ReviewVideoCourse videoCourseID={Number(courseID)} onReloadReviewTab={onReloadReviewTab} />
									</TabPane>
								</Tabs>
							</Card>
						</div>
					</div>
				)}
			</div>

			<div
				className={`desktop:w-1/4 transition-all h-[calc(100vh_-_56px)] overflow-y-auto border-x border-tw-gray bg-tw-white ${
					openMenuCourse
						? 'absolute right-0 w-[90%] tablet:w-[60%] z-10 after:content-[""] after:-z-10 after:block after:fixed after:top-[56px] after:right-0 after:bg-[rgba(0,0,0,0.3)] after:w-full after:h-full active-menu-mobile'
						: 'fixed w-[90%] -right-[90%] tablet:w-[60%] tablet:-right-[60%] desktop:block desktop:right-0 scrollbar'
				}`}
			>
				<div className="h-16 bg-tw-white flex justify-between align-center">
					<p className="desktop:pt-0 text-base my-auto px-4 font-bold">Nội dung khóa học</p>
					{isStdent() && <p className="tablet:hidden my-auto px-4 text-base font-bold text-[#ab1d38]">{completedPercent?.toFixed(2)}%</p>}

					{(isAdmin() || isManager() || isAcademic()) && (
						<button
							onClick={() => setIsChangePositionSection(!isChangePositionSection)}
							className="w-fit my-4 pr-4 flex items-center justify-center"
						>
							<RiExchangeLine size={22} className="text-tw-black font-bold mr-2" />{' '}
							<span className="text-tw-black text-bold text-base ">Đổi vị trí chương</span>
						</button>
					)}
				</div>

				<div className="overflow-y-auto scrollbar h-full bg-tw-white">
					<SectionVideo
						section={section}
						getSection={getSection}
						isChangePositionSection={isChangePositionSection}
						setLessonSelected={setLessonSelected}
						setOpenMenuCourse={setOpenMenuCourse}
					/>
				</div>
			</div>
		</div>
	)
}

export default WrapLesson
