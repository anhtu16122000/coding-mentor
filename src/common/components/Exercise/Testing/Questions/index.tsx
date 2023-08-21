import React from 'react'
import Choice from './Choice'
import { QUESTION_TYPES } from '~/common/libs'
import Write from './Write'
import TrueFalseTesting from './TrueFalse'
import { log } from '~/common/utils'
import TrueFalseQuestion from '../../Details/QuestionsForm/TrueFalseForm/Question'
import SpeakingQuestion from './Speak'

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

	const theQuestions = data?.IeltsQuestions || []

	function isChoice() {
		return data?.Type == QUESTION_TYPES.MultipleChoice
	}

	function isWriting() {
		return data?.Type == QUESTION_TYPES.Write
	}

	function isTrueFalse() {
		return data?.Type == QUESTION_TYPES.TrueOrFalse
	}

	function isSpeaking() {
		return data?.Type == QUESTION_TYPES.Speak
	}

	return (
		<>
			{isChoice() &&
				theQuestions.map((itemQuestion, index) => {
					const thisItem = getQuestIndex(itemQuestion)

					return (
						<Choice
							key={index}
							isFinal={isFinal}
							data={itemQuestion}
							index={index}
							onRefresh={onRefresh}
							dataSource={data}
							indexInExam={thisItem?.Index || ''}
							showEdit={showEdit}
						/>
					)
				})}

			{isWriting() &&
				theQuestions.map((itemQuestion, index) => {
					const thisItem = getQuestIndex(itemQuestion)

					return (
						<Write
							key={index}
							isFinal={isFinal}
							disabled={true}
							data={itemQuestion}
							index={index}
							IndexInExam={thisItem?.Index}
							dataSource={data}
						/>
					)
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

					{theQuestions.map((itemQuestion, index) => (
						<TrueFalseQuestion type="doing" key={index} data={itemQuestion} />
					))}
				</div>
			)}

			{isSpeaking() &&
				theQuestions.map((itemQuestion, index) => {
					const thisItem = getQuestIndex(itemQuestion)

					return (
						<SpeakingQuestion
							key={index}
							disabled={true}
							isFinal={isFinal}
							data={itemQuestion}
							index={index}
							IndexInExam={thisItem?.Index}
							dataSource={data}
						/>
					)
				})}
		</>
	)
}

export default TestingQuestions
