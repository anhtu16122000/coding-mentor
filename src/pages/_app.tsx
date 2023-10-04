import React, { useEffect } from 'react'

import type { AppProps } from 'next/app'
import AuthProvider from '~/common/components/Auth/Provider'

// ant
import { ConfigProvider } from 'antd'
import locale from 'antd/lib/locale/vi_VN'

// redux
import { Provider as StoreProvider } from 'react-redux'
import { store } from '~/store'
import Script from 'next/script'

// css
import 'antd/dist/antd.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-toastify/dist/ReactToastify.css'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import '../styles/global.scss'
import 'w3-css/w3.css'
import 'react-vertical-timeline-component/style.min.css'
import 'react-h5-audio-player/lib/styles.css'
import 'react-image-crop/src/ReactCrop.scss'

import 'react-tooltip/dist/react-tooltip.css'

import ToastifyContainer from '~/common/providers/Toastify'
import { checkInternet } from '~/common/utils/main-function'
import MainHeader from '~/common/libs/SEO/main-header'

import { GoogleAnalytics } from 'nextjs-google-analytics'
import { removeProductionLog } from '~/common/utils/super-functions'

const gaMeasurementId = 'G-HLZL768WH8' // G-KXHWW4100Q

function App({ Component, pageProps }: AppProps & IViewProps) {
	const Layout = Component.Layout || ((props) => <>{props.children}</>)
	const breadcrumb = Component.breadcrumb || ''

	useEffect(() => {
		checkInternet()
	}, [])

	removeProductionLog()

	return (
		<>
			<Script src="https://cdn.tiny.cloud/1/lmr9ug3bh4iwjsrap9hgwgxqcngllssiraqluwto4slerrwg/tinymce/6/tinymce.min.js" />

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
