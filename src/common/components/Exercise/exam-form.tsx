import { Modal, Form, Input } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { formRequired } from '~/common/libs/others/form'
import { ShowNoti } from '~/common/utils'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import PrimaryButton from '../Primary/Button'
import { NumericFormat } from 'react-number-format'
import { examApi } from '~/api/exam'
import ButtonAdd from '../DirtyButton/Button-Add'
import ButtonCancel from '../DirtyButton/Button-Cancel'
import ButtonSave from '../DirtyButton/Button-Save'
import UploadFile from '../UploadFile'

const CreateExam: FC<ICreateExam> = (props) => {
	const { onRefresh, isEdit, defaultData, className, onOpen } = props

	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [isModalVisible, setIsModalVisible] = useState(false)

	useEffect(() => {
		if (isModalVisible) {
			!!onOpen && onOpen()
		}
	}, [isModalVisible])

	async function postEditExam(param) {
		try {
			const response = await examApi.put(param)
			if (response.status === 200) {
				ShowNoti('success', response.data.message)
				if (!!onRefresh) {
					onRefresh()
					form.resetFields()
					setIsModalVisible(false)
				}
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	async function postNewExam(param) {
		try {
			const response = await examApi.post(param)
			if (response.status === 200) {
				ShowNoti('success', response.data.message)
				if (!!onRefresh) {
					onRefresh()
					form.resetFields()
					setIsModalVisible(false)
				}
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	const onFinish = (values) => {
		const passPoint = !values.PassPoint ? 0 : values.PassPoint.toString().split(',').join('')
		const time = !values.Time ? 0 : values.Time.toString().split(',').join('')

		const DATA_SUBMIT = { ...values, Time: parseInt(time), PassPoint: parseInt(passPoint) }

		setLoading(true)
		if (!isEdit) {
			postNewExam(DATA_SUBMIT)
		}
		if (!!isEdit) {
			postEditExam({ ...DATA_SUBMIT, ID: defaultData.Id })
		}
	}

	function openEdit() {
		form.setFieldsValue({ Code: defaultData?.Code })
		form.setFieldsValue({ Description: defaultData?.Description })
		form.setFieldsValue({ Name: defaultData?.Name })
		form.setFieldsValue({ PassPoint: defaultData.PassPoint })
		form.setFieldsValue({ Time: defaultData?.Time })
		setIsModalVisible(true)
	}

	const user = useSelector((state: RootState) => state.user.information)

	return (
		<>
			{user?.RoleId == 1 && !!!isEdit && (
				<ButtonAdd icon="outline" onClick={() => setIsModalVisible(true)}>
					Tạo mới
				</ButtonAdd>
			)}

			{user?.RoleId == 1 && !!isEdit && (
				<PrimaryButton className={className} onClick={openEdit} type="button" background="yellow" icon="edit">
					Cập nhật
				</PrimaryButton>
			)}

			<Modal
				centered
				title={isEdit ? 'Cập nhật đề' : 'Tạo đề mới'}
				width={700}
				open={isModalVisible}
				onCancel={() => !loading && setIsModalVisible(false)}
				footer={
					<div className="w-full flex items-center justify-center">
						<ButtonCancel iconSize={18} icon="outline" shadow="sm" onClick={() => setIsModalVisible(false)}>
							Huỷ
						</ButtonCancel>
						<ButtonSave iconSize={16} loading={loading} onClick={() => form.submit()} shadow="sm" className="ml-3" icon="outline">
							Lưu
						</ButtonSave>
					</div>
				}
			>
				<Form disabled={loading} form={form} layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
					<div className="grid grid-cols-4 gap-x-4">
						<Form.Item className="col-span-2" label="Mã đề" name="Code" rules={formRequired}>
							<Input disabled={loading} className="primary-input" />
						</Form.Item>
						<Form.Item className="col-span-2" label="Tên đề" name="Name" rules={formRequired}>
							<Input disabled={loading} className="primary-input" />
						</Form.Item>
						<Form.Item className="col-span-2" label="Thời gian làm bài" name="Time" rules={formRequired}>
							<NumericFormat disabled={loading} className="primary-input w-full px-[10px]" thousandSeparator={true} />
						</Form.Item>
						<Form.Item className="col-span-2" label="Điểm sàn" name="PassPoint">
							<NumericFormat disabled={loading} className="primary-input w-full px-[10px]" thousandSeparator={true} />
						</Form.Item>
						{/* <Form.Item className="col-span-2" label="File nghe" name="Audio">
							<UploadFile />
						</Form.Item> */}
						<Form.Item className="col-span-4" label="Hướng dẫn làm bài" name="Description">
							<Input.TextArea rows={5} disabled={loading} className="primary-input" />
						</Form.Item>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default CreateExam
