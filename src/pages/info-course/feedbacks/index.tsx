import React from 'react'
import { MainLayout } from '~/common'
import FeedbacksStudentPage from '~/common/pages/Info-Course/feedbacks/FeedbacksPage'

export interface IFeedbacksStudentProps {}

export default function FeedbacksStudent(props: IFeedbacksStudentProps) {
	return (
		<>
			<FeedbacksStudentPage />
		</>
	)
}
FeedbacksStudent.Layout = MainLayout
