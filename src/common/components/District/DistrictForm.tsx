import React, { useState } from 'react'
import { Edit } from 'react-feather'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { districtApi } from '~/api/area'
import { Form, Modal, Spin, Tooltip } from 'antd'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
import InputTextField from '~/common/components/FormControl/InputTextField'
import { useRouter } from 'next/router'
import { ShowNoti } from '~/common/utils'

const DistrictForm = (props) => {
	const { fetchDistrictList, dataRow } = props
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	// const schema = yup.object({
	// 	DistrictName: yup.string().nullable().required('Vui lòng nhập tên Quận/Huyện')
	// })

	// const defaultValues = {
	// 	ID: 0,
	// 	DistrictName: null,
	// 	Enable: true,
	// 	AreaID: router.query.area,
	// 	AreaName: router.query.name
	// }

	// const form = useForm({
	// 	defaultValues: defaultValues,
	// 	resolver: yupResolver(schema)
	// })

	const [form] = Form.useForm()

	const showModal = () => {
		if (dataRow) {
			form.setFieldValue('ID', dataRow.ID)
			form.setFieldValue('DistrictName', dataRow.DistrictName)
			form.setFieldValue('Enable', dataRow.Enable)
			form.setFieldValue('AreaID', dataRow.AreaID)
			form.setFieldValue('AreaName', dataRow.AreaName)
		}
		setIsModalOpen(true)
	}

	const handleSubmitForm = async (data) => {
		setIsLoading(true)
		if (data.ID) {
			try {
				const res = await districtApi.update(data)
				if (res.status === 200) {
					ShowNoti('success', res.data.message)
				}
			} catch (err) {
				ShowNoti('error', err.message)
			}
		} else {
			try {
				const res = await districtApi.add(data)
				if (res.status === 200) {
					ShowNoti('success', res.data.message)
				}
			} catch (err) {
				ShowNoti('error', err.message)
			}
		}
		form.resetFields()
		fetchDistrictList()
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
					<InputTextField name="AreaName" label="Tỉnh/Thành phố" disabled />
					<InputTextField placeholder="Tên Quận/Huyện" name="DistrictName" label="Quận/Huyện" />
					<button className="btn btn-primary w-100" type="submit" disabled={isLoading}>
						{!isLoading && <MdSave size={18} className="mr-2" />} Lưu {isLoading && <Spin className="loading-base" />}
					</button>
				</Form>
			</Modal>
		</>
	)
}

export default DistrictForm
