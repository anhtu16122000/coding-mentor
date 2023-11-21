import { Checkbox, Radio, Space } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import ReactHTMLParser from 'react-html-parser'

const SortAnswer: FC<{ data: any; type: 'edit' | 'doing' }> = (props) => {
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
		data.IeltsAnswers.forEach((answer) => {
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
				if (element?.Correct == true) {
					checked.push(!!element.Id ? element.Id : element.timestamp)
				}
			}
		})
		return { option: temp, checked: checked }
	}

	return (
		<>
			<div className="w-full mt-1">{ReactHTMLParser(data?.Content)}</div>

			{getType() == 'single' && (
				<Radio.Group className="mt-2" value={value}>
					<Space direction="vertical">
						{data.IeltsAnswers.map((answer, index) => {
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
				<div className="custom-check-group">
					<Checkbox.Group options={getDataCheckbox(data.IeltsAnswers).option} value={getDataCheckbox(data.IeltsAnswers).checked} />
				</div>
			)}
		</>
	)
}

export default SortAnswer
