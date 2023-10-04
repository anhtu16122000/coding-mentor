import Head from 'next/head'
import React from 'react'
import appConfigs from '~/appConfig'
import ExamResult from '~/common/pages/ExamResult'

const ExamResultPage = () => {
	return (
		<>
			<Head>
				<title>{appConfigs.appName} - Kết quả làm bài</title>
			</Head>

			<ExamResult />
		</>
	)
}

export default ExamResultPage
