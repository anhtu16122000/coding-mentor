import React from 'react'
import MainLayout from '~/common/components/MainLayout'
import Student from '~/common/pages/InfoCourse/Student'

const PersonnelPage = () => <Student role="1,2,4,5,6,7" isStaff={true} />

PersonnelPage.Layout = MainLayout
export default PersonnelPage
