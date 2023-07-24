import { Modal } from 'antd'
import { useState } from 'react'
import { testAppointmentApi } from '~/api/learn/test-appointment'
import { ShowNoti } from '~/common/utils'
import IconButton from '../Primary/IconButton'
import PrimaryButton from '../Primary/Button'

import Lottie from 'react-lottie-player'

import deleteJson from '~/common/components/json/15120-delete.json'

const CancelTest = (props) => {
	const { onUpdateData, dataRow } = props

	const [visible, setVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const showModal = () => {
		setVisible(true)
	}

	const handleOk = async () => {
		setIsLoading(true)
		try {
			let res = await testAppointmentApi.delete(dataRow.Id)
			if (res.status == 200) {
				ShowNoti('success', 'Hủy lịch hẹn test thành công!')
				setVisible(false)
				onUpdateData && onUpdateData()
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	const handleCancel = () => {
		setVisible(false)
	}

	return (
		<>
			<IconButton icon="cancel" tooltip="Hủy lịch hẹn" color="primary" type="button" onClick={showModal} />
			<Modal
				title="Hủy lịch test"
				open={visible}
				width={500}
				onCancel={handleCancel}
				okButtonProps={{ loading: isLoading }}
				footer={
					<PrimaryButton icon="remove" onClick={() => handleOk()} type="button" background="red" disable={isLoading} loading={isLoading}>
						Xác nhận huỷ
					</PrimaryButton>
				}
			>
				<div className="w-full h-[260px] mt-[-30px] flex flex-col items-center justify-center">
					<Lottie loop animationData={deleteJson} play className="inner w-[200px] mx-auto" />
				</div>

				<p className="text-center text-[16px]">
					Hủy lịch hẹn của <div className="inline-block font-[600] text-primary">{dataRow?.FullName}?</div>
				</p>
			</Modal>
		</>
	)
}

export default CancelTest
