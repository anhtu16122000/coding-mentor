import { Card, Spin } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FiCalendar } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { feedbackReplyApi, feedbackStudentApi } from '~/api/feedbacks-student'
import PrimaryButton from '~/common/components/Primary/Button'
import IconButton from '~/common/components/Primary/IconButton'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import ModalFeedbackReplyCRUD from './ModalFeedbackReplyCRUD'

export interface IFeedbackBlockProps {
	feedbackDetail: IFeedbackStudent
}

const initialParams = { pageIndex: 1, pageSize: 9999 }

export default function FeedbackBlock(props: IFeedbackBlockProps) {
	const { feedbackDetail } = props

	const router = useRouter()

	const [dataSource, setDataSource] = useState<IFeedbackStudentReply[]>()
	const [isLoading, setIsLoading] = useState({ type: '', status: false })

	const userInformation = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return userInformation?.RoleId == 1
	}

	function isTeacher() {
		return userInformation?.RoleId == 2
	}

	function isManager() {
		return userInformation?.RoleId == 4
	}

	function isStdent() {
		return userInformation?.RoleId == 3
	}

	function isAccountant() {
		return userInformation?.RoleId == 6
	}

	function isAcademic() {
		return userInformation?.RoleId == 7
	}

	function isParent() {
		return userInformation?.RoleId == 8
	}

	const getFeedbacks = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await feedbackReplyApi.getAll({ ...initialParams, FeedbackId: router.query.feedbackId })
			if (res.status == 200) {
				setDataSource(res.data.data)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
		}
	}

	const getFeedbacksUpdate = async () => {
		setIsLoading({ type: 'GET_UPDATE', status: true })
		try {
			let res = await feedbackReplyApi.getAll({ ...initialParams, FeedbackId: router.query.feedbackId })
			if (res.status == 200) {
				setDataSource(res.data.data)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
		}
	}

	const _onSubmit = async (data) => {
		setIsLoading({ type: 'GET_UPDATE', status: true })
		try {
			let res
			if (data.mode == 'add') {
				res = await feedbackReplyApi.add({ Content: data.Content, FeedbackId: router.query.feedbackId })
			}
			if (data.mode == 'delete') {
				res = await feedbackReplyApi.delete(data.Id)
			}
			if (res.status == 200) {
				getFeedbacksUpdate()
				return res
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
		}
	}

	useEffect(() => {
		if (router.query) {
			getFeedbacks()
		}
	}, [router])

	return (
		<div className="feedback-block">
			<div className="detail-information">
				<div className="time">
					<div className="flex items-center ">
						<FiCalendar size={18} />

						<span style={{ color: '#8d8d90', marginLeft: 8 }}>{moment(feedbackDetail?.CreatedOn).format('DD/MM/YYYY HH:mm')}</span>
					</div>

					{!isParent() && (
						<ModalFeedbackReplyCRUD mode="add" isLoading={isLoading.type == 'SUBMIT' && isLoading.status} onSubmit={_onSubmit} />
					)}
				</div>
				<div className="title-feedback">{feedbackDetail?.Title}</div>
				<div className="content-feedback">{feedbackDetail?.Content}</div>
			</div>

			<div className="feedback-reply-wrap">
				{isLoading.type == 'GET_UPDATE' && isLoading.status && (
					<div className="flex justify-center items-center mt-4">
						<Spin />
					</div>
				)}
				{dataSource?.map((item, index) => {
					return (
						<div className="wrap-content-reply">
							<div
								className="item-reply"
								key={index}
								style={{
									borderBottom: index !== dataSource.length - 1 ? 1 : 0,
									borderBottomColor: '#e8eded',
									borderBottomStyle: 'solid'
								}}
							>
								<div className="left">
									<div className="avatar">
										<img src={item?.Avatar?.length > 0 ? item.Avatar : '/images/default-avatar.svg'} alt="" />
									</div>
								</div>

								<div className="right">
									<div className="information">
										<div className="left">
											<div style={{ fontSize: 16, fontWeight: 600 }}>{item.CreatedBy || 'Ẩn danh'}</div>
											<p style={{ color: '#8d8d90', fontSize: 14 }}>{moment(item.CreatedOn).format('DD/MM/YYYY HH:mm')}</p>
										</div>
									</div>

									<div className="content">
										<p>{item.Content}</p>
									</div>
								</div>
							</div>

							{!isParent() && (
								<>
									{userInformation?.UserInformationId == item.CreatedIdBy && (
										<ModalFeedbackReplyCRUD
											mode="delete"
											isLoading={isLoading.type == 'SUBMIT' && isLoading.status}
											onSubmit={_onSubmit}
											dataRow={item}
										/>
									)}
								</>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}
