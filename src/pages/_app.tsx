import React, { useEffect } from 'react'

import type { AppProps } from 'next/app'
import Head from 'next/head'
import AuthProvider from '~/common/components/Auth/Provider'

// ant
import { ConfigProvider } from 'antd'
import locale from 'antd/lib/locale/vi_VN'

// redux
import { Provider as StoreProvider } from 'react-redux'
import { store } from '~/store'

// css
import 'bootstrap/dist/css/bootstrap.min.css'
import 'antd/dist/antd.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/global.scss'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'react-tooltip/dist/react-tooltip.css'

import ToastifyContainer from '~/common/providers/Toastify'
import { checkInternet } from '~/common/utils/main-function'
import MainHeader from '~/common/libs/SEO/main-header'

import { GoogleAnalytics } from 'nextjs-google-analytics'

const gaMeasurementId = 'G-KXHWW4100Q'

function App({ Component, pageProps }: AppProps & IViewProps) {
	const Layout = Component.Layout || ((props) => <>{props.children}</>)
	const breadcrumb = Component.breadcrumb || ''

	useEffect(() => {
		checkInternet()
	}, [])

	return (
		<>
			<GoogleAnalytics trackPageViews gaMeasurementId={gaMeasurementId} />

			<MainHeader />

			<StoreProvider store={store}>
				<AuthProvider>
					<ConfigProvider locale={locale}>
						<ToastifyContainer />
						<Layout breadcrumb={breadcrumb}>
							<Component {...pageProps} />
						</Layout>
					</ConfigProvider>
				</AuthProvider>
			</StoreProvider>
		</>
	)
}

export default App
