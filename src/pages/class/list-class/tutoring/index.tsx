import React from 'react'
import MainLayout from '~/common/components/MainLayout'
import DetailClassTutoring from '~/common/pages/Class/DetailClassTutoring'

const TutoringPage = () => {
	return (
		<div className="wrapper-detail-class">
			<DetailClassTutoring />
		</div>
	)
}

TutoringPage.Layout = MainLayout

export default TutoringPage
