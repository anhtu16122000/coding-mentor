import { Form, Modal, Spin, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { Edit } from 'react-feather'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
import * as yup from 'yup'
import { sourceApi } from '~/api/source'
import InputTextField from '~/common/components/FormControl/InputTextField'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'

const CustomerSupplier = (props) => {
	const { rowData, getDataTable } = props
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
			let dataSubmit = null
			if (rowData) {
				dataSubmit = { ...rowData, ...data }
			} else {
				dataSubmit = { ...data }
			}
			const res = await (dataSubmit?.Id ? sourceApi.update(dataSubmit) : sourceApi.add(dataSubmit))
			if (res.status === 200) {
				getDataTable()
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
				Object.keys(rowData).forEach(function (key) {
					form.setFieldValue(key, rowData[key])
				})
			}
		}
	}, [isModalVisible])

	return (
		<>
			{rowData ? (
				<IconButton
					icon="edit"
					tooltip="Cập nhật"
					color="yellow"
					type="button"
					onClick={() => {
						setIsModalVisible(true)
					}}
				/>
			) : (
				<PrimaryButton
					background="green"
					icon="add"
					onClick={() => {
						setIsModalVisible(true)
					}}
					type="button"
				>
					Thêm mới
				</PrimaryButton>
			)}

			<Modal
				title={<>{rowData ? 'Cập nhật nguồn khách hàng' : 'Thêm nguồn khách hàng'}</>}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								<InputTextField placeholder="Nguồn khách hàng" isRequired label="Tên nguồn khách hàng" name="Name" rules={[yupSync]} />
							</div>
						</div>
						<div className="row ">
							<div className="col-12 flex-all-center">
								<PrimaryButton icon="save" type="submit" background="blue" disable={isLoading} loading={isLoading}>
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

export default CustomerSupplier
