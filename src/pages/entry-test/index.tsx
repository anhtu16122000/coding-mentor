import Head from 'next/head'
import React from 'react'
import appConfigs from '~/appConfig'
import MainLayout from '~/common/components/MainLayout'
import ServiceAppointmentTestPage from '~/common/pages/InfoCourse/ServiceAppointmentTest'

const ServiceAppointmentTest = () => {
	return (
		<>
			<Head>
				<title>{appConfigs.appName} - Hẹn test</title>
			</Head>
			<ServiceAppointmentTestPage />
		</>
	)
}

ServiceAppointmentTest.Layout = MainLayout
export default ServiceAppointmentTest
