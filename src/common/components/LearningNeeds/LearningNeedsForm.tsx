import { Form, Modal, Spin, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { Edit } from 'react-feather'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
import * as yup from 'yup'
import { learningNeedApi } from '~/api/learning-needs'
import InputTextField from '~/common/components/FormControl/InputTextField'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'

const LearningNeedsForm = (props) => {
	const { record, getDataSource } = props
	const [visible, setVisible] = useState(false)
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

	const handleCancel = () => {
		setVisible(false)
	}

	const handleSubmit = async (data) => {
		setIsLoading(true)
		try {
			let dataSubmit = null
			if (record) {
				dataSubmit = { ...record, ...data }
			} else {
				dataSubmit = { ...data }
			}
			const res = await (record?.Id ? learningNeedApi.update(dataSubmit) : learningNeedApi.add(dataSubmit))
			if (res.status === 200) {
				handleCancel()
				form.resetFields()
				getDataSource()
				ShowNoti('success', res.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (record) {
			form.setFieldValue('Name', record.Name)
		}
	}, [visible])

	return (
		<>
			{record ? (
				<IconButton
					icon="edit"
					type="button"
					color="yellow"
					tooltip="Sửa nhu cầu học"
					onClick={() => {
						setVisible(true)
						form.resetFields()
					}}
				/>
			) : (
				<PrimaryButton
					onClick={() => {
						setVisible(true)
						form.resetFields()
					}}
					type="button"
					background="green"
					icon="add"
				>
					Thêm mới
				</PrimaryButton>
			)}

			<Modal open={visible} onCancel={handleCancel} title={record ? 'Cập nhật nhu cầu học' : 'Thêm nhu cầu học'} footer={null}>
				<Form form={form} onFinish={handleSubmit} layout="vertical">
					<div className="row">
						<div className="col-12">
							<InputTextField placeholder="Nhu cầu học" name="Name" label="Nhu cầu học" isRequired rules={[yupSync]} />
						</div>

						<div className="col-12 flex-all-center">
							<PrimaryButton icon="save" type="submit" disable={isLoading} loading={isLoading} background="blue">
								Lưu
							</PrimaryButton>
						</div>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default LearningNeedsForm
