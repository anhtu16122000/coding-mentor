import React from 'react'
import { MainLayout } from '~/common'
import { SalaryTutoringConfigPage } from '~/common/pages/UserSalary/SalaryTutoringConfigPage'

const SalaryTutoringConfig = () => {
	return (
		<>
			<SalaryTutoringConfigPage />
		</>
	)
}

SalaryTutoringConfig.Layout = MainLayout

export default SalaryTutoringConfig
