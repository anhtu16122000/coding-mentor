import { Popconfirm, Popover, Rate, Skeleton, Spin } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { HiMail, HiPhone } from 'react-icons/hi'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import { TiLocation } from 'react-icons/ti'
import { useSelector } from 'react-redux'
import { feedbackStudentApi } from '~/api/feedbacks-student'
import { userInformationApi } from '~/api/user'
import PrimaryButton from '~/common/components/Primary/Button'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import FeedbackBlock from './FeedbackBlock'

export interface IFeedbackDetailPageProps {}

export default function FeedbackDetailPage(props: IFeedbackDetailPageProps) {
	const router = useRouter()

	const [dataSource, setDataSource] = useState<any>(null)
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [userInformation, setUserInformation] = useState<any>()
	const [isVisiblePopover, setIsVisiblePopover] = useState(false)

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

	function isParent() {
		return user?.RoleId == 8
	}

	const getStudentInformation = async (userID) => {
		setIsLoading({ type: 'GET_USER', status: true })
		try {
			let res = await userInformationApi.getByID(userID)
			if (res.status == 200) {
				setUserInformation(res.data.data)
			} else {
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
				if (!!res.data.data?.CreatedIdBy) {
					getStudentInformation(res.data.data.CreatedIdBy)
				}
			} else {
				setDataSource(null)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
		}
	}

	useEffect(() => {
		if (!!router.query?.feedbackId) {
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

	if (isLoading.type == 'GET_DETAIL' && isLoading.status) {
		return <Skeleton active />
	}

	return (
		<div className="feedback-student-detail">
			{isLoading.type == 'GET_USER' && isLoading.status ? (
				<Skeleton active />
			) : (
				<div className="information-block">
					<div className="avatar">
						{!!dataSource?.IsIncognito && <img src="/images/default-avatar.svg" />}
						{!dataSource?.IsIncognito && (
							<img src={userInformation?.Avatar?.length > 0 ? userInformation.Avatar : '/images/default-avatar.svg'} alt="student-avatar" />
						)}
					</div>
					{!!dataSource?.IsIncognito && <div className="name mb-[8px]">Ẩn danh</div>}
					{!dataSource?.IsIncognito && (
						<>
							<div className="name">{userInformation?.FullName}</div>
							<div className="user-name">{userInformation?.UserName}</div>
						</>
					)}
					<div className="horizontal" />
					{!isParent() && (
						<div className="actions">
							{(isAdmin() || isStdent()) && (
								<div className="w-full flex justify-center">
									<div className="flex justify-start items-center gap-4">
										<Rate
											className="bg-[blue]"
											style={{ marginBottom: -6 }}
											defaultValue={dataSource?.StarRating}
											onChange={(data) => handleRating(data)}
										/>
										{isLoading.type == 'PUT_RATING' && isLoading.status && <Spin />}
									</div>
								</div>
							)}
							{!isStdent() && (
								<Popconfirm
									title="Bạn muốn hoàn thành phản hồi này?"
									onConfirm={() => handleChangeStatus(dataSource?.Id)}
									placement="topRight"
									disabled={dataSource?.Status == 3}
									okText="Xác nhận"
									cancelText="Hủy"
								>
									<PrimaryButton
										type="button"
										icon="check"
										className="mt-[8px]"
										background={dataSource?.Status == 3 ? 'disabled' : 'green'}
									>
										{dataSource?.StatusName}
									</PrimaryButton>
								</Popconfirm>
							)}
							<div className="w-full flex justify-center mt-[8px]">
								{isStdent() && dataSource?.Status == 3 && <div className="tag green">{dataSource?.StatusName}</div>}
								{isStdent() && dataSource?.Status == 2 && <div className="tag blue">{dataSource?.StatusName}</div>}
								{isStdent() && dataSource?.Status == 1 && <div className="tag red">{dataSource?.StatusName}</div>}
							</div>
						</div>
					)}
					{!dataSource?.IsIncognito && (
						<>
							<div className="horizontal"></div>
							<div className="contact">
								<p className="title font-[600]">Thông tin liên hệ</p>
								<div className="item">
									<div className="icon">
										<HiMail size={16} />
									</div>
									<div className="text">
										<div className="main-content">{userInformation?.Email}</div>
									</div>
								</div>
								<div className="item">
									<div className="icon">
										<HiPhone />
									</div>
									<div className="text">
										<div className="main-content">{userInformation?.Mobile}</div>
									</div>
								</div>
								{!!userInformation?.Address && (
									<div className="item">
										<div className="icon">
											<TiLocation />
										</div>
										<div className="text">
											<div className="title">Địa chỉ</div>
											<div className="main-content">{userInformation?.Address}</div>
										</div>
									</div>
								)}
							</div>
						</>
					)}
				</div>
			)}

			<FeedbackBlock feedbackDetail={dataSource} />
		</div>
	)
}
