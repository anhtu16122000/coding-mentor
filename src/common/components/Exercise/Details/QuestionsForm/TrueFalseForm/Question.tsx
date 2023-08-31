import { Checkbox } from 'antd'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { doingTestApi } from '~/api/IeltsExam/doing-test'
import htmlParser from '~/common/components/HtmlParser'

const TrueFalseQuestion = (props) => {
	const { data, isDoing, getDoingQuestionGroup } = props

	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		setLoading(false)
	}, [data])

	function checkChecked(index: number) {
		if (!isDoing && data.IeltsAnswers[index].Correct) {
			return true
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
				getDoingQuestionGroup()
			}
		}
	}

	return (
		<div className="flex items-start">
			<div className="flex-1 mt-1">{htmlParser(data?.Content)}</div>

			<div className="flex items-center mr-[2px] true-false-checkbox">
				<div className="w-[50px] flex items-center justify-center">
					<Checkbox
						disabled={loading || !isDoing}
						id={`check-box-${data.IeltsAnswers[0]?.Id}`}
						defaultChecked={checkChecked(0)}
						onClick={(e: any) => e.target?.checked && insertDetails(data.IeltsAnswers[0])}
					/>
				</div>

				<div className="w-[50px] flex items-center justify-center">
					<Checkbox
						disabled={loading || !isDoing}
						id={`check-box-${data.IeltsAnswers[1]?.Id}`}
						defaultChecked={checkChecked(1)}
						onClick={(e: any) => e.target?.checked && insertDetails(data.IeltsAnswers[1])}
					/>
				</div>
			</div>
		</div>
	)
}

export default TrueFalseQuestion
