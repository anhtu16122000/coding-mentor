import React, { useEffect, useState } from 'react'
import { Modal, Form, Tooltip, Spin } from 'antd'
import { Edit } from 'react-feather'
import { customerStatusApi } from '~/api/customer-status'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
import { ShowNoti } from '~/common/utils'
import * as yup from 'yup'
import InputTextField from '~/common/components/FormControl/InputTextField'
import IconButton from '../Primary/IconButton'
import PrimaryButton from '../Primary/Button'

const ConsultationStatusForm = React.memo((props: any) => {
	const { infoDetail, getDataConsultationStatus } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [form] = Form.useForm()
	const [isLoading, setIsLoading] = useState(false)

	let schema = yup.object().shape({
		Name: yup.string().required('Bạn không được để trống')
	})

	const yupSync = {
		async validator({ field }, value) {
			await schema.validateSyncAt(field, { [field]: value })
		}
	}

	const onSubmit = async (data: any) => {
		setIsLoading(true)
		try {
			let DATA_SUBMIT = null
			if (infoDetail?.Id) {
				DATA_SUBMIT = {
					...data,
					ID: infoDetail?.Id
				}
			} else {
				DATA_SUBMIT = data
			}
			const res = await (infoDetail?.Id ? customerStatusApi.update(DATA_SUBMIT) : customerStatusApi.add(DATA_SUBMIT))
			if (res.status === 200) {
				getDataConsultationStatus(1)
				form.resetFields()
				setIsModalVisible(false)
				ShowNoti('success', res.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (infoDetail) {
			form.setFieldsValue(infoDetail)
		}
	}, [isModalVisible])

	return (
		<>
			{infoDetail?.Id ? (
				<IconButton
					type="button"
					tooltip="Cập nhật"
					icon="edit"
					onClick={() => {
						setIsModalVisible(true)
					}}
					color="yellow"
				/>
			) : (
				<PrimaryButton
					type="button"
					onClick={() => {
						setIsModalVisible(true)
					}}
					icon="add"
					background="green"
				>
					Thêm mới
				</PrimaryButton>
			)}

			<Modal
				title={<>{infoDetail ? 'Cập nhật' : 'Thêm mới'}</>}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								<InputTextField
									placeholder="Tình trạng tư vấn khách hàng"
									name="Name"
									label="Tình trạng tư vấn khách hàng"
									isRequired
									rules={[yupSync]}
								/>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<PrimaryButton className="w-full" icon="save" type="submit" background="blue" disable={isLoading} loading={isLoading}>
									Lưu
								</PrimaryButton>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
})

export default ConsultationStatusForm
