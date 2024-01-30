import React from 'react'
import { MainLayout } from '~/common/index'
import IncomeExpenseManagementPage from '~/common/components/Finance/IncomeExpenseManagement/MainPage'

export default function IncomeExpenseManagement() {
	return <IncomeExpenseManagementPage />
}

IncomeExpenseManagement.Layout = MainLayout
