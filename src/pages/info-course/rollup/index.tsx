import { Button, Card, Input, Space } from 'antd'
import React from 'react'
import { MainLayout } from '~/common'
import PrimaryButton from '~/common/components/Primary/Button'
import { RollUpQRStudentPage } from '~/common/components/RollUpQR/RollUpQRStudentPage'

const RollUp = () => {
	return (
		<>
			<RollUpQRStudentPage />
		</>
	)
}

RollUp.Layout = MainLayout
export default RollUp
