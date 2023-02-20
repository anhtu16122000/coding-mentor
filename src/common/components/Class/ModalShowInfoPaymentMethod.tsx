import { Modal, Tooltip } from 'antd'
import React, { useState } from 'react'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import ReactHtmlParser from 'react-html-parser'
import PrimaryButton from '../Primary/Button'

const ModalShowInfoPaymentMethod = (props) => {
	const { method } = props
	const [isModalOpen, setIsModalOpen] = useState(false)

	return (
		<>
			{!!method && !!method.Description ? (
				<Tooltip placement="top" title={'Xem thông tin thanh toán'}>
					<button type="button" onClick={() => setIsModalOpen(true)}>
						<AiOutlineQuestionCircle size={18} className={`text-tw-primary ${!!method.Description ? 'cursor-pointer' : ''}`} />
					</button>
				</Tooltip>
			) : null}

			<Modal
				title="Thông tin thanh toán"
				open={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				footer={
					<>
						<PrimaryButton background="blue" icon="cancel" type="button" onClick={() => setIsModalOpen(false)}>
							Đóng
						</PrimaryButton>
					</>
				}
			>
				{!!method && !!method.Description ? ReactHtmlParser(method.Description) : null}
			</Modal>
		</>
	)
}

export default ModalShowInfoPaymentMethod
