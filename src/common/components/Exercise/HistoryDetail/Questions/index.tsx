import React from 'react'
import ResultChoice from './Choice'
import { QUESTION_TYPES } from '~/common/libs'
import ResultTrueFalse from './TrueFalse'
import ResultWrite from './Write'

const ResultQuestion = (props) => {
	const { data } = props

	function isWriting() {
		return data?.Type == QUESTION_TYPES.Write
	}

	function isChoice() {
		return data?.Type == QUESTION_TYPES.MultipleChoice
	}

	function isTrueFalse() {
		return data?.Type == QUESTION_TYPES.TrueOrFalse
	}

	return (
		<>
			{isChoice() && data?.ExerciseResults.map((item, index) => <ResultChoice key={index} data={item} />)}

			{isWriting() && data?.ExerciseResults.map((item, index) => <ResultWrite key={index} data={item} />)}

			{isTrueFalse() && (
				<div className="mb-[16px]">
					<div className="w-full mb-[8px] hidden w500:flex">
						<div className="flex-1" />
						<div className="h-[30px] flex items-center">
							<div className="w-[50px]">True</div>
							<div className="w-[50px]">False</div>
							<div className="w-[74px]">Not given</div>
						</div>
					</div>

					{data?.ExerciseResults.map((item, index) => (
						<ResultTrueFalse key={index} data={item} />
					))}
				</div>
			)}
		</>
	)
}

export default ResultQuestion
