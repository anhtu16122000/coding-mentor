import Head from 'next/head'
import React from 'react'
import appConfigs from '~/appConfig'
import MainLayout from '~/common/components/MainLayout'
import DayOffPage from '~/common/pages/options/DayOff'

const DayOff = () => {
	return (
		<>
			<Head>
				<title>{appConfigs.appName} | Lịch nghỉ</title>
			</Head>
			<DayOffPage />
		</>
	)
}

DayOff.Layout = MainLayout
export default DayOff
