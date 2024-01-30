import React from 'react'
import { MainLayout } from '~/common/index'
import PrintCashFlowPage from '~/common/pages/Finance/CashFlow/Print'
import Head from 'next/head'
import appConfigs from '~/appConfig'

function PrintCashFlow() {
	return (
		<>
			<Head>
				<title>{appConfigs.appName} - In phiếu</title>
			</Head>
			<PrintCashFlowPage />
		</>
	)
}

PrintCashFlow.Layout = MainLayout
export default PrintCashFlow
