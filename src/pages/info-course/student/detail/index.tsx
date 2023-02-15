import React from 'react'
import { MainLayout } from '~/common'
import StudentDetailInfoPage from '~/common/pages/Student/StudentDetailInfoPage'

export interface IStudentDetailInfoProps {}

export default function StudentDetailInfo(props: IStudentDetailInfoProps) {
	return (
		<>
			<StudentDetailInfoPage />
		</>
	)
}
StudentDetailInfo.Layout = MainLayout
