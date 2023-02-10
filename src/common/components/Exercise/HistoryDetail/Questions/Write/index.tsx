import React, { useState } from 'react'
import ReactHTMLParser from 'react-html-parser'
import { IoIosArrowUp } from 'react-icons/io'
import { RiErrorWarningLine } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import { setActivating } from '~/store/testingState'

const ResultWrite = (props) => {
	const { data } = props

	const dispatch = useDispatch()

	const activating = useSelector((state: RootState) => state.testingState.activating)
	const user = useSelector((state: RootState) => state.user.information)

	function getAnswered() {
		let temp = ''
		data?.AnswerResults.forEach((element: any, answerIndex: any) => {
			if (!!element?.MyAnswerContent) {
				temp = !temp ? temp + getAlphaBet(answerIndex) : temp + ' - ' + getAlphaBet(answerIndex)
			}
		})
		return temp
	}

	/**
	 * It takes a number and returns a letter
	 * @param param - the index of the array
	 * @returns The letter of the alphabet that corresponds to the number passed in.
	 */
	function getAlphaBet(param) {
		let temp = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
		return temp[param]
	}

	const activeClass = activating == data.Id ? 'quest-activated' : ''
	const falseClass = !getAnswered() ? 'false-quest' : ''

	const [showDesc, setShowDesc] = useState(false)

	return (
		<div
			onClick={() => dispatch(setActivating(data.Id))}
			key={'question-' + data.Id}
			id={'question-' + data.Id}
			className={`ex-res-section mb-[8px] ${activeClass} ${falseClass}`}
		>
			<div className="exam-quest-wrapper none-selection pr-[16px]">
				<span className="cc-choice-number">Câu {data?.IndexInExam}</span>

				{ReactHTMLParser(data?.Content)}

				{getAnswered() && (
					<div>
						<div className="mt-[8px]">- - - - -</div>
						<div className="writing-ans-title">Câu trả lời</div>
						<div className=" whitespace-pre-wrap">{ReactHTMLParser(data?.AnswerResults[0]?.MyAnswerContent)}</div>
					</div>
				)}
			</div>

			{!getAnswered() && (
				<div className="none-answer">
					<RiErrorWarningLine size={20} className="mr-2" /> Không trả lời
				</div>
			)}

			{!!data?.DescribeAnswer && (
				<div className="inline-flex flex-col pb-3 mt-[-16px]">
					<div className="mt-[8px]">- - - - -</div>
					<div className="w-fit flex flex-row items-center none-selection cursor-pointer text-[#10a708]">
						<div className="pr-2" onClick={() => setShowDesc(!showDesc)}>
							{showDesc ? 'Ẩn đáp án mẫu' : 'Xem đáp án mẫu'}
						</div>
						<IoIosArrowUp className={showDesc ? 'rotate-0 duration-300' : 'rotate-180 duration-300'} size={16} />
					</div>
					{showDesc && <div className="slide-down-text whitespace-pre-wrap">{ReactHTMLParser(data?.DescribeAnswer)}</div>}
				</div>
			)}
		</div>
	)
}

export default ResultWrite
