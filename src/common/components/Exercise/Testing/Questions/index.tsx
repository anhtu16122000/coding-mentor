import React from 'react'
import Choice from './Choice'
import { QUESTION_TYPES } from '~/common/libs'
import Write from './Write'
import TrueFalseQuestion from '../../Details/QuestionsForm/TrueFalseForm/Question'
import SpeakingQuestion from './Speak'
import Router from 'next/router'
import MindMap from './MindMap'

function getQuestIndex(questions, curQuest) {
	if (Router.asPath.includes('questions')) {
		return null
	}

	const theIndex = questions.findIndex((question) => question?.IeltsQuestionId == curQuest?.Id)
	if (theIndex !== -1) {
		return questions[theIndex]
	}
	return ''
}

const TestingQuestions = (props) => {
	const { data, isFinal, questions, onRefresh, showEdit, getDoingQuestionGroup, setCurrentQuestion, onRefreshNav } = props

	const theQuestions = data?.IeltsQuestions || []

	const is = {
		choice: data?.Type == QUESTION_TYPES.MultipleChoice,
		writing: data?.Type == QUESTION_TYPES.Write,
		trueOrFalse: data?.Type == QUESTION_TYPES.TrueOrFalse,
		speak: data?.Type == QUESTION_TYPES.Speak,
		mind: data?.Type == QUESTION_TYPES.Mindmap
	}

	return (
		<>
			{is.choice &&
				theQuestions.map((quest, index) => {
					const thisItem = getQuestIndex(questions, quest)

					return (
						<Choice
							key={index}
							data={quest}
							index={index}
							onRefresh={onRefresh}
							indexInExam={thisItem?.Index || ''}
							showEdit={showEdit}
							isDoing={Router.asPath.includes('take-an-exam')}
							setCurrentQuestion={setCurrentQuestion}
							onRefreshNav={onRefreshNav}
						/>
					)
				})}

			{is.writing &&
				theQuestions.map((quest, index) => {
					const thisItem = getQuestIndex(questions, quest)

					return (
						<Write
							key={index}
							data={quest}
							IndexInExam={thisItem?.Index}
							isDoing={Router.asPath.includes('take-an-exam')}
							setCurrentQuestion={setCurrentQuestion}
							onRefreshNav={onRefreshNav}
						/>
					)
				})}

			{is.trueOrFalse && (
				<div className="mb-[16px] bg-[#ffffff] p-[8px] !rounded-[6px]">
					<div className="w-full mb-[8px] hidden w500:flex">
						<div className="flex-1"></div>
						<div className="h-[30px] flex items-center">
							<div className="w-[50px]">True</div>
							<div className="w-[50px]">False</div>
						</div>
					</div>

					{theQuestions.map((quest, index) => {
						const thisItem = getQuestIndex(questions, quest)

						return (
							<TrueFalseQuestion
								type="doing"
								key={index}
								data={quest}
								indexInExam={thisItem?.Index || ''}
								isDoing={Router.asPath.includes('take-an-exam')}
								getDoingQuestionGroup={getDoingQuestionGroup}
								setCurrentQuestion={setCurrentQuestion}
								onRefreshNav={onRefreshNav}
							/>
						)
					})}
				</div>
			)}

			{is.speak &&
				theQuestions.map((quest, index) => {
					const thisItem = getQuestIndex(questions, quest)

					return (
						<SpeakingQuestion
							key={index}
							disabled={true}
							isFinal={isFinal}
							data={quest}
							index={index}
							IndexInExam={thisItem?.Index}
							dataSource={data}
							setCurrentQuestion={setCurrentQuestion}
							onRefreshNav={onRefreshNav}
						/>
					)
				})}

			{is.mind && (
				<MindMap
					disabled={true}
					isFinal={isFinal}
					dataSource={data}
					getDoingQuestionGroup={getDoingQuestionGroup}
					setCurrentQuestion={setCurrentQuestion}
					onRefreshNav={onRefreshNav}
				/>
			)}
		</>
	)
}

export default TestingQuestions
