import { Checkbox, Radio, Space } from 'antd'
import React from 'react'
import ReactHTMLParser from 'react-html-parser'
import { AiOutlineFileDone } from 'react-icons/ai'
import { TbFileCertificate } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import { setActivating, setListAnswered, setTestingData } from '~/store/testingState'

const Choice = (props) => {
	const { data, type, isFinal, dataSource, index } = props

	const dispatch = useDispatch()

	const testingData = useSelector((state: RootState) => state.testingState.data)
	const answered = useSelector((state: RootState) => state.testingState.answered)

	const onChange = (event, type: 'single' | 'multiple') => {
		console.time('--- Select Answer')
		const cloneData = []

		testingData.forEach((element) => {
			// Tìm đúng câu đang chọn
			if (data.Id == element?.ExerciseId) {
				// Câu chọn 1 đáp án
				if (type == 'single') {
					const currentAnswer = { AnswerId: event.target.value, AnswerContent: null }
					if (event.target.checked) {
						// Chọn câu đó
						cloneData.push({ ExerciseId: element?.ExerciseId, Answers: [currentAnswer] })
					} else {
						// Bỏ chọn câu đó
						cloneData.push({ ExerciseId: element?.ExerciseId, Answers: [] })
					}
				}

				// Câu chọn nhiều đáp án
				if (type == 'multiple') {
					// Câu hiện tại chưa có đáp án nào

					let answers = []
					event.forEach((eventItem: number) => {
						// Gán từng đáp án dô danh sách đáp án
						answers.push({ AnswerId: eventItem, AnswerContent: null })
					})

					// Gán đáp án dô danh sách câu trả lời
					cloneData.push({ ExerciseId: element?.ExerciseId, Answers: answers })
				}
			} else {
				cloneData.push({ ...element })
			}
		})

		dispatch(setTestingData(cloneData))

		// Lấy danh sách câu hỏi đã trả lời
		const cloneAnswered = []

		if (type == 'single') {
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
		}

		if (type == 'multiple') {
			if (event.length == 0) {
				answered.forEach((element) => {
					if (data?.Id !== element) {
						cloneAnswered.push(element)
					}
				})
			} else {
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
			}
		}

		dispatch(setListAnswered(cloneAnswered))

		console.timeEnd('--- Select Answer')
	}

	function isDisabled() {
		if (type == 'edit') {
			return true
		} else {
			return false
		}
	}

	function getType() {
		if (data?.Correct > 1) {
			return 'multiple'
		} else {
			return 'single'
		}
	}

	function getDataCheckbox(params) {
		let temp = []
		let checked = []

		params.forEach((element) => {
			if (element?.Enable !== false) {
				temp.push({ value: !!element.Id ? element.Id : element.ficaID, label: element.AnswerContent })
				if (element?.IsTrue == true) {
					checked.push(!!element.Id ? element.Id : element.ficaID)
				}
			}
		})

		return { option: temp, checked: checked }
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
				<div className="cc-choice-number">
					Câu {data?.IndexInExam}
					<div className="cc-choice-point">
						<TbFileCertificate size={12} className="mr-1" />
						<div className="mt-[1px]">{data?.Point} điểm</div>
					</div>
					{data?.Correct > 1 && (
						<div className="cc-choice-correct-number">
							<AiOutlineFileDone size={12} className="mr-1" />
							<div className="mt-[1px]">{data?.Correct} câu đúng</div>
						</div>
					)}
				</div>
				{ReactHTMLParser(data?.Content)}
			</div>

			{getType() == 'single' && (
				<Radio.Group disabled={isDisabled()} className="mt-2" onChange={(event) => onChange(event, 'single')}>
					<Space direction="vertical">
						{data.Answers.map((answer) => (
							<Radio key={'choice-' + index + '-' + answer.Id} className="none-selection" value={parseInt(answer.Id + '')}>
								{answer.AnswerContent}
							</Radio>
						))}
					</Space>
				</Radio.Group>
			)}

			{getType() !== 'single' && (
				<div className="custom-check-group">
					<Checkbox.Group
						className="none-selection"
						options={getDataCheckbox(data.Answers).option}
						onChange={(event) => onChange(event, 'multiple')}
					/>
				</div>
			)}
		</div>
	)
}

export default Choice
