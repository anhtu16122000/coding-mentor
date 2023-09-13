import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import appConfigs from '~/appConfig'
import MainLayout from '~/common/components/MainLayout'
import TrainingRouteForm from '~/common/pages/Practice/Detail'
import TrainingStudent from '~/common/pages/TrainingStudent'
import { setGlobalBreadcrumbs } from '~/store/globalState'

const TrainingStudentPage = () => {
	const dispatch = useDispatch()
	const router = useRouter()

	useEffect(() => {
		dispatch(
			setGlobalBreadcrumbs([
				{ title: 'Luyện tập', link: '/practice' },
				{ title: 'Chi tiết', link: '' }
			])
		)

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
			<TrainingStudent />
		</>
	)
}

TrainingStudentPage.Layout = MainLayout
export default TrainingStudentPage
