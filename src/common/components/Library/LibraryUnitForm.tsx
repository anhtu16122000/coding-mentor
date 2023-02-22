import { Form, Modal, Spin } from 'antd'
import { FC, useEffect, useState } from 'react'
import { FiEdit } from 'react-icons/fi'
import { documentLibraryApi, documentLibraryDirectoryApi } from '~/api/document-library'
import { formRequired } from '~/common/libs/others/form'
import { ShowNoti } from '~/common/utils'
import InputTextField from '../FormControl/InputTextField'
import TextBoxField from '../FormControl/TextBoxField'
import PrimaryButton from '../Primary/Button'
import LibraryContextItem from './LibraryContextItem'

interface IFormUnit {
	isEdit?: boolean
	onRefresh?: Function
	defaultData?: any
	curriculumId?: string
	showEdit?: boolean
	onOpen?: Function
}

const LibraryFormUnit: FC<IFormUnit> = ({ isEdit, onRefresh, defaultData, curriculumId, showEdit, onOpen }) => {
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

		if (!isEdit) {
			post(DATA_SUBMIT)
		} else {
			edit(DATA_SUBMIT)
		}
	}

	async function post(data) {
		try {
			const response = await documentLibraryDirectoryApi.add(data)
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
			const response = await documentLibraryDirectoryApi.update({ ...data, Id: defaultData?.Id })
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
				<LibraryContextItem onClick={async () => openEdit()} Icon={<FiEdit size={18} className="mr-2" />} title="Cập nhật" />
			)}

			{/* {isEdit && <LibraryContextItem onClick={async () => openEdit()} Icon={<FiEdit size={18} className="mr-2" />} title="Cập nhật" />} */}

			<Modal
				width={500}
				title={isEdit ? 'Cập nhật chủ đề' : 'Thêm chủ đề mới'}
				open={visible}
				onCancel={toggle}
				footer={
					<PrimaryButton background="blue" icon="save" type="button" onClick={form.submit}>
						Lưu {loading && <Spin className="loading-base" />}
					</PrimaryButton>
				}
			>
				<Form form={form} layout="vertical" onFinish={onFinish} autoComplete="on">
					<InputTextField isRequired rules={formRequired} label="Tên chủ đề" name="Name" placeholder="Nhập tên chủ đề" />
				</Form>
			</Modal>
		</>
	)
}

export default LibraryFormUnit
