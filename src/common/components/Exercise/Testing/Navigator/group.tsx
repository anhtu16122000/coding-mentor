import { List } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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

	async function getAllQuest() {
		console.time('-- getAllQuest')
		let temp = []
		section?.ExerciseGroups.forEach((group) => {
			group?.Exercises.forEach((currentQuestion) => {
				const questIndex = listQuestionID.indexOf(currentQuestion?.Id)
				temp.push({ Id: currentQuestion?.Id, Index: questIndex + 1 })
			})
		})
		setAllQuest(temp)
		console.timeEnd('-- getAllQuest')
	}

	// SCROLL TO ELEMENT
	const scrollToElement = async (activate: any) => {
		const firstElement = await document.getElementById(`question-${listQuestionID[0]}`)
		const element = await document.getElementById(`question-${activate}`)

		console.log('`question-${activate}`: ', `question-${activate}`)
		console.log('element: ', element)

		const elemRect = await element.getBoundingClientRect()
		const firstElemRect = await firstElement.getBoundingClientRect()
		const offset = await (elemRect.top - firstElemRect.top)
		scrollElement.scroll({ top: offset, left: 0, behavior: 'smooth' })
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
					const currentIndex = answered.indexOf(item?.Id)

					return (
						<List.Item className="none-selection">
							{currentIndex == -1 && activating == item?.Id && (
								<div
									onClick={() => activeAnswer(item?.Id)}
									className="cursor-pointer text-[#0074e4] bg-[#e9f6ff] hover:bg-[#d9ecfa] active:bg-[#dbdbdb] active:border-[0px] border-[1px] border-[#a7c9e9] w-[28px] h-[28px] rounded-[4px] flex items-center justify-center font-[700]"
								>
									{item.Index}
								</div>
							)}

							{currentIndex !== -1 && (
								<div
									onClick={() => activeAnswer(item?.Id)}
									className="cursor-pointer text-[#ffffff] bg-[#b3b3b3] hover:bg-[#d9ecfa] active:bg-[#dbdbdb] w-[28px] h-[28px] rounded-[4px] flex items-center justify-center font-[700]"
								>
									{item.Index}
								</div>
							)}

							{currentIndex == -1 && activating !== item?.Id && (
								<div
									onClick={() => activeAnswer(item?.Id)}
									className="cursor-pointer bg-[#eeeeee] hover:bg-[#cccccc] active:bg-[#dbdbdb] w-[28px] h-[28px] rounded-[4px] flex items-center justify-center font-[700]"
								>
									{item.Index}
								</div>
							)}
						</List.Item>
					)
				}}
			/>
		</div>
	)
}

export default SectionNavigator
