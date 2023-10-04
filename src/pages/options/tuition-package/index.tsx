import Head from 'next/head'
import React from 'react'
import appConfigs from '~/appConfig'
import { MainLayout } from '~/common/index'
import TuitionPackage from '~/common/pages/TuitionPackage'

function TuitionPackagePage() {
	return (
		<>
			<Head>
				<title>{appConfigs.appName + ' -  Gói học phí'}</title>
			</Head>
			<TuitionPackage />
		</>
	)
}

TuitionPackagePage.Layout = MainLayout
export default TuitionPackagePage
