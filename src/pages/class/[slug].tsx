import moment from 'moment'
import { GetStaticPaths } from 'next'
import React from 'react'
import MainLayout from '~/common/components/MainLayout'
import DetailClassPage from '~/common/pages/Class/DetailClass'
import { log } from '~/common/utils'

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [
			{
				params: {
					slug: '1'
				}
			} // See the "paths" section below
		],
		fallback: true // false or "blocking"
	}
}

// Hàm getStaticProps để tạo dữ liệu tĩnh cho mỗi trang
export async function getStaticProps({ params }) {
	// Xác định dữ liệu tĩnh tương ứng với params.slug ở đây
	const classData = {
		// Dữ liệu của trang
		id: 'nasbdnab ass',
		name: 'Nguyễn Chaos',
		time: moment(new Date()).format('HH:mm:ss DD/MM/YYYY')
	}

	// Trả về dữ liệu tĩnh
	return {
		props: {
			...classData,
			staticPaths: {
				...params
			}
		}
	}
}

const DetailClass = (props) => {
	log.Yellow('staticProps', props)

	return (
		<div className="wrapper-class-detail">
			<DetailClassPage />
		</div>
	)
}

DetailClass.Layout = MainLayout
export default DetailClass
