import Head from 'next/head'
import React from 'react'
import appConfigs from '~/appConfig'
import { MainLayout } from '~/common'
import StudentDetailInfoPage from '~/common/pages/Student/StudentDetailInfoPage'

export interface IStudentDetailInfoProps {}

export default function StudentDetailInfo(props: IStudentDetailInfoProps) {
	return (
		<>
			<Head>
				<title>{appConfigs.appName} - Thông tin học viên</title>
			</Head>
			<StudentDetailInfoPage />
		</>
	)
}
StudentDetailInfo.Layout = MainLayout
