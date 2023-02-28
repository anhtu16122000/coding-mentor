import React from 'react'
import Lottie from 'react-lottie-player'

import loadingJson from '~/common/components/json/96237-success.json'
import PrimaryButton from '../Primary/Button'

const PaymentSucess = ({ onClose }) => {
	return (
		<div className="flex flex-col items-center">
			<div className="w-[300px] h-[300px] flex flex-col items-center justify-center">
				<Lottie loop animationData={loadingJson} play className="inner w-[300px] mx-auto" />
			</div>
			<div className="">Đã gửi yêu cầu thanh toán, vui lòng đợi duyệt!</div>

			<PrimaryButton onClick={onClose} className="mt-[24px]" type="button" background="green" icon="none">
				Xác nhận
			</PrimaryButton>
		</div>
	)
}

export default PaymentSucess
