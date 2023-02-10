import { Dropdown, Rate } from 'antd'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { FiUsers } from 'react-icons/fi'
import { GiRoundStar } from 'react-icons/gi'
import { StudentListInCourseApi } from '~/api/course/video-course/student-list-in-video-course'
import { VideoCourseApi } from '~/api/course/video-course/video-course'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '../../Primary/Button'
import ModalAddVideoCourse from './ModalAddVideoCourse'

const VideoCourseItem = (props) => {
	const { Item, onFetchData, prerequisiteCourse, UserRoleID } = props
	const router = useRouter()
	const [isLoading, setIsLoading] = useState({ type: '', status: false })

	const onUpdateCourse = async (data) => {
		setIsLoading({ type: 'SUBMIT_SECTION', status: true })
		try {
			let res = await VideoCourseApi.update(data)
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				onFetchData && onFetchData()
			}
			return true
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'SUBMIT_SECTION', status: false })
		}
	}

	const onRemoveCourse = async (data) => {
		setIsLoading({ type: 'SUBMIT_SECTION', status: true })
		try {
			let res = await VideoCourseApi.delete(data.Id)
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				onFetchData && onFetchData()
			}
			return true
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'SUBMIT_SECTION', status: false })
		}
	}

	const onActiveCourse = async () => {
		setIsLoading({ type: 'SUBMIT_SECTION', status: true })
		try {
			let res = await VideoCourseApi.update({ Id: Item.Id, Active: !Item.Active })
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				onFetchData && onFetchData()
			}
			return true
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'SUBMIT_SECTION', status: false })
		}
	}

	const onRegisterCourse = async (Id) => {
		setIsLoading({ type: 'REGISTER_COURSE', status: true })
		try {
			let res = await StudentListInCourseApi.addVideoCourse(Id)
			if (res.status == 200) {
				router.push({
					pathname: '/course/video-course/detail',
					query: { slug: Id }
				})
				ShowNoti('success', res.data.message)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'REGISTER_COURSE', status: false })
		}
	}

	const content = (
		<div className="drop-shadow-lg rounded-xl px-3 py-3 bg-tw-white flex flex-col gap-2 z-10">
			<PrimaryButton
				background="blue"
				type="button"
				children={<span>{Item.Active ? 'Ẩn khóa học' : 'Hiện khóa học'}</span>}
				icon={Item.Active ? 'hide' : 'eye'}
				onClick={() => onActiveCourse()}
			/>
			<ModalAddVideoCourse
				item={Item}
				mode="edit"
				prerequisiteCourse={prerequisiteCourse}
				isLoading={isLoading}
				onSubmit={onUpdateCourse}
			/>
			<ModalAddVideoCourse
				item={Item}
				mode="remove"
				prerequisiteCourse={prerequisiteCourse}
				isLoading={isLoading}
				onSubmit={onRemoveCourse}
			/>
		</div>
	)

	return (
		<div className="video_course-item antd-custom-wrap m-2 rounded-xl group bg-tw-white hover:drop-shadow-lg linear duration-400">
			<div className="relative video_course">
				{/* tag */}
				{UserRoleID == '1' && (
					<div
						className={`absolute ${
							Item.Active ? 'bg-tw-green' : 'bg-[#c4c4c4]'
						} top-0 left-0 text-tw-white px-3 py-2 rounded-tl-xl rounded-br-xl z-20`}
					>
						{Item.Active ? 'Hiện' : 'Ẩn'}
					</div>
				)}
				{UserRoleID == '3' && (
					<div
						className={`absolute ${
							Item.Status == 1 ? 'bg-tw-primary' : Item.Status == 2 ? 'bg-tw-yellow' : 'bg-tw-green'
						} top-0 left-0 text-tw-white px-3 py-2 rounded-tl-xl rounded-br-xl z-20`}
					>
						{Item.Status == 1 ? 'Chưa học' : Item.Status == 2 ? 'Đang học' : 'Hoàn thành'}
					</div>
				)}
				{/*  */}
				<img
					src={Item.Thumbnail?.length > 0 ? Item.Thumbnail : '/images/video-course-alt.jpg'}
					className="object-cover w-full h-56 rounded-xl group-hover:rounded-br-none group-hover:rounded-bl-none linear duration-400"
				/>
				<div className="absolute top-0 bottom-0 left-0 right-0 backdrop-blur-none group-hover:backdrop-blur-sm z-10 linear duration-500 rounded-xl group-hover:rounded-bl-none group-hover:rounded-br-none"></div>
				<div className="absolute top-8 group-hover:top-0 bottom-0 right-0 left-0 opacity-tw-0 group-hover:opacity-tw-10 linear duration-500 z-20 flex justify-center items-center ">
					<div>
						{(UserRoleID == '1' || UserRoleID == '2' || (UserRoleID == '3' && Item.Status != 1)) && (
							<PrimaryButton
								background="blue"
								type="button"
								disable={UserRoleID == '3' && Item.Disable}
								icon="eye"
								onClick={() => {
									router.push({
										pathname: '/course/video-course/detail',
										query: { slug: Item?.Id }
									})
								}}
							>
								Xem khóa học
							</PrimaryButton>
						)}
						{UserRoleID == '3' && Item.Status == 1 && (
							<PrimaryButton
								background="green"
								type="button"
								className="w-fit"
								children={<span>Đăng ký học</span>}
								icon="edit"
								onClick={() => onRegisterCourse(Item.Id)}
							/>
						)}
					</div>
				</div>
			</div>

			<div className="p-3">
				<p className="text-[18px] font-[600] mb-2 line-clamp-1">{Item.Name}</p>
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2 w-3/4 ">
						<p className="text-base text-[#666666]">
							<FiUsers />
						</p>
						<p className="text-base text-[#666666] font-semibold">{Item.TotalStudent}</p>
						<Rate defaultValue={Item.TotalRate} allowHalf character={<GiRoundStar />} disabled className="text-tw-yellow" />
					</div>

					{UserRoleID == '1' && (
						<div className="flex items-center justify-end gap-2 w-1/4">
							<Dropdown overlay={content} placement="topRight" overlayClassName="z-50">
								<button>
									<BsThreeDotsVertical />
								</button>
							</Dropdown>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default VideoCourseItem
VideoCourseItem.propTypes = {
	Item: PropTypes.shape({
		Name: PropTypes.string,
		Thumbnail: PropTypes.string,
		Stag: PropTypes.string,
		Description: PropTypes.string,
		Active: PropTypes.bool,
		BeforeCourseId: PropTypes.number,
		BeforeCourseName: PropTypes.string,
		TotalRate: PropTypes.number,
		TotalStudent: PropTypes.number,
		Id: PropTypes.number,
		Enable: PropTypes.bool,
		CreatedOn: PropTypes.string,
		CreatedBy: PropTypes.string,
		ModifiedOn: PropTypes.string,
		ModifiedBy: PropTypes.string
	}),
	prerequisiteCourse: PropTypes.array,
	UserRoleID: PropTypes.object,
	onFetchData: PropTypes.func
}
