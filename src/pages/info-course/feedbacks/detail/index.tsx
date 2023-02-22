import React from 'react'
import { MainLayout } from '~/common'
import FeedbackDetailPage from '~/common/pages/Info-Course/feedbacks/FeedbackDetailPage'

export interface IFeedbackDetailProps {}

export default function FeedbackDetail(props: IFeedbackDetailProps) {
	return (
		<>
			<FeedbackDetailPage />
		</>
	)
}
FeedbackDetail.Layout = MainLayout
