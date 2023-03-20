import { Spin, Tooltip } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import React, { useState } from 'react'
import { Trash } from 'react-feather'
import { IoMdTrash } from 'react-icons/io'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'

const DeleteTableRow = (props) => {
	const { handleDelete, text, title, setShowPop } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const checkHandleDelete = () => {
		if (!handleDelete) return
		setIsLoading(true)
		handleDelete()
			.then((res) => {
				if (res?.status == 200) {
					setIsModalVisible(false)
				}
			})
			.finally(() => {
				setIsLoading(false)
			})
	}

	return (
		<>
			<IconButton
				color="primary"
				type="button"
				icon="remove"
				tooltip={title || 'Xóa'}
				onClick={() => {
					setIsModalVisible(true)
					setShowPop && setShowPop('')
				}}
			/>

			<Modal
				title={'Xác nhận xóa'}
				open={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={
					<div className="flex-all-center">
						<PrimaryButton
							type="button"
							icon="cancel"
							background="transparent"
							onClick={() => setIsModalVisible(false)}
							className="mr-2 btn-outline"
						>
							Hủy
						</PrimaryButton>

						<PrimaryButton
							type="button"
							icon="remove"
							background="red"
							onClick={() => checkHandleDelete()}
							disable={isLoading}
							loading={isLoading}
						>
							Xóa
						</PrimaryButton>
					</div>
				}
			>
				<p className="mb-4 text-base">
					Bạn có chắc muốn xóa <span className="text-[#f25767]">{text}</span> ?
				</p>
			</Modal>
		</>
	)
}

export default DeleteTableRow
