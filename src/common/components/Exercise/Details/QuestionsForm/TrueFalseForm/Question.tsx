import { Checkbox } from 'antd'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { doingTestApi } from '~/api/IeltsExam/doing-test'
import htmlParser from '~/common/components/HtmlParser'
import { RootState } from '~/store'

const TrueFalseQuestion = (props) => {
	const { data, isDoing, getDoingQuestionGroup, setCurrentQuestion, onRefreshNav, indexInExam, isResult } = props

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
		if (!isDoing && !isResult && data.IeltsAnswers[index].Correct) {
			return true
		}

		if (!!isResult) {
			return data?.IeltsAnswerResults[index].MyChoice
		}

		if (!!isDoing) {
			return !data?.DoingTestDetails ? null : data?.DoingTestDetails[0]?.IeltsAnswerId == data.IeltsAnswers[index]?.Id ? true : false
		}

		return false
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
				await doingTestApi.insertDetail({
					DoingTestId: parseInt(Router?.query?.exam + ''),
					IeltsQuestionId: data.Id,
					Items: [...items]
				})
			} catch (error) {
			} finally {
				onRefreshNav()
				getDoingQuestionGroup()
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

	return (
		<div
			onClick={() =>
				!Router.asPath.includes('/questions') &&
				setCurrentQuestion({ ...data, IeltsQuestionId: data?.Id, IeltsQuestionGroupId: curGroup?.Id })
			}
			className="flex items-start"
		>
			<div id={`cauhoi-${data.Id}`} className="flex flex-1 mt-1">
				{!Router.asPath.includes('questions') && <span className="flex-shrink-0 inline font-[600] mr-[8px]">Câu {indexInExam}:</span>}
				{htmlParser(data?.Content)}
			</div>

			{!isResult && (
				<div className="flex items-center mr-[2px] true-false-checkbox">
					<div className="w-[50px] all-center">
						<Checkbox
							disabled={disabledCheckbox}
							id={`check-box-${data?.Id || ''}`}
							defaultChecked={checkChecked(0)}
							onClick={(e: any) => !isResult && e.target?.checked && insertDetails(data.IeltsAnswers[0])}
						/>
					</div>

					<div className="w-[50px] all-center">
						<Checkbox
							disabled={disabledCheckbox}
							id={`check-box-${data?.Id || ''}`}
							defaultChecked={checkChecked(1)}
							onClick={(e: any) => !isResult && e.target?.checked && insertDetails(data.IeltsAnswers[1])}
						/>
					</div>
				</div>
			)}

			{!!isResult && (
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
				</div>
			)}
		</div>
	)
}

export default TrueFalseQuestion
