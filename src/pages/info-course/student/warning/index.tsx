import Head from 'next/head'
import React from 'react'
import appConfigs from '~/appConfig'
import MainLayout from '~/common/components/MainLayout'
import { StudentWarningPage } from '~/common/pages/Info-Course/StudentWarningPage'

const StudentWarning = () => {
	return (
		<>
			<Head>
				<title>{appConfigs.appName} | Học viên bị cảnh báo</title>
			</Head>
			<StudentWarningPage />
		</>
	)
}

StudentWarning.Layout = MainLayout
export default StudentWarning
