import { Checkbox, Radio, Space } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import ReactHTMLParser from 'react-html-parser'

const TrueFalseQuestion: FC<{ data: any; type: 'edit' | 'doing' }> = (props) => {
	const { data, type } = props

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
		if (data.IeltsAnswers[index].Correct) {
			return true
		}
		return false
	}

	return (
		<div className="flex items-start">
			<div className="flex-1 mt-1">{ReactHTMLParser(data?.Content)}</div>

			<div className="flex items-center mr-[2px] true-false-checkbox">
				<div className="w-[50px] flex items-center justify-center">
					<Checkbox checked={checkChecked(0)} />
				</div>
				<div className="w-[50px] flex items-center justify-center">
					<Checkbox checked={checkChecked(1)} />
				</div>
				{/* <div className="w-[80px] flex items-center justify-center">
					<Checkbox checked={checkChecked(2)} />
				</div> */}
			</div>
		</div>
	)
}

export default TrueFalseQuestion
