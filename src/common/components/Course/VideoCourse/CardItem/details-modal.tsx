import { Modal } from 'antd'
import React, { useState } from 'react'
import PrimaryButton from '~/common/components/Primary/Button'

const DetailsModal = ({ data }) => {
	const [visible, setVisible] = useState<boolean>(false)

	function toggle() {
		setVisible(!visible)
	}

	return (
		<>
			<PrimaryButton onClick={toggle} className="mt-[8px]" background="green" type="button" icon="none">
				Xem thông tin
			</PrimaryButton>

			<Modal title="Thông tin khoá học" open={visible} onCancel={toggle} footer={null}>
				<div className="text-[16px]">{data?.Description}</div>
			</Modal>
		</>
	)
}

export default DetailsModal
