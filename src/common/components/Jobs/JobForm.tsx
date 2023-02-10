import { Form, Input, Modal, Spin, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { Edit } from 'react-feather'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
import { jobApi } from '~/api/job'
import { ShowNoti } from '~/common/utils'
import * as yup from 'yup'
import InputTextField from '~/common/components/FormControl/InputTextField'
import IconButton from '../Primary/IconButton'
import PrimaryButton from '../Primary/Button'

const JobForm = (props: any) => {
	const { rowData, getDataJob } = props
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
			const res = await (rowData?.Id ? jobApi.update({ ...rowData, ...data }) : jobApi.add({ ...data }))
			if (res.status === 200) {
				getDataJob()
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
		if (isModalVisible) {
			if (rowData) {
				form.setFieldsValue(rowData)
			}
		}
	}, [isModalVisible])

	return (
		<>
			{rowData ? (
				<IconButton
					color="yellow"
					type="button"
					icon="edit"
					tooltip="Cập nhật"
					onClick={() => {
						setIsModalVisible(true)
					}}
				/>
			) : (
				<PrimaryButton
					onClick={() => {
						setIsModalVisible(true)
					}}
					type="button"
					icon="add"
					background="green"
				>
					Thêm mới
				</PrimaryButton>
			)}

			<Modal title={<>{rowData ? 'Cập nhật' : 'Thêm mới'}</>} open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								<InputTextField placeholder="Nghề nghiệp" name="Name" label="Nghề nghiệp" isRequired rules={[yupSync]} />
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<PrimaryButton className="w-full" icon="save" background="blue" type="submit" disable={isLoading} loading={isLoading}>
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

export default JobForm
