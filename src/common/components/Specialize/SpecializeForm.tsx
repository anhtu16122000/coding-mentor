import { Form, Modal, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { Edit } from 'react-feather'
import { MdAddCircleOutline } from 'react-icons/md'
import { gradeApi } from '~/api/grade'
import InputTextField from '~/common/components/FormControl/InputTextField'
import { ShowNoti } from '~/common/utils'
import * as yup from 'yup'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'

const SpeacializeForm = React.memo((props: any) => {
	const { setTodoApi, listTodoApi, rowData } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [form] = Form.useForm()

	let schema = yup.object().shape({
		Code: yup.string().required('Bạn không được để trống'),
		Name: yup.string().required('Bạn không được để trống')
	})

	const yupSync = {
		async validator({ field }, value) {
			await schema.validateSyncAt(field, { [field]: value })
		}
	}

	// SUBMI FORM
	const onSubmit = async (data) => {
		setIsLoading(true)
		try {
			let DATA_SUBMIT = null
			if (rowData) {
				DATA_SUBMIT = {
					...rowData,
					...data
				}
			} else {
				DATA_SUBMIT = {
					...data
				}
			}
			const res = await (rowData?.Id ? gradeApi.update(DATA_SUBMIT) : gradeApi.add(DATA_SUBMIT))
			if (res.status === 200) {
				setTodoApi(listTodoApi)
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
				<IconButton type="button" color="yellow" icon="edit" tooltip="Cập nhật" onClick={() => setIsModalVisible(true)} />
			) : (
				<PrimaryButton background="green" icon="add" type="button" onClick={() => setIsModalVisible(true)}>
					Thêm mới
				</PrimaryButton>
			)}

			<Modal
				title={rowData ? 'Cập nhật chuyên môn' : 'Thêm chuyên môn'}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								<InputTextField name="Code" label="Mã chuyên môn" rules={[yupSync]} isRequired />
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<InputTextField name="Name" label="Tên chuyên môn" rules={[yupSync]} isRequired />
							</div>
						</div>
						<div className="row ">
							<div className="col-12">
								<PrimaryButton background="blue" type="submit" icon="save" loading={isLoading} disable={isLoading} className="w-full">
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

export default SpeacializeForm
