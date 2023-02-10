import { Checkbox, Radio, Space } from 'antd'
import React from 'react'
import ReactHTMLParser from 'react-html-parser'
import { AiOutlineFileDone } from 'react-icons/ai'
import { BsCheck } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { RiErrorWarningLine } from 'react-icons/ri'
import { TbFileCertificate } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import { setActivating } from '~/store/testingState'

const ResultChoice = (props) => {
	const { data } = props

	const dispatch = useDispatch()

	function getType() {
		let count = 0
		data?.AnswerResults.forEach((element) => {
			if (element?.IsTrue) {
				count++
			}
		})
		if (count > 1) {
			return 'multiple'
		}
		return 'single'
	}

	function getDataCheckbox(params) {
		let temp = []
		let checked = []

		params.forEach((element) => {
			if (element?.Enable !== false) {
				temp.push({ value: !!element.Id ? element.Id : element.ficaID, label: element.AnswerContent })
				if (element?.MyResult == true) {
					checked.push(!!element.Id ? element.Id : element.ficaID)
				}
			}
		})

		return { option: temp, checked: checked }
	}

	const activating = useSelector((state: RootState) => state.testingState.activating)

	function getAnswered() {
		let temp = ''
		data?.AnswerResults.forEach((element, answerIndex) => {
			if (element?.MyResult) {
				temp = !temp ? temp + getAlphaBet(answerIndex) : temp + ' - ' + getAlphaBet(answerIndex)
			}
		})
		return temp
	}

	function getTrueAnswer() {
		let temp = ''
		data?.AnswerResults.forEach((element, answerIndex) => {
			if (element?.IsTrue) {
				temp = !temp ? temp + getAlphaBet(answerIndex) : temp + ' - ' + getAlphaBet(answerIndex)
			}
		})
		return temp
	}

	function getAlphaBet(param) {
		let temp = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
		return temp[param]
	}

	const activatedClass = activating == data.Id ? 'quest-activated' : ''
	const trueClass = getAnswered() == getTrueAnswer() ? '!bg-[#4ad54e1f]' : ''
	const falseClass = getAnswered() !== getTrueAnswer() ? 'false-quest' : ''

	return (
		<div
			onClick={() => dispatch(setActivating(data.Id))}
			key={'question-' + data.Id}
			id={'question-' + data.Id}
			className={`ex-res-section ${activatedClass} ${falseClass} ${trueClass}`}
		>
			<div className="exam-quest-wrapper none-selection pr-[16px]">
				<header className="cc-choice-number w-full flex flex-col !items-start">
					<span>Câu {data?.IndexInExam}</span>

					<div className="w-full flex mt-[4px]">
						<div className="cc-choice-orange">
							<TbFileCertificate size={12} className="mr-1" />
							<span className="mt-[1px]">{data?.Point} điểm</span>
						</div>
						{!!getAnswered() && (
							<div className="cc-choice-point">
								<TbFileCertificate size={12} className="mr-1" />
								<span className="mt-[1px]">Đã chọn {getAnswered()}</span>
							</div>
						)}
						<div className="cc-choice-correct-number">
							<AiOutlineFileDone size={12} className="mr-1" />
							<span className="mt-[1px]">Đúng: {getTrueAnswer()}</span>
						</div>
					</div>
				</header>
				{ReactHTMLParser(data?.Content)}
			</div>

			{getType() == 'single' && (
				<Radio.Group disabled={true} className="mt-2 none-selection" value={getDataCheckbox(data.AnswerResults).checked[0]}>
					<Space direction="vertical">
						{data.AnswerResults.map((answer, answerIndex) => {
							const isTrue = answer?.IsTrue && answer?.MyResult

							return (
								<Radio key={'choice-' + data?.Id + '-' + answer.Id} className="none-selection" value={parseInt(answer.Id + '')}>
									<div className={`inline-flex items-center ${isTrue ? 'true-answer' : answer?.MyResult ? 'false-answer' : ''}`}>
										{getAlphaBet(answerIndex)} - {answer.AnswerContent}
										{isTrue && <BsCheck className="ml-1" size={24} />}
										{!isTrue && answer?.MyResult && <IoMdClose className="ml-1 mb-[-2px]" size={20} />}
									</div>
								</Radio>
							)
						})}
					</Space>
				</Radio.Group>
			)}

			{getType() !== 'single' && (
				<div className="custom-check-group none-selection">
					{data.AnswerResults.map((answer, answerIndex) => {
						const isTrue = answer?.IsTrue && answer?.MyResult

						return (
							<div className="custom-check-group">
								<Checkbox className="custom-check-group" checked={answer?.MyResult} disabled={true}>
									<div className={`inline-flex items-center ${isTrue ? 'true-answer' : answer?.MyResult ? 'false-answer' : ''}`}>
										{getAlphaBet(answerIndex)} - {answer.AnswerContent}
										{isTrue && <BsCheck className="ml-1" size={24} />}
										{!isTrue && answer?.MyResult && <IoMdClose className="ml-1 mb-[-2px]" size={20} />}
									</div>
								</Checkbox>
							</div>
						)
					})}
				</div>
			)}

			{!getAnswered() && (
				<div className="none-answer">
					<RiErrorWarningLine size={20} className="mr-2" /> Không chọn đáp án
				</div>
			)}

			{getType() !== 'single' && getAnswered().length !== getTrueAnswer().length && (
				<div className="none-answer">
					<RiErrorWarningLine size={20} className="mr-2" /> Số câu bạn chọn không đúng với số câu đúng
				</div>
			)}
		</div>
	)
}

export default ResultChoice
