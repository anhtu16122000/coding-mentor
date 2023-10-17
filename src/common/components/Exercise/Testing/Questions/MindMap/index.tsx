import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { doingTestApi } from '~/api/IeltsExam/doing-test'
import Router from 'next/router'
import { AiOutlineFullscreen } from 'react-icons/ai'
import MindMapAnnotate from './Annotate'
import MindMapFullLoading from './FullLoading'
import QuestionContent from './QuestionContent'
import MindMapCheckBox from './CustomCheckbox'
import MindMapAnswer from './Answer'
import { useExamContext } from '~/common/providers/Exam'

function getQuestIndex(questions, curQuest) {
	if (Router.asPath.includes('questions')) {
		return null
	}

	const theIndex = questions.findIndex((question) => question?.IeltsQuestionId == curQuest?.Id)
	if (theIndex !== -1) {
		return questions[theIndex]
	}
	return ''
}

function getResultQuestIndex(questions, curQuest) {
	if (Router.asPath.includes('questions')) {
		return null
	}

	const theIndex = questions.findIndex((question) => question?.IeltsQuestionResultId == curQuest?.Id)
	if (theIndex !== -1) {
		return questions[theIndex]
	}
	return ''
}

const MindMap = (props) => {
	const { dataSource, isResult, setCurGroup } = props

	const { questionsInSection, setQuestionsInSection, setNotSetCurrentQuest, setCurrentQuestion } = useExamContext()

	const [isFirst, setIsFirst] = useState<boolean>(true)
	const [answerFormated, setAnswerFormated] = useState([])

	useEffect(() => {
		if (isFirst) getALLAnswer()
	}, [dataSource])

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[array[i], array[j]] = [array[j], array[i]]
		}
		setIsFirst(false)
		return array
	}

	function getALLAnswer() {
		let temp = []
		if (!isResult) {
			for (let i = 0; i < dataSource?.IeltsQuestions.length; i++) {
				const question = dataSource?.IeltsQuestions[i]
				for (let j = 0; j < question?.IeltsAnswers.length; j++) {
					const answer = question?.IeltsAnswers[j]
					temp.push({ ...answer, question: question })
				}
			}
		}

		if (!!isResult) {
			for (let i = 0; i < dataSource?.IeltsQuestionResults.length; i++) {
				const question = dataSource?.IeltsQuestionResults[i]

				for (let j = 0; j < question?.IeltsAnswerResults.length; j++) {
					const answer = question?.IeltsAnswerResults[j]
					temp.push({ ...answer, question: question })
				}
			}
		}
		setAnswerFormated(shuffleArray(temp))
	}

	function getSelectedAns(params, curAns) {
		if (!!params?.DoingTestDetails && params.DoingTestDetails[0]?.IeltsAnswerId == curAns) {
			return { checked: true }
		}

		if (isResult && params.IeltsAnswerResults) {
			let temp = null

			for (let p = 0; p < params.IeltsAnswerResults.length; p++) {
				const element = params.IeltsAnswerResults[p]

				if (element?.Correct) {
					temp = element
				}
			}

			if (params?.AnswerOfMindmap == curAns) {
				return { correct: temp, checked: true }
			} else {
				return { correct: temp, checked: false }
			}
		}

		return { checked: false }
	}

	const [loading, setLoading] = useState<boolean>(false)
	async function insertDetails(quest, answer) {
		// setLoading(true)

		let items = []

		if (!!quest?.DoingTestDetails) {
			items.push({ ...quest?.DoingTestDetails[0], Enable: false })
		}
		items.push({ Id: 0, IeltsAnswerId: answer, IeltsAnswerContent: '', Type: 0, Index: 0, Enable: true })

		if (!!Router?.query?.exam) {
			console.log('-------- PUT Mindmap items: ', items)

			try {
				const res = await doingTestApi.insertDetail({
					DoingTestId: parseInt(Router?.query?.exam + ''),
					IeltsQuestionId: quest?.Id,
					Items: [...items]
				})

				// --------------------------------
				if (res.status == 200) {
					setCurGroup(res.data?.data)

					const indexInQuestions = questionsInSection.findIndex((qx) => qx?.IeltsQuestionId == quest?.Id)

					if (indexInQuestions > -1) {
						setNotSetCurrentQuest(true)

						setCurrentQuestion(questionsInSection[indexInQuestions])

						let temp = [...questionsInSection]
						temp[indexInQuestions].IsDone = true
						setQuestionsInSection([...temp])
					}
				}
			} catch (error) {}
		}

		setLoading(false)
	}

	const [dataFormated, setDataFormated] = useState([])

	function formatData(param) {
		let temp = []
		let count = 1 // Renew Index
		param.forEach((item) => {
			if (item.Enable != false) {
				temp.push({ ...item, Index: count })
			}
			count++
		})
		setDataFormated(temp)
		return temp
	}

	const [visible, setVisible] = useState<boolean>(false)

	const mapQuestions = !isResult ? dataSource?.IeltsQuestions : dataSource?.IeltsQuestionResults

	function getStartedIndex() {
		// Lấy index của câu đầu tiên trong nhóm
		if (isResult) {
			// Coi kết quả
			return getResultQuestIndex(questionsInSection, mapQuestions[0])?.Index
		}
		return getQuestIndex(questionsInSection, mapQuestions[0])?.Index
	}

	function getFinalIndex() {
		// Lấy index của câu cuối cùng trong nhóm
		const mapLength = mapQuestions.length
		if (isResult) {
			// Coi kết quả
			return getResultQuestIndex(questionsInSection, mapQuestions[mapLength - 1])?.Index
		}
		return getQuestIndex(questionsInSection, mapQuestions[mapLength - 1])?.Index
	}

	useEffect(() => {
		formatData(!isResult ? dataSource?.IeltsQuestions : dataSource?.IeltsQuestionResults)
	}, [dataSource])

	return (
		<>
			<div className={`cc-choice-warpper ex23-mind`}>
				<div className="flex w-full items-center justify-end">
					<div onClick={() => setVisible(true)} className="ex-23-btn-change-skill !mr-0 mb-[8px]">
						<AiOutlineFullscreen size={20} />
						<div className="ml-[4px] font-[600]">Toàn màn hình</div>
					</div>
				</div>

				<div className="exam-quest-wrapper no-select">
					<div className="flex flex-col">
						<div className="mindmap-scroll flex flex-row">
							<div className="ex23-mind-quest-wrapper">
								<div className="h-[46px]" />
								{dataFormated.map((exercise, exIndex) => {
									const thisItem = isResult
										? getResultQuestIndex(questionsInSection, exercise)
										: getQuestIndex(questionsInSection, exercise)
									return <QuestionContent Index={thisItem?.Index} Content={exercise?.Content} question={exercise} />
								})}
							</div>

							<div className="w-full">
								<div className="flex items-center min-h-[46px]">
									{answerFormated.map((answer, ansIndex) => {
										return <MindMapAnswer answer={answer} index={ansIndex} />
									})}
								</div>

								{dataFormated.map((exercise) => {
									return (
										<MindMapCheckBox
											answers={answerFormated}
											exercise={exercise}
											isResult={isResult}
											onClick={insertDetails}
											getSelectedAns={getSelectedAns}
										/>
									)
								})}
							</div>
						</div>
					</div>
				</div>

				{isResult && <MindMapAnnotate />}
				{loading && <MindMapFullLoading />}
			</div>

			<Modal
				width="90%"
				footer={null}
				title={`Câu: ${getStartedIndex()} - ${getFinalIndex()}`}
				open={visible}
				onCancel={() => setVisible(false)}
			>
				<div className={`cc-choice-warpper ex23-mind`}>
					<div className="exam-quest-wrapper no-select">
						<div className="flex flex-col">
							<div className="mindmap-scroll flex flex-row">
								<div className="ex23-mind-quest-wrapper">
									<div className="h-[46px]" />
									{dataFormated.map((exercise, exIndex) => {
										const thisItem = isResult
											? getResultQuestIndex(questionsInSection, exercise)
											: getQuestIndex(questionsInSection, exercise)
										return <QuestionContent Index={thisItem?.Index} Content={exercise?.Content} question={exercise} />
									})}
								</div>

								<div className="w-full">
									<div className="flex items-center min-h-[46px]">
										{answerFormated.map((answer, ansIndex) => {
											return <MindMapAnswer answer={answer} index={ansIndex} />
										})}
									</div>

									{dataFormated.map((exercise) => {
										return (
											<MindMapCheckBox
												answers={answerFormated}
												exercise={exercise}
												isResult={isResult}
												onClick={insertDetails}
												getSelectedAns={getSelectedAns}
											/>
										)
									})}
								</div>
							</div>
						</div>
					</div>

					{isResult && <MindMapAnnotate />}
					{loading && <MindMapFullLoading />}
				</div>
			</Modal>
		</>
	)
}

export default MindMap
