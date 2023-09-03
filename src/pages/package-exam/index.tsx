import Head from 'next/head'
import React from 'react'
import appConfigs from '~/appConfig'
import MainLayout from '~/common/components/MainLayout'
import PackageExam from '~/common/pages/PackagedExam'

function PackageExamPage() {
	return (
		<>
			<Head>
				<title>{appConfigs.appName} - Quản lý bộ đề</title>
			</Head>

			<PackageExam />
		</>
	)
}

PackageExamPage.Layout = MainLayout
export default PackageExamPage
