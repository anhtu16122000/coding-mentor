import { Popconfirm, Skeleton } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AnswerQuestionInVideoCourseApi } from '~/api/course/video-course/answer-question-in-video-course'
import { QuestionInVideoCourseApi } from '~/api/course/video-course/question-in-video-course'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import PrimaryButton from '../../Primary/Button'
import IconButton from '../../Primary/IconButton'

export interface IQuestionInCourseItemProps {
	Item: IQuestionInVideoCourse
	onFetchData: Function
}

export default function QuestionInCourseItem(props: IQuestionInCourseItemProps) {
	const { Item, onFetchData } = props

	const user = useSelector((state: RootState) => state.user.information.RoleId)

	const [dataAnswer, setDataAnswer] = useState<IAnswerQuestionInVideoCourse[]>()
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [isAddAnswer, setIsAddAnswer] = useState(false)
	const [contentAnswer, setContentAnswer] = useState('')

	const getDataAnswer = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await AnswerQuestionInVideoCourseApi.getAll(Item.Id)
			if (res.status == 200) {
				setDataAnswer(res.data.data)
				setIsAddAnswer(false)
			} else {
				setDataAnswer([])
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	useEffect(() => {
		if (Item) {
			getDataAnswer()
		}
	}, [Item])

	const handleAddAnswer = async () => {
		setIsLoading({ type: 'ADD_ANSWER', status: true })
		try {
			let res = await AnswerQuestionInVideoCourseApi.addQuestion({ QuestionInVideoId: Item.Id, Content: contentAnswer })
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				getDataAnswer()
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'ADD_ANSWER', status: false })
		}
	}

	const handleRemoveAnswer = async (item) => {
		setIsLoading({ type: 'REMOVE', status: true })
		try {
			let res = await AnswerQuestionInVideoCourseApi.deleteQuestion(item.Id)
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				getDataAnswer()
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'REMOVE', status: false })
		}
	}

	const handleRemoveQuestion = async (item) => {
		setIsLoading({ type: 'ADD_QUESTION', status: true })
		try {
			let res = await QuestionInVideoCourseApi.deleteQuestion(item.Id)
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				onFetchData && onFetchData()
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'ADD_QUESTION', status: false })
		}
	}

	return (
		<div className="mb-4 antd-custom-wrap">
			<div className="flex gap-2 justify-start items-center">
				<img className="w-9 h-9 rounded-full" src={Item.Avatar?.length > 0 ? Item.Avatar : '/images/default-avatar.svg'} alt="avatar" />
				<p className="text-2xl font-bold">{Item.FullName}</p>
			</div>

			<div className="flex gap-2 justify-between items-start">
				<p>{Item.Content}</p>

				{user == '1' ? (
					<Popconfirm
						title="Bạn xác nhận xóa câu hỏi này?"
						okButtonProps={{ loading: isLoading.type == 'REMOVE' && isLoading.status }}
						onConfirm={() => handleRemoveQuestion(Item)}
						onCancel={() => {}}
						okText="Xác nhận"
						cancelText="Hủy"
					>
						<IconButton type="button" icon="remove" color="primary" onClick={() => {}} tooltip="" />
					</Popconfirm>
				) : (user == '3' || user == '2') && Number(user) == Number(Item.UserId) ? (
					<Popconfirm
						title="Bạn xác nhận xóa câu hỏi này?"
						okButtonProps={{ loading: isLoading.type == 'REMOVE' && isLoading.status }}
						onConfirm={() => handleRemoveQuestion(Item)}
						onCancel={() => {}}
						okText="Xác nhận"
						cancelText="Hủy"
					>
						<IconButton type="button" icon="remove" color="primary" onClick={() => {}} tooltip="" />
					</Popconfirm>
				) : (
					<></>
				)}
			</div>

			<div className="flex justify-start items-center mb-2">
				<button
					className="text-tw-blue font-semibold cursor-pointer opacity-70 hover:opacity-100 mr-2"
					onClick={() => setIsAddAnswer(!isAddAnswer)}
				>
					Trả lời
				</button>
				<span> {moment(Item.CreatedOn).format('DD/MM/YYYY - HH:mm:ss')}</span>
			</div>

			{isLoading.type == 'GET_ALL' && isLoading.status ? (
				<Skeleton />
			) : (
				<div className="bg-[#f6f6f6] shadow-sm rounded-md mx-6 px-4 py-3">
					{!!dataAnswer && dataAnswer.length > 0 ? (
						<>
							{isAddAnswer && (
								<div className={`flex flex-col gap-2 h-0 transition-all transition-400 ${isAddAnswer ? 'h-auto' : 'h-0'}`}>
									<TextArea
										rows={4}
										className="rounded-lg"
										onChange={(e) => setContentAnswer(e.target.value)}
										placeholder="Nhập câu trả lời"
									/>
									<PrimaryButton
										background="blue"
										disable={isLoading.type == 'ADD_ANSWER' && isLoading.status}
										loading={isLoading.type == 'ADD_ANSWER' && isLoading.status}
										type="button"
										className="ml-auto"
										icon="save"
										onClick={handleAddAnswer}
									>
										Phản hồi
									</PrimaryButton>
								</div>
							)}

							{dataAnswer?.map((item, index) => {
								return (
									<div key={index} className="p-[8px] mb-[8px] border-b border-[#cfcfcf] last:border-b-0">
										<div className="flex gap-2 justify-start items-center">
											<img
												className="w-9 h-9  rounded-full"
												src={item.Avatar?.length > 0 ? item.Avatar : '/images/default-avatar.svg'}
												alt="avatar"
											/>
											<span className=" font-bold">{item.FullName}</span>
											<span> {moment(item.CreatedOn).format('DD/MM/YYYY - HH:mm:ss')}</span>
										</div>

										<div className="pl-11 flex gap-2 justify-between items-start">
											<p>{item.Content}</p>
											{user == '1' ? (
												<Popconfirm
													title="Bạn xác nhận xóa câu trả lời này?"
													okButtonProps={{ loading: isLoading.type == 'REMOVE' && isLoading.status }}
													onConfirm={() => {
														handleRemoveAnswer(item)
													}}
													onCancel={() => {}}
													okText="Xác nhận"
													cancelText="Hủy"
												>
													<IconButton type="button" icon="remove" color="primary" onClick={() => {}} tooltip="" />
												</Popconfirm>
											) : (user == '3' || user == '2') && Number(user) == Number(item.UserId) ? (
												<Popconfirm
													title="Bạn xác nhận xóa câu trả lời này?"
													okButtonProps={{ loading: isLoading.type == 'REMOVE' && isLoading.status }}
													onConfirm={() => {
														handleRemoveAnswer(item)
													}}
													onCancel={() => {}}
													okText="Xác nhận"
													cancelText="Hủy"
												>
													<IconButton type="button" icon="remove" color="primary" onClick={() => {}} tooltip="" />
												</Popconfirm>
											) : (
												<></>
											)}
										</div>
									</div>
								)
							})}
						</>
					) : (
						<>
							<p className="">Chưa có câu trả lời!</p>
							{isAddAnswer && (
								<div className={`flex flex-col gap-2 h-0 transition-all transition-400 ${isAddAnswer ? 'h-auto' : 'h-0'}`}>
									<TextArea
										rows={4}
										className="rounded-lg"
										onChange={(e) => setContentAnswer(e.target.value)}
										placeholder="Nhập câu trả lời"
									/>
									<PrimaryButton
										background="blue"
										disable={isLoading.type == 'ADD_ANSWER' && isLoading.status}
										loading={isLoading.type == 'ADD_ANSWER' && isLoading.status}
										type="button"
										className="ml-auto"
										icon="save"
										onClick={handleAddAnswer}
									>
										Lưu
									</PrimaryButton>
								</div>
							)}
						</>
					)}
				</div>
			)}
		</div>
	)
}
