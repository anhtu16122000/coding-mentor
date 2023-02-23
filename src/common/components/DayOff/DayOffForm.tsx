import { Form, Modal } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import { dayOffApi } from '~/api/day-off'
import DatePickerField from '~/common/components/FormControl/DatePickerField'
import InputTextField from '~/common/components/FormControl/InputTextField'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'

const DayOffForm = (props) => {
	const { dataRow, getAllDayOffList } = props
	const [form] = Form.useForm()

	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const openModal = () => setIsModalVisible(true)
	const closeModal = () => setIsModalVisible(false)

	const schema = yup.object().shape({
		Name: yup.string().nullable().required('Bạn không được để trống'),
		sDate: yup.string().nullable().required('Bạn không được để trống'),
		eDate: yup.string().nullable().required('Bạn không được để trống')
	})

	const yupSync = {
		async validator({ field }, value) {
			await schema.validateSyncAt(field, { [field]: value })
		}
	}
	useEffect(() => {
		if (isModalVisible && dataRow) {
			form.setFieldValue('Name', dataRow.Name)
			form.setFieldValue('sDate', moment(dataRow.sDate))
			form.setFieldValue('eDate', moment(dataRow.eDate))
		}
	}, [isModalVisible])

	const handleSubmit = async (data) => {
		setIsLoading(true)
		try {
			let dataSubmit = null
			if (dataRow) {
				dataSubmit = { ...dataRow, ...data, sDate: moment(data.sDate).format(), eDate: moment(data.eDate).format() }
			} else {
				dataSubmit = { ...data, sDate: moment(data.sDate).format(), eDate: moment(data.eDate).format() }
			}
			const res = await (dataSubmit?.Id ? dayOffApi.update(dataSubmit) : dayOffApi.add(dataSubmit))
			if (res.status === 200) {
				closeModal()
				form.resetFields()
				setIsModalVisible(false)
				getAllDayOffList()
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(true)
		}
	}

	return (
		<>
			{dataRow ? (
				<IconButton color="yellow" icon="edit" type="button" onClick={openModal} tooltip="Cập nhật" />
			) : (
				<PrimaryButton icon="add" background="green" type="button" onClick={openModal}>
					Thêm mới
				</PrimaryButton>
			)}

			<Modal title={dataRow ? 'Cập nhật ngày nghỉ' : 'Thêm ngày nghỉ'} visible={isModalVisible} onCancel={closeModal} footer={null}>
				<div>
					<Form form={form} layout="vertical" onFinish={handleSubmit}>
						<div className="row">
							<div className="col-12">
								<InputTextField name="Name" label="Tên ngày nghỉ" placeholder="Nhập tên ngày nghỉ" isRequired rules={[yupSync]} />
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<DatePickerField
									mode="single"
									name="sDate"
									label="Ngày nghỉ (Từ ngày)"
									placeholder="Từ ngày"
									isRequired
									rules={[yupSync]}
								/>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<DatePickerField
									mode="single"
									name="eDate"
									label="Ngày nghỉ (Đến ngày)"
									placeholder="Đến ngày"
									isRequired
									rules={[yupSync]}
								/>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<PrimaryButton icon="save" className="w-full" type="submit" background="blue" disable={isLoading} loading={isLoading}>
									Lưu
								</PrimaryButton>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}
export default DayOffForm
