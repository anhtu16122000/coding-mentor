import Head from 'next/head'
import React from 'react'
import appConfigs from '~/appConfig'
import ExamProvider from '~/common/providers/Exam'
import TakeAnExamDetail from '~/common/components/Exercise/Details/TakeAnExam/take-an-exam'

const ExamDetailPage = () => {
	return (
		<>
			<Head>
				<title>{appConfigs.appName} - Làm bài</title>
			</Head>
			<ExamProvider>
				<TakeAnExamDetail />
			</ExamProvider>
		</>
	)
}

export default ExamDetailPage
