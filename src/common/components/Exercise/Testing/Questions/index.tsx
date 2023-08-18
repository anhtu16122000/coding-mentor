import React from 'react'
import Choice from './Choice'
import { QUESTION_TYPES } from '~/common/libs'
import Write from './Write'
import TrueFalseTesting from './TrueFalse'
import { log } from '~/common/utils'
import TrueFalseQuestion from '../../Details/QuestionsForm/TrueFalseForm/Question'

const TestingQuestions = (props) => {
	const { data, isFinal, questions, onRefresh, showEdit } = props

	// log.Blue('TestingQuestions', data)

	// log.Red('questions', questions)

	function getQuestIndex(curQuest) {
		const theIndex = questions.findIndex((question) => question?.IeltsQuestionId == curQuest?.Id)

		if (theIndex !== -1) {
			return questions[theIndex]
		}

		return ''
	}

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
				data?.IeltsQuestions.map((itemQestion, index) => {
					const thisItem = getQuestIndex(itemQestion)

					return (
						<Choice
							key={index}
							isFinal={isFinal}
							data={itemQestion}
							index={index}
							onRefresh={onRefresh}
							dataSource={data}
							indexInExam={thisItem?.Index || ''}
							showEdit={showEdit}
						/>
					)
				})}

			{isWriting() &&
				data?.IeltsQuestions.map((itemQestion, index) => {
					const thisItem = getQuestIndex(itemQestion)

					return <Write key={index} isFinal={isFinal} data={itemQestion} index={index} IndexInExam={thisItem?.Index} dataSource={data} />
				})}

			{isTrueFalse() && (
				<div className="mb-[16px] bg-[#ffffff] p-[8px] !rounded-[6px]">
					<div className="w-full mb-[8px] hidden w500:flex">
						<div className="flex-1"></div>
						<div className="h-[30px] flex items-center">
							<div className="w-[50px]">True</div>
							<div className="w-[50px]">False</div>
							{/* <div className="w-[74px]">Not given</div> */}
						</div>
					</div>

					{data?.IeltsQuestions.map((itemQestion, index) => (
						<TrueFalseQuestion type="doing" key={index} data={itemQestion} />
					))}
				</div>
			)}
		</>
	)
}

export default TestingQuestions
