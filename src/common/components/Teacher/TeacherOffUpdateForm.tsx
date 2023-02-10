import { Form, Modal, Spin, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { Edit } from 'react-feather'
import { teacherOffApi } from '~/api/teacher-off'
import { ShowNoti } from '~/common/utils'
import SelectField from '../FormControl/SelectField'
import TextBoxField from '../FormControl/TextBoxField'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'

const TeacherOffUpdateForm = (props) => {
	const { dataRow, setTodoApi, listTodoApi } = props
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [form] = Form.useForm()
	const onSubmit = async (data) => {
		setIsLoading(true)
		try {
			let DATA_SUBMIT = {
				Id: dataRow?.Id,
				...data
			}
			const res = await teacherOffApi.update(DATA_SUBMIT)
			if (res.status === 200) {
				setIsModalOpen(false)
				form.resetFields()
				setTodoApi(listTodoApi)
				ShowNoti('success', res.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}
	useEffect(() => {
		if (dataRow) {
			form.setFieldsValue(dataRow)
		}
	}, [isModalOpen])
	return (
		<>
			<IconButton type="button" color="yellow" icon="edit" tooltip="Duyệt ngày nghỉ" onClick={() => setIsModalOpen(true)} />
			<Modal
				title="Duyệt ngày nghỉ"
				open={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				footer={
					<PrimaryButton background="blue" icon="save" type="button" onClick={form.submit} loading={isLoading} disable={isLoading}>
						Lưu
					</PrimaryButton>
				}
			>
				<Form form={form} layout="vertical" onFinish={onSubmit}>
					<SelectField
						name="Status"
						label="Trạng thái"
						optionList={[
							{ value: 1, title: 'Chờ duyệt' },
							{ value: 2, title: 'Duyệt' },
							{ value: 3, title: 'Không duyệt' }
						]}
					/>
					<TextBoxField name="Note" label="Ghi chú" />
				</Form>
			</Modal>
		</>
	)
}

export default TeacherOffUpdateForm
