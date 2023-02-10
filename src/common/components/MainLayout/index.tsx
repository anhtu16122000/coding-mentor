import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { logOut } from '~/common/utils/common'
import { RootState } from '~/store'
import Layout from './layout'
import LoadingLayout from './LoadingLayout'

const MainLayout = ({ children }) => {
	const { loading, data } = useSelector((state: RootState) => state.auth)

	const router = useRouter()

	useEffect(() => {
		if (loading || !data) return

		let checkNewUser = localStorage.getItem('isNewUser')

		if (checkNewUser == 'true') {
			router.push('/change-password')
		}
	}, [loading])

	if (loading) {
		return <LoadingLayout />
	}

	if (!data) {
		logOut()
		return <LoadingLayout />
	}

	return <Layout>{children}</Layout>
}

export default MainLayout
