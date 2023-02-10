import { Checkbox, Radio, Space } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import ReactHTMLParser from 'react-html-parser'

const ChoiceForm: FC<{ data: IExercise; type: 'edit' | 'doing' }> = (props) => {
	const { data, type } = props

	const [value, setValue] = useState(null)

	useEffect(() => {
		if (type == 'edit') {
			data.Answers.forEach((element) => {
				if (element?.IsTrue) {
					setValue(!!element.Id ? element.Id : element?.timestamp)
				}
			})
		}
	}, [])

	useEffect(() => {
		if (type == 'edit') {
			data.Answers.forEach((element) => {
				if (element?.IsTrue) setValue(!!element.Id ? element.Id : element?.timestamp)
			})
		}
	}, [data])

	function getType() {
		let flag = 0
		data.Answers.forEach((answer) => {
			if (!!answer.IsTrue) {
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
				temp.push({ value: !!element.Id ? element.Id : element.timestamp, label: element.AnswerContent })
				if (element?.IsTrue == true) {
					checked.push(!!element.Id ? element.Id : element.timestamp)
				}
			}
		})
		return { option: temp, checked: checked }
	}

	return (
		<>
			<div className="w-full">{ReactHTMLParser(data?.Content)}</div>

			{getType() == 'single' && (
				<Radio.Group className="mt-2 mb-4" value={value}>
					<Space direction="vertical">
						{data.Answers.map((answer, index) => {
							return (
								<>
									{answer?.Enable != false && (
										<Radio key={`hhso-${index}`} value={parseInt(!!answer.Id ? answer.Id : answer?.timestamp)}>
											<div>{answer?.AnswerContent || answer?.Content}</div>
										</Radio>
									)}
								</>
							)
						})}
					</Space>
				</Radio.Group>
			)}

			{getType() !== 'single' && (
				<div className="custom-check-group mb-3">
					<Checkbox.Group options={getDataCheckbox(data.Answers).option} value={getDataCheckbox(data.Answers).checked} />
				</div>
			)}
		</>
	)
}

export default ChoiceForm
