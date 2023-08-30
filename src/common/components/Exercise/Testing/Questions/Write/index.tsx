import { Input } from 'antd'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import ReactHTMLParser from 'react-html-parser'
import { useDispatch, useSelector } from 'react-redux'
import { doingTestApi } from '~/api/IeltsExam/doing-test'
import { RootState } from '~/store'
import { setActivating, setListAnswered, setTestingData } from '~/store/testingState'

const Write = (props) => {
	const { data, type, isFinal, dataSource, index, IndexInExam, disabled, isDoing } = props

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

	// ----------------------------------------------------------------
	// Doing test

	async function insertDetails(answer) {
		let items = []

		if (!!data?.DoingTestDetails) {
			items.push({ ...data?.DoingTestDetails[0], Enable: false })
		}
		items.push({ Id: 0, IeltsAnswerId: 0, IeltsAnswerContent: answer?.Content, Type: 0, Index: 0, Enable: true })

		if (!!Router?.query?.exam) {
			console.log('-------- PUT items: ', items)

			try {
				const res = await doingTestApi.insertDetail({
					DoingTestId: parseInt(Router?.query?.exam + ''),
					IeltsQuestionId: data.Id,
					Items: [...items]
				})
			} catch (error) {}
		}
	}

	function getAnswered() {
		if (!!isDoing) {
			if (!!data?.DoingTestDetails) {
				return !!data?.DoingTestDetails[0]?.IeltsAnswerContent ? data?.DoingTestDetails[0]?.IeltsAnswerContent : ''
			}
		}
		return ''
	}

	return (
		<div
			// onClick={() => dispatch(setActivating(data.Id))}
			key={'question-' + data.Id}
			id={'question-' + data.Id}
			className={`cc-choice-warpper border-[1px] border-[#e6e6e6]`}
		>
			<div className="exam-quest-wrapper none-selection">
				<div className="cc-choice-number">Câu {IndexInExam}</div>
				{ReactHTMLParser(data?.Content)}
			</div>

			<div>
				<div className="font-[600] mb-2 mt-3">Câu trả lời</div>
				<Input.TextArea
					key={'the-answer-' + data.id}
					placeholder={isDoing ? 'Nhập câu trả lời' : ''}
					disabled={!isDoing || false}
					defaultValue={getAnswered()}
					// onChange={(e) => setAnswer(e.target.value)}
					onBlur={(e) => !!e.target.value && insertDetails({ Content: e.target.value })}
					className="cc-writing-testing"
					rows={4}
				/>
			</div>
		</div>
	)
}

export default Write
