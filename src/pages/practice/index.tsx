import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import appConfigs from '~/appConfig'
import MainLayout from '~/common/components/MainLayout'
import Practice from '~/common/pages/Practice'
import { setGlobalBreadcrumbs } from '~/store/globalState'

const PracticePage = () => {
	const dispatch = useDispatch()
	const router = useRouter()

	useEffect(() => {
		dispatch(setGlobalBreadcrumbs([{ title: 'Luyện tập', link: '/practice' }]))

		const handleRouteChange = async (url) => {
			dispatch(setGlobalBreadcrumbs([]))
		}

		// Đăng ký sự kiện lắng nghe sự thay đổi router
		router.events.on('routeChangeStart', handleRouteChange)

		// Hủy đăng ký sự kiện khi component bị unmount để tránh memory leak
		return () => {
			router.events.off('routeChangeStart', handleRouteChange)
		}
	}, [])

	return (
		<>
			<Head>
				<title>{appConfigs.appName} - Luyện tập</title>
			</Head>
			<Practice />
		</>
	)
}

PracticePage.Layout = MainLayout
export default PracticePage
