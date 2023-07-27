import Head from 'next/head'
import React from 'react'
import appConfigs from '~/appConfig'
import ExamList from '~/common/components/Exercise'
import MainLayout from '~/common/components/MainLayout'

function ExamListPage() {
	return (
		<>
			<Head>
				<title>{appConfigs.appName} - Quản lý đề</title>
			</Head>
			<ExamList />
		</>
	)
}

ExamListPage.Layout = MainLayout
export default ExamListPage
