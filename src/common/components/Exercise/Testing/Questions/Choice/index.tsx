import { Checkbox, Radio, Space } from 'antd'
import React from 'react'
import { AiOutlineFileDone } from 'react-icons/ai'
import { TbFileCertificate } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import ChoiceInputForm from '../../../Details/QuestionsForm/MultipleChoiceForm/Form'
import { doingTestApi } from '~/api/IeltsExam/doing-test'
import Router from 'next/router'
import htmlParser from '~/common/components/HtmlParser'

const Choice = (props) => {
	const { data, index, indexInExam, onRefresh, showEdit, isDoing, setCurrentQuestion, onRefreshNav } = props

	const dispatch = useDispatch()

	const onChange = (event, type: 'single' | 'multiple') => {
		console.time('--- Select Answer')

		if (type == 'single') {
			//
			insertDetails({ Id: event.target?.value })
		}

		if (type == 'multiple') {
			//
		}

		console.timeEnd('--- Select Answer')
	}

	function isDisabled() {
		if (!!isDoing) {
			return false
		}

		if (!isDoing) {
			return true
		}
	}

	function getType() {
		if (!!data?.CorrectAmount) {
			if (data?.CorrectAmount > 1) {
				return 'multiple'
			} else {
				return 'single'
			}
		}

		let flag = 0
		data.IeltsAnswers.forEach((answer) => {
			if (!!answer.Correct) {
				flag++
			}
		})
		if (flag > 1) {
			return 'multiple'
		} else {
			return 'single'
		}
	}

	function getDataCheckbox(params, type?: any) {
		let temp = []
		let checked = []

		params.forEach((element) => {
			if (element?.Enable !== false) {
				temp.push({
					value: !!element.Id ? element.Id : element.ficaID,
					label: element.Content
				})
				if (!isDoing) {
					if (element?.Correct == true) {
						checked.push(!!element.Id ? element.Id : element.ficaID)
					}
				}
			}
		})

		if (!!isDoing && !!data?.DoingTestDetails) {
			for (let i = 0; i < data?.DoingTestDetails.length; i++) {
				const element = data?.DoingTestDetails[i]
				checked.push(element?.IeltsAnswerId)
			}
		}

		return { option: temp, checked: checked }
	}

	function getChecked() {
		if (!isDoing) {
			for (let i = 0; i < data.IeltsAnswers.length; i++) {
				const element = data.IeltsAnswers[i]
				if (element?.Correct) {
					return element?.Id
				}
			}
		}

		if (!!isDoing) {
			if (!!data?.DoingTestDetails) {
				return data?.DoingTestDetails[0]?.IeltsAnswerId
			}
		}
		return ''
	}

	const curGroup = useSelector((state: RootState) => state.newExam.currentGroup)

	// ----------------------------------------------------------------
	// Doing test

	async function insertDetails(answer) {
		let items = []

		if (getType() == 'single') {
			if (!!data?.DoingTestDetails) {
				items.push({ ...data?.DoingTestDetails[0], Enable: false })
			}
			items.push({ Id: 0, IeltsAnswerId: answer?.Id, IeltsAnswerContent: answer?.Content, Type: 0, Index: 0, Enable: true })
		} else {
			// ----------------------------------
			if (!!data?.DoingTestDetails) {
				let flag = false

				for (let i = 0; i < data?.DoingTestDetails.length; i++) {
					flag = false

					for (let j = 0; j < answer.length; j++) {
						if (data?.DoingTestDetails[i]?.IeltsAnswerId == answer[j]) {
							flag = true
						}
					}

					if (!flag) {
						items.push({ ...data?.DoingTestDetails[i], Enable: false })
					} else {
						items.push({ ...data?.DoingTestDetails[i] })
					}
				}

				for (let j = 0; j < answer.length; j++) {
					const indexInMyHeart = items.findIndex((item) => item?.IeltsAnswerId == answer[j])
					if (indexInMyHeart == -1) {
						items.push({ Id: 0, IeltsAnswerId: answer[j], IeltsAnswerContent: '', Type: 0, Index: 0, Enable: true })
					}
				}
			} else {
				for (let j = 0; j < answer.length; j++) {
					const indexInMyHeart = items.findIndex((item) => item?.IeltsAnswerId == answer[j])

					if (indexInMyHeart == -1) {
						items.push({ Id: 0, IeltsAnswerId: answer[j], IeltsAnswerContent: '', Type: 0, Index: 0, Enable: true })
					}
				}

				// items.push({ Id: 0, IeltsAnswerId: answer?.Id, IeltsAnswerContent: answer?.Content, Type: 0, Index: 0, Enable: true })
			}
		}

		if (!!Router?.query?.exam) {
			console.log('-------- PUT items: ', items)

			try {
				await doingTestApi.insertDetail({
					DoingTestId: parseInt(Router?.query?.exam + ''),
					IeltsQuestionId: data.Id,
					Items: [...items]
				})
			} catch (error) {
			} finally {
				onRefreshNav()
			}
		}
	}

	return (
		<div
			onClick={() => setCurrentQuestion({ ...data, IeltsQuestionId: data?.Id })}
			key={'question-' + data.Id}
			id={'question-' + data.Id}
			className={`cc-choice-warpper shadow-sm border-[1px] border-[#fff]`}
			style={{ marginTop: index == 0 ? 8 : 0 }}
		>
			<div className="exam-quest-wrapper none-selection">
				<div className="cc-choice-number">
					Câu {indexInExam}
					<div className="cc-choice-point">
						<TbFileCertificate size={12} className="mr-1" />
						<div className="mt-[1px]">{data?.Point} điểm</div>
					</div>
					{!!showEdit && (
						<div className="mx-[8px]">
							<ChoiceInputForm isEdit defaultData={data} onRefresh={onRefresh} />
						</div>
					)}
					{data?.Correct > 1 && (
						<div className="cc-choice-correct-number">
							<AiOutlineFileDone size={12} className="mr-1" />
							<div className="mt-[1px]">{data?.Correct} câu đúng</div>
						</div>
					)}
				</div>

				<div>{htmlParser(data?.Content)}</div>
			</div>

			{getType() == 'single' && (
				<Radio.Group disabled={isDisabled()} className="mt-2" defaultValue={getChecked()} onChange={(event) => onChange(event, 'single')}>
					<Space direction="vertical">
						{data.IeltsAnswers.map((answer) => (
							<Radio
								checked={answer?.Correct}
								key={'choice-' + index + '-' + answer.Id}
								className="none-selection"
								value={parseInt(answer.Id + '')}
							>
								{answer.Content}
							</Radio>
						))}
					</Space>
				</Radio.Group>
			)}

			{getType() !== 'single' && (
				<div className="custom-check-group">
					<Checkbox.Group
						className="none-selection"
						options={getDataCheckbox(data.IeltsAnswers).option}
						defaultValue={getDataCheckbox(data.IeltsAnswers, 1).checked}
						onChange={(e) => insertDetails(e)}
					/>
				</div>
			)}
		</div>
	)
}

export default Choice
