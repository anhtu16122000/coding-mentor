import { Modal } from 'antd'
import Router from 'next/router'
import React from 'react'
import PrimaryButton from '~/common/components/Primary/Button'

import Lottie from 'react-lottie-player'
import successAni from '~/common/components/json/134369-sucess.json'
import { RootState } from '~/store'
import { useSelector } from 'react-redux'

const ModalTimeOut = (props) => {
	const { visible, submitedData } = props

	const globalState = useSelector((state: RootState) => state.takeAnExam)

	return (
		<>
			<Modal
				width={500}
				closable={false}
				open={visible}
				footer={
					<div className="tae-submit-footer">
						<PrimaryButton onClick={() => window.close()} background="red" icon="cancel" type="button">
							Thoát ngay
						</PrimaryButton>

						<PrimaryButton
							className="ml-[8px]"
							onClick={() => Router.replace(`/exam-result/?test=${submitedData?.Id}`)}
							background="blue"
							icon="eye"
							type="button"
						>
							Xem kết quả
						</PrimaryButton>
					</div>
				}
			>
				<div className="tae-submit-modal">
					<Lottie loop animationData={successAni} play style={{ width: 300, height: 300, marginTop: 0 }} />
					{!!globalState.timeout && <div style={{ marginTop: 0 }}>Đã hết giờ, hệ thống đã tự nộp bài</div>}
					{!globalState.timeout && <div style={{ marginTop: 0 }}>Nộp bài thành công</div>}
				</div>
			</Modal>
		</>
	)
}

export default ModalTimeOut
