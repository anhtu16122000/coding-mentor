import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { wardApi } from '~/api/area'
import { Form, Modal, Spin, Tooltip } from 'antd'
import { Edit } from 'react-feather'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
import InputTextField from '~/common/components/FormControl/InputTextField'
import { ShowNoti } from '~/common/utils'

const WardForm = (props) => {
	const { fetchWardList, dataRow } = props
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	// const schema = yup.object({
	// 	WardName: yup.string().nullable().required('Vui lòng nhập tên Phường/Xã')
	// })

	// const defaultValues = {
	// 	ID: 0,
	// 	WardName: null,
	// 	Enable: true,
	// 	DistrictID: router.query.dis,
	// 	DistrictName: router.query.name
	// }

	// const form = useForm({
	// 	defaultValues: defaultValues,
	// 	resolver: yupResolver(schema)
	// })

	const [form] = Form.useForm()

	const showModal = () => {
		if (dataRow) {
			form.setFieldValue('ID', dataRow.ID)
			form.setFieldValue('WardName', dataRow.WardName)
			form.setFieldValue('Enable', dataRow.Enable)
			form.setFieldValue('DistrictID', dataRow.DistrictID)
			form.setFieldValue('DistrictName', dataRow.DistrictName)
		}
		setIsModalOpen(true)
	}

	const handleSubmitForm = async (data) => {
		setIsLoading(true)
		if (data.ID) {
			try {
				const res = await wardApi.update(data)
				if (res.status === 200) {
					ShowNoti('success', res.data.message)
				}
			} catch (err) {
				ShowNoti('error', err.message)
			}
		} else {
			try {
				const res = await wardApi.add(data)
				if (res.status === 200) {
					ShowNoti('success', res.data.message)
				}
			} catch (err) {
				ShowNoti('error', err.message)
			}
		}
		form.resetFields()
		fetchWardList()
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

			<Modal title="Thêm Quận/Huyện" visible={isModalOpen} onCancel={handleCancel} footer={null}>
				<Form layout="vertical" onFinish={handleSubmitForm}>
					<InputTextField name="DistrictName" label="Quận/Huyện" disabled />
					<InputTextField placeholder="Tên Phường/Xã" name="WardName" label="Phường/Xã" />
					<button className="btn btn-primary w-100" type="submit" disabled={isLoading}>
						{!isLoading && <MdSave size={18} className="mr-2" />} Lưu {isLoading && <Spin className="loading-base" />}
					</button>
				</Form>
			</Modal>
		</>
	)
}

export default WardForm
