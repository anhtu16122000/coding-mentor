import { Form, Modal, Spin } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { FiEdit } from 'react-icons/fi'
import { MdAddCircleOutline } from 'react-icons/md'
import { curriculumDetailApi } from '~/api/curriculum-detail'
import { formRequired } from '~/common/libs/others/form'
import { ShowNoti } from '~/common/utils'
import InputTextField from '../FormControl/InputTextField'
import PrimaryButton from '../Primary/Button'
import ContextItem from './ContextItem'

interface IFormUnit {
	isEdit?: boolean
	onRefresh?: Function
	defaultData?: any
	curriculumId?: string
	showEdit?: boolean
	onOpen?: Function
}

const FormUnit: FC<IFormUnit> = ({ isEdit, onRefresh, defaultData, curriculumId, showEdit, onOpen }) => {
	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		if (showEdit) {
			openEdit()
		}
	}, [showEdit])

	function toggle() {
		setVisible(!visible)
	}

	function openEdit() {
		setVisible(!visible)
		form.setFieldsValue({ ...defaultData })
		onOpen()
	}

	function onFinish(data) {
		setLoading(true)

		const DATA_SUBMIT = { ...data, CurriculumId: curriculumId }

		console.log('-- DATA_SUBMIT', DATA_SUBMIT, !isEdit)

		if (!isEdit) {
			post(DATA_SUBMIT)
		} else {
			edit(DATA_SUBMIT)
		}
	}

	async function post(data) {
		try {
			const response = await curriculumDetailApi.add(data)
			if (response.status === 200) {
				!!onRefresh && onRefresh()
				setVisible(false)
				form.resetFields()
				ShowNoti('success', response.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setLoading(false)
		}
	}

	async function edit(data) {
		try {
			const response = await curriculumDetailApi.update({ ...data, Id: defaultData?.Id })
			if (response.status === 200) {
				ShowNoti('success', response.data.message)
				!!onRefresh && onRefresh()
				setVisible(false)
				form.resetFields()
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			{!isEdit ? (
				<PrimaryButton onClick={toggle} icon="add" type="button" background="green">
					Thêm mới
				</PrimaryButton>
			) : (
				<ContextItem onClick={async () => openEdit()} Icon={<FiEdit size={18} className="mr-2" />} title="Cập nhật" />
			)}

			{/* {isEdit && <ContextItem onClick={async () => openEdit()} Icon={<FiEdit size={18} className="mr-2" />} title="Cập nhật" />} */}

			<Modal
				width={500}
				title={isEdit ? 'Cập nhật chương' : 'Thêm chương mới'}
				open={visible}
				onCancel={toggle}
				footer={
					<PrimaryButton background="blue" icon="save" type="button" onClick={form.submit}>
						Lưu {loading && <Spin className="loading-base" />}
					</PrimaryButton>
				}
			>
				<Form form={form} layout="vertical" onFinish={onFinish} autoComplete="on">
					<InputTextField isRequired rules={formRequired} label="Tên chương" name="Name" placeholder="Nhập tên chương" />
				</Form>
			</Modal>
		</>
	)
}

export default FormUnit
