import React from 'react'
import { MainLayout } from '~/common'
import RefundPage from '~/common/pages/Finance/Refund/RefundPage'

export interface IFinanceRefundProps {}

export default function FinanceRefund(props: IFinanceRefundProps) {
	return <RefundPage />
}
FinanceRefund.Layout = MainLayout
