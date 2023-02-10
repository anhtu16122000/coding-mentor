import { Form, Modal, Tooltip } from 'antd'
import React, { useState } from 'react'
import { Eye } from 'react-feather'
import { generalNotificationApi } from '~/api/general-notification'
import { ShowNoti } from '~/common/utils'
import { parseSelectArrayUser } from '~/common/utils/common'
import SelectField from '../FormControl/SelectField'
import IconButton from '../Primary/IconButton'

const GeneralNotificationUserReceiver = (props) => {
	const { dataRow } = props
	const [form] = Form.useForm()
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [dataReceiver, setDataReceiver] = useState([])
	const showModal = () => {
		getUserReceiver(dataRow?.Id)
		setIsModalOpen(true)
	}
	const handleCancel = () => {
		setIsModalOpen(false)
	}
	const getUserReceiver = async (id) => {
		try {
			const res = await generalNotificationApi.getReceiverById(id)
			if (res.status === 200) {
				const convertDataReceiver = parseSelectArrayUser(res.data.data, 'FullName', 'UserCode', 'UserInformationId')
				const selectDefault = convertDataReceiver.map((data) => data.value)
				form.setFieldsValue({ receiver: selectDefault })
				setDataReceiver(convertDataReceiver)
			}
			if (res.status === 204) {
				setDataReceiver([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}
	return (
		<>
			<IconButton color="blue" tooltip="Danh sách người nhận" onClick={showModal} icon="eye" type="button" />
			<Modal
				title="Danh sách người nhận"
				open={isModalOpen}
				onCancel={handleCancel}
				footer={
					<button onClick={handleCancel} className="btn btn-primary">
						Đóng
					</button>
				}
				width={800}
			>
				<Form form={form} layout="vertical">
					<SelectField disabled className="label-full" mode="multiple" optionList={dataReceiver} label="" name="receiver" />
				</Form>
			</Modal>
		</>
	)
}

export default GeneralNotificationUserReceiver
