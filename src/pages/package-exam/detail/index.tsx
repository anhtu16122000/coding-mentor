import Head from 'next/head'
import React from 'react'
import appConfigs from '~/appConfig'
import MainLayout from '~/common/components/MainLayout'
import PackageExamDetail from '~/common/pages/PackagedExam/Detail'

function PackageDetailPage() {
	return (
		<>
			<Head>
				<title>{appConfigs.appName} - Chi tiết bộ đề</title>
			</Head>

			<PackageExamDetail />
		</>
	)
}

PackageDetailPage.Layout = MainLayout
export default PackageDetailPage
