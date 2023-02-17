import React from 'react'
import { MainLayout } from '~/common'
import IncomeExpenseManagementPage from '~/common/components/Finance/IncomeExpenseManagement/MainPage'

export interface IIncomeExpenseManagementProps {}

export default function IncomeExpenseManagement(props: IIncomeExpenseManagementProps) {
	return <IncomeExpenseManagementPage />
}
IncomeExpenseManagement.Layout = MainLayout
