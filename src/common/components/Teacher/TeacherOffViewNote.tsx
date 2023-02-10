import { Modal } from 'antd'
import React, { useState } from 'react'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'

const TeacherOffViewNote = (props) => {
	const { dataRow } = props
	const [isModalOpen, setIsModalOpen] = useState(false)
	return (
		<>
			<IconButton tooltip="Xem ghi chú" size={20} color="yellow" type="button" icon="eye" onClick={() => setIsModalOpen(true)} />
			<Modal
				title="Ghi chú"
				open={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				footer={
					<PrimaryButton background="blue" type="button" onClick={() => setIsModalOpen(false)}>
						Đóng
					</PrimaryButton>
				}
			>
				{dataRow.Note}
			</Modal>
		</>
	)
}

export default TeacherOffViewNote
