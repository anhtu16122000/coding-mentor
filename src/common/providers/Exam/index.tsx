import { useRouter } from 'next/router'
import React, { useContext, useEffect, createContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ieltsExamApi } from '~/api/IeltsExam'
import { ShowNostis, log } from '~/common/utils'
import { RootState } from '~/store'

type TExamProvider = {
	questionWithAnswers: any
	setQuestionWithAnswers?: Function
	curAudio?: any
	setCurAudio?: Function
	loading?: boolean
	setLoading?: Function
	questionsInSection?: any[]
	setQuestionsInSection?: Function
	getAllQuestions?: Function

	notSetCurrentQuest?: boolean
	setNotSetCurrentQuest?: Function

	currentQuestion?: any
	setCurrentQuestion?: Function
}

export const ExamContext = createContext<TExamProvider>(null)

function ExamProvider(props) {
	const router = useRouter()

	const [loading, setLoading] = useState(true)
	const [curAudio, setCurAudio] = useState(null)
	const [questionWithAnswers, setQuestionWithAnswers] = useState([])

	const [questionsInSection, setQuestionsInSection] = useState([])
	const [notSetCurrentQuest, setNotSetCurrentQuest] = useState<boolean>(false)

	const [currentQuestion, setCurrentQuestion] = useState(null)

	async function getAllQuestions(currentSection, callBack?: Function) {
		// GET questions in navigation
		if (currentSection?.Id) {
			try {
				const res = await ieltsExamApi.getQuestions({
					ieltsSectionId: currentSection?.Id,
					doingTestId: parseInt(router?.query?.exam + '')
				})
				if (res.status == 200) {
					setQuestionsInSection(res.data.data)
				} else {
					setQuestionsInSection([])
					callBack([])
				}
			} catch (error) {
				ShowNostis.error(error?.message)
				setQuestionsInSection([])
				callBack([])
			} finally {
				setLoading(false)
			}
		}
	}

	// useEffect(() => {
	// 	log.Yellow('questionsInSection', questionsInSection)
	// }, [questionsInSection])

	const contextValue = {
		questionWithAnswers: questionWithAnswers,
		setQuestionWithAnswers: setQuestionWithAnswers,
		curAudio: curAudio,
		setCurAudio: setCurAudio,
		loading: loading,
		setLoading: setLoading,
		questionsInSection: questionsInSection,
		setQuestionsInSection: setQuestionsInSection,
		getAllQuestions: getAllQuestions,
		notSetCurrentQuest: notSetCurrentQuest,
		setNotSetCurrentQuest: setNotSetCurrentQuest,
		currentQuestion: currentQuestion,
		setCurrentQuestion: setCurrentQuestion
	}

	return <ExamContext.Provider value={contextValue}>{props.children}</ExamContext.Provider>
}

export const useExamContext = () => useContext(ExamContext)
export default ExamProvider
