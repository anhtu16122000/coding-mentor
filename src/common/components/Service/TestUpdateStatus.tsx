import { Tooltip, Modal, Form } from 'antd'
import React, { useEffect, useState } from 'react'
import SelectField from '~/common/components/FormControl/SelectField'
import { testAppointmentApi } from '~/api/test-appointment'
import { FileMinus } from 'react-feather'
import { MdSave } from 'react-icons/md'
import { ShowNoti } from '~/common/utils'
import IconButton from '../Primary/IconButton'
import PrimaryButton from '../Primary/Button'

const TestUpdateStatus = (props) => {
	const { rowData, setTodoApi, listTodoApi } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [form] = Form.useForm()
	const [isLoading, setIsLoading] = useState(false)

	const showModal = () => {
		setIsModalVisible(true)
	}

	const handleCancel = () => {
		setIsModalVisible(false)
	}

	const onSubmit = async (data) => {
		setIsLoading(true)
		try {
			const newData = { ...rowData, Status: data.Status }
			const res = await testAppointmentApi.update(newData)
			if (res.status === 200) {
				handleCancel()
				setTodoApi(listTodoApi)
				ShowNoti('success', res.data.message)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (rowData) {
			form.setFieldsValue(rowData)
		}
	}, [isModalVisible])

	return (
		<>
			{/* <Tooltip title="Cập nhật trạng thái">
				<button className="btn btn-icon add " onClick={showModal}>
					<FileMinus size={20} />
				</button>
			</Tooltip> */}
			<IconButton onClick={showModal} tooltip="Cập nhật trạng thái" color="blue" type="button" icon="file" />

			<Modal
				title="Cập nhật trạng thái"
				visible={isModalVisible}
				onCancel={handleCancel}
				footer={
					<div className="flex-all-center">
						<PrimaryButton disable={isLoading} loading={isLoading} type="button" background="blue" icon="save" onClick={form.submit}>
							Cập nhật
						</PrimaryButton>
					</div>
				}
			>
				<Form form={form} layout="vertical" onFinish={onSubmit}>
					<SelectField
						name="Status"
						label="Trạng thái"
						optionList={[
							{ value: 1, title: 'Chưa kiểm tra' },
							{ value: 2, title: 'Đã kiểm tra' }
						]}
					/>
					{/* <button type="submit" className="btn btn-primary w-100">
						<MdSave size={18} className="mr-2" />
						Cập nhật
					</button>
					<PrimaryButton type="submit" background="blue" icon="save">
						Cập nhật
					</PrimaryButton> */}
				</Form>
			</Modal>
		</>
	)
}

export default TestUpdateStatus
