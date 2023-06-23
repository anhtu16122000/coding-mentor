import Modal from 'antd/lib/modal/Modal'
import React, { useState } from 'react'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'

type TProps = {
	handleDelete?: Function
	text?: string
	title?: string
	setShowPop?: any
	disable?: boolean
}

const DeleteTableRow = (props: TProps) => {
	const { handleDelete, text, title, setShowPop, disable } = props
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
			.finally(() => setIsLoading(false))
	}

	function handleClickDelete() {
		setIsModalVisible(true)
		setShowPop && setShowPop('')
	}

	return (
		<>
			<IconButton
				className={`${disable ? 'opacity-30 mt-[-8px]' : ''}`}
				disabled={disable}
				color="primary"
				type="button"
				icon="remove"
				placementTooltip="left"
				tooltip={title || 'Xóa'}
				onClick={handleClickDelete}
			/>

			<Modal
				title="Xác nhận xóa"
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
				<p className="text-base text-center">
					Bạn muốn xóa <span className="text-[#f25767]">{text}</span>?
				</p>
			</Modal>
		</>
	)
}

export default DeleteTableRow
