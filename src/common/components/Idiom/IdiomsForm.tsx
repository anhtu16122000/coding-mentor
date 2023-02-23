import { Form, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import { idiomApi } from '~/api/idiom'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'
import TextBoxField from '../FormControl/TextBoxField'

const IdiomsForm = React.memo((props: any) => {
	const { rowData, getDataIdiom } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [form] = Form.useForm()

	const schema = yup.object().shape({
		Content: yup.string().required('Bạn không được để trống')
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
			const res = await (dataSubmit?.Id ? idiomApi.update(dataSubmit) : idiomApi.add(dataSubmit))
			if (res.status === 200) {
				getDataIdiom()
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
				form.setFieldValue('Content', rowData.Content)
			}
		}
	}, [isModalVisible])

	return (
		<>
			{rowData ? (
				<IconButton
					type="button"
					icon="edit"
					color="yellow"
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
					background="green"
					icon="add"
				>
					Thêm mới
				</PrimaryButton>
			)}

			<Modal
				width={500}
				title={<>{rowData ? 'Cập nhật' : 'Thêm mới'}</>}
				open={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
				centered
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								<TextBoxField
									rows={4}
									className="rounded-lg"
									label="Câu thành ngữ"
									name="Content"
									placeholder="Nhập câu thành ngữ"
									onChange={(value) => form.setFieldValue('Content', value.target.value)}
								/>
							</div>
						</div>
						<div className="row">
							<div className="col-12 text-center">
								<PrimaryButton className="w-full" type="submit" background="blue" icon="save" disable={isLoading} loading={isLoading}>
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

export default IdiomsForm
