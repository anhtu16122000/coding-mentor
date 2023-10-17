import { Modal } from 'antd'
import React from 'react'
import PrimaryButton from '~/common/components/Primary/Button'

import Lottie from 'react-lottie-player'
import submitAni from '~/common/components/json/110944-plane.json'

import { RootState, closeSubmitModal } from '~/store'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { FaTelegramPlane } from 'react-icons/fa'

const ModalConfirmSubmit = (props) => {
	const { submiting, onSubmit } = props

	const dispatch = useDispatch()
	const globalState = useSelector((state: RootState) => state.takeAnExam)

	return (
		<>
			<Modal
				width={500}
				closable={false}
				open={globalState.submitVisible}
				footer={
					<div className="tae-submit-footer">
						<PrimaryButton onClick={() => !submiting && dispatch(closeSubmitModal())} background="red" icon="cancel" type="button">
							Huỷ
						</PrimaryButton>

						<PrimaryButton className="ml-[8px]" onClick={onSubmit} background="blue" icon="none" type="button">
							<FaTelegramPlane size={20} />
							<div className="tae-submit-title">{submiting ? 'Đang nộp bài..' : 'Nộp ngay'}</div>
						</PrimaryButton>
					</div>
				}
			>
				<div className="tae-submit-modal">
					<Lottie loop animationData={submitAni} play className="animation-submit" />
					<div>Bạn muốn nộp bài ngay?</div>
				</div>
			</Modal>
		</>
	)
}

export default ModalConfirmSubmit
