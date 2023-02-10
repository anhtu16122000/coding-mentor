import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { RootState } from '~/store'
import { setListAnswered, setTestingData } from '~/store/testingState'
import HeaderTrueFalse from '../../../Question/TrueFalse/Header'
import CheckBox from '../../../Question/TrueFalse/CheckBox'

const TrueFalseTesting: FC<any> = (props) => {
	const { data } = props

	const dispatch = useDispatch()

	const testingData = useSelector((state: RootState) => state.testingState.data)
	const answered = useSelector((state: RootState) => state.testingState.answered)

	const onChange = (event, content: string) => {
		console.time('--- Select Answer')
		const cloneData = []
		testingData.forEach((element) => {
			// Tìm đúng câu đang chọn
			if (data.Id == element?.ExerciseId) {
				cloneData.push({ ExerciseId: element?.ExerciseId, Answers: [{ AnswerId: event?.Id, AnswerContent: content }] })
			} else {
				cloneData.push({ ...element })
			}
		})
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

	function checkChecked(index: number) {
		let flag = false
		// Tìm đúng câu đang chọn
		testingData.forEach((element) => {
			if (data.Id == element?.ExerciseId) {
				// Tìm đáp án đang chọn
				element?.Answers.forEach((innerElement) => {
					if (data.Answers[index]?.Id == innerElement?.AnswerId) {
						flag = true
					}
				})
			}
		})
		return flag
	}

	return (
		<div key={'question-' + data.Id} id={'question-' + data.Id} className="cc-tf-question py-[8px] !pl-[0px] ">
			<HeaderTrueFalse data={data} />

			<div className="true-false-container">
				<CheckBox content="True" data={data} checked={checkChecked(0)} onChange={() => onChange(data.Answers[0], 'True')} />

				<CheckBox content="False" data={data} checked={checkChecked(1)} onChange={() => onChange(data.Answers[1], 'False')} />

				<CheckBox content="Not given" data={data} checked={checkChecked(2)} onChange={() => onChange(data.Answers[2], 'Not given')} />
			</div>

			<div className="w-[90%] h-[1px] bg-[#00000016] block w500:hidden" />
		</div>
	)
}

export default TrueFalseTesting
