import React from 'react'
import { MainLayout } from '~/common'
import { SalaryPage } from '~/common/pages/UserSalary/SalaryPage'

const Salary = () => {
	return (
		<>
			<SalaryPage />
		</>
	)
}
Salary.Layout = MainLayout
export default Salary
