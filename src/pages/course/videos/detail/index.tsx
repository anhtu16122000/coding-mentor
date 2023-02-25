import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai'
import { IoIosArrowBack } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { VideoCourseApi } from '~/api/course/video-course/video-course'
import { VideoCourseSectionApi } from '~/api/course/video-course/video-course-section'
import WrapLesson from '~/common/components/Course/VideoCourse/WrapLesson'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'

const VideoCourseDetail = () => {
	const user = useSelector((state: RootState) => state.user.information)

	const router = useRouter()
	const { slug: courseID } = router.query

	const [userRoleId, setUserRoleId] = useState(null)
	const [openMenuCourse, setOpenMenuCourse] = useState(false)
	const [courseDetail, setCourseDetail] = useState<IVideoCourse>()
	const [section, setSection] = useState<IVideoCourseSection[]>()
	const [lessonSelected, setLessonSelected] = useState<IVideoCourseSectionLesson>()
	const [completedPercent, setCompletedPercent] = useState(0)

	useEffect(() => {
		if (!!user) {
			setUserRoleId(user?.RoleId || null)
		}
	}, [user])

	const getCourseDetail = async () => {
		try {
			let res = await VideoCourseApi.getByID(courseID)
			if (res.status == 200) {
				setCourseDetail(res.data.data)
			}
			if (res.status == 204) {
				setCourseDetail(null)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	const getSection = async () => {
		try {
			let res: any = await VideoCourseSectionApi.getByVideoID(courseID)
			if (res.status == 200) {
				setSection(res.data.data)
				setCompletedPercent(res.data.complete !== 'NaN' ? res.data.complete : 0)
			}
			if (res.status == 204) {
				setSection([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	useEffect(() => {
		if (courseID) {
			getCourseDetail()
			getSection()
		}
	}, [courseID])

	const toggleMenuCourse = () => {
		setOpenMenuCourse(!openMenuCourse)
	}

	useEffect(() => {
		document.onclick = (e) => {
			const element = e.target as HTMLElement
			const getClass = element.classList.contains('active-menu-mobile')
			if (getClass) {
				setOpenMenuCourse(false)
			}
		}
	}, [])

	return (
		<>
			<header className="flex justify-between align-center h-16 bg-tw-primary">
				<div className="flex justify-start align-center gap-4 px-8">
					<button className="text-[#ffffff] text-2xl" onClick={() => router.push('/course/videos')}>
						{<IoIosArrowBack />}
					</button>
					<p className="m-auto in-1-line text-2xl font-bold text-white">{courseDetail?.Name}</p>
				</div>

				<div className="flex justify-end align-center gap-4 px-8">
					{userRoleId == '3' && (
						<p className="hidden tablet:block desktop:block text-tw-white m-auto font-bold">
							Đã hoàn thành: {completedPercent?.toFixed(2)}%
						</p>
					)}
					<button
						onClick={toggleMenuCourse}
						className={`desktop:hidden text-[#ffffff] text-2xl ${openMenuCourse ? 'active-menu-mobile' : ''}`}
					>
						{openMenuCourse ? <AiOutlineClose /> : <AiOutlineMenu />}
					</button>
				</div>
			</header>

			<WrapLesson
				section={section}
				lessonSelected={lessonSelected}
				getSection={getSection}
				getCourseDetail={getCourseDetail}
				completedPercent={completedPercent}
				courseID={courseID}
				courseDetail={courseDetail}
				openMenuCourse={openMenuCourse}
				setOpenMenuCourse={setOpenMenuCourse}
				setLessonSelected={setLessonSelected}
			/>
		</>
	)
}

export default VideoCourseDetail
