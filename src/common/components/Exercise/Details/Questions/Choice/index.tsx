import { Checkbox, Radio, Space } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import ReactHTMLParser from 'react-html-parser'
import type { RadioChangeEvent } from 'antd'
import { IoIosArrowUp } from 'react-icons/io'
import { TbFileCertificate } from 'react-icons/tb'

const Choice: FC<{ data: IExercise; type: 'edit' | 'doing' }> = (props) => {
	const { data, type } = props

	const [value, setValue] = useState(null)

	useEffect(() => {
		if (type == 'edit') {
			data.Answers.forEach((element) => {
				if (element?.IsTrue) {
					setValue(element.Id)
				}
			})
		}
	}, [])

	useEffect(() => {
		if (type == 'edit') {
			data.Answers.forEach((element) => {
				if (element?.IsTrue) {
					setValue(element.Id)
				}
			})
		}
	}, [data])

	const onChange = (e: RadioChangeEvent) => {}

	function isDisabled() {
		if (type == 'edit') {
			return true
		} else {
			return false
		}
	}

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
				temp.push({ value: !!element.Id ? element.Id : element.ficaID, label: element.AnswerContent })
				if (element?.IsTrue == true) {
					checked.push(!!element.Id ? element.Id : element.ficaID)
				}
			}
		})

		return { option: temp, checked: checked }
	}

	const [showDesc, setShowDesc] = useState(false)

	return (
		<div className="ml-[30px]">
			<div className="w-full">
				<div className="flex items-center">
					<div className="text-[#0074e4] font-[600]">Câu {data?.IndexInExam}</div>

					{!!data?.Point && data?.Answers.length > 0 && (
						<div className="cc-choice-orange ml-[8px]">
							<TbFileCertificate size={12} className="mr-1" />
							<span className="mt-[1px]">{data?.Point} điểm</span>
						</div>
					)}
				</div>
				{ReactHTMLParser(data?.Content)}
			</div>

			{getType() == 'single' && (
				<Radio.Group disabled={isDisabled()} className="mt-2 mb-4" onChange={onChange} value={value}>
					<Space direction="vertical">
						{data.Answers.map((answer) => (
							<Radio value={parseInt(answer.Id + '')}>{answer.AnswerContent}</Radio>
						))}
					</Space>
				</Radio.Group>
			)}

			{getType() !== 'single' && (
				<div className="custom-check-group mb-3">
					<Checkbox.Group
						disabled
						options={getDataCheckbox(data.Answers).option}
						value={getDataCheckbox(data.Answers).checked}
						onChange={() => {}}
					/>
				</div>
			)}

			{!!data?.DescribeAnswer && (
				<div className="inline-flex flex-col pb-3 mt-[-16px]">
					<div className="w-fit flex flex-row items-center none-selection cursor-pointer text-[#10a708]">
						<div className="pr-2" onClick={() => setShowDesc(!showDesc)}>
							{showDesc ? 'Ẩn đáp án mẫu' : 'Xem đáp án mẫu'}
						</div>
						<IoIosArrowUp className={showDesc ? 'rotate-0 duration-300' : 'rotate-180 duration-300'} size={16} />
					</div>

					{showDesc && <div className="slide-down-text">{ReactHTMLParser(data?.DescribeAnswer)}</div>}
				</div>
			)}
		</div>
	)
}

export default Choice
