import { Modal } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { scheduleApi } from '~/api/learn/schedule'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import PrimaryButton from '../Primary/Button'
import PrimaryTooltip from '../PrimaryTooltip'

const ModalRemoveScheduleTutoringEdit = (props) => {
	const { IdSchedule, startTime, endTime, getListSchedule, refPopover, dataRow } = props
	const paramsSchedule = useSelector((state: RootState) => state.class.paramsSchedule)
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const checkHandleDelete = async () => {
		setIsLoading(true)
		try {
			const res = await scheduleApi.cancelTutoring(IdSchedule)
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

	function onClickRemove() {
		setIsModalVisible(true)
		!!refPopover && refPopover.current.close()
	}

	return (
		<>
			<PrimaryTooltip className="w-full px-[8px] mb-[8px]" place="top" content="Hủy" id={`remove-sc-${dataRow.event.extendedProps?.Id}`}>
				<PrimaryButton
					loading={isLoading}
					disable={isLoading}
					type="button"
					background="red"
					icon="cancel"
					className="w-full"
					onClick={onClickRemove}
				/>
			</PrimaryTooltip>

			<Modal
				title="Xác nhận hủy"
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
							icon="save"
							background="red"
							onClick={() => checkHandleDelete()}
							disable={isLoading}
							loading={isLoading}
						>
							OK
						</PrimaryButton>
					</div>
				}
			>
				<p className="text-base mb-4">
					Bạn có chắc muốn hủy{' '}
					<span className="text-[#f25767]">
						Ca {moment(startTime).format('HH:mm')} - {moment(endTime).format('HH:mm')}
					</span>{' '}
					?
				</p>
			</Modal>
		</>
	)
}

export default ModalRemoveScheduleTutoringEdit
