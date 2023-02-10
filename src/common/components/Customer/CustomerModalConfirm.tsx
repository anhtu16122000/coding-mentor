import { Modal, Spin } from 'antd'
import React from 'react'
import { FiSave } from 'react-icons/fi'
import Lottie from 'react-lottie-player'

import warningIcon from '~/common/components/json/100468-warning.json'
import PrimaryButton from '../Primary/Button'

const CustomerModalConfirm = (props) => {
	const { confirmExistCustomer, setConfirmExistCustomer, onSubmit, dataSubmit } = props
	return (
		<Modal
			title="Xác nhận thông tin"
			open={confirmExistCustomer}
			footer={
				<>
					<PrimaryButton
						type="button"
						onClick={() => setConfirmExistCustomer(false)}
						background="transparent"
						className="btn-outline mr-2"
						icon="cancel"
					>
						Hủy
					</PrimaryButton>
					<PrimaryButton type="button" onClick={() => (onSubmit(dataSubmit), setConfirmExistCustomer(false))} background="blue" icon="save">
						Tạo
					</PrimaryButton>
				</>
			}
		>
			<>
				<Lottie className="mx-auto" loop animationData={warningIcon} play style={{ width: '120px', marginTop: '-20px' }} />
				<p className="text-base text-center mt-2">Thông tin khách hàng đã tồn tại, bạn có muốn tạo thêm?</p>
			</>
		</Modal>
	)
}

export default CustomerModalConfirm
