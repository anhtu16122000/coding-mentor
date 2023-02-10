import { Modal, Form, Select, Input } from 'antd'
import React, { FC, useState } from 'react'
import { ShowNoti } from '~/common/utils'
import { useDispatch, useSelector } from 'react-redux'
import PrimaryButton from '~/common/components/Primary/Button'
import { setCurrentExerciseForm } from '~/store/globalState'
import { FiEdit } from 'react-icons/fi'
import { examGroupsApi } from '~/api/exam/group'
import { MultipleChoiceForm } from '../QuestionsForm'
import { RootState } from '~/store'
import { formNoneRequired, formRequired } from '~/common/libs/others/form'
import { PlusCircle } from 'react-feather'
import PrimaryEditor from '~/common/components/Editor'
import { QUESTION_TYPES } from '~/common/libs'
import { formatExerciseInGroup } from '../QuestionsForm/utils'
import CreateWriting from '../QuestionsForm/WritingForm'
import TrueFalseForm from '../QuestionsForm/TrueFalseForm'
import MindMapForm from '../QuestionsForm/MindMap'

const GroupForm: FC<IGroupForm> = (props) => {
	const { isEdit, defaultData, isChangeInfo, onOpen, section, onRefresh } = props

	const dispatch = useDispatch()
	const [form] = Form.useForm()

	const exercises = useSelector((state: RootState) => state.globalState.currentExerciseForm)

	const [currentType, setCurrentType] = useState(null)
	const [loading, setLoading] = useState(false)
	const [isModalVisible, setIsModalVisible] = useState(false)

	function reset() {
		!!onRefresh && onRefresh()
		ShowNoti('success', 'Thành công')
		dispatch(setCurrentExerciseForm([]))
		setIsModalVisible(false)
		form.resetFields()
		setCurrentType(null)
	}

	// Call api update section data
	async function putGroup(param) {
		const dataFormated = await formatExerciseInGroup(param, false, section)
		console.log('-- putGroup: ', dataFormated)
		try {
			const response = await examGroupsApi.put(dataFormated)
			if (response.status == 200) reset()
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	// Call api create new section
	async function postGroup(param) {
		const dataFormated = await formatExerciseInGroup(param, true, section)
		console.log('-- postGroup: ', dataFormated)
		try {
			const response = await examGroupsApi.post(dataFormated)
			if (response.status == 200) reset()
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	const [textError, setTextError] = useState('')

	function _checkSubmit() {
		let flag = false
		exercises.forEach((element) => {
			if (element.Enable !== false) {
				flag = true
			}
		})
		if (flag == false) {
			return 'Vui lòng thêm câu hỏi'
		}
		return ''
	}

	// Handle submit form
	const onFinish = (values) => {
		setTextError('')

		const checkSubmit = _checkSubmit()

		if (checkSubmit == '') {
			setLoading(true)
			if (!isEdit && !isChangeInfo) {
				postGroup({ ...values, ExamSectionId: section.Id, ExerciseCreates: exercises })
			}
			if (!!isEdit || !!isChangeInfo) {
				putGroup({ ...values, Id: defaultData.Id, ExerciseUpdates: exercises })
			}
		} else {
			setTextError(checkSubmit)
		}
	}

	// Assign current data to this form
	function openEdit() {
		if (!!onOpen) onOpen()
		dispatch(setCurrentExerciseForm([]))
		form.setFieldsValue({ ...defaultData })
		setCurrentType(defaultData?.Type)
		dispatch(setCurrentExerciseForm([...defaultData.Exercises]))
		setIsModalVisible(true)
	}

	function openCreate() {
		if (!!onOpen) onOpen()
		setIsModalVisible(true)
		dispatch(setCurrentExerciseForm([]))
	}

	const ButtonCreate = () => {
		if (!!isEdit || !!isChangeInfo) {
			return <></>
		}

		return (
			<div
				onClick={openCreate}
				className="p-2 w-full text-[#0074e4] hover:!text-[#0074e4] rounded-[4px] inline-flex items-center font-[600] hover:bg-[rgba(0,0,0,0.08)] cursor-pointer active:!bg-[rgba(0,0,0,0.1)]"
			>
				<PlusCircle size={18} className="mr-2 mt-[-2px]" />
				Thêm nhóm mới
			</div>
		)
	}

	const ButtonUpdate = () => {
		if (!isEdit) {
			return <></>
		}

		return (
			<div
				onClick={openEdit}
				className="inline-flex p-2 w-full text-[#000] rounded-[4px] items-center font-[600] hover:bg-[rgba(0,0,0,0.08)] cursor-pointer active:!bg-[rgba(0,0,0,0.1)]"
			>
				<FiEdit size={18} className="mr-2 mt-[-2px]" />
				Cập nhật nhóm
			</div>
		)
	}

	return (
		<>
			<ButtonCreate />
			<ButtonUpdate />

			<Modal
				centered
				title={isEdit ? 'Cập nhật nhóm' : 'Thêm nhóm mới'}
				width={1200}
				open={isModalVisible}
				onCancel={() => !loading && setIsModalVisible(false)}
				footer={
					<>
						<PrimaryButton disable={loading} onClick={() => setIsModalVisible(false)} background="red" icon="cancel" type="button">
							Huỷ
						</PrimaryButton>
						<PrimaryButton loading={loading} onClick={() => form.submit()} className="ml-2" background="blue" icon="save" type="button">
							Lưu
						</PrimaryButton>
					</>
				}
			>
				<Form disabled={loading} form={form} layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
					<div className="grid grid-cols-8 gap-x-4">
						<div className="col-span-8 w800:col-span-4 grid grid-cols-4 gap-x-4">
							<Form.Item className="col-span-2" label="Tên nhóm" name="Name" rules={formRequired}>
								<Input className="primary-input" placeholder="" />
							</Form.Item>

							<Form.Item className="col-span-2" label="Loại" name="Type" rules={formRequired}>
								<Select disabled={loading || isEdit} className="primary-input primary-select" onChange={(event) => setCurrentType(event)}>
									<Select.Option value={QUESTION_TYPES.MultipleChoice}>Trắc nghiệm</Select.Option>
									<Select.Option value={QUESTION_TYPES.Write}>Tự luận</Select.Option>
									<Select.Option value={QUESTION_TYPES.TrueOrFalse}>True or false</Select.Option>
									<Select.Option value={QUESTION_TYPES.Mindmap}>Mindmap</Select.Option>
								</Select>
							</Form.Item>

							<Form.Item className="col-span-2" label="Cấp độ" name="Level" rules={formRequired}>
								<Select disabled={loading} className="primary-input primary-select">
									<Select.Option value={1}>Dễ</Select.Option>
									<Select.Option value={2}>Trung bình</Select.Option>
									<Select.Option value={3}>Khó</Select.Option>
									<Select.Option value={4}>Khó dữ lắm luôn</Select.Option>
								</Select>
							</Form.Item>

							<Form.Item className="col-span-2" label="Từ khóa" name="Tags" rules={formNoneRequired}>
								<Select disabled={loading} className="primary-input primary-select">
									<Select.Option value={QUESTION_TYPES.MultipleChoice}>Chưa gắn api lấy tag</Select.Option>
								</Select>
							</Form.Item>

							<Form.Item className="col-span-4 mb-0" label="Nội dung" name="Content">
								<PrimaryEditor
									id={`content-${new Date().getTime()}`}
									height={210}
									initialValue={defaultData?.Content || ''}
									onChange={(event) => form.setFieldValue('Content', event)}
								/>
							</Form.Item>
						</div>

						<div className="cc-group-quest-list">
							{textError && <div className="!ml-[25px] mb-2 text-danger">{textError}</div>}

							{currentType == QUESTION_TYPES.MultipleChoice && <MultipleChoiceForm />}
							{currentType == QUESTION_TYPES.Write && <CreateWriting />}
							{currentType == QUESTION_TYPES.TrueOrFalse && <TrueFalseForm />}
							{currentType == QUESTION_TYPES.Mindmap && <MindMapForm />}
						</div>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default GroupForm
