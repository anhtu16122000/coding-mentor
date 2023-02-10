import { Modal, Tooltip } from 'antd'
import React, { useState } from 'react'
import { Trash } from 'react-feather'

const ModalDeleteKeywordSearch = (props) => {
	const { dataRow, onDelete } = props
	const [isModalOpen, setIsModalOpen] = useState(false)

	const showModal = () => {
		setIsModalOpen(true)
	}

	const handleOk = () => {
		setIsModalOpen(false)
	}

	const handleCancel = () => {
		setIsModalOpen(false)
	}

	return (
		<>
			<button className="btn btn-icon delete" onClick={showModal}>
				<Tooltip title="Xóa">
					<Trash size={18} />
				</Tooltip>
			</button>
			<Modal
				title="Xóa từ khóa"
				visible={isModalOpen}
				onCancel={handleCancel}
				footer={
					<>
						<button onClick={handleCancel} className="btn btn-outline mr-2">
							Hủy
						</button>
						<button onClick={() => onDelete(dataRow)} className="btn btn-danger">
							Xóa
						</button>
					</>
				}
			>
				<div>
					<span className="text-base mb-4">Bạn muốn xóa từ khóa: </span>
					<span className="text-base mb-4" style={{ color: '#f25767' }}>
						{dataRow.Keyword}
					</span>
				</div>
			</Modal>
		</>
	)
}

export default ModalDeleteKeywordSearch
