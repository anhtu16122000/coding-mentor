import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { registerApi } from '~/api/user/user'
import appConfigs from '~/appConfig'
import MainLayout from '~/common/components/MainLayout'
import Student from '~/common/pages/InfoCourse/Student'
import { ShowNoti } from '~/common/utils'

const PersonnelPage = () => {
	const [allowed, setAllow] = useState<any>()

	useEffect(() => {
		getAllow()
	}, [])

	const getAllow = async () => {
		try {
			const response = await registerApi.getAllowRegister()
			if (response.status == 200) {
				setAllow(response.data.data == 'Allow' ? true : false)
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
	}

	return (
		<>
			<Head>
				<title>{appConfigs.appName} - Danh sách học viên</title>
			</Head>
			<Student role={3} allowRegister={allowed} reFresh={getAllow} />
		</>
	)
}

PersonnelPage.Layout = MainLayout
export default PersonnelPage
