import React, { FC } from 'react'
import Choice from './Choice'
import { QUESTION_TYPES } from '~/common/libs'
import TrueFalse from './TrueFalse'

const Questions: FC<IQuestions> = (props) => {
	const { data } = props

	console.log('-- Questions data: ', data)

	function isChoice() {
		return data?.Type == QUESTION_TYPES.MultipleChoice
	}

	function isWrite() {
		return data?.Type == QUESTION_TYPES.Write
	}

	function isTrueFalse() {
		return data?.Type == QUESTION_TYPES.TrueOrFalse
	}

	return (
		<>
			{(isChoice() || isWrite()) && data?.Exercises.map((itemQestion, index) => <Choice data={itemQestion} type="edit" />)}

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
						<TrueFalse data={itemQestion} />
					))}
				</div>
			)}
		</>
	)
}

export default Questions
