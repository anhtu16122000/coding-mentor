import Head from 'next/head'
import React from 'react'
import appConfigs from '~/appConfig'
import ExamDetail from '~/common/components/Exercise/Details'
import MainLayout from '~/common/components/MainLayout'

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

ExamDetailPage.Layout = MainLayout
export default ExamDetailPage
