import React from 'react'
import { MainLayout } from '~/common/index'
import QuestionsBank from '~/common/components/Exercise/QuestionsBank'
import Head from 'next/head'
import appConfigs from '~/appConfig'
import ExamProvider from '~/common/providers/Exam'

const QuestionsBankPage = () => {
	return (
		<>
			<Head>
				<title>{appConfigs.appName} - Ngân hàng câu hỏi</title>
			</Head>
			<ExamProvider>
				<QuestionsBank />
			</ExamProvider>
		</>
	)
}

QuestionsBankPage.Layout = MainLayout
export default QuestionsBankPage
