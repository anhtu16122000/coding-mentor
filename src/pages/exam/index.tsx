import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import appConfigs from '~/appConfig'
import ExamList from '~/common/components/Exercise'
import MainLayout from '~/common/components/MainLayout'
import { wait } from '~/common/utils'
import { setGlobalBreadcrumbs } from '~/store/globalState'

function ExamListPage() {
	const dispatch = useDispatch()
	const router = useRouter()

	useEffect(() => {
		dispatch(setGlobalBreadcrumbs([{ title: 'Quản lý đề', link: '/exam' }]))

		const handleRouteChange = async (url) => {
			// await wait(300)
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
				<title>{appConfigs.appName} - Quản lý đề</title>
			</Head>
			<ExamList />
		</>
	)
}

ExamListPage.Layout = MainLayout
export default ExamListPage
