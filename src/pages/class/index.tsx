import { GetStaticPaths } from 'next'
import Head from 'next/head'
import React from 'react'
import appConfigs from '~/appConfig'
import MainLayout from '~/common/components/MainLayout'
import ListClassPro from '~/common/pages/Class/Pro/ListClassPro'

// export async function generateStaticParams() {
// 	return {
// 		slug: 1
// 	}
// }

// export const getStaticPaths: GetStaticPaths = async () => {
// 	return {
// 		paths: [
// 			{
// 				params: {
// 					name: 'next.js'
// 				}
// 			} // See the "paths" section below
// 		],
// 		fallback: true // false or "blocking"
// 	}
// }

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
