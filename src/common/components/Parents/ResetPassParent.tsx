import { Modal, Tooltip } from 'antd'
import React, { useState } from 'react'
import { Repeat } from 'react-feather'
import { MdOutlineSettingsBackupRestore } from 'react-icons/md'
import { parentsApi } from '~/api/parents'
// import { useWrap } from '~/src/context/wrap'
import { ShowNoti } from '~/common/utils'

const ResetPassParent = (props) => {
	const { dataRow } = props
	// const { showNoti } = useWrap()
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [loading, setLoading] = useState(false)

	const showModal = () => {
		setIsModalVisible(true)
	}

	const handleOk = () => {
		resetPassword()
	}

	// -------------- RESET PASSWORD ----------------
	const resetPassword = async () => {
		let dataSubmit = {
			UserInformationID: dataRow.UserInformationID,
			Password: '123456'
		}
		setLoading(true)
		try {
			let res = await parentsApi.update(dataSubmit)
			if (res.status === 200) {
				ShowNoti('success', 'Khôi phục thành công')
				setIsModalVisible(false)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	const handleCancel = () => {
		setIsModalVisible(false)
	}

	return (
		<>
			{/* <Tooltip title="Khôi phục mật khẩu">
				<button className="btn btn-icon" onClick={showModal}>
					<RetweetOutlined />
				</button>
			</Tooltip> */}
			<Tooltip title="Khôi phục mật khẩu">
				<button className="btn btn-icon delete" onClick={showModal}>
					{/* <RetweetOutlined /> */}
					<Repeat />
				</button>
			</Tooltip>

			<Modal
				okButtonProps={{ loading: loading }}
				title="Khôi phục mật khẩu"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={
					<>
						<button onClick={() => setIsModalVisible(false)} className="btn btn-outline mr-2">
							Hủy
						</button>
						<button onClick={() => handleOk()} className="btn btn-danger">
							<MdOutlineSettingsBackupRestore size={18} className="mr-2" />
							Khôi phục
						</button>
					</>
				}
			>
				<p className="text-base mb-4">Khôi phục mật khẩu cho phụ huynh này?</p>
			</Modal>
		</>
	)
}

export default ResetPassParent
