import { Modal } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import { setListCalendar } from '~/store/classReducer'
import PrimaryButton from '../Primary/Button'

const ModalRemoveSchedule = (props) => {
	const { dataRow } = props
	const listCalendar = useSelector((state: RootState) => state.class.listCalendar)
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const dispatch = useDispatch()
	const checkHandleDelete = async () => {
		setIsLoading(true)
		const newListCalendar = listCalendar.filter((item) => item.Id !== dataRow.event.extendedProps.Id)
		dispatch(setListCalendar(newListCalendar))
		ShowNoti('success', 'Xóa thành công')
		setIsLoading(false)
	}
	return (
		<>
			<PrimaryButton
				loading={isLoading}
				disable={isLoading}
				type="button"
				background="red"
				icon="remove"
				className="w-full"
				onClick={() => setIsModalVisible(true)}
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
						Ca {moment(dataRow.event.start).format('HH:mm')} - {moment(dataRow.event.end).format('HH:mm')}
					</span>{' '}
					?
				</p>
			</Modal>
		</>
	)
}

export default ModalRemoveSchedule
