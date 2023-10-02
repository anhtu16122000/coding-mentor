import { Modal, Form, Input } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { formRequired } from '~/common/libs/others/form'
import { ShowNoti } from '~/common/utils'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import PrimaryButton from '../Primary/Button'
import ButtonAdd from '../DirtyButton/Button-Add'
import ButtonCancel from '../DirtyButton/Button-Cancel'
import ButtonSave from '../DirtyButton/Button-Save'
import { ieltsExamApi } from '~/api/IeltsExam'
import { is } from '~/common/utils/common'

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
			const response = await ieltsExamApi.put(param)
			if (response.status == 200) {
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
			const response = await ieltsExamApi.post(param)
			if (response.status == 200) {
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

	const onFinish = async (values) => {
		const DATA_SUBMIT = { ...values, Thumbnail: '' }

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
		setIsModalVisible(true)
	}

	const user = useSelector((state: RootState) => state.user.information)

	return (
		<>
			{(is(user).admin || is(user).manager) && !!!isEdit && (
				<div data-tut="reactour-create" className="flex-shrink-0 !ml-[8px]">
					<ButtonAdd icon="outline" onClick={() => setIsModalVisible(true)}>
						Tạo mới
					</ButtonAdd>
				</div>
			)}

			{(is(user).admin || is(user).manager) && !!isEdit && (
				<PrimaryButton className={className} onClick={openEdit} type="button" background="yellow" icon="edit">
					Cập nhật
				</PrimaryButton>
			)}

			<Modal
				centered
				title={isEdit ? 'Cập nhật đề' : 'Tạo đề mới'}
				width={600}
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
						<Form.Item className="col-span-4" label="Mô tả" name="Description">
							<Input.TextArea rows={5} disabled={loading} className="primary-input" />
						</Form.Item>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default CreateExam
