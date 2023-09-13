import { Editor } from '@tinymce/tinymce-react'
import { Button, Card, Modal, Skeleton, Spin } from 'antd'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { ShowNoti, log } from '~/common/utils'

import CommentItem from './Comment'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { MarkApi } from '~/api/exam/mark'
import PrimaryButton from '../Primary/Button'
import { comment } from 'postcss'

const quickMenu = 'bold italic underline strikethrough | fontfamily fontsize blocks | codesample | forecolor backcolor | customInsertButton'
const editorPlugins =
	'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons'

const fontFormat =
	'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva;Lucida Sans Unicode=lucida sans unicode'

var comments: Array<IComments> = []

let isFirst = true

const Mark = (props: any) => {
	const { dataRow, info, setMarkingWritting, onRefresh, markingWritting, dataMarking, curGroup } = props
	const editorRef = useRef(null)

	console.log('--- Mark props: ', props)

	const userInformation = useSelector((state: RootState) => state.user.information)

	const [timeStamp, setTimeStamp] = useState(0)
	const [loadingContent, setLoadingContent] = useState(false)

	const [loading, setLoading] = useState(true)
	const [isSubmit, setIsSubmit] = useState(false)
	const [essayPoint, setEssayPoint] = useState('')
	const [markWriting, setMarkWriting] = useState(false)

	const [activeComment, setActiveComment] = useState<string>('')

	if (!!activeComment) {
		document.getElementById(`${activeComment}`)?.setAttribute('class', 'highlight-editor active')
	}

	useEffect(() => {
		markingWritting && getDetail() && getComments()

		if (!!markingWritting) {
			// getComments({ ieltsQuestionResultId: null, ieltsAnswerResultId: null })

			setEssayPoint(dataMarking?.Point)
		}
	}, [markingWritting])

	// useEffect(() => {
	// 	if (!!props.dataRow.SetPackageExerciseAnswerStudent && !!props.dataRow.SetPackageExerciseAnswerStudent[0].AnswerContentFix) {
	// 		_addHandle()
	// 	}
	// }, [document.getElementsByClassName('highlight-editor')])

	useEffect(() => {
		if (!!activeComment) {
			scrollToElement(activeComment)
		}
	}, [activeComment])

	const isStudent = () => {
		return !!userInformation && userInformation.RoleId == 3 ? true : false
	}

	const isTeacher = () => {
		return !!userInformation && (userInformation.RoleId == 1 || userInformation.RoleId == 2) ? true : false
	}

	async function getDetail() {
		try {
			const response = await MarkApi.getByID(curGroup?.Id)

			if (response.status == 200) {
				// comments = response.data.data
				// // setEssayPoint(response.data.data[0].EssayPoint)
				// _clickComment({ Code: response.data.data[0].Code })
			} else {
				comments = []
			}
		} catch (error) {
			ShowNoti('error', error?.message || error)
		} finally {
			setLoading(false)
			setTimeStamp(getTimeStamp())
		}
	}

	async function getComments() {
		try {
			const response = await MarkApi.getAnswerComment({
				ieltsQuestionResultId: dataRow?.Id,
				ieltsAnswerResultId: !!dataRow?.IeltsAnswerResults && dataRow?.IeltsAnswerResults.length > 0 && dataRow?.IeltsAnswerResults[0]?.Id
			})

			if (response.status == 200) {
				const formated = []

				// Avatar: 'http://monalms.monamedia.net/Upload/Images/dc51f19a-ff5d-4134-9f56-9c22d1f00497.jpeg'
				// Code: 'cmt-1694527705869'

				// ID: 0
				// IeltsAnswerResultId: 883
				// RoleName: 'Giáo viên'
				// isAdd: true

				// ----------------------------------------------------------------

				// CreatedOn: '2023-09-13T09:35:57.27'
				// Enable: true
				// Id: 1
				// IeltsAnswerResultId: 883
				// IeltsQuestionResultId: 432
				// ModifiedBy: 'Nguyễn Chaos'
				// ModifiedOn: '2023-09-13T09:35:57.27'

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

				// setEssayPoint(response.data.data[0].EssayPoint)

				_clickComment({ Code: formated[0].Code })
			} else {
				comments = []
			}
		} catch (error) {
			ShowNoti('error', error?.message || error)
		} finally {
			setLoading(false)
			setTimeStamp(getTimeStamp())
		}
	}

	// async function addComments(param: any) {
	// 	try {
	// 		const response = await MarkApi.addComment(param)
	// 		if (response.status == 200) {
	// 			// getComments(dataRow?.ID)
	// 		}
	// 	} catch (error) {
	// 		ShowNoti('error', error?.message || error)
	// 	} finally {
	// 		setLoading(false)
	// 	}
	// }

	// async function updateFixContent(param: IUpdateFixContent) {
	// 	try {
	// 		const response = await MarkApi.updateFixContent(param)
	// 		if (response.status == 200) {
	// 			//
	// 		}
	// 	} catch (error) {
	// 		ShowNoti('error', error?.message || error)
	// 	} finally {
	// 		setLoading(false)
	// 	}
	// }

	async function deleteComment(param: { ID: number; AnswerContentFix: string }) {
		// try {
		// 	const response = await MarkApi.deleteComment(param)
		// 	if (response.status == 200) {
		// 		// updateFixContent({ ID: dataRow?.SetPackageExerciseAnswerStudentId, AnswerContentFix: fixedContent[0]?.innerHTML })
		// 	}
		// } catch (error) {
		// 	ShowNoti('error', error?.message || error)
		// } finally {
		// 	setLoading(false)
		// }
	}

	async function completeMark(param: any) {
		log.Yellow('SUBMIT completeMark', param)

		setTimeStamp(getTimeStamp())
		setLoading(false)
		setSubmitLoading(false)

		// ------------------------------------------------------------- Đã tới khúc này

		try {
			const response = await MarkApi.post(param)
			if (response.status == 200) {
				ShowNoti('success', 'Thành công')
				setMarkingWritting(false)

				onRefresh(curGroup?.Id)
				comments = []
				setEssayPoint('')
				// setComments([])
			}
		} catch (error) {
			ShowNoti('error', error?.message || error)
		} finally {
			setTimeStamp(getTimeStamp())
			setLoading(false)
			setSubmitLoading(false)
		}
	}

	// CREATE NEW COMMENT
	async function createNewComment(param: IFunCreate) {
		comments.push({
			ID: 0,
			Code: `cmt-${param.ID}`,
			Comment: '',
			LinkAudio: '',
			Avatar: userInformation.Avatar,
			CreatedBy: userInformation.FullName,
			RoleName: 'Giáo viên',
			IeltsAnswerResultId: !!dataRow?.IeltsAnswerResults && dataRow?.IeltsAnswerResults.length > 0 && dataRow?.IeltsAnswerResults[0]?.Id,
			isAdd: true,
			Enable: true
		})

		setTimeStamp(getTimeStamp())

		_clickComment({ Code: `cmt-${param.ID}` }) // Active new comment
		setTimeStamp(getTimeStamp()) // Rerender required
	}

	if (isFirst) {
		const nodeComments = document.getElementsByClassName('highlight-editor') // Get hightlight text list
		if (nodeComments.length > 0) {
			isFirst = false
			_addHandle()
		}
	}

	// ADD CLICK EVENT FOR HIGHTLIGHT TEXT
	async function _addHandle() {
		const nodeComments = await document.getElementsByClassName('highlight-editor') // Get hightlight text list

		if (nodeComments?.length > 0) {
			for (let i = 0; i < nodeComments.length; i++) {
				if (!!nodeComments[i]) {
					// Add click event for this tag
					const itemID = nodeComments[i].getAttribute('id')

					nodeComments[i].addEventListener('click', (event) => {
						event.preventDefault()
						_clickComment({ Code: itemID, event: event })
					})
				}
			}
		}
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

	// CALL API SAVE NEW COMMENT
	async function _saveComment(param: IComments) {
		const commentIndex = await comments.findIndex((item) => item?.Code == param?.Code)

		comments[commentIndex].LinkAudio = param?.LinkAudio
		comments[commentIndex].Comment = param?.Comment

		setTimeStamp(getTimeStamp())
	}

	async function _deleteComment(param) {
		const nodeComments = document.getElementsByClassName('highlight-editor') // Get hightlight text list

		for (let i = 0; i < nodeComments.length; i++) {
			if (!!nodeComments[i]) {
				const itemID = nodeComments[i].getAttribute('id')
				if (itemID == param.Code) {
					nodeComments[i].replaceWith(nodeComments[i].textContent)
				} else {
					nodeComments[i]?.setAttribute('class', 'highlight-editor')
				}
			}
		}

		const commentIndex = await comments.findIndex((item) => item?.Code == param?.Code)

		console.log('----- commentIndex: ', commentIndex)

		if (commentIndex > -1) {
			// comments.splice(commentIndex, 1)
			comments[commentIndex] = { ...comments[commentIndex], Enable: false }

			// console.log('---- comment: ', comments)

			setTimeStamp(getTimeStamp())
		}

		if (typeof param?.ID == 'number' && !param?.isAdd) {
			// const tempContent = await document.getElementsByClassName('mce-content-body')
			const tempContent = await document.querySelector(`.mce-content-body[id="${dataRow.ID}"]`)
			deleteComment({ ID: param?.ID, AnswerContentFix: !!tempContent.innerHTML ? tempContent?.innerHTML : '' })
		}
	}

	// SCROLL TO ACTIVATED ITEM
	async function scrollToElement(CommentID: string) {
		if (!!CommentID) {
			const scrollElement = document.getElementById('scroll-tag') // Find parent tag
			const tempComments = await document.getElementsByClassName('cmt-item') // Get comment item list
			if (tempComments.length > 0) {
				const element = await document.getElementById('item-' + CommentID) // Get node item activated

				if (!!element) {
					const firstElemRect = await tempComments[0].getBoundingClientRect() // Get position of first comment item
					const elemRect = await element.getBoundingClientRect() // Get position of this comment item
					const offset = await (elemRect.top - firstElemRect.bottom)
					scrollElement.scroll({ top: offset, left: 0, behavior: 'smooth' }) // Documents: https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll
				}
			}
		}
	}

	function _checkSubmit() {
		let temp = true
		setIsSubmit(true)
		for (let i = 0; i < comments.length; i++) {
			if (comments[i].Comment == '') {
				temp = false
			}
		}

		const fixedContent = document.getElementsByClassName('highlight-editor active') || []

		if (fixedContent.length > 0) {
			fixedContent[0]?.setAttribute('class', 'highlight-editor')
		}

		return temp
	}

	const [submitLoading, setSubmitLoading] = useState(false)

	async function _submitData() {
		setSubmitLoading(true)
		if (!!essayPoint) {
			if (_checkSubmit() == true) {
				const fixedContent = await document.querySelector(`.mce-content-body[id="${dataRow.Id}"]`)

				const formatedComments = []

				// Avatar: 'http://monalms.monamedia.net/Upload/Images/dc51f19a-ff5d-4134-9f56-9c22d1f00497.jpeg'
				// Code: 'cmt-1694527705869'
				// Comment: ''
				// CreatedBy: 'Nguyễn Chaos'
				// ID: 0
				// IeltsAnswerResultId: 883
				// LinkAudio: ''
				// RoleName: 'Giáo viên'
				// isAdd: true

				comments.forEach((comment, index) => {
					formatedComments.push({
						...comment,
						// Id: 0,
						Content: comment.Comment,
						Audio: comment?.LinkAudio || '',
						// Enable: true,
						Note: JSON.stringify(comment)
					})
				})

				let temp = {
					AnswerContentFix: fixedContent?.innerHTML,
					Comment: comments,
					EssayPoint: essayPoint,

					// ----------------------------------------------------------------
					IeltsQuestionResultId: dataRow?.Id,
					Point: essayPoint,
					Items: formatedComments,
					Note: fixedContent?.innerHTML
				}

				// {
				//   "IeltsQuestionResultId": 0,
				//   "Note": "string",
				//   "Point": 0,
				//   "Items": [
				//     {
				//       "Id": 0,
				//       "IeltsAnswerResultId": 0,
				//       "Content": "string",
				//       "Audio": "string",
				//       "Enable": true
				//     }
				//   ]
				// }

				completeMark(temp)

				fixedContent.innerHTML = ''

				setMarkWriting(true)
			} else {
				ShowNoti('error', 'Vui lòng nhập nội dung nhận xét!')
				setSubmitLoading(false)
			}
		} else {
			ShowNoti('error', 'Vui lòng nhập điểm')
			setSubmitLoading(false)
		}
	}

	async function _requestFix() {
		// setSubmitLoading(true)
		// try {
		// 	const response = await MarkApi.requestFix(dataRow?.SetPackageExerciseAnswerStudentId)
		// 	if (response.status == 200) {
		// 		ShowNoti('success', 'Đã gửi yêu cầu chấm lại')
		// 	}
		// } catch (error) {
		// 	ShowNoti('error', error?.message || error)
		// } finally {
		// 	setLoading(false)
		// 	setSubmitLoading(false)
		// }
	}
	const [isShowContent, setShowContent] = useState<boolean>(false)

	useEffect(() => {
		if (!!dataRow) {
			setLoadingContent(true)
			setTimeout(() => {
				setLoadingContent(false)
			}, 500)
		}
	}, [markingWritting])

	function replaceNewlinesWithBr(text) {
		return text.replace(/\n/g, '<br/>')
	}

	function getInitValue() {
		if (!dataRow?.IeltsAnswerResults || dataRow?.IeltsAnswerResults.length == 0) {
			return null
		}

		// Note là đoạn text có chứa hightlight
		if (!!dataRow?.Note) {
			return dataRow?.Note
		}

		// return replaceNewlinesWithBr(!!dataRow.AnswerContentFix ? dataRow.AnswerContentFix : dataRow.MyAnswerContent.replace('\n', '<br/>'))

		// Nếu không có đoạn text chứa hightlight tức là chưa chấm, lấy bài đã làm hiện lên
		return dataRow?.IeltsAnswerResults[0]?.MyIeltsAnswerContent
	}

	// console.log('---- comments: ', comments)

	// RENDER
	return (
		<>
			<Modal width={900} onCancel={() => setShowContent(false)} centered title="Bài làm của học viên" visible={isShowContent} footer={null}>
				{!!dataRow?.IeltsAnswerResults && dataRow?.IeltsAnswerResults.length > 0 && (
					<div style={{ whiteSpace: 'pre-line' }}>{ReactHtmlParser(dataRow?.IeltsAnswerResults[0]?.MyIeltsAnswerContent || '')}</div>
				)}
			</Modal>

			<Modal
				width="100%"
				centered
				title={'Sửa bài tập'}
				open={markingWritting}
				onCancel={() => setMarkingWritting(false)}
				footer={
					<div className="w-100" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
						<>
							<PrimaryButton background="red" icon="cancel" onClick={() => setMarkingWritting(false)} type="button">
								Đóng
							</PrimaryButton>

							{isTeacher() && !dataMarking?.IsDone && (
								<PrimaryButton
									className="ml-[8px]"
									loading={submitLoading}
									background="blue"
									icon="save"
									onClick={_submitData}
									type="button"
								>
									Hoàn thành chấm bài
								</PrimaryButton>
							)}

							{isStudent() && (
								<button type="button" onClick={_requestFix} className="btn btn-primary">
									Yêu cầu chấm lại {submitLoading && <Spin className="ml-3" />}
								</button>
							)}
						</>
					</div>
				}
			>
				<div className="wrap-writting-marking !h-[calc(100vh-200px)]">
					<div className="wrap-mark w-100">
						<div className="row">
							<div className="col-md-8 col-12 flex flex-col">
								<Card title="Nội dung câu hỏi" className="mark-quest-content scrollable">
									<div>{ReactHtmlParser(dataMarking?.Content)}</div>
								</Card>

								<Card
									title="Giáo viên sửa bài"
									extra={
										<div className="wrapper-teacher-mark">
											{!!dataMarking?.Point && <div style={{ fontSize: 18 }}>Điểm: {essayPoint} </div>}

											<button type="button" onClick={() => setShowContent(true)} className="btn btn-primary">
												Bài làm của học viên
											</button>

											{!dataMarking?.Point && (
												<input
													disabled={!!userInformation && userInformation.RoleId == 3}
													className="input-wrapper"
													placeholder="Nhập điểm"
													value={essayPoint}
													onChange={(e) => setEssayPoint(e.target.value)}
												/>
											)}
										</div>
									}
									className="mark-content scrollable flex-1"
								>
									{!!dataRow?.IeltsAnswerResults && dataRow?.IeltsAnswerResults.length > 0 && (
										<div>
											{!loadingContent && (
												<Editor
													id={`${dataRow.Id}`}
													onInit={(evt, editor) => (editorRef.current = editor)}
													initialValue={getInitValue()}
													onChange={(event: any) => setTimeStamp(getTimeStamp())}
													disabled={isStudent()}
													init={{
														plugins: editorPlugins,
														menubar: '', // Command list
														toolbar: '', // Command list

														height: 600,

														quickbars_insert_toolbar: false,
														quickbars_selection_toolbar: quickMenu,

														font_family_formats: fontFormat,

														setup: (editor) => {
															editor.ui.registry.addButton('customInsertButton', {
																icon: 'comment-add',
																tooltip: 'Thêm nhận xét',
																onAction: () => {
																	const nowTimeStamp: number = getTimeStamp() // Timestamp
																	const textSelected: string = editorRef.current.selection.getContent()

																	const textInsert: string = `<span class="highlight-editor" id="cmt-${nowTimeStamp}">${textSelected}</span>`

																	editor.insertContent(textInsert) // Add textInsert to editor value

																	_addHandle()
																	createNewComment({ ID: nowTimeStamp, Text: textSelected })
																}
															})
														},
														inline: true, // Remove iframe tag
														noneditable_class: 'mceNonEditable',
														toolbar_mode: 'sliding'
													}}
												/>
											)}
										</div>
									)}

									{/*  */}
								</Card>
							</div>

							<div className="col-md-4 col-12">
								<Card className="info-comments">
									<div className="comments h-[calc(100vh-305px)] scrollable">
										<div id="scroll-title" className="title">
											Danh sách nhận xét
										</div>

										<div id="scroll-tag" className="inner scrollable">
											{loading && (
												<>
													<Skeleton />
													<Skeleton />
													<Skeleton />
												</>
											)}

											{!loading && (
												<>
													{comments.length == 0 && <p className="mt-5 text-center font-weight-bold red-text">Không có dữ liệu</p>}

													{comments.length > 0 && (
														<>
															{comments.map((item: IComments) => {
																if (!item?.Enable) {
																	return <></>
																}

																return (
																	<CommentItem
																		hiddenRemove={false}
																		loading={loading}
																		item={item}
																		active={activeComment}
																		onDeleteItem={_deleteComment}
																		onSave={_saveComment}
																		onActive={_clickComment}
																		isSubmit={isSubmit}
																		disabled={isStudent()}
																	/>
																)
															})}
														</>
													)}
												</>
											)}
										</div>
									</div>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default Mark
