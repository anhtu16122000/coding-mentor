import { FormOutlined } from '@ant-design/icons'
import { Button, Form, InputNumber, Modal, Skeleton, Spin, Tooltip } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { AiOutlineFileDone } from 'react-icons/ai'
import { FaFileMedicalAlt } from 'react-icons/fa'
import Mark from '..'
import { MarkApi } from '~/api/exam/mark'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import CommentItem from '../Comment'
import PrimaryButton from '../../Primary/Button'
import { ShowNostis, log } from '~/common/utils'

type IDataRow = {
	Content: string
	DescribeAnswer: string
	ExerciseAnswer: Array<any>
	ExerciseID: number
	ID: number
	Level: number
	LevelName: string
	LinkAudio: string
	Point: number
	PointMax: number
	SetPackageExerciseAnswerStudent: Array<any>
	SkillID: number
	SkillName: string
	Type: number
	TypeName: string
	inputID: any
	isDone: boolean
	isTrue: boolean
}

type IdataMarking = {
	Note: string
	SetPackageResultID: number
	setPackageExerciseStudentsList: Array<{
		ID: number
		Point: any
	}>
}

type IMarkingExam = {
	onGetPoint: Function
	dataMarking: any
	dataRow: any
	isWritting?: boolean
	info?: any
	onRefresh?: Function
	isSpeaking?: boolean

	curGroup?: any
}

let comments: Array<IComments> = []

const MarkingExam = (props: IMarkingExam) => {
	const { onGetPoint, dataMarking, dataRow, isWritting, info, onRefresh, isSpeaking, curGroup } = props

	const router = useRouter()

	const [activeComment, setActiveComment] = useState<string>('')
	const [isSubmit, setIsSubmit] = useState(false)
	const [essayPoint, setEssayPoint] = useState('')

	const [isModalVisible, setIsModalVisible] = useState(false)
	const [valuePoint, setValuePoint] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	const [markingWritting, setMarkingWritting] = useState(false)
	const [timeStamp, setTimeStamp] = useState(0)

	const userInformation = useSelector((state: RootState) => state.user.information)

	function isMarking() {
		return router.asPath.includes('/exam-result')
	}

	const getCurrentResultData = async () => {
		comments = []

		const response = await MarkApi.getAnswerComment({
			ieltsQuestionResultId: dataRow?.Id,
			ieltsAnswerResultId: !!dataRow?.IeltsAnswerResults && dataRow?.IeltsAnswerResults.length > 0 && dataRow?.IeltsAnswerResults[0]?.Id
		})

		if (response.status == 200) {
			const formated = []

			await response.data.data.forEach((comment: any, index) => {
				let thisNote = {}

				try {
					thisNote = !comment?.Note ? {} : JSON.parse(comment?.Note) // Đây là bí thuật, xin đừng phá
				} catch (error) {
					thisNote = {} // Đây là bí thuật, xin đừng phá
				}

				formated.push({
					...comment,
					...thisNote,
					Comment: comment?.Content,
					LinkAudio: comment.Audio
				})
			})

			comments = formated

			setEssayPoint(dataRow?.Point)

			_clickComment({ Code: formated[0].Code })
		} else {
			comments = [
				{
					Avatar: userInformation.Avatar,
					Comment: '',
					CreatedBy: userInformation.FullName,
					CreatedOn: '',
					// ID: 0,
					Code: `cmt-${getTimeStamp()}`,
					LinkAudio: '',
					RoleName: userInformation?.role,
					IeltsAnswerResultId:
						!!dataRow?.IeltsAnswerResults && dataRow?.IeltsAnswerResults.length > 0 && dataRow?.IeltsAnswerResults[0]?.Id,
					isAdd: true
				}
			]
		}

		setTimeStamp(new Date().getTime())
	}

	useEffect(() => {
		if (isSpeaking) {
			getCurrentResultData()
		}
	}, [isModalVisible])

	// CALL API SAVE NEW COMMENT
	async function _saveComment(param: IComments) {
		const commentIndex = await comments.findIndex((item) => item?.Code == param?.Code)
		comments[commentIndex].LinkAudio = param?.LinkAudio
		comments[commentIndex].Comment = param?.Comment

		setTimeStamp(getTimeStamp())
	}

	// HANDLE CLICK COMMENT TEXT
	function _clickComment(params) {
		setActiveComment(params.Code) // Active this comment item
		const nodeComments = document.getElementsByClassName('highlight-editor') // Get hightlight text list
		for (let i = 0; i < nodeComments.length; i++) {
			if (!!nodeComments[i]) {
				const itemID = nodeComments[i].getAttribute('id')
				if (itemID == params.Code) {
					nodeComments[i]?.setAttribute('class', 'highlight-editor active') // Active this comment text
				} else {
					nodeComments[i]?.setAttribute('class', 'highlight-editor')
				}
			}
		}
	}

	// GET NOW TIMESTAMP
	function getTimeStamp() {
		return new Date().getTime() // Example: 1653474514413
	}

	const showModal = () => {
		!!isWritting ? setMarkingWritting(true) : setIsModalVisible(true)
	}

	const handleSubmit = async () => {
		if (!!essayPoint) {
			// if (_checkSubmit() == true) {
			// const fixedContent = await document.querySelector(`.mce-content-body[id="${dataRow.Id}"]`)

			const formatedComments = []

			comments.forEach((comment, index) => {
				formatedComments.push({
					...comment,
					// Id: 0,
					Content: comment.Comment,
					Audio: comment?.LinkAudio || '',
					Enable: true,
					Note: JSON.stringify(comment)
				})
			})

			let temp = {
				// AnswerContentFix: fixedContent?.innerHTML,
				Comment: comments,
				EssayPoint: essayPoint,

				// ----------------------------------------------------------------
				IeltsQuestionResultId: dataRow?.Id,
				Point: essayPoint,
				Items: formatedComments,
				Note: ''
			}

			completeMark(temp)
		} else {
			ShowNostis.error('Vui lòng nhập nội dung nhận xét!')
		}
	}

	async function completeMark(param: any) {
		log.Yellow('SUBMIT completeMark', param)

		setTimeStamp(getTimeStamp())

		// ------------------------------------------------------------- Đã tới khúc này

		try {
			const response = await MarkApi.post(param)
			if (response.status == 200) {
				ShowNostis.success('Thành công')
				setMarkingWritting(false)
				onRefresh(curGroup?.Id)
				comments = []
				setEssayPoint('')
				// setComments([])
			}
		} catch (error) {
			ShowNostis.error(error?.message || error)
		} finally {
			setTimeStamp(getTimeStamp())
			// setLoading(false)
			// setSubmitLoading(false)
		}
	}

	const handleCancel = () => {
		if (!!isWritting) {
			setMarkingWritting(false)
		} else {
			setIsModalVisible(false)
			setValuePoint(null)
		}
	}

	useEffect(() => {
		// getPermissiton()
	}, [])

	const getPermissiton = async () => {
		await navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((stream) => {})
			.catch((err) => {})
	}

	useEffect(() => {
		setValuePoint(dataMarking?.EssayPoint)
	}, [dataMarking])

	const isStudent = () => {
		return !!userInformation && userInformation.RoleId == 3 ? true : false
	}

	return (
		<>
			{!!userInformation && (userInformation?.RoleId == 1 || userInformation?.RoleId == 2) && !dataMarking.Point && isMarking() && (
				<PrimaryButton background="blue" icon="edit" type="button" onClick={showModal}>
					Chấm bài
				</PrimaryButton>
			)}

			{!!dataMarking.Point && (
				<PrimaryButton background="blue" icon="file" type="button" onClick={showModal}>
					Kết quả
				</PrimaryButton>
			)}

			<Modal title={isSpeaking ? 'Sửa bài' : 'Chấm bài'} open={isModalVisible} onCancel={handleCancel} footer={null}>
				{!isLoading && (
					<div className="wrap-mark">
						<div className="info-comments-point">
							<div className="comments">
								<div id="scroll-tag" className="inner scrollable">
									<>
										<div className="wrapper-teacher-mark">
											<label style={{ marginBottom: 0, fontWeight: 500 }} htmlFor="id-mark">
												Nhập điểm:{' '}
											</label>

											<input
												disabled={isStudent() || dataMarking.IsDone}
												id="id-mark"
												className="input-wrapper"
												placeholder="Nhập điểm"
												value={essayPoint}
												onChange={(e) => setEssayPoint(e.target.value)}
											/>
										</div>

										{comments.length == 0 && <p className="mt-5 text-center font-weight-bold red-text">Không có dữ liệu</p>}

										{comments.length > 0 && (
											<>
												{comments.map((item: IComments) => {
													return (
														<CommentItem
															hiddenRemove={true}
															item={item}
															active={activeComment}
															onDeleteItem={() => {}}
															onSave={_saveComment}
															onActive={_clickComment}
															isSubmit={isSubmit}
															disabled={isStudent() || dataMarking.IsDone}
														/>
													)
												})}
											</>
										)}
									</>
								</div>
							</div>
						</div>
					</div>
				)}

				{!isWritting && (userInformation?.RoleId == 1 || userInformation?.RoleId == 2) && (
					<button disabled={!!isLoading} onClick={handleSubmit} type="button" className="btn btn-primary w-100">
						Lưu {!!isLoading && <Spin className="loading-base" />}
					</button>
				)}
			</Modal>

			<Mark
				markingWritting={markingWritting}
				info={info}
				onRefresh={onRefresh}
				setMarkingWritting={setMarkingWritting}
				dataMarking={dataMarking}
				dataRow={dataRow}
				curGroup={curGroup}
			/>
		</>
	)
}

export default MarkingExam
