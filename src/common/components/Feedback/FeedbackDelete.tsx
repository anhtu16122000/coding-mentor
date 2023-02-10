import { Tooltip } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import React, { useState } from 'react'
import { AlertTriangle, Trash, X } from 'react-feather'
import { feedbackApi } from '~/api/feedback'
// import { useWrap } from '~/src/context/wrap'
import { ShowNoti } from '~/common/utils'

const FeedbackDelete = React.memo((props: any) => {
	const [isModalVisible, setIsModalVisible] = useState(false)
	const { feedbackId, reloadData } = props
	// const { showNoti } = useWrap()

	const onHandleDelete = async () => {
		try {
			setIsModalVisible(false)
			// @ts-ignore
			let res = await feedbackApi.update({ ID: feedbackId, Enable: false })
			ShowNoti('success', res.data?.message)
			reloadData()
		} catch (error) {
			setIsModalVisible(false)
			ShowNoti('error', error.message)
		}
	}

	return (
		<>
			<Tooltip title="Xóa">
				<button
					className="btn btn-icon delete"
					onClick={() => {
						setIsModalVisible(true)
					}}
				>
					{/* <X /> */}
					<Trash />
				</button>
			</Tooltip>
			<Modal
				title={'Xóa phản hồi'}
				visible={isModalVisible}
				// onOk={onHandleDelete}
				onCancel={() => setIsModalVisible(false)}
				footer={
					<>
						<button onClick={() => setIsModalVisible(false)} className="btn btn-outline mr-2">
							Hủy
						</button>
						<button onClick={() => onHandleDelete()} className="btn btn-danger">
							Xóa
						</button>
					</>
				}
			>
				<p className="text-base mb-4">Bạn có muốn xóa phản hồi này?</p>
			</Modal>
		</>
	)
})

export default FeedbackDelete
