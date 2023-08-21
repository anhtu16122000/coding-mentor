import { Input } from 'antd'
import React, { useEffect, useState } from 'react'
import ReactHTMLParser from 'react-html-parser'
import { useDispatch, useSelector } from 'react-redux'
import AudioRecord from '~/common/components/AudioRecord/AudioRecord'
import UploadAudioField from '~/common/components/FormControl/UploadAudioField'
import { RootState } from '~/store'
import { setActivating, setListAnswered, setTestingData } from '~/store/testingState'

const SpeakingQuestion = (props) => {
	const { data, type, isFinal, dataSource, index, IndexInExam, disabled } = props

	const dispatch = useDispatch()

	const testingData = useSelector((state: RootState) => state.testingState.data)
	const answered = useSelector((state: RootState) => state.testingState.answered)

	const [loading, setLoading] = useState<boolean>(false)

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

	function getLinkRecorded(questIndex) {
		// const element = groupDetail.Exercises[questIndex]

		// if (element?.AnswerValues.length > 0) {
		// 	const answered = element?.AnswerValues[0]

		// 	if (!!answered?.AnswerContent) {
		// 		return answered?.AnswerContent
		// 	}
		// }

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
				{!loading && (
					<>
						<AudioRecord
							disabled={disabled}
							// linkRecord={getLinkRecorded(exerIndex)}
							// getLinkRecord={(linkRecord) => onChange(exercise.ExerciseTopicId, linkRecord)}
							packageResult={[]}
							// dataQuestion={group}
							// exerciseID={exercise.ExerciseTopicId}
							getActiveID={() => {}}
						/>

						<div className="mt-4" style={{ display: 'flex' }}>
							{/* <UploadAudioField
								isHideControl
								getFile={(file: any) => onChange(exercise.ExerciseTopicId, file)}
								link={getLinkRecorded(exerIndex)}
							/>
							<div style={{ marginTop: 5, marginLeft: 9 }}>(Phương thức dự phòng)</div> */}
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default SpeakingQuestion
