import { Form, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import IconButton from '../Primary/IconButton'
import { ShowNoti } from '~/common/utils'
import { permissionApi } from '~/api/permission'
import SelectField from '../FormControl/SelectField'
import PrimaryButton from '../Primary/Button'

const PermissionEditForm = (props) => {
	const { item, getFunctionPermission, rolePermission } = props
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const [form] = Form.useForm()

	const showModal = () => {
		setIsModalOpen(true)
		if (!!item?.Allowed) {
			const convertRole = item.Allowed.split(',').map((data) => parseInt(data))
			form.setFieldsValue({ Allowed: convertRole })
		}
	}

	const handleCancel = () => {
		setIsModalOpen(false)
	}

	const onSubmit = async (data) => {
		let newData
		if (data.Allowed) {
			newData = {
				Id: item.Id,
				Allowed: data.Allowed.join(',')
			}
		} else {
			newData = {
				Id: item.Id,
				Allowed: ''
			}
		}

		try {
			setLoading(true)
			const res = await permissionApi.update(newData)
			if (res.status === 200) {
				getFunctionPermission()
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setLoading(false)
			setIsModalOpen(false)
		}
	}
	return (
		<div>
			<IconButton onClick={showModal} tooltip="Cấp quyền" icon="edit" color="green" type="button" />
			<Modal
				title="Phân quyền chức năng"
				open={isModalOpen}
				onCancel={handleCancel}
				footer={
					<>
						<PrimaryButton loading={loading} onClick={form.submit} background="blue" icon="save" type="button">
							Ficà
						</PrimaryButton>
					</>
				}
			>
				<Form form={form} layout="vertical" onFinish={onSubmit}>
					<SelectField mode="multiple" optionList={rolePermission} name="Allowed" label="Chọn quyền" placeholder="Chọn quyền tại đây" />
				</Form>
			</Modal>
		</div>
	)
}

export default PermissionEditForm
