import { Modal, Tooltip } from 'antd'
import { useState } from 'react'
import { IoMdTrash } from 'react-icons/io'
import { testAppointmentApi } from '~/api/test-appointment'
import { ShowNoti } from '~/common/utils'
import { CloseOutlined } from '@ant-design/icons'
import IconButton from '../Primary/IconButton'
import PrimaryButton from '../Primary/Button'

const CancelTest = (props) => {
	const { onUpdateData, dataRow } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const showModal = () => {
		setIsModalVisible(true)
	}

	const handleOk = async () => {
		setIsLoading(true)
		try {
			let res = await testAppointmentApi.delete(dataRow.Id)
			if (res.status == 200) {
				ShowNoti('success', 'Hủy lịch hẹn test thành công!')
				setIsModalVisible(false)
				onUpdateData && onUpdateData()
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	const handleCancel = () => {
		setIsModalVisible(false)
	}

	return (
		<>
			{/* <Tooltip title="Hủy lịch hẹn">
				<button className="btn btn-icon delete" onClick={showModal}>
					<CloseOutlined size={20} />
				</button>
			</Tooltip> */}
			<IconButton icon="cancel" tooltip="Hủy lịch hẹn" color="primary" type="button" onClick={showModal} />
			<Modal
				title={
					// <button className="btn btn-icon delete">
					// 	<QuestionCircleOutlined />
					// </button>
					'Hủy lịch test'
				}
				open={isModalVisible}
				// onOk={handleOk}
				onCancel={handleCancel}
				okButtonProps={{ loading: isLoading }}
				footer={
					<>
						<PrimaryButton
							onClick={() => setIsModalVisible(false)}
							type="button"
							background="transparent"
							icon="cancel"
							className="mr-2 btn-outline"
						>
							Hủy
						</PrimaryButton>
						<PrimaryButton icon="remove" onClick={() => handleOk()} type="button" background="red" disable={isLoading} loading={isLoading}>
							Xóa
						</PrimaryButton>
					</>
				}
			>
				<p className="text-base mb-4">Bạn muốn hủy lịch hẹn test của học viên này?</p>
			</Modal>
		</>
	)
}

export default CancelTest
