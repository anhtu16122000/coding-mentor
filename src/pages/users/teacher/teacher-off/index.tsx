import Head from 'next/head'
import React from 'react'
import appConfigs from '~/appConfig'
import MainLayout from '~/common/components/MainLayout'
import TeacherOffPage from '~/common/pages/Teacher/TeacherOff'

const TeacherOff = () => {
	return (
		<>
			<Head>
				<title>{appConfigs.appName} | Lịch nghỉ</title>
			</Head>
			<TeacherOffPage />
		</>
	)
}

TeacherOff.Layout = MainLayout
export default TeacherOff
