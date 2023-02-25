import { Dropdown, Rate } from 'antd'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { GiRoundStar } from 'react-icons/gi'
import { StudentListInCourseApi } from '~/api/course/video-course/student-list-in-video-course'
import { VideoCourseApi } from '~/api/course/video-course/video-course'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '../../Primary/Button'
import CreateVideoCourse from './CreateVideoCourse'
import { parseToMoney } from '~/common/utils/common'
import { FaUsers } from 'react-icons/fa'

const VideoCourseItem = (props) => {
	const { Item, onFetchData, UserRoleID, onRefresh } = props

	const router = useRouter()

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

	const onRegisterCourse = async (Id) => {
		try {
			let res = await StudentListInCourseApi.addVideoCourse(Id)
			if (res.status == 200) {
				router.push({
					pathname: '/course/videos/detail',
					query: { slug: Id }
				})
				ShowNoti('success', res.data.message)
			}
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

	return (
		<div className="video-item-container group">
			<div className="relative video_course">
				{UserRoleID == '1' && (
					<div className={`${Item.Active ? 'bg-tw-green' : 'bg-[#c4c4c4]'} video-status-tag`}>{Item.Active ? 'Hiện' : 'Ẩn'}</div>
				)}

				{UserRoleID == '3' && (
					<div className={`${Item.Status == 1 ? 'bg-tw-primary' : Item.Status == 2 ? 'bg-tw-yellow' : 'bg-tw-green'} video-status-tag`}>
						{Item.Status == 1 ? 'Chưa học' : Item.Status == 2 ? 'Đang học' : 'Hoàn thành'}
					</div>
				)}

				<img src={!!Item?.Thumbnail ? Item.Thumbnail : '/video-default-thumnails.jpg'} className="videos-thumnail linear" />

				<div className="absolute top-0 bottom-0 left-0 right-0 backdrop-blur-none group-hover:backdrop-blur-sm z-10 linear duration-500 rounded-xl group-hover:rounded-bl-none group-hover:rounded-br-none"></div>

				<div className="absolute top-8 group-hover:top-0 bottom-0 right-0 left-0 opacity-tw-0 group-hover:opacity-tw-10 linear duration-500 z-20 flex justify-center items-center ">
					<div>
						{(UserRoleID == '1' || UserRoleID == '2' || (UserRoleID == '3' && Item.Status != 1)) && (
							<PrimaryButton
								background="blue"
								type="button"
								disable={UserRoleID == '3' && Item.Disable}
								icon="eye"
								onClick={() => router.push({ pathname: '/course/videos/detail', query: { slug: Item?.Id } })}
							>
								Xem khóa học
							</PrimaryButton>
						)}

						{UserRoleID == '3' && Item.Status == 1 && (
							<PrimaryButton background="green" type="button" className="w-fit" icon="edit" onClick={() => onRegisterCourse(Item.Id)}>
								Đăng ký học
							</PrimaryButton>
						)}
					</div>
				</div>
			</div>

			<div className="p-3">
				<p className="text-[18px] font-[600] mb-2 line-clamp-1">{Item.Name}</p>
				{!!Item?.Price && <div className="text-[16px] font-[600] mb-2 text-[#E64A19]">{parseToMoney(Item.Price)}</div>}
				{!Item?.Price && <div className="text-[16px] font-[600] mb-2 text-[#1976D2]">Miễn phí</div>}

				<div className="flex justify-between items-center">
					<div className="flex items-center gap-2 w-3/4 ">
						<p className="text-base text-[#000000]">
							<FaUsers className="mt-[-2px]" size={20} />
						</p>

						<p className="text-base text-[#666666] font-semibold">{Item.TotalStudent}</p>

						<Rate
							defaultValue={Item.TotalRate}
							allowHalf
							character={<GiRoundStar />}
							disabled
							className="text-tw-yellow ml-[8px]"
							style={{ lineHeight: 0 }}
						/>
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
