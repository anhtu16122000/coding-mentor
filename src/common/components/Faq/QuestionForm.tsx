import { Modal, Spin, Form, Tooltip } from 'antd'
import React, { useState, useEffect } from 'react'
import { Edit } from 'react-feather'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
import { faqApi } from '~/api/faq'
import InputTextField from '~/common/components/FormControl/InputTextField'
import TextBoxField from '~/common/components/FormControl/TextBoxField'
import { ShowNoti } from '~/common/utils'
import * as yup from 'yup'
import IconButton from '../Primary/IconButton'
import PrimaryButton from '../Primary/Button'

const QuestionForm = (props) => {
	const { rowData, getDataSource } = props
	const [showModal, setShowModal] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [form] = Form.useForm()

	let schema = yup.object().shape({
		Question: yup.string().required('Bạn không được để trống'),
		Answer: yup.string().required('Bạn không được để trống')
	})

	const yupSync = {
		async validator({ field }, value) {
			await schema.validateSyncAt(field, { [field]: value })
		}
	}

	const onSubmit = async (data) => {
		setIsLoading(true)
		try {
			let dataSubmit = null
			if (rowData) {
				dataSubmit = { ...rowData, ...data }
			} else {
				dataSubmit = { ...data }
			}
			const res = await (dataSubmit?.Id ? faqApi.update(dataSubmit) : faqApi.add(dataSubmit))
			if (res.status === 200) {
				getDataSource()
				form.resetFields()
				setShowModal(false)
				ShowNoti('success', res.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (showModal) {
			if (rowData) {
				form.setFieldsValue(rowData)
			}
		}
	}, [showModal])

	return (
		<>
			{rowData ? (
				<IconButton
					color="yellow"
					icon="edit"
					tooltip="Cập nhật"
					onClick={() => {
						form.resetFields()
						setShowModal(true)
					}}
					type="button"
				/>
			) : (
				<PrimaryButton
					icon="add"
					background="green"
					type="button"
					onClick={() => {
						setShowModal(true)
					}}
				>
					Thêm mới
				</PrimaryButton>
			)}

			<Modal
				title="Thêm câu hỏi"
				visible={showModal}
				onCancel={() => {
					form.resetFields()
					setShowModal(false)
				}}
				footer={false}
			>
				<div className="container-fluit">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								<InputTextField isRequired rules={[yupSync]} label="Tiêu đề câu hỏi" name="Question" placeholder="Nhập tiêu đề câu hỏi" />
							</div>

							<div className="col-12 mb-2">
								<TextBoxField isRequired rules={[yupSync]} label="Nội dung trả lời" name="Answer" />
							</div>

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

export default QuestionForm
