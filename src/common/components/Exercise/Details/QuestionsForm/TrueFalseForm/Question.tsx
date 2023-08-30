import { Checkbox, Radio, Space } from 'antd'
import Router from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import ReactHTMLParser from 'react-html-parser'
import { doingTestApi } from '~/api/IeltsExam/doing-test'

const TrueFalseQuestion = (props) => {
	const { data, type, isDoing, getDoingQuestionGroup } = props

	const [value, setValue] = useState(null)

	useEffect(() => {
		if (type == 'edit') {
			data.IeltsAnswers.forEach((element) => {
				if (element?.Correct) {
					setValue(!!element.Id ? element.Id : element?.timestamp)
				}
			})
		}
	}, [])

	useEffect(() => {
		if (type == 'edit') {
			data.IeltsAnswers.forEach((element) => {
				if (element?.Correct) setValue(!!element.Id ? element.Id : element?.timestamp)
			})
		}
	}, [data])

	function getType() {
		let flag = 0
		data.Answers.forEach((answer) => {
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

	function getDataCheckbox(params) {
		let temp = []
		let checked = []
		params.forEach((element) => {
			if (element?.Enable !== false) {
				temp.push({ value: !!element.Id ? element.Id : element.timestamp, label: element.Content })
				if (element?.IsTrue == true) {
					checked.push(!!element.Id ? element.Id : element.timestamp)
				}
			}
		})
		return { option: temp, checked: checked }
	}

	function checkChecked(index: number) {
		// console.log('----- data.IeltsAnswers: ', data.IeltsAnswers)

		if (!isDoing && data.IeltsAnswers[index].Correct) {
			return true
		}

		if (!!isDoing) {
			console.log('------- data?.DoingTestDetails: ', data?.DoingTestDetails)

			return !data?.DoingTestDetails ? null : data?.DoingTestDetails[0]?.IeltsAnswerId == data.IeltsAnswers[index]?.Id ? true : false
		}

		return false
	}

	async function insertDetails(answer) {
		let items = []

		if (!!data?.DoingTestDetails) {
			const checkedBox = document.getElementById(`check-box-${data.DoingTestDetails[0]?.IeltsAnswerId}`)
			console.log('---- checkedBox: ', checkedBox.parentNode)

			// ant-checkbox ant-checkbox-checked

			if (!!checkedBox) {
				// @ts-ignore
				checkedBox.parentNode.setAttribute('class', 'ant-checkbox')
			}

			items.push({ ...data?.DoingTestDetails[0], Enable: false })
		}

		// const checkedBox = document.getElementById(`check-box-${data.IeltsAnswers[1]?.Id}`)
		items.push({ Id: 0, IeltsAnswerId: answer?.Id, IeltsAnswerContent: '', Type: 0, Index: 0, Enable: true })

		if (!!Router?.query?.exam) {
			console.log('-------- PUT items: ', items)

			try {
				const res = await doingTestApi.insertDetail({
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
			<div className="flex-1 mt-1">{ReactHTMLParser(data?.Content)}</div>

			<div className="flex items-center mr-[2px] true-false-checkbox">
				<div className="w-[50px] flex items-center justify-center">
					<Checkbox
						id={`check-box-${data.IeltsAnswers[0]?.Id}`}
						defaultChecked={checkChecked(0)}
						onClick={() => insertDetails(data.IeltsAnswers[0])}
					/>
				</div>

				<div className="w-[50px] flex items-center justify-center">
					<Checkbox
						id={`check-box-${data.IeltsAnswers[1]?.Id}`}
						defaultChecked={checkChecked(1)}
						onClick={() => insertDetails(data.IeltsAnswers[1])}
					/>
				</div>

				{/* <div className="w-[80px] flex items-center justify-center">
					<Checkbox checked={checkChecked(2)} />
				</div> */}
			</div>
		</div>
	)
}

export default TrueFalseQuestion
