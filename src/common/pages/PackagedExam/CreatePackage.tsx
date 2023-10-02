import { Modal, Form, Input } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { formNoneRequired, formRequired } from '~/common/libs/others/form'
import { ShowNoti } from '~/common/utils'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import ButtonAdd from '~/common/components/DirtyButton/Button-Add'
import ModalFooter from '~/common/components/ModalFooter'
import { packedApi } from '~/api/packed'
import MiniImageCrop from './MiniImageCrop'
import InputNumberField from '~/common/components/FormControl/InputNumberField'
import { FaEdit } from 'react-icons/fa'
import { is } from '~/common/utils/common'

const CreatePackage: FC<ICreateExam> = (props) => {
	const { onRefresh, isEdit, defaultData, className, onOpen } = props

	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		if (visible) {
			!!onOpen && onOpen()
		}
	}, [visible])

	async function putPackage(param) {
		try {
			const response = await packedApi.put(param)
			if (response.status == 200) {
				ShowNoti('success', response.data.message)
				if (!!onRefresh) {
					onRefresh()
					form.resetFields()
					setVisible(false)
				}
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	async function postPackage(param) {
		try {
			const response = await packedApi.post(param)
			if (response.status == 200) {
				ShowNoti('success', response.data.message)
				if (!!onRefresh) {
					onRefresh()
					form.resetFields()
					setVisible(false)
				}
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	const onFinish = async (values) => {
		const DATA_SUBMIT = { ...values, Active: true }

		setLoading(true)

		if (!isEdit) {
			postPackage(DATA_SUBMIT)
		}

		if (!!isEdit) {
			putPackage({ ...DATA_SUBMIT, Id: defaultData.Id })
		}
	}

	function openEdit() {
		form.setFieldsValue({ ...defaultData })
		setVisible(true)
	}

	const user = useSelector((state: RootState) => state.user.information)

	return (
		<>
			{(is(user).admin || is(user).manager) && !isEdit && (
				<div data-tut="reactour-create" className="flex-shrink-0">
					<ButtonAdd icon="outline" onClick={() => setVisible(true)}>
						Tạo mới
					</ButtonAdd>
				</div>
			)}

			{(is(user).admin || is(user).manager) && !!isEdit && (
				<div onClick={openEdit} className="pe-menu-item mt-[8px]">
					<FaEdit size={16} color="#1b73e8" />
					<div className="ml-[8px]">Chỉnh sửa</div>
				</div>
			)}

			<Modal
				centered
				title={isEdit ? 'Cập nhật bộ đề' : 'Tạo bộ đề'}
				width={400}
				open={visible}
				onCancel={() => !loading && setVisible(false)}
				footer={<ModalFooter loading={loading} onOK={() => form.submit()} onCancel={() => setVisible(false)} />}
			>
				<Form disabled={loading} form={form} layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
					<div className="grid grid-cols-4 gap-x-4">
						<Form.Item className="col-span-4" label="Hình thu nhỏ" name="Thumbnail" rules={formNoneRequired}>
							<MiniImageCrop
								className=""
								defaultValue={defaultData?.Thumbnail}
								onChange={(event) => {
									form.setFieldValue('Thumbnail', event?.uri)
								}}
							/>
						</Form.Item>

						<Form.Item className="col-span-4" label="Tên" name="Name" rules={formRequired}>
							<Input disabled={loading} className="primary-input" />
						</Form.Item>

						<InputNumberField className="col-span-4" label="Giá" name="Price" />

						<Form.Item className="col-span-4" label="Mô tả" name="Description">
							<Input.TextArea rows={5} disabled={loading} className="primary-input" />
						</Form.Item>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default CreatePackage
