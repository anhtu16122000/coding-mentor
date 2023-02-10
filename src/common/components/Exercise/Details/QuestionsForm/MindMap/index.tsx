import React, { FC, useEffect, useRef, useState } from 'react'
import DraggableList from 'react-draggable-list'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import cx from 'classnames'
import { setCurrentExerciseForm } from '~/store/globalState'
import QestDragMenu from '../QuestDragMenu'
import { QUESTION_TYPES } from '~/common/libs'
import CreateMindmap from './Create'
import { log } from '~/common/utils'

import HTMLParser from 'react-html-parser'

class GroupItem extends React.Component<PlanetProps, PlanetState> {
	state = { value: 0 }

	getDragHeight() {
		return 36
	}

	render() {
		const { item, itemSelected, dragHandleProps } = this.props

		const scale = itemSelected * 0.005 + 1
		const shadow = itemSelected * 1 + 0
		const dragged = itemSelected !== 0

		return (
			<div className={cx('cc-quest-wrapper', { dragged })} style={{ transform: `scale(${scale})`, borderWidth: 1, borderStyle: 'solid' }}>
				<div className="dragHandle mt-[10px] ml-2" {...dragHandleProps} />

				<div className="cc-form-group-header">
					<div className="cc-form-gr-number mt-2">
						Câu {item.Index}
						<span className="text-[#000000] font-[600] ml-2">({item?.Point} điểm)</span>
					</div>

					<div className="!inline-flex">
						<QestDragMenu item={item} isQuest questionType={QUESTION_TYPES.MultipleChoice} />
					</div>
				</div>

				{/* <Choice data={item} type="edit" /> */}
			</div>
		)
	}
}

const MindMapForm = () => {
	const questRef = useRef()

	const dispatch = useDispatch()
	const exercises = useSelector((state: RootState) => state.globalState.currentExerciseForm)

	function changeQuestions(newList) {
		let newIndexList = []
		newList.forEach((item, index) => {
			newIndexList.push({ ...item, Index: index + 1 })
		})
		dispatch(setCurrentExerciseForm(newIndexList))
	}

	function formatData(param) {
		let temp = []
		let count = 1 // Renew Index
		param.forEach((item) => {
			if (item.Enable !== false) {
				temp.push({ ...item, Index: count })
			}
			count++
		})
		return temp
	}

	log.Blue('exercises: ', exercises)
	log.Red('formatData(exercises): ', formatData(exercises))

	/*
	*
	- Random đáp án, đảo vị trí nó lại
	*
	*/

	const [answerFormated, setAnswerFormated] = useState([])

	useEffect(() => {
		getALLAnswer()
	}, [exercises])

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[array[i], array[j]] = [array[j], array[i]]
		}
		return array
	}

	function getALLAnswer() {
		let temp = []
		for (let i = 0; i < exercises.length; i++) {
			const question = exercises[i]
			for (let j = 0; j < question?.Answers.length; j++) {
				const answer = question?.Answers[j]
				temp.push({ ...answer, question: question })
			}
		}
		setAnswerFormated(shuffleArray(temp))
	}

	log.Yellow('answerFormated: ', answerFormated)

	return (
		<div className="flex flex-col ">
			<div className="flex flex-row">
				<div className="flex flex-col flex-shrink-0 px-[16px]">
					<div className="h-[46px]" />
					{formatData(exercises).map((exercise) => {
						return (
							<div className="h-[46px]">
								<div className="">{HTMLParser(exercise?.Content)}</div>
							</div>
						)
					})}
				</div>

				<div className="mb-[32px] scrollable-h w-[calc(100vw/2-64px)] max-w-[calc(600px-64px)]">
					<div className="flex items-center bg-[#5695ea] min-h-[46px]">
						{answerFormated.map((answer, ansIndex) => {
							log.Green('answer: ', answer)

							return (
								<div className={`min-h-[46px] bg-[red] flex-shrink-0 px-[16px] ${ansIndex !== 0 ? 'border-l-[1px] border-[#ffffff]' : ''}`}>
									<div className="text-[16px] text-[#fff]">{HTMLParser(answer?.AnswerContent)}</div>
								</div>
							)
						})}
					</div>
					----------------------------------------------------------------
					{formatData(exercises).map((exercise) => {
						console.log('----------------------------------------------------------------')
						log.Green('exercise: ', exercise)

						return (
							<div className="flex items-center">
								<div className="">{HTMLParser(exercise?.Content)}</div>

								<div className="inline-flex">
									{answerFormated.map((answer) => {
										log.Green('answer: ', answer)

										return (
											<div className="">
												<div className="">{HTMLParser(answer?.AnswerContent)}</div>
											</div>
										)
									})}
								</div>
							</div>
						)
					})}
				</div>
			</div>

			<CreateMindmap />
		</div>
	)
}

export default MindMapForm
