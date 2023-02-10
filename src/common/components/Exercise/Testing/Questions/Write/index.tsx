import { Input } from 'antd'
import React, { useEffect, useState } from 'react'
import ReactHTMLParser from 'react-html-parser'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import { setActivating, setListAnswered, setTestingData } from '~/store/testingState'

const Write = (props) => {
	const { data, type, isFinal, dataSource, index } = props

	const dispatch = useDispatch()

	const testingData = useSelector((state: RootState) => state.testingState.data)
	const answered = useSelector((state: RootState) => state.testingState.answered)

	const [answer, setAnswer] = useState('')

	useEffect(() => {
		getVaklue()
	}, [testingData])

	function getVaklue() {
		let text = ''
		testingData.forEach((element) => {
			if (element?.ExerciseId == data.Id) {
				if (element?.Answers.length > 0) {
					text = element.Answers[0]?.AnswerContent
				}
			}
		})
		setAnswer(text)
	}

	const onChange = (event) => {
		console.time('--- Select Answer')
		const cloneData = []
		if (!!event) {
			testingData.forEach((element) => {
				if (data.Id == element?.ExerciseId) {
					cloneData.push({ ExerciseId: element?.ExerciseId, Answers: [{ AnswerId: '', AnswerContent: event }] })
				} else {
					cloneData.push({ ...element })
				}
			})
		}
		dispatch(setTestingData(cloneData))
		// Lấy danh sách câu hỏi đã trả lời
		const cloneAnswered = []
		let flag = true
		answered.forEach((element) => {
			cloneAnswered.push(element)
			if (data?.Id == element) {
				flag = false
			}
		})
		if (flag == true) {
			cloneAnswered.push(data?.Id)
		}
		dispatch(setListAnswered(cloneAnswered))
		console.timeEnd('--- Select Answer')
	}

	const activating = useSelector((state: RootState) => state.testingState.activating)
	const activeClass = activating == data.Id ? '!bg-[#2e8fce12] border-[#a4dbf2]' : 'border-[#fff]'

	return (
		<div
			onClick={() => dispatch(setActivating(data.Id))}
			key={'question-' + data.Id}
			id={'question-' + data.Id}
			className={`cc-choice-warpper border-[1px] ${activeClass}`}
		>
			<div className="exam-quest-wrapper none-selection">
				<div className="cc-choice-number">Câu {data?.IndexInExam}</div>
				{ReactHTMLParser(data?.Content)}
			</div>

			<div>
				<div className="font-[600] mb-2 mt-3">Câu trả lời</div>
				<Input.TextArea
					key={'the-answer-' + data.id}
					placeholder=""
					value={answer}
					onChange={(e) => setAnswer(e.target.value)}
					onBlur={(e) => !!e.target.value && onChange(e.target.value)}
					className="cc-writing-testing"
					rows={4}
				/>
			</div>
		</div>
	)
}

export default Write
