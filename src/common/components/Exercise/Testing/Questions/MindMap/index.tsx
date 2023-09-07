import { Checkbox } from 'antd'
import React, { useEffect, useState } from 'react'
import { doingTestApi } from '~/api/IeltsExam/doing-test'
import Router from 'next/router'
import htmlParser from '~/common/components/HtmlParser'

const MindMap = (props) => {
	const { dataSource, getDoingQuestionGroup, onRefreshNav, isResult } = props

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

				console.log('---- question?.IeltsAnswersResults: ', question)

				for (let j = 0; j < question?.IeltsAnswerResults.length; j++) {
					const answer = question?.IeltsAnswerResults[j]
					temp.push({ ...answer, question: question })
				}
			}
		}
		setAnswerFormated(shuffleArray(temp))
	}

	// ----------------------------------------------------------------

	function getSelectedAns(params, curAns) {
		console.log('---- getSelectedAns: ', params)
		console.log('---- getSelectedAns curAns: ', curAns)

		if (!!params?.DoingTestDetails && params.DoingTestDetails[0]?.IeltsAnswerId == curAns) {
			return true
		}

		if (isResult && params.IeltsAnswerResults[0]?.Id == curAns) {
			return true
		}

		return false
	}

	const [loading, setLoading] = useState<boolean>(false)
	async function insertDetails(quest, answer) {
		setLoading(true)

		let items = []

		if (!!quest?.DoingTestDetails) {
			items.push({ ...quest?.DoingTestDetails[0], Enable: false })
		}
		items.push({ Id: 0, IeltsAnswerId: answer, IeltsAnswerContent: '', Type: 0, Index: 0, Enable: true })

		if (!!Router?.query?.exam) {
			console.log('-------- PUT Mindmap items: ', items)

			try {
				await doingTestApi.insertDetail({
					DoingTestId: parseInt(Router?.query?.exam + ''),
					IeltsQuestionId: quest.Id,
					Items: [...items]
				})
			} catch (error) {
			} finally {
				getDoingQuestionGroup()
				onRefreshNav()
			}
		}

		setLoading(false)
	}

	function formatData(param) {
		let temp = []
		let count = 1 // Renew Index
		param.forEach((item) => {
			if (item.Enable !== false) {
				temp.push({ ...item, Index: count })
			}
			count++
		})
		return temp
	}

	// isResult

	console.log('---- dataSource: ', dataSource)

	return (
		<div className={`cc-choice-warpper relative shadow-sm border-[1px] border-[#fff]`}>
			<div className="exam-quest-wrapper none-selection">
				<div className="flex flex-col ">
					<div className="flex flex-row">
						<div className="flex flex-col flex-shrink-0 border-r-[1px] border-[#ffffff]">
							<div className="h-[46px]" />
							{formatData(!isResult ? dataSource?.IeltsQuestions : dataSource?.IeltsQuestionResults).map((exercise, exIndex) => {
								return (
									<div className={`border-t-[1px] px-[8px] border-[#ffffff] h-[46px] flex all-center bg-[#f2f2f2] min-w-[110px]`}>
										<div>{htmlParser(exercise?.Content)}</div>
									</div>
								)
							})}
						</div>

						<div className="mindmap-scroll w-full">
							<div className="flex items-center min-h-[46px]">
								{answerFormated.map((answer, ansIndex) => {
									return (
										<div
											className={`min-h-[46px] w-[110px] bg-[#86ce86] all-center flex-shrink-0 ${
												ansIndex !== 0 ? 'border-l-[1px] border-[#ffffff]' : ''
											}`}
										>
											<div className="text-[14px] text-[#fff]">{htmlParser(answer?.Content || answer?.IeltsAnswerContent)}</div>
										</div>
									)
								})}
							</div>

							{formatData(!isResult ? dataSource?.IeltsQuestions : dataSource?.IeltsQuestionResults).map((exercise) => {
								return (
									<div className="flex items-center mt-[0.5px]">
										<div className="inline-flex">
											{answerFormated.map((answer, ansIndex) => {
												return (
													<div
														className={`${
															ansIndex !== 0 ? 'border-l-[1px] border-[#ffffff]' : ''
														} h-[46px] bg-[#f2f2f2] flex all-center flex-shrink-0 w-[110px]`}
													>
														<Checkbox
															onClick={() => !isResult && insertDetails(exercise, answer?.Id)}
															checked={getSelectedAns(exercise, answer?.Id)}
															disabled={Router.asPath.includes('exam/detail')}
															id={`mind-${exercise?.Id}-${answer?.Id}`}
														/>
													</div>
												)
											})}
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</div>
			</div>

			{loading && (
				<div className="bg-[rgba(0,0,0,0.1)] all-center rounded-[6px] absolute top-0 left-0 w-full h-full">
					<div className="text-[#000] font-[500]">Đang xử lý...</div>
				</div>
			)}
		</div>
	)
}

export default MindMap
