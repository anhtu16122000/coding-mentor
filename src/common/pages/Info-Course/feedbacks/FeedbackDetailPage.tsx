import { Popconfirm, Popover, Rate, Skeleton, Spin } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { BsFillTelephoneFill } from 'react-icons/bs'
import { HiMail, HiPhone } from 'react-icons/hi'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import { TiLocation } from 'react-icons/ti'
import { feedbackStudentApi } from '~/api/feedbacks-student'
import { userInformationApi } from '~/api/user'
import PrimaryButton from '~/common/components/Primary/Button'
import IconButton from '~/common/components/Primary/IconButton'
import { ShowNoti } from '~/common/utils'
import FeedbackBlock from './FeedbackBlock'

export interface IFeedbackDetailPageProps {}

export default function FeedbackDetailPage(props: IFeedbackDetailPageProps) {
	const router = useRouter()
	const [dataSource, setDataSource] = useState<IFeedbackStudent>()
	console.log('🚀 ~ dataSource:', dataSource)
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [userInformation, setUserInformation] = useState<IUserResponse>()
	const [isVisiblePopover, setIsVisiblePopover] = useState(false)

	const getUserInformation = async (userID) => {
		setIsLoading({ type: 'GET_USER', status: true })
		try {
			let res = await userInformationApi.getByID(userID)
			if (res.status == 200) {
				setUserInformation(res.data.data)
			}
			if (res.status == 204) {
				setUserInformation(null)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
		}
	}
	const getDetailFeedbacks = async () => {
		setIsLoading({ type: 'GET_DETAIL', status: true })
		try {
			let res = await feedbackStudentApi.getByID(router.query.feedbackId)
			if (res.status == 200) {
				setDataSource(res.data.data)
				getUserInformation(res.data.data.CreatedIdBy)
			}
			if (res.status == 204) {
				setDataSource(null)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
		}
	}

	useEffect(() => {
		if (router.query) {
			getDetailFeedbacks()
		}
	}, [router])

	const handleRating = async (data) => {
		setIsLoading({ type: 'PUT_RATING', status: true })
		try {
			let res = await feedbackStudentApi.updateRating({ Id: router.query.feedbackId, Rating: data })
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				setIsVisiblePopover(false)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
		}
	}

	const handleChangeStatus = async (ID) => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await feedbackStudentApi.update({ Id: ID, Status: 3 })
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				getDetailFeedbacks()
			}
			if (res.status == 204) {
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
		}
	}

	const contentRating = (
		<div className="rounded-xl">
			<div className="flex justify-start items-center gap-4">
				<Rate
					defaultValue={dataSource?.StarRating}
					onChange={(data) => {
						handleRating(data)
					}}
				/>
				{isLoading.type == 'PUT_RATING' && isLoading.status && <Spin />}
			</div>
		</div>
	)

	if (isLoading.type == 'GET_DETAIL' && isLoading.status) {
		return <Skeleton active />
	}

	return (
		<div className="feedback-student-detail">
			{isLoading.type == 'GET_USER' && isLoading.status ? (
				<Skeleton active />
			) : (
				<div className="information-block">
					<div
						className="back-button"
						onClick={() => {
							router.back()
						}}
					>
						<MdKeyboardArrowLeft /> Quay lại
					</div>

					<div className="avatar">
						<img src={userInformation?.Avatar?.length > 0 ? userInformation.Avatar : '/images/default-avatar.svg'} alt="" />
					</div>
					<div className="name">{userInformation?.FullName}</div>
					<div className="user-name">{userInformation?.UserName}</div>

					<div className="horizontal"></div>

					<div className="actions">
						<Popover
							placement="bottomLeft"
							trigger="click"
							open={isVisiblePopover}
							onOpenChange={(visible) => setIsVisiblePopover(visible)}
							content={contentRating}
							title="Đánh giá"
						>
							<PrimaryButton background="yellow" type="button" children={<span>Đánh giá</span>} icon="arrow-down" />
						</Popover>
						<Popconfirm
							title="Bạn muốn hoàn thành phản hồi này?"
							onConfirm={() => {
								handleChangeStatus(dataSource?.Id)
							}}
							placement="topRight"
							disabled={dataSource?.Status == 3}
							onCancel={() => {}}
							okText="Xác nhận"
							cancelText="Hủy"
						>
							<PrimaryButton
								type="button"
								icon="check"
								className=""
								background={dataSource?.Status == 3 ? 'disabled' : 'green'}
								children={dataSource?.Status == 3 ? 'Đã xong' : 'Hoàn tất phản hồi'}
							/>
						</Popconfirm>
					</div>

					<div className="horizontal"></div>

					<div className="contact">
						<p className="title">Thông tin liên hệ</p>
						<div className="item">
							<div className="icon">
								<HiMail />
							</div>
							<div className="text">
								<div className="title">Email</div>
								<div className="main-content">{userInformation?.Email}</div>
							</div>
						</div>
						<div className="item">
							<div className="icon">
								<HiPhone />
							</div>
							<div className="text">
								<div className="title">Phone</div>
								<div className="main-content">{userInformation?.Mobile}</div>
							</div>
						</div>
						<div className="item">
							<div className="icon">
								<TiLocation />
							</div>
							<div className="text">
								<div className="title">Địa chỉ</div>
								<div className="main-content">{userInformation?.Address}</div>
							</div>
						</div>
					</div>
				</div>
			)}

			<FeedbackBlock feedbackDetail={dataSource} />
		</div>
	)
}
