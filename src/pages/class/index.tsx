import Head from 'next/head'
import React from 'react'
import appConfigs from '~/appConfig'
import MainLayout from '~/common/components/MainLayout'
import ListClassPro from '~/common/pages/Class/Pro/ListClassPro'

const ListClass = () => {
	return (
		<>
			<Head>
				<title>{appConfigs.appName} - Danh sách lớp</title>
			</Head>
			<ListClassPro />
		</>
	)
}

ListClass.Layout = MainLayout
export default ListClass
