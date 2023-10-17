import { Checkbox, Radio, Space } from 'antd'
import React from 'react'
import { AiOutlineFileDone } from 'react-icons/ai'
import { TbFileCertificate } from 'react-icons/tb'
import ChoiceInputForm from '../../../Details/QuestionsForm/MultipleChoiceForm/Form'
import { doingTestApi } from '~/api/IeltsExam/doing-test'
import Router from 'next/router'
import htmlParser from '~/common/components/HtmlParser'
import { CgSelectO } from 'react-icons/cg'
import { useExamContext } from '~/common/providers/Exam'

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']

const Choice = (props) => {
	const { data, index, indexInExam, showEdit, isDoing, isResult } = props

	const { questionsInSection, setCurrentQuestion, setQuestionsInSection, setNotSetCurrentQuest } = useExamContext()

	function onRefresh() {}

	const onChange = (event, type: 'single' | 'multiple') => {
		if (!isDoing) {
			return
		}
		if (type == 'single') {
			insertDetails({ Id: event.target?.value })
		}
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

		if (!isResult) {
			data.IeltsAnswers.forEach((answer) => {
				if (!!answer.Correct) {
					flag++
				}
			})
		}

		if (!!isResult) {
			data.IeltsAnswerResults.forEach((answer) => {
				if (!!answer.Correct) {
					flag++
				}
			})
		}

		if (flag > 1) {
			return 'multiple'
		} else {
			return 'single'
		}
	}

	function getDataCheckbox(params, type?: any) {
		let temp = []
		let checked = []

		if (!isResult) {
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
		}

		if (!!isResult) {
			params.forEach((element) => {
				temp.push({
					value: !!element.Id ? element.Id : element.ficaID,
					label: element.IeltsAnswerContent
				})

				if (element?.MyChoice == true) {
					checked.push(!!element.Id ? element.Id : element.ficaID)
				}
			})
		}

		if (!!isDoing && !!data?.DoingTestDetails) {
			for (let i = 0; i < data?.DoingTestDetails.length; i++) {
				const element = data?.DoingTestDetails[i]
				checked.push(element?.IeltsAnswerId)
			}
		}

		return { option: temp, checked: checked }
	}

	function getChecked() {
		if (!isDoing && !isResult) {
			for (let i = 0; i < data.IeltsAnswers.length; i++) {
				const element = data.IeltsAnswers[i]
				if (element?.Correct) {
					return element?.Id
				}
			}
		}

		if (!isDoing && !!isResult) {
			for (let i = 0; i < data.IeltsAnswerResults.length; i++) {
				const element = data.IeltsAnswerResults[i]
				if (element?.MyChoice) {
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

	function getCorrect() {
		let cor = []

		if (!!isResult) {
			for (let i = 0; i < data.IeltsAnswerResults.length; i++) {
				const element = data.IeltsAnswerResults[i]
				if (element?.MyChoice) {
					cor.push(alphabet[i])
				}
			}
		}

		return cor.length > 0 ? cor.join(', ') : ''
	}

	async function insertDetails(answer) {
		if (!isDoing) {
			return
		}

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
			}
		}

		if (!!Router?.query?.exam) {
			console.log('-------- PUT items: ', items)

			try {
				const res = await doingTestApi.insertDetail({
					DoingTestId: parseInt(Router?.query?.exam + ''),
					IeltsQuestionId: data.Id,
					Items: [...items]
				})

				if (res.status == 200) {
					const indexInQuestions = questionsInSection.findIndex((qx) => qx?.IeltsQuestionId == data?.Id)

					if (indexInQuestions > -1) {
						setNotSetCurrentQuest(true)

						let temp = [...questionsInSection]
						temp[indexInQuestions].IsDone = true
						setQuestionsInSection([...temp])
					}
				}
			} catch (error) {}
		}
	}

	function activeThis() {
		setNotSetCurrentQuest(true)
		if (!Router.asPath.includes('/questions')) {
			setCurrentQuestion({ ...data, IeltsQuestionId: data?.Id, IeltsQuestionResultId: data?.Id })
		}
	}

	return (
		<div
			onClick={activeThis}
			key={'question-' + data?.Id}
			id={'question-' + data?.Id}
			className={`cc-choice-warpper shadow-sm border-[1px] border-[#fff]`}
			style={{ marginTop: index == 0 ? 8 : 0 }}
		>
			<div className="exam-quest-wrapper none-selection">
				<div id={`cauhoi-${data.Id}`} className="cc-choice-number">
					{!Router.asPath.includes('questions') && (
						<div id={`quest-num-${data.Id}`} className="ex-quest-tf">
							{indexInExam}
						</div>
					)}

					<div className="bg-[#e9e9e9] h-[26px] px-[8px] rounded-full text-[14px] inline-flex items-center justify-center">
						<div>Point: {data?.Point}</div>
					</div>

					{!!showEdit && (
						<div className="mx-[8px]">
							<ChoiceInputForm isEdit defaultData={data} onRefresh={onRefresh} />
						</div>
					)}

					{!!isResult && (
						<div className="cc-choice-correct-number">
							<AiOutlineFileDone size={12} className="mr-1" />
							<div className="mt-[1px]">Câu đúng: {getCorrect()}</div>
						</div>
					)}

					{!!isResult && (
						<div className="cc-choice-orange">
							<CgSelectO size={12} className="mr-1" />
							<div className="mt-[1px]">Đã chọn: {getCorrect()}</div>
						</div>
					)}
				</div>

				<div>{htmlParser(!isResult ? data?.Content : '')}</div>
			</div>

			{getType() == 'single' && (
				<Radio.Group disabled={isDisabled()} className="mt-2" defaultValue={getChecked()} onChange={(event) => onChange(event, 'single')}>
					<Space direction="vertical">
						{!isResult &&
							data.IeltsAnswers.map((answer) => (
								<Radio
									checked={answer?.Correct}
									key={'choice-' + index + '-' + answer.Id}
									className="none-selection"
									value={parseInt(answer.Id + '')}
								>
									{answer.Content}
								</Radio>
							))}

						{!!isResult &&
							data.IeltsAnswerResults.map((answer) => (
								<Radio
									checked={answer?.MyChoice}
									key={'choice-' + index + '-' + answer.Id}
									className="none-selection"
									value={parseInt(answer.Id + '')}
								>
									{answer.IeltsAnswerContent}
								</Radio>
							))}
					</Space>
				</Radio.Group>
			)}

			{getType() !== 'single' && (
				<div className="custom-check-group">
					<Checkbox.Group
						className="none-selection"
						options={getDataCheckbox(!isResult ? data.IeltsAnswers : data.IeltsAnswerResults).option}
						defaultValue={getDataCheckbox(!isResult ? data.IeltsAnswers : data.IeltsAnswerResults, 1).checked}
						onChange={(e) => insertDetails(e)}
					/>
				</div>
			)}
		</div>
	)
}

export default Choice
