import React, { FC, useEffect, useRef, useState } from 'react'
import DraggableList from 'react-draggable-list'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import ReactHTMLParser from 'react-html-parser'
import cx from 'classnames'
import { setCurrentExerciseForm } from '~/store/globalState'
import QestDragMenu from '../QuestDragMenu'
import { QUESTION_TYPES } from '~/common/libs'
import FormWriting from './form-drag'
import FormSpeaking from './form-drag'
import PrimaryButton from '~/common/components/Primary/Button'
import { log, wait } from '~/common/utils'
import { Input, Skeleton } from 'antd'
import { IoClose } from 'react-icons/io5'
import { setQuestionsWithAnswers } from '~/store/createQuestion'
import { useExamContext } from '~/common/components/Auth/Provider/exam'

const CreateDragAndDrop = (props) => {
	const { isEdit } = props

	const quest = useSelector((state: RootState) => state.createQuestion.Questions)

	const { setQuestionWithAnswers, questionWithAnswers } = useExamContext()

	function setData(params) {
		setQuestionWithAnswers([...params])
	}

	function compareAndFilterArrays(A, B) {
		// Tạo một Set chứa tất cả các ID từ mảng A
		const idSetA = new Set(A.map((item) => item.id))

		// Lọc ra các phần tử từ mảng B có ID không xuất hiện trong mảng A
		const filteredB = B.filter((item) => !idSetA.has(item.InputId))

		return filteredB
	}

	const [loading, setLoading] = useState<boolean>(false)

	async function fuckingChanged() {
		if (!!isEdit && isFirst) {
			setIsFirst(false)
			return
		}

		if (!quest || quest.length == 0) {
			setData([])
			return
		}

		if (quest) {
			if (questionWithAnswers.length < quest.length) {
				let temp = []

				for (let i = 0; i < quest.length; i++) {
					// Tìm vị trí của câu hiện tại trong dữ liệu đã có. Nếu không tìm thấy ra -1
					const thisQuestInData = questionWithAnswers.findIndex((thisQuest) => thisQuest.InputId == quest[i]?.id)

					if (thisQuestInData == -1) {
						// Chưa có thì tạo mới với Id = 0

						const newQuest = {
							Id: 0,
							InputId: quest[i]?.id, // Input Id là cái ID do ngài Châu tạo ra, do Id là BE tạo ra nên không DOM được
							IeltsAnswers: [{ Id: 0, Content: '', Correct: true, isAdd: true, Type: 1, timestamp: new Date().getTime() }]
						}

						temp.push(newQuest)
					} else {
						// Nếu câu hỏi đã tồn tại rồi thì lấy nguyên cục đã có đập dô
						temp.push(questionWithAnswers[thisQuestInData])
					}
				}

				setLoading(true)

				setData(temp)
				await wait(200)
				setLoading(false)
			}

			if (questionWithAnswers.length > 0) {
				const newData = compareAndFilterArrays(quest, questionWithAnswers)

				for (let i = 0; i < newData.length; i++) {
					setLoading(true)

					const ficaIndex = questionWithAnswers.findIndex((item) => item?.InputId == newData[i]?.InputId)

					if (ficaIndex > -1 && questionWithAnswers[ficaIndex]?.Id == 0) {
						const newFuckingData = removeItemAtIndex(questionWithAnswers, ficaIndex)
						setData([...newFuckingData])
					}

					if (ficaIndex > -1 && questionWithAnswers[ficaIndex]?.Id != 0) {
						questionWithAnswers[ficaIndex] = { ...questionWithAnswers[ficaIndex], Enable: false }
						setData([...questionWithAnswers])
					}
				}

				await wait(200)
				setLoading(false)
			}
		}
	}

	const [isFirst, setIsFirst] = useState<boolean>(true)

	useEffect(() => {
		fuckingChanged()
	}, [quest])

	// log.Yellow('data', questionWithAnswers)

	function removeItemAtIndex(array, index) {
		const cloned = [...array]

		if (index < 0 || index >= cloned.length) {
			console.error('Invalid index')
			return cloned
		}

		let temp = []

		for (let i = 0; i < cloned.length; i++) {
			if (i == index && cloned[i]?.Id != 0) {
				temp.push({ ...cloned[i], Enable: false })
			}
			if (i != index) {
				temp.push(cloned[i])
			}
		}

		console.log('---- removeItemAtIndex temp: ', temp)

		return temp
	}

	function handleChangeContent(questIndex, ansIndex, params) {
		var cloneData = [...questionWithAnswers]
		cloneData[questIndex].IeltsAnswers[ansIndex].Content = params.target.value
		setData([...cloneData])
	}

	return (
		<div className="drag-list">
			<div className="drag-section">
				{questionWithAnswers &&
					questionWithAnswers.map((thisQuest, questIndex) => {
						if (!thisQuest || thisQuest?.Enable == false) {
							return <></>
						}

						return (
							<div id={`the-quest-${thisQuest?.id}`} key={`f-quest-${questIndex}`} className="mt-[16px]">
								<div className="mb-[4px] font-[600] text-[#3477c9]">Câu {questIndex + 1}</div>

								<div className="grid grid-cols-2 gap-4">
									{thisQuest?.IeltsAnswers.map((item: any, ansIndex) => {
										if (!item || item?.Enable == false) {
											return <></>
										}

										return (
											<div key={`f-${questIndex}-ans-${ansIndex}`} className="flex items-center">
												{!loading && (
													<Input
														onBlur={(e) => handleChangeContent(questIndex, ansIndex, e)}
														defaultValue={item?.Content}
														id={item?.timestamp || item?.id || ''}
														className="primary-input"
														placeholder="Nhập đáp án"
													/>
												)}

												{loading && <Skeleton active paragraph={false} className="w-[100%]" />}

												{ansIndex > 0 && (
													<div
														onClick={() => {
															let newAns = removeItemAtIndex(questionWithAnswers[questIndex].IeltsAnswers, ansIndex)

															let temp = []

															for (let i = 0; i < questionWithAnswers.length; i++) {
																const element = questionWithAnswers[i]

																if (i != questIndex) {
																	temp.push(element)
																} else {
																	temp.push({ ...element, IeltsAnswers: newAns })
																}
															}

															setData([...temp])
														}}
														className="ml-[8px] cursor-pointer"
													>
														<IoClose color="red" size={24} />
													</div>
												)}
											</div>
										)
									})}
								</div>

								<div className="col-span-1 flex mt-[8px]">
									<PrimaryButton
										onClick={() => {
											const cloneData = [...questionWithAnswers]

											cloneData[questIndex].IeltsAnswers.push({
												Id: 0,
												Content: '',
												Correct: false,
												isAdd: true,
												Type: 1,
												timestamp: new Date().getTime()
											})

											setData([...cloneData])
										}}
										background="red"
										icon="add"
										type="button"
									>
										Thêm đáp án gây nhiễu
									</PrimaryButton>
								</div>
							</div>
						)
					})}
			</div>
		</div>
	)
}

export default CreateDragAndDrop
