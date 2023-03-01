import { Dropdown, Rate } from 'antd'
import { useRouter } from 'next/router'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { GiRoundStar } from 'react-icons/gi'
import { VideoCourseApi } from '~/api/course/video-course/video-course'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '../../../Primary/Button'
import CreateVideoCourse from '../CreateVideoCourse'
import { parseToMoney } from '~/common/utils/common'
import { FaUsers } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import StudentControl from './student-control'
import AdminControl from './admin-control'

const VideoItem = (props) => {
	const { Item, onFetchData, UserRoleID, onRefresh } = props

	const router = useRouter()

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

	const onActiveCourse = async () => {
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
		}
	}

	/**
	 * Delete a course
	 * @param data - The data of the course that you want to delete
	 */
	const onDeleteCourse = async (data) => {
		try {
			let res = await VideoCourseApi.delete(Item.Id)
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				onRefresh()
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
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
			<CreateVideoCourse defaultData={Item} isEdit onRefresh={onRefresh} />
			<PrimaryButton background="red" type="button" icon="remove" onClick={onDeleteCourse}>
				Xoá khoá học
			</PrimaryButton>
		</div>
	)

	function viewDetails() {
		router.push({ pathname: '/course/videos/detail', query: { slug: Item?.Id } })
	}

	return (
		<div className="video-item-container group">
			<div className="relative video_course">
				{(isAdmin() || isManager() || isAcademic()) && (
					<div className={`${Item.Active ? 'bg-tw-green' : 'bg-[#c4c4c4]'} video-status-tag`}>{Item.Active ? 'Hiện' : 'Ẩn'}</div>
				)}

				{isStdent() && (
					<div className={`${Item.Status == 1 ? 'bg-tw-primary' : Item.Status == 2 ? 'bg-[#43A047]' : 'bg-tw-green'} video-status-tag`}>
						{Item?.StatusName}
					</div>
				)}

				<img src={!!Item?.Thumbnail ? Item.Thumbnail : '/video-default-thumnails.jpg'} className="videos-thumnail linear" />

				<div className="video-blur linear" />

				<div className="video-option-menu linear">
					<AdminControl item={Item} onRefresh={onRefresh} />
					<StudentControl item={Item} onRefresh={onRefresh} />
				</div>
			</div>

			<div className="p-3">
				<p className="video-name">{Item.Name}</p>

				{!!Item?.Price && <div className="video-price text-[#E64A19]">{parseToMoney(Item.Price)}</div>}
				{!Item?.Price && <div className="video-price text-[#1976D2]">Miễn phí</div>}

				<div className="all-center">
					<div className="row-center gap-2 w-full">
						<p className="text-base text-[#000000]">
							<FaUsers className="mt-[-2px]" size={20} />
						</p>

						<p className="text-base text-[#666666] font-semibold">{Item.TotalStudent}</p>

						<Rate
							defaultValue={Item.TotalRate}
							allowHalf
							character={<GiRoundStar />}
							disabled
							className="text-[#ffe819] ml-[8px]"
							style={{ lineHeight: 0 }}
						/>
					</div>

					{(isAdmin() || isManager() || isAcademic()) && (
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

export default VideoItem
