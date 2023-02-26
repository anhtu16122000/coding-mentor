import { Modal } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { scheduleApi } from '~/api/schedule'
import { scheduleAvailableApi } from '~/api/schedule-available'
import PrimaryButton from '~/common/components/Primary/Button'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'

const ModalRemoveScheduleAvailableEdit = (props) => {
	const { IdSchedule, startTime, endTime, getListSchedule, refPopover } = props
	const paramsSchedule = useSelector((state: RootState) => state.class.paramsSchedule)
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const checkHandleDelete = async () => {
		setIsLoading(true)
		try {
			const res = await scheduleAvailableApi.delete(IdSchedule)
			if (res.status === 200) {
				getListSchedule(paramsSchedule)
				setIsModalVisible(false)
				ShowNoti('success', res.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}
	return (
		<>
			<PrimaryButton
				loading={isLoading}
				disable={isLoading}
				type="button"
				background="red"
				icon="remove"
				className="btn-remove"
				onClick={() => {
					setIsModalVisible(true), !!refPopover && refPopover.current.close()
				}}
			>
				Xóa
			</PrimaryButton>

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
							className="btn-outline mr-2"
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
				<p className="text-base mb-4">
					Bạn có chắc muốn xóa{' '}
					<span className="text-[#f25767]">
						Ca {moment(startTime).format('HH:mm')} - {moment(endTime).format('HH:mm')}
					</span>{' '}
					?
				</p>
			</Modal>
		</>
	)
}

export default ModalRemoveScheduleAvailableEdit
