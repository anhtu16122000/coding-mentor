import Head from 'next/head'
import React from 'react'
import appConfigs from '~/appConfig'
import ExamDetail from '~/common/components/Exercise/Details'

const ExamDetailPage = () => {
	return (
		<>
			<Head>
				<title>{appConfigs.appName} - Quản lý đề</title>
			</Head>
			<ExamDetail />
		</>
	)
}

export default ExamDetailPage
