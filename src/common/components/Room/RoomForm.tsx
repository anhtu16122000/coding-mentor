import { Form, Modal, Spin, Tooltip } from 'antd'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import { Edit } from 'react-feather'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
import SelectField from '../FormControl/SelectField'
import InputTextField from '~/common/components/FormControl/InputTextField'
import * as yup from 'yup'
import { ShowNoti } from '~/common/utils'
import { roomApi } from '~/api/room'
import IconButton from '../Primary/IconButton'
import PrimaryButton from '../Primary/Button'

const RoomForm = (props: any) => {
	const { rowData, dataCenter, getDataRoom } = props
	const branchID = parseInt(router.query.slug as string)
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [form] = Form.useForm()
	const [isLoading, setIsLoading] = useState(false)

	let schema = yup.object().shape({
		Code: yup.string().required('Bạn không được để trống'),
		Name: yup.string().required('Bạn không được để trống')
	})

	const yupSync = {
		async validator({ field }, value) {
			await schema.validateSyncAt(field, { [field]: value })
		}
	}

	// HANDLE SUBMIT
	const onFinish = async (data: any) => {
		setIsLoading(true)
		try {
			let dataSubmit = null
			if (rowData?.Id) {
				dataSubmit = { ...data, Id: rowData.Id }
			} else {
				dataSubmit = { ...data }
			}
			const res = await (dataSubmit?.Id ? roomApi.update(dataSubmit) : roomApi.add(dataSubmit))
			if (res.status === 200) {
				form.resetFields()
				getDataRoom()
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
			if (branchID) {
				form.setFieldsValue({ ...rowData, BranchID: branchID })
			}
			if (rowData?.Id) {
				form.setFieldsValue(rowData)
			}
		}
	}, [isModalVisible])

	return (
		<>
			{rowData ? (
				<IconButton tooltip={'Cập nhật'} type="button" color="yellow" onClick={() => setIsModalVisible(true)} icon="edit" />
			) : (
				<PrimaryButton background="green" icon="add" type="button" onClick={() => setIsModalVisible(true)}>
					Thêm mới
				</PrimaryButton>
			)}

			<Modal
				title={`${rowData ? 'Cập nhật' : 'Tạo'} phòng`}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} onFinish={onFinish} layout="vertical">
						<div className="row">
							<div className="col-12">
								<SelectField name="BranchID" label="Trung tâm" optionList={dataCenter} disabled />
							</div>
							<div className="col-12">
								<InputTextField isRequired name="Code" label="Mã phòng" rules={[yupSync]} />
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<InputTextField isRequired name="Name" label="Tên phòng" rules={[yupSync]} />
							</div>
						</div>
						<div className="row ">
							<div className="col-12 mt-3 flex-all-center">
								<PrimaryButton type="submit" background="blue" icon="save" disable={isLoading} loading={isLoading}>
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

export default RoomForm
