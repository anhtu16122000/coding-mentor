import React from 'react'
import MainLayout from '~/common/components/MainLayout'
import { StudentWarningPage } from '~/common/pages/Info-Course/StudentWarningPage'

const StudentWarning = () => {
	return (
		<>
			<StudentWarningPage />
		</>
	)
}

StudentWarning.Layout = MainLayout

export default StudentWarning
