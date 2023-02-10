import { List } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { QUESTION_TYPES } from '~/common/libs'
import { RootState } from '~/store'
import { setActivating } from '~/store/testingState'

let scrollElement: any = ''

const SectionNavigator = (props) => {
	const { section } = props

	const dispatch = useDispatch()

	const listQuestionID = useSelector((state: RootState) => state.testingState.listQuestionID)
	const activating = useSelector((state: RootState) => state.testingState.activating)
	const answered = useSelector((state: RootState) => state.testingState.answered)

	const [allQuest, setAllQuest] = useState([])

	useEffect(() => {
		scrollElement = document.getElementById('scroll-main')
		getAllQuest()
	}, [section])

	function getResult(params) {
		let flag = true
		let numberTrue = 0
		let numberAnswer = 0

		params?.AnswerResults.forEach((element) => {
			if (element.IsTrue !== element.MyResult) {
				flag = false
				return false
			}
			if (element.IsTrue) {
				numberTrue++
			}
			if (element.MyResult) {
				numberAnswer++
			}
		})

		if (numberAnswer !== numberTrue) {
			flag = false
		}

		return flag
	}

	function getWriteResult(params) {
		if (!!params?.AnswerResults[0]?.MyAnswerContent) {
			return true
		}
		return false
	}

	async function getAllQuest() {
		console.time('-- getAllQuest')
		let temp = []
		section?.ExerciseResultGroups.forEach((group) => {
			group?.ExerciseResults.forEach((currentQuestion) => {
				const isTrue = group?.Type == QUESTION_TYPES.Write ? getWriteResult(currentQuestion) : getResult(currentQuestion)
				const questIndex = listQuestionID.indexOf(currentQuestion?.Id)
				temp.push({ Id: currentQuestion?.Id, Index: questIndex + 1, isTrue: isTrue })
			})
		})
		setAllQuest(temp)
		console.timeEnd('-- getAllQuest')
	}

	// SCROLL TO ELEMENT
	const scrollToElement = async (activate: any) => {
		const firstElement = await document.getElementById(`question-${listQuestionID[0]}`)
		const element = await document.getElementById(`question-${activate}`)

		const elemRect = await element.getBoundingClientRect()
		const firstElemRect = await firstElement.getBoundingClientRect()
		const offset = await (elemRect.top - firstElemRect.top)

		scrollElement.scroll({ top: offset + 100, left: 0, behavior: 'smooth' })
	}

	function activeAnswer(answerID) {
		dispatch(setActivating(answerID))
		scrollToElement(answerID)
	}

	return (
		<div className="w-full mt-[0px]">
			<div className="font-[600] text-[16px] mb-3">{section?.Name}</div>

			<List
				grid={{ gutter: 16, xs: 8, sm: 8, md: 4, lg: 6, xl: 8, xxl: 8 }}
				pagination={false}
				dataSource={allQuest}
				renderItem={(item, index) => {
					const wIndex = answered.indexOf(item?.Id)
					const activated = activating == item?.Id

					function activate() {
						activeAnswer(item?.Id)
					}

					return (
						<List.Item className="none-selection">
							{wIndex == -1 && activated && (
								<>
									{item?.isTrue && (
										<div onClick={activate} className="exam-nav-item nav-active">
											{item.Index}
										</div>
									)}

									{!item?.isTrue && (
										<div onClick={activate} className="exam-nav-item nav-red">
											{item.Index}
										</div>
									)}
								</>
							)}

							{wIndex == -1 && !activated && (
								<>
									{item?.isTrue && (
										<div onClick={activate} className="exam-nav-item nav-default">
											{item.Index}
										</div>
									)}

									{!item?.isTrue && (
										<div onClick={activate} className="exam-nav-item nav-red none-border">
											{item.Index}
										</div>
									)}
								</>
							)}
						</List.Item>
					)
				}}
			/>
		</div>
	)
}

export default SectionNavigator
