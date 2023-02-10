import { Form, Input, Modal, Select } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { formRequired } from '~/common/libs/others/form'
import ButtonAdd from '../DirtyButton/Button-Add'
import ButtonCancel from '../DirtyButton/Button-Cancel'
import ButtonSave from '../DirtyButton/Button-Save'
import PrimaryEditor from '../Editor'
import EditorBase from '../FormControl/EditorField/Editor'
import { examGroupsApi } from '~/api/exam/group'
import { FiEdit } from 'react-icons/fi'
import { ShowNoti } from '~/common/utils'

type TCCExerciseGroup = {
	onOpen?: Function
	isEdit?: boolean
	section?: any
	onRefresh?: Function
	defaultData?: any
}

const ExerciseGroup: FC<TCCExerciseGroup> = (props) => {
	const { onOpen, isEdit, section, onRefresh, defaultData } = props

	const [form] = Form.useForm()

	const dispatch = useDispatch()

	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)
	const [submitDisabled, setSubmitDisabled] = useState(true)

	useEffect(() => {
		if (visible && !!onOpen) onOpen()
	}, [visible])

	/**
	 * Get the text of the exercise group
	 * @returns text of the exercise group modal
	 */
	function getTitle() {
		if (!!isEdit) {
			return 'Cập nhật nhóm câu hỏi'
		}
		return 'Thêm nhóm câu hỏi'
	}

	/**
	 * Open the modal and call the callback function
	 */
	function openModal() {
		setVisible(true)
		if (!!onOpen) onOpen()
	}

	async function postData(params: any) {
		try {
			const response = await examGroupsApi.post({ ...params })
			if (response.status == 200) {
				!!onRefresh && onRefresh()
				setVisible(false)
			}
		} catch (error) {
			console.log('error:', error)
			ShowNoti('error', error?.message)
		} finally {
			setLoading(false)
		}
	}

	async function putData(params: any) {
		try {
			const response = await examGroupsApi.put({ ...params, Id: defaultData?.Id })
			if (response.status == 200) {
				!!onRefresh && onRefresh()
				setVisible(false)
			}
		} catch (error) {
			console.log('error:', error)
			ShowNoti('error', error?.message)
		} finally {
			setLoading(false)
		}
	}

	/**
	 *  Function submit the form and call the create or update function
	 * @param values all values of the form
	 */
	const onFinish = (values) => {
		setLoading(true)
		const SUBMIT_DATA = {
			...values,
			ExamSectionId: section?.Id,
			// Type: null,
			Type: 'MultipleChoice',
			Tags: null
		}

		console.log('-- SUBMIT_DATA: ', SUBMIT_DATA)

		if (!isEdit) {
			postData({ ...SUBMIT_DATA, ExerciseCreates: [] })
		} else {
			putData({ ...SUBMIT_DATA })
		}
	}

	// Assign current data to this form
	function openEdit() {
		form.setFieldsValue({ ...defaultData })
		setVisible(true)
	}

	return (
		<>
			{!isEdit && (
				<ButtonAdd onClick={openModal} icon="inline">
					Thêm nhóm câu
				</ButtonAdd>
			)}

			{!!isEdit && (
				<div
					onClick={openEdit}
					className="p-2 w-full text-[#000] rounded-[4px] inline-flex items-center font-[600] hover:bg-[rgba(0,0,0,0.08)] cursor-pointer active:!bg-[rgba(0,0,0,0.1)]"
				>
					<FiEdit size={18} className="mr-2 mt-[-2px]" />
					Cập nhật nhóm
				</div>
			)}

			<Modal
				width={600}
				centered
				open={visible}
				onCancel={() => setVisible(false)}
				title={getTitle()}
				footer={
					<div className="all-center">
						<ButtonCancel iconSize={18} icon="outline" onClick={() => setVisible(false)}>
							Huỷ
						</ButtonCancel>
						<ButtonSave loading={loading} className="ml-2" onClick={() => form.submit()} icon="outline">
							Lưu
						</ButtonSave>
					</div>
				}
			>
				<Form disabled={loading} form={form} layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
					<div className="grid grid-cols-4 gap-x-4">
						<Form.Item className="col-span-2" label="Cấp độ" name="Level" rules={formRequired}>
							<Select disabled={loading} className="primary-input">
								<Select.Option value={1}>Dễ</Select.Option>
								<Select.Option value={2}>Trung bình</Select.Option>
								<Select.Option value={3}>Khó</Select.Option>
							</Select>
						</Form.Item>

						<Form.Item className="col-span-2" label="Tên nhóm" name="Name" rules={formRequired}>
							<Input className="primary-input" placeholder="" />
						</Form.Item>

						<Form.Item className="col-span-4" label="Nội dung" name="Content">
							<PrimaryEditor
								id={`content-${new Date().getTime()}`}
								height={300}
								initialValue={defaultData?.Content || ''}
								onChange={(event) => form.setFieldValue('Content', event)}
							/>
						</Form.Item>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default ExerciseGroup
