import Head from 'next/head'
import React from 'react'
import appConfigs from '~/appConfig'
import ExamProvider from '~/common/providers/Exam'
import ResultDetail from '~/common/components/Exercise/Details/ResultDetail'

const ExamResultPage = () => {
	return (
		<>
			<Head>
				<title>{appConfigs.appName} - Chi tiết kết quả làm bài</title>
			</Head>
			<ExamProvider>
				<ResultDetail />
			</ExamProvider>
		</>
	)
}

export default ExamResultPage
