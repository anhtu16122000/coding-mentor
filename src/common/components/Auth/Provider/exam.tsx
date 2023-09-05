import { useRouter } from 'next/router'
import React, { useContext, useEffect, createContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'

type TExamProvider = {
	questionWithAnswers: any
	setQuestionWithAnswers?: Function
}

export const ExamContext = createContext<TExamProvider>(null)

function ExamProvider(props) {
	const router = useRouter()

	const [questionWithAnswers, setQuestionWithAnswers] = useState([])

	const contextValue = {
		questionWithAnswers: questionWithAnswers,
		setQuestionWithAnswers: setQuestionWithAnswers
	}

	return <ExamContext.Provider value={contextValue}>{props.children}</ExamContext.Provider>
}

export const useExamContext = () => useContext(ExamContext)
export default ExamProvider
