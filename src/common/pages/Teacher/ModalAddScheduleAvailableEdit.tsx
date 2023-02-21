import { Form, Modal, Select, Tooltip } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { AiOutlineWarning } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { scheduleAvailableApi } from '~/api/schedule-available'
import DatePickerField from '~/common/components/FormControl/DatePickerField'
import TextBoxField from '~/common/components/FormControl/TextBoxField'
import PrimaryButton from '~/common/components/Primary/Button'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import { setRoomEdit, setTeacherEdit } from '~/store/classReducer'

const ModalAddScheduleAvailableEdit = (props) => {
	const { getListSchedule, paramsSchedule } = props
	const [openModalAdd, setOpenModalAdd] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [form] = Form.useForm()
	const user = useSelector((state: RootState) => state.user.information)
	const onSubmit = async (data) => {
		if (moment(data.StartTime).format() < moment(data.EndTime).format()) {
			setIsLoading(true)
			data.TeacherId = Number(user?.UserInformationId)
			try {
				const res = await scheduleAvailableApi.add(data)
				if (res.status === 200) {
					getListSchedule(paramsSchedule)
					setOpenModalAdd(false)
					form.resetFields()
					ShowNoti('success', res.data.message)
				}
			} catch (err) {
				ShowNoti('error', err.message)
			} finally {
				setIsLoading(false)
			}
		} else {
			ShowNoti('error', 'Ngày bắt đầu không được lớn hơn ngày kết thúc')
		}
	}

	return (
		<>
			<PrimaryButton onClick={() => setOpenModalAdd(true)} className="ml-3" background="green" type="button" icon="add">
				Thêm lịch
			</PrimaryButton>
			<Modal
				title="Thêm lịch trống"
				open={openModalAdd}
				onCancel={() => {
					form.resetFields()
					setTeacherEdit([])
					setRoomEdit([])
					setOpenModalAdd(false)
				}}
				footer={
					<>
						<PrimaryButton disable={isLoading} loading={isLoading} background="blue" icon="save" type="button" onClick={form.submit}>
							Lưu
						</PrimaryButton>
					</>
				}
			>
				<Form form={form} layout="vertical" onFinish={onSubmit}>
					<DatePickerField
						mode="single"
						showTime={'HH:mm'}
						picker="showTime"
						format="DD/MM/YYYY HH:mm"
						label="Giờ bắt đầu"
						name="StartTime"
					/>
					<DatePickerField
						mode="single"
						showTime={'HH:mm'}
						picker="showTime"
						format="DD/MM/YYYY HH:mm"
						label="Giờ kết thúc"
						name="EndTime"
					/>

					<TextBoxField name="Note" label="Ghi chú" />
				</Form>
			</Modal>
		</>
	)
}

export default ModalAddScheduleAvailableEdit
