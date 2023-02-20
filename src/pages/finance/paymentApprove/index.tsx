import React from 'react'
import { MainLayout } from '~/common'
import PaymentApprovePage from '~/common/pages/options/PaymentApprovePage'

const paymentApprove = () => {
	return <PaymentApprovePage />
}

paymentApprove.Layout = MainLayout
export default paymentApprove
