import React from 'react'
import MainLayout from '~/common/components/MainLayout'
import PaymentMethodPage from '~/common/pages/options/PaymentMethod'

const PaymentMethod = () => {
	return (
		<div className="wrapper-payment-method-page">
			<PaymentMethodPage />
		</div>
	)
}

PaymentMethod.Layout = MainLayout
export default PaymentMethod
