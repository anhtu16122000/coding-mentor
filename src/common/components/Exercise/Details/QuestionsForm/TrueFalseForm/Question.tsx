import { Checkbox } from 'antd'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { doingTestApi } from '~/api/IeltsExam/doing-test'
import { useExamContext } from '~/common/providers/Exam'
import htmlParser from '~/common/components/HtmlParser'
import { wait } from '~/common/utils'
import { RootState } from '~/store'

const TrueFalseQuestion = (props) => {
	const { data, type, isDoing, setCurrentQuestion, setCurGroup, indexInExam, isResult } = props

	const { questionsInSection, setNotSetCurrentQuest, setQuestionsInSection } = useExamContext()

	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		setLoading(false)
	}, [data])

	function getTrueAns(index: number) {
		if (!isDoing && data.IeltsAnswerResults[index].Correct) {
			return true
		}

		return false
	}

	function checkChecked(index: number) {
		if (!isDoing && !isResult && data.IeltsAnswers[index]?.Correct) {
			return true
		}

		if (!!isResult) {
			return data?.IeltsAnswerResults[index]?.MyChoice
		}

		if (!!isDoing) {
			return !data?.DoingTestDetails ? null : data?.DoingTestDetails[0]?.IeltsAnswerId == data.IeltsAnswers[index]?.Id ? true : false
		}

		return false
	}

	const [showen, setShowen] = useState<boolean>(true)

	async function thisMagic() {
		setShowen(false)
		await wait(50)
		setShowen(true)
	}

	async function insertDetails(answer) {
		setLoading(true)

		let items = []

		if (!!data?.DoingTestDetails) {
			const checkedBox = document.getElementById(`check-box-${data.DoingTestDetails[0]?.IeltsAnswerId}`)

			if (!!checkedBox) {
				checkedBox.click()
			}

			items.push({ ...data?.DoingTestDetails[0], Enable: false })
		}

		items.push({ Id: 0, IeltsAnswerId: answer?.Id, IeltsAnswerContent: '', Type: 0, Index: 0, Enable: true })

		if (!!Router?.query?.exam) {
			console.log('-------- PUT items: ', items)

			try {
				const res = await doingTestApi.insertDetail({
					DoingTestId: parseInt(Router?.query?.exam + ''),
					IeltsQuestionId: data.Id,
					Items: [...items]
				})
				if (res.status == 200) {
					setCurGroup(res.data?.data)

					const indexInQuestions = questionsInSection.findIndex((qx) => qx?.IeltsQuestionId == data?.Id)

					if (indexInQuestions > -1) {
						setNotSetCurrentQuest(true)

						setCurrentQuestion(questionsInSection[indexInQuestions])

						let temp = [...questionsInSection]
						temp[indexInQuestions].IsDone = true
						setQuestionsInSection([...temp])
					}
				}
			} catch (error) {
			} finally {
				thisMagic()
			}
		}
	}

	const curGroup = useSelector((state: RootState) => state.takeAnExam?.curGroup)

	function getClass(index) {
		if (checkChecked(index) && getTrueAns(index)) {
			return 'check-true-true'
		}

		if (checkChecked(index) && !getTrueAns(index)) {
			return 'check-false'
		}

		if (!checkChecked(index) && getTrueAns(index)) {
			return 'check-true'
		}

		return ''
	}

	const disabledCheckbox = loading || !isDoing || isResult

	function onClick() {
		if (setCurrentQuestion && !Router.asPath.includes('/questions')) {
			setCurrentQuestion({
				...data,
				IeltsQuestionId: data?.Id,
				IeltsQuestionGroupId: curGroup?.Id
			})
		}
	}

	return (
		<div onClick={onClick} className="flex items-start mb-[8px] pl-[4px] min-h-[37px]">
			<div id={`cauhoi-${data.Id}`} className="flex flex-1 mt-1">
				{!Router.asPath.includes('questions') && type != 'edit' && (
					<span className="flex-shrink-0 inline font-[600] mr-[8px]">
						<div id={`quest-num-${data.Id}`} className="ex-quest-tf">
							{indexInExam}
						</div>
						<div className="bg-[#e9e9e9] h-[26px] px-[8px] rounded-full text-[14px] inline-flex items-center justify-center">
							<div>Point: {data?.Point}</div>
						</div>
					</span>
				)}

				{htmlParser(data?.Content)}
			</div>

			{!isResult && (
				<div className="flex items-center mr-[2px] true-false-checkbox">
					<div className="w-[50px] all-center">
						{checkChecked(0) && (
							<>
								{showen && (
									<Checkbox
										disabled={disabledCheckbox}
										id={`check-box-${data?.Id || ''}`}
										defaultChecked={checkChecked(0)}
										onClick={(e: any) => !isResult && e.target?.checked && insertDetails(data.IeltsAnswers[0])}
									/>
								)}
							</>
						)}

						{!checkChecked(0) && (
							<Checkbox
								disabled={disabledCheckbox}
								id={`check-box-${data?.Id || ''}`}
								defaultChecked={checkChecked(0)}
								onClick={(e: any) => !isResult && e.target?.checked && insertDetails(data.IeltsAnswers[0])}
							/>
						)}
					</div>

					<div className="w-[50px] all-center">
						{checkChecked(1) && (
							<>
								{showen && (
									<Checkbox
										disabled={disabledCheckbox}
										id={`check-box-${data?.Id || ''}`}
										defaultChecked={checkChecked(1)}
										onClick={(e: any) => !isResult && e.target?.checked && insertDetails(data.IeltsAnswers[1])}
									/>
								)}
							</>
						)}

						{!checkChecked(1) && (
							<Checkbox
								disabled={disabledCheckbox}
								id={`check-box-${data?.Id || ''}`}
								defaultChecked={checkChecked(1)}
								onClick={(e: any) => !isResult && e.target?.checked && insertDetails(data.IeltsAnswers[1])}
							/>
						)}
					</div>

					<div className="w-[80px] all-center">
						{checkChecked(2) && (
							<>
								{showen && (
									<Checkbox
										disabled={disabledCheckbox}
										id={`check-box-${data?.Id || ''}`}
										defaultChecked={checkChecked(2)}
										onClick={(e: any) => !isResult && e.target?.checked && insertDetails(data.IeltsAnswers[2])}
									/>
								)}
							</>
						)}

						{!checkChecked(2) && (
							<Checkbox
								disabled={disabledCheckbox}
								id={`check-box-${data?.Id || ''}`}
								defaultChecked={checkChecked(2)}
								onClick={(e: any) => !isResult && e.target?.checked && insertDetails(data.IeltsAnswers[2])}
							/>
						)}
					</div>
				</div>
			)}

			{isResult && (
				<div className="flex items-center mr-[2px] true-false-checkbox">
					<div className="w-[50px] all-center">
						<Checkbox
							disabled={disabledCheckbox}
							id={`check-box-${!!data?.IeltsAnswer ? data?.IeltsAnswers[0]?.Id : data?.IeltsAnswerResults[0]?.Id}`}
							defaultChecked={checkChecked(0) || getTrueAns(0)}
							className={`${getClass(0)}`}
							onClick={(e: any) => !isResult && e.target?.checked && insertDetails(data.IeltsAnswers[0])}
						/>
					</div>

					<div className="w-[50px] all-center">
						<Checkbox
							disabled={disabledCheckbox}
							id={`check-box-${!!data?.IeltsAnswer ? data?.IeltsAnswers[0]?.Id : data?.IeltsAnswerResults[0]?.Id}`}
							defaultChecked={checkChecked(1) || getTrueAns(1)}
							className={`${getClass(1)}`}
							onClick={(e: any) => !isResult && e.target?.checked && insertDetails(data.IeltsAnswers[1])}
						/>
					</div>

					<div className="w-[80px] all-center">
						<Checkbox
							disabled={disabledCheckbox}
							id={`check-box-${data?.Id || ''}`}
							defaultChecked={checkChecked(2)}
							onClick={(e: any) => !isResult && e.target?.checked && insertDetails(data.IeltsAnswers[2])}
						/>
					</div>
				</div>
			)}
		</div>
	)
}

export default TrueFalseQuestion
