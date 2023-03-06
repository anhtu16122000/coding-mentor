import React from 'react'
import { useSelector } from 'react-redux'
import MainLayout from '~/common/components/MainLayout'
import Report from '~/common/components/Report'
import { RootState } from '~/store'

const ReportPage = () => {
	const user = useSelector((state: RootState) => state.user.information)

	return <>{user?.RoleId == 1 && <Report />}</>
}

ReportPage.Layout = MainLayout

export default ReportPage
