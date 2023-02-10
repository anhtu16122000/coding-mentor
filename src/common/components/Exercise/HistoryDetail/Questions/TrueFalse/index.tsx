import React, { FC } from 'react'
import HeaderTrueFalse from '../../../Question/TrueFalse/Header'
import CheckBox from '../../../Question/TrueFalse/CheckBox'
import { RiErrorWarningLine } from 'react-icons/ri'

const SHOW_DETAIL = false

const ResultTrueFalse: FC<any> = (props) => {
	const { data } = props

	function isMyAnswer(index: number) {
		let flag = false
		data.AnswerResults.forEach((element) => {
			if (data.Answers[index]?.Id == element?.MyAnswerId) {
				flag = true
			}
		})
		return flag
	}

	function isTrueAnswer(index: number) {
		if (data.Answers[index].IsTrue) {
			return true
		}
		return false
	}

	function getTrue() {
		let flag = null
		data.Answers.forEach((element, index) => {
			if (element.IsTrue) {
				flag = index
			}
		})

		if (flag == 0) {
			flag = 'True'
		}

		if (flag == 1) {
			flag = 'False'
		}

		if (flag == 2) {
			flag = 'Not given'
		}

		return flag
	}

	function getAnswer() {
		let flag = null

		data.Answers.forEach((element, index) => {
			if (element?.Id == data?.AnswerResults[0]?.MyAnswerId) {
				flag = index
			}
		})

		if (flag == 0) {
			return 'True'
		}

		if (flag == 1) {
			return 'False'
		}

		if (flag == 2) {
			return 'Not given'
		}

		return flag
	}

	function isTrue() {
		let flag = false
		data.Answers.forEach((element) => {
			if (element?.Id == data?.AnswerResults[0]?.MyAnswerId && element?.IsTrue) {
				flag = true
			}
		})
		return flag
	}

	function noneSelect() {
		return !isTrue() && !isMyAnswer(0) && !isMyAnswer(1) && !isMyAnswer(2)
	}

	return (
		<div
			key={'question-' + data.Id}
			id={'question-' + data.Id}
			className={`cc-tf-question py-[8px] !pl-[16px] rounded-[6px] ${isTrue() ? 'cc-tf-qu-true' : 'cc-tf-qu-false'}`}
		>
			<HeaderTrueFalse data={data} isNoneSelect={noneSelect()}>
				{SHOW_DETAIL && (
					<>
						<div className="cc-qh-tf-point !text-[#179325]">
							<div>Đúng: {getTrue()}</div>
						</div>
						<div className="cc-qh-tf-point !text-[#781793]">
							<div>Chọn: {getAnswer()}</div>
						</div>
					</>
				)}
			</HeaderTrueFalse>

			<div className="true-false-container">
				<CheckBox content="True" data={data} isTrue={isTrueAnswer(0)} checked={isMyAnswer(0) || isTrueAnswer(0)} />
				<CheckBox content="False" data={data} isTrue={isTrueAnswer(1)} checked={isMyAnswer(1) || isTrueAnswer(1)} />
				<CheckBox content="Not given" data={data} isTrue={isTrueAnswer(2)} checked={isMyAnswer(2) || isTrueAnswer(2)} />
			</div>
		</div>
	)
}

export default ResultTrueFalse
