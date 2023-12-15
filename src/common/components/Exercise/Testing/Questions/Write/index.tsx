import { Input } from 'antd'
import Router from 'next/router'
import React, { useState } from 'react'
import ReactHTMLParser from 'react-html-parser'
import { FaCheck } from 'react-icons/fa'
import { doingTestApi } from '~/api/IeltsExam/doing-test'
import { useExamContext } from '~/common/providers/Exam'
import MarkingExam from '~/common/components/Mark/MarkingExam/MarkingExam'
import PrimaryTag from '~/common/components/Primary/Tag'

const Write = (props) => {
	const { data, IndexInExam, isDoing, isResult, curGroup, onRefresh } = props
	const { questionsInSection, setCurrentQuestion, setQuestionsInSection, setNotSetCurrentQuest } = useExamContext()

	const [doingTestDetails, setDoingTestDetails] = useState<Array<any>>([...data?.DoingTestDetails])

	async function insertDetails(answer) {
		let items = []

		if (!!doingTestDetails) {
			doingTestDetails.forEach((element) => {
				items.push({ ...element, Enable: false })
			})
		}

		items.push({ Id: 0, IeltsAnswerId: 0, IeltsAnswerContent: answer?.Content, Type: 0, Index: 0, Enable: true })

		if (!!Router?.query?.exam) {
			try {
				const res = await doingTestApi.insertDetail({
					DoingTestId: parseInt(Router?.query?.exam + ''),
					IeltsQuestionId: data.Id,
					Items: [...items]
				})
				if (res.status == 200) {
					const ieltsQuestions = res?.data?.data?.IeltsQuestions

					if (ieltsQuestions) {
						const questIndex = ieltsQuestions.findIndex((inQuest) => inQuest?.Id == data?.Id)
						if (questIndex > -1 && !!ieltsQuestions[questIndex]?.DoingTestDetails) {
							setDoingTestDetails([...ieltsQuestions[questIndex]?.DoingTestDetails])
						}
					}

					// ----------------------------------------------------------------

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

	function getAnswered() {
		if (!!isDoing) {
			if (!!doingTestDetails) {
				return !!doingTestDetails[0]?.IeltsAnswerContent ? doingTestDetails[0]?.IeltsAnswerContent : ''
			}
		}

		if (!!isResult) {
			return data?.IeltsAnswerResults[0]?.MyIeltsAnswerContent || 'Không trả lời'
		}

		return ''
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
			key={'question-' + data.Id}
			id={'cauhoi-' + data.Id}
			className={`cc-choice-warpper border-[1px] border-[#e6e6e6]`}
		>
			<div className="exam-quest-wrapper none-selection">
				{!Router.asPath.includes('questions') && (
					<div id={`quest-num-${data.Id}`} className="ex-quest-tf">
						{IndexInExam}
					</div>
				)}

				<div className="h-[16px]" />

				{ReactHTMLParser(data?.Content)}
			</div>

			<div>
				<div className="font-[600] mb-2 mt-3">Answer</div>
				{!isResult && (
					<Input.TextArea
						key={'the-answer-' + data.id}
						placeholder={isDoing ? 'Nhập câu trả lời' : ''}
						disabled={!isDoing || false}
						defaultValue={getAnswered()}
						onBlur={(e) => !!e.target.value && insertDetails({ Content: e.target.value })}
						className="cc-writing-testing"
						rows={4}
					/>
				)}

				{!!isResult && <div className="whitespace-pre-wrap">{getAnswered()}</div>}

				{!!isResult && (
					<div className="flex flex-col items-start mt-[16px]">
						{!data?.Point && (
							<PrimaryTag color="yellow" className="!px-[8px]">
								Chưa chấm
							</PrimaryTag>
						)}

						{!!data?.Point && (
							<PrimaryTag color="green" className="!px-[8px]">
								<FaCheck size={14} className="mr-[4px]" /> Đã chấm
							</PrimaryTag>
						)}

						{!!data?.Point && (
							<div className="title-exercise-content" style={{ marginTop: 16, fontSize: 16, fontWeight: 600 }}>
								Điểm: {data?.Point}
							</div>
						)}

						<div className="mt-[16px]">
							<MarkingExam
								onRefresh={onRefresh}
								isWritting={true}
								onGetPoint={(point) => {}}
								dataRow={data}
								dataMarking={data}
								info={data}
								curGroup={curGroup}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default Write
