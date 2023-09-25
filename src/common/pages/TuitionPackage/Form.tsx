import { Form, Input, Modal, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import { tuitionPackageApi } from '~/api/configs/tuition-package'
import InputNumberField from '~/common/components/FormControl/InputNumberField'
import ModalFooter from '~/common/components/ModalFooter'
import PrimaryButton from '~/common/components/Primary/Button'
import { formNoneRequired, formRequired } from '~/common/libs/others/form'
import { ShowNoti } from '~/common/utils'

const FormTuition = (props) => {
	const { onRefresh, isEdit, defaultData } = props

	const [form] = Form.useForm()

	const [loading, setLoading] = useState<boolean>(false)
	const [visible, setVisible] = useState<boolean>(false)

	useEffect(() => {}, [visible])

	function toggle() {
		setVisible(!visible)
	}

	async function handlePost(params) {
		setLoading(true)
		try {
			const res = await tuitionPackageApi.add(params)
			if (res.status == 200) {
				onRefresh()
				form.resetFields()
				toggle()
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setLoading(false)
		}
	}

	async function handlePut(params) {
		setLoading(true)
		try {
			const res = await tuitionPackageApi.update(params)
			if (res.status == 200) {
				onRefresh()
				form.resetFields()
				toggle()
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setLoading(false)
		}
	}

	function handleSubmitForm(params) {
		const DATA_SUBMIT = { ...params }

		console.log('---- DATA_SUBMIT: ', DATA_SUBMIT)

		if (isEdit) {
			handlePut({ ...defaultData, ...DATA_SUBMIT })
		}

		if (!isEdit) {
			handlePost({ ...DATA_SUBMIT })
		}
	}

	function onOpenEdit() {
		if (defaultData) {
			form.setFieldsValue({ ...defaultData })
			toggle()
		}
	}

	return (
		<>
			{!isEdit && (
				<PrimaryButton onClick={toggle} background="green" icon="add" type="button">
					Thêm mới
				</PrimaryButton>
			)}

			{!!isEdit && (
				<div onClick={onOpenEdit}>
					<FaEdit size={18} color="#0A89FF" className="mt-[-3px]" />
				</div>
			)}

			<Modal
				width={500}
				open={visible}
				title={isEdit ? 'Cập nhật gói' : 'Thêm gói mới'}
				onCancel={toggle}
				footer={<ModalFooter loading={loading} onCancel={toggle} onOK={form.submit} />}
			>
				<Form className="grid grid-cols-2 gap-x-[16px]" form={form} layout="vertical" onFinish={handleSubmitForm}>
					<Form.Item className="col-span-1" name="Code" label="Mã" rules={formRequired}>
						<Input className="primary-input" placeholder="" />
					</Form.Item>

					<Form.Item initialValue={1} className="col-span-1" name="DiscountType" label="Loại" rules={formRequired}>
						<Select>
							<Select.Option key={1} value={1}>
								Giảm theo số tiền
							</Select.Option>
							<Select.Option key={2} value={2}>
								Giảm theo phần trăm
							</Select.Option>
						</Select>
					</Form.Item>

					<InputNumberField isRequired={true} className="col-span-1" name="Months" label="Số tháng" rules={formRequired} />

					<InputNumberField isRequired={true} className="col-span-1" name="Discount" label="Giảm" rules={formRequired} />

					<Form.Item className="col-span-2" name="Description" label="Mô tả" rules={formNoneRequired}>
						<Input.TextArea rows={4} className="primary-input" placeholder="" />
					</Form.Item>
				</Form>
			</Modal>
		</>
	)
}

export default FormTuition
