import React from 'react'
import Choice from './Choice'
import { QUESTION_TYPES } from '~/common/libs'
import Write from './Write'
import TrueFalseTesting from './TrueFalse'

const TestingQuestions = (props) => {
	const { data, isFinal } = props

	function isChoice() {
		return data?.Type == QUESTION_TYPES.MultipleChoice
	}

	function isWriting() {
		return data?.Type == QUESTION_TYPES.Write
	}

	function isTrueFalse() {
		return data?.Type == QUESTION_TYPES.TrueOrFalse
	}

	return (
		<>
			{isChoice() &&
				data?.Exercises.map((itemQestion, index) => (
					<Choice key={index} isFinal={isFinal} data={itemQestion} index={index} dataSource={data} />
				))}

			{isWriting() &&
				data?.Exercises.map((itemQestion, index) => (
					<Write key={index} isFinal={isFinal} data={itemQestion} index={index} dataSource={data} />
				))}

			{isTrueFalse() && (
				<div className="mb-[16px]">
					<div className="w-full mb-[8px] hidden w500:flex">
						<div className="flex-1"></div>
						<div className="h-[30px] flex items-center">
							<div className="w-[50px]">True</div>
							<div className="w-[50px]">False</div>
							<div className="w-[74px]">Not given</div>
						</div>
					</div>

					{data?.Exercises.map((itemQestion, index) => (
						<TrueFalseTesting key={index} data={itemQestion} />
					))}
				</div>
			)}
		</>
	)
}

export default TestingQuestions
