import React from 'react'
import MainLayout from '~/common/components/MainLayout'
import ClassGanttChart from '~/common/pages/Class/ClassGanttChart'
import ListClassPage from '~/common/pages/Class/ListClass'

const ListClass = () => {
	return <ClassGanttChart />
}

ListClass.Layout = MainLayout
export default ListClass
