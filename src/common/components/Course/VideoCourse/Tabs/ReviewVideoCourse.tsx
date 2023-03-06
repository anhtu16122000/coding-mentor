import { Modal, Rate } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { GiRoundStar } from 'react-icons/gi'
import { useSelector } from 'react-redux'
import { StudentListInCourseApi } from '~/api/course/video-course/student-list-in-video-course'
import PrimaryButton from '~/common/components/Primary/Button'
import IconButton from '~/common/components/Primary/IconButton'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'

export interface IReviewVideoCourseProps {
	videoCourseID: number
	onReloadReviewTab: number
}

export default function ReviewVideoCourse(props: IReviewVideoCourseProps) {
	const user = useSelector((state: RootState) => state.user.information)
	const { videoCourseID, onReloadReviewTab } = props
	const [dataSource, setDataSource] = useState<IReviewVideoCourse[]>()
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [isModalVisible, setIsModalVisible] = useState(false)

	const showModal = () => {
		setIsModalVisible(true)
	}

	const handleCancel = () => {
		setIsModalVisible(false)
	}

	const getDataSource = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		setIsLoading({ type: '', status: true })
		try {
			let res = await StudentListInCourseApi.getRate(videoCourseID)
			if (res.status == 200) {
				setDataSource(res.data.data)
			}
			if (res.status == 204) {
				setDataSource([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
		}
	}

	useEffect(() => {
		getDataSource()
	}, [onReloadReviewTab])

	const handleDeleteComment = async (item) => {
		try {
			const data = {
				VideoCourseId: item.VideoCourseId,
				MyRate: 0,
				RateComment: ''
			}
			const res = await StudentListInCourseApi.addRate(data)
			if (res.status == 200) {
				getDataSource()
				setIsModalVisible(false)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	return (
		<div className="container">
			{dataSource?.map((item) => {
				return (
					<div className="relative flex gap-4 justify-start items-start mb-tw-6 last:mb-tw-0 bg-[#f4f4f4] p-[8px] rounded-[6px]">
						<img
							className="rounded-full w-[50px] h-[50px] max-w-none"
							src={!!item.Avatar && item.Avatar.length > 0 ? item.Avatar : '/images/default-avatar.svg'}
							alt="avatar reviewer"
						/>
						<div>
							<p className="text-[16px] font-[600]">{item.FullName}</p>
							<p className="text-[#949494] text-[14px]">{moment(item.CreatedOn).format('DD/MM/YYYY HH:mm')}</p>
							<div className="flex gap-2 justify-start items-center text-sm my-2">
								<Rate
									defaultValue={item.MyRate}
									value={item.MyRate}
									character={<GiRoundStar size={18} />}
									allowHalf
									disabled
									className="text-tw-yellow group-hover:cursor-pointer"
								/>
							</div>
							<p>{item.RateComment}</p>
						</div>
						{user?.RoleId === '3' && user.UserInformationId == item.UserId && (
							<div className="absolute right-0">
								<IconButton onClick={() => showModal()} type="button" color="red" icon="remove" tooltip="Xóa đánh giá" />

								<Modal onCancel={handleCancel} title="Xóa đánh giá" visible={isModalVisible} footer={null}>
									<p>Bạn có chắc muốn xóa đánh giá này?</p>
									<div className="text-center mt-4">
										<PrimaryButton
											onClick={() => handleDeleteComment(item)}
											type="button"
											background="red"
											icon="remove"
											children="Xóa đánh giá"
										/>
									</div>
								</Modal>
							</div>
						)}
					</div>
				)
			})}
		</div>
	)
}
