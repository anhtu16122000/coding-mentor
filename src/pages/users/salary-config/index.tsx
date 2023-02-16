import React from 'react'
import { MainLayout } from '~/common'
import { SalaryConfigPage } from '~/common/pages/UserSalary/SalaryConfigPage'

const SalaryConfig = () => {
	return (
		<div>
			<SalaryConfigPage />
		</div>
	)
}

SalaryConfig.Layout = MainLayout
export default SalaryConfig
