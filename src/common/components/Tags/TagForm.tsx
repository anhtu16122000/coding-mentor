import { Form, Modal } from 'antd'
import { useState } from 'react'
import * as yup from 'yup'
import { tagCategoryApi } from '~/api/configs/tagCategory'
import { ShowNoti } from '~/common/utils'
import InputTextField from '../FormControl/InputTextField'
import PrimaryButton from '../Primary/Button'

function TagForm(props) {
	const { onAddTag, activeTab } = props

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

		data.type = activeTab

		try {
			const res = await tagCategoryApi.add(data)
			if (res.status === 200) {
				form.resetFields()
				onAddTag()
				setIsModalVisible(false)
				ShowNoti('success', res.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			<PrimaryButton onClick={() => setIsModalVisible(true)} type="button" icon="add" background="green">
				Thêm mới
			</PrimaryButton>

			<Modal width={400} title={<>Thêm mới</>} open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
				<Form form={form} layout="vertical" onFinish={onSubmit}>
					<InputTextField placeholder="Tên danh mục " name="Name" label="Tên danh mục" isRequired rules={[yupSync]} />

					<div className="row">
						<div className="col-12">
							<PrimaryButton className="w-full" icon="save" background="blue" type="submit" disable={isLoading} loading={isLoading}>
								Lưu
							</PrimaryButton>
						</div>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default TagForm
