import { Form, Modal, Spin, Tooltip } from 'antd'
import React, { useState } from 'react'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import InputTextField from '~/common/components/FormControl/InputTextField'
import { areaApi } from '~/api/area'
import { Edit } from 'react-feather'
import { ShowNoti } from '~/common/utils'

const AreaForm = (props) => {
	const { fetchAreaList, dataRow } = props
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	// const schema = yup.object({
	// 	AreaName: yup.string().nullable().required('Vui lòng nhập tên Tỉnh/Thành phố')
	// })

	// const defaultValues = {
	// 	AreaID: 0,
	// 	AreaName: null,
	// 	Enable: true
	// }

	// const form = useForm({
	// 	defaultValues: defaultValues,
	// 	resolver: yupResolver(schema)
	// })

	const [form] = Form.useForm()

	const showModal = () => {
		if (dataRow) {
			form.setFieldValue('AreaID', dataRow.AreaID)
			form.setFieldValue('AreaName', dataRow.AreaName)
			form.setFieldValue('Enable', dataRow.Enable)
		}
		setIsModalOpen(true)
	}

	const handleSubmitForm = async (data) => {
		setIsLoading(true)
		if (data.AreaID) {
			try {
				const res = await areaApi.update(data)
				if (res.status === 200) {
					ShowNoti('success', res.data.message)
				}
			} catch (err) {
				ShowNoti('error', err.message)
			}
		} else {
			try {
				const res = await areaApi.add(data)
				if (res.status === 200) {
					ShowNoti('success', res.data.message)
				}
			} catch (err) {
				ShowNoti('error', err.message)
			}
		}
		form.resetFields()
		fetchAreaList()
		setIsLoading(false)
		setIsModalOpen(false)
	}

	const handleCancel = () => {
		setIsModalOpen(false)
	}

	return (
		<>
			{dataRow ? (
				<button className="btn btn-icon edit" onClick={showModal}>
					<Tooltip title="Cập nhật">
						<Edit />
					</Tooltip>
				</button>
			) : (
				<button className="btn btn-warning add-new" onClick={showModal}>
					<MdAddCircleOutline size={18} className="mr-2" /> Thêm mới
				</button>
			)}

			<Modal title="Thêm Tỉnh/Thành phố" open={isModalOpen} onCancel={handleCancel} footer={null}>
				<Form form={form} layout="vertical" onFinish={handleSubmitForm}>
					<InputTextField placeholder="Tên Tỉnh/Thành phố" name="AreaName" label="Tỉnh/Thành phố" />
					<button className="btn btn-primary w-100" type="submit" disabled={isLoading}>
						{!isLoading && <MdSave size={18} className="mr-2" />} Lưu {isLoading && <Spin className="loading-base" />}
					</button>
				</Form>
			</Modal>
		</>
	)
}

export default AreaForm
