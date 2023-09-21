import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import CreateMindmap from './Create'
import HTMLParser from 'react-html-parser'
import { Checkbox } from 'antd'

const MindMapForm = () => {
	const exercises = useSelector((state: RootState) => state.globalState.currentExerciseForm)

	function formatData(param) {
		let temp = []
		let count = 1 // Renew Index
		param.forEach((item) => {
			if (item.Enable !== false) {
				temp.push({ ...item, Index: count })
			}
			count++
		})
		return temp
	}

	const [answerFormated, setAnswerFormated] = useState([])

	useEffect(() => {
		getALLAnswer()
	}, [exercises])

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[array[i], array[j]] = [array[j], array[i]]
		}
		return array
	}

	function getALLAnswer() {
		let temp = []
		for (let i = 0; i < exercises.length; i++) {
			const question = exercises[i]
			for (let j = 0; j < question?.IeltsAnswers.length; j++) {
				const answer = question?.IeltsAnswers[j]
				temp.push({ ...answer, question: question })
			}
		}
		setAnswerFormated(shuffleArray(temp))
	}

	return (
		<div className="flex flex-col ">
			<div className="flex flex-row">
				<div className="flex flex-col flex-shrink-0 border-r-[1px] border-[#ffffff]">
					<div className="h-[46px]" />
					{formatData(exercises).map((exercise, exIndex) => {
						return (
							<div className={`border-t-[1px] px-[8px] border-[#ffffff] h-[46px] flex all-center bg-[#f2f2f2] min-w-[110px]`}>
								<div>{HTMLParser(exercise?.Content)}</div>
							</div>
						)
					})}
				</div>

				<div className="mb-[32px] mindmap-scroll w-[calc(100vw/2-64px)] max-w-[calc(600px-64px)]">
					<div className="flex items-center min-h-[46px]">
						{answerFormated.map((answer, ansIndex) => {
							return (
								<div
									className={`min-h-[46px] w-[110px] bg-[#86ce86] all-center flex-shrink-0 ${
										ansIndex !== 0 ? 'border-l-[1px] border-[#ffffff]' : ''
									}`}
								>
									<div className="text-[16px] text-[#fff]">{HTMLParser(answer?.Content)}</div>
								</div>
							)
						})}
					</div>

					{formatData(exercises).map((exercise) => {
						return (
							<div className="flex items-center mt-[0.5px]">
								<div className="inline-flex">
									{answerFormated.map((answer, ansIndex) => {
										return (
											<div
												className={`${
													ansIndex !== 0 ? 'border-l-[1px] border-[#ffffff]' : ''
												} h-[46px] bg-[#f2f2f2] flex all-center flex-shrink-0 w-[110px]`}
											>
												<Checkbox id={`mind-${exercise?.Id}-${answer?.Id}`} />
											</div>
										)
									})}
								</div>
							</div>
						)
					})}
				</div>
			</div>

			<CreateMindmap />
		</div>
	)
}

export default MindMapForm
