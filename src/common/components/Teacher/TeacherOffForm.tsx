import { Form, Modal, Spin } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import { MdAddCircleOutline } from 'react-icons/md'
import { teacherOffApi } from '~/api/teacher-off'
import { ShowNoti } from '~/common/utils'
import DatePickerField from '../FormControl/DatePickerField'
import TextBoxField from '../FormControl/TextBoxField'
import PrimaryButton from '../Primary/Button'

const TeacherOffForm = (props) => {
	const { setTodoApi, listTodoApi } = props
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [form] = Form.useForm()

	const onSubmit = async (data) => {
		console.time('Call Api teacherOffApi: ')
		setIsLoading(true)
		try {
			let DATA_SUBMIT = {
				...data,
				StartTime: moment(data.StartTime),
				EndTime: moment(data.EndTime)
			}
			const res = await teacherOffApi.add(DATA_SUBMIT)
			if (res.status === 200) {
				setTodoApi(listTodoApi)
				setIsModalOpen(false)
				ShowNoti('success', res.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
			console.timeEnd('Call Api teacherOffApi: ')
		}
	}

	return (
		<div>
			<button className="btn btn-warning add-new" onClick={() => setIsModalOpen(true)}>
				<MdAddCircleOutline size={18} className="mr-2" />
				Thêm mới
			</button>

			<Modal
				title="Đăng ký lịch nghỉ"
				open={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				footer={
					<PrimaryButton background="blue" type="button" icon="save" onClick={form.submit}>
						Lưu {isLoading && <Spin className="loading-base" />}
					</PrimaryButton>
				}
			>
				<Form form={form} layout="vertical" onFinish={onSubmit}>
					<DatePickerField mode="single" name="StartTime" label="Nghỉ (từ ngày)" />
					<DatePickerField mode="single" name="EndTime" label="Nghỉ (đến ngày)" />
					<TextBoxField name="Reason" label="Lý do" />
				</Form>
			</Modal>
		</div>
	)
}

export default TeacherOffForm
