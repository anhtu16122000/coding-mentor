import React from 'react'
import MainLayout from '~/common/components/MainLayout'
import DetailClassPage from '~/common/pages/Class/DetailClass'

const DetailClass = () => {
	return (
		<div className="wrapper-class-detail">
			<DetailClassPage />
		</div>
	)
}

DetailClass.Layout = MainLayout
export default DetailClass
