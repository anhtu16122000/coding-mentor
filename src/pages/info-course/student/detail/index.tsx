import Head from 'next/head'
import React from 'react'
import appConfigs from '~/appConfig'
import { MainLayout } from '~/common/index'
import StudentDetailInfo from '~/common/pages/Student/StudentDetailInfo'

function StudentDetailInfoPage() {
	return (
		<>
			<Head>
				<title>{appConfigs.appName} - Thông tin học viên</title>
			</Head>
			<StudentDetailInfo />
		</>
	)
}

StudentDetailInfoPage.Layout = MainLayout
export default StudentDetailInfoPage
