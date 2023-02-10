import { Form, Modal, Spin, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { Edit } from 'react-feather'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
import * as yup from 'yup'
import { purposeApi } from '~/api/purpose'
import InputTextField from '~/common/components/FormControl/InputTextField'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'

const PurposeForm = (props) => {
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
			const res = await (dataSubmit?.Id ? purposeApi.update(dataSubmit) : purposeApi.add(dataSubmit))
			if (res.status === 200) {
				setIsModalVisible(false)
				getDataTable()
				form.resetFields()
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
					icon="edit"
					onClick={() => {
						setIsModalVisible(true)
					}}
					tooltip="Cập nhật"
					type="button"
					color="yellow"
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

			{/*  */}
			<Modal
				title={<>{rowData ? 'Cập nhật mục đích học' : 'Thêm mục đích học'}</>}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								<InputTextField isRequired label="Mục đích học" name="Name" rules={[yupSync]} />
							</div>
						</div>
						<div className="row ">
							<div className="col-12">
								{/* <button type="submit" disabled={isLoading} className="btn btn-primary w-100">
									<MdSave size={18} className="mr-2" />
									Lưu
									{isLoading && <Spin className="loading-base" />}
								</button> */}
								<PrimaryButton className="w-full" background="blue" icon="save" type="submit" disable={isLoading} loading={isLoading}>
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

export default PurposeForm
