import { Modal, Form, Select, Input, Skeleton } from 'antd'
import React, { FC, useEffect, useRef, useState } from 'react'
import { ShowNostis, ShowNoti, log, wait } from '~/common/utils'
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
import { ieltsGroupApi } from '~/api/IeltsExam/ieltsGroup'
import { IoCloseSharp } from 'react-icons/io5'
import CreateSpeaking from '../QuestionsForm/SpeakingForm'
import CreateTyping from '../QuestionsForm/FillInBlankForm'
import { useExamContext } from '~/common/components/Auth/Provider/exam'
import { setQuestions } from '~/store/createQuestion'
import CreateDragAndDrop from '../QuestionsForm/DragAndDropForm'
import { tagCategoryApi } from '~/api/configs/tagCategory'
import { tagApi } from '~/api/configs/tag'

let fullEditor = false
const quickMenu = 'bold italic underline strikethrough | fontfamily fontsize blocks | codesample | forecolor backcolor | customInsertButton'

const GroupForm: FC<IGroupForm> = (props) => {
	const { isEdit, defaultData, isChangeInfo, onOpen, section, onRefresh } = props

	const { questionWithAnswers, setQuestionWithAnswers } = useExamContext()

	const dispatch = useDispatch()
	const [form] = Form.useForm()

	const exercises = useSelector((state: RootState) => state.globalState.currentExerciseForm)

	const [currentType, setCurrentType] = useState(null)
	const [loading, setLoading] = useState(false)
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [showEditor, setShowEditor] = useState<boolean>(true)

	const [tags, setTags] = useState([])

	const getAllTags = async () => {
		try {
			const response = await tagApi.getAllTagByTagCeteId({ pageIndex: 1, pageSize: 99999, type: 2 })
			if (response.status == 200) {
				const { data, totalRow } = response.data
				setTags(data)
			} else {
				setTags([])
			}
		} catch (error) {
			ShowNostis.error(error.message)
		}
	}

	useEffect(() => {
		getAllTags()
	}, [])

	useEffect(() => {
		changeType()
	}, [currentType])

	async function changeType() {
		setShowEditor(false)
		await wait(200)
		setShowEditor(true)
	}

	function reset() {
		!!onRefresh && onRefresh()
		ShowNoti('success', 'Thành công')

		setQuestionWithAnswers([])
		dispatch(setQuestions([]))

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
			const response = await ieltsGroupApi.put(dataFormated)
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
			const response = await ieltsGroupApi.post(dataFormated)
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

		const isTyping = currentType == QUESTION_TYPES.FillInTheBlank
		const isDrag = currentType == QUESTION_TYPES.DragDrop

		const finalExercise = isTyping || isDrag ? questionWithAnswers : exercises

		finalExercise.forEach((element) => {
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
		log.Red('--------- FORM onFinish', exercises)

		setTextError('')

		const checkSubmit = _checkSubmit()

		log.Yellow('checkSubmit', checkSubmit)

		const isTyping = currentType == QUESTION_TYPES.FillInTheBlank
		const isDrag = currentType == QUESTION_TYPES.DragDrop

		// TagIds

		const xTags = !values?.TagIds ? '' : values?.TagIds.join(',')

		if (checkSubmit == '') {
			setLoading(true)
			if (!isEdit && !isChangeInfo) {
				postGroup({
					...values,
					TagIds: xTags,
					IeltsSectionId: section.Id,
					IeltsQuestions: isTyping || isDrag ? questionWithAnswers : exercises
				})
			}
			if (!!isEdit || !!isChangeInfo) {
				putGroup({
					...values,
					TagIds: xTags,
					Id: defaultData.Id,
					IeltsQuestions: isTyping || isDrag ? questionWithAnswers : exercises
				})
			}
		} else {
			setTextError(checkSubmit)
		}
	}

	// Assign current data to this form
	function openEdit() {
		console.log('---- defaultData: ', defaultData)

		if (!!onOpen) onOpen()

		setQuestionWithAnswers([...defaultData?.IeltsQuestions])
		dispatch(setCurrentExerciseForm([]))
		form.setFieldsValue({ ...defaultData, TagIds: !defaultData?.TagIds ? [] : defaultData?.TagIds.split(',') })
		setCurrentType(defaultData?.Type)
		dispatch(setCurrentExerciseForm([...defaultData.IeltsQuestions]))

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
			<>
				<div onClick={openCreate} className="cc-23-skill-menu-item">
					<PlusCircle size={17} className="text-[#4CAF50] ml-[-2px]" />
					<div className="ml-[8px] font-[500]">Thêm câu hỏi</div>
				</div>
			</>
		)
	}

	const ButtonUpdate = () => {
		if (!isEdit) {
			return <></>
		}

		return (
			<div onClick={openEdit} className="exam-23-btn-update-group">
				<FiEdit size={18} className="mr-2 mt-[-2px]" />
				Cập nhật
			</div>
		)
	}

	// GET NOW TIMESTAMP
	function getTimeStamp() {
		return new Date().getTime() // Example: 1653474514413
	}

	const editorRef = useRef(null)

	return (
		<>
			<ButtonCreate />
			<ButtonUpdate />

			<Modal
				centered
				title={isEdit ? 'Cập nhật nhóm' : 'Thêm nhóm mới'}
				width={currentType! == QUESTION_TYPES.FillInTheBlank ? '98%' : '98%'}
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
					<div className="grid grid-cols-8 gap-x-1">
						<div className="col-span-8 w800:col-span-4 pr-[16px] grid grid-cols-4 gap-x-4" style={{ borderRight: '1px solid #0000002b' }}>
							<div id="the-baby-form" className="col-span-4 grid grid-cols-4 gap-x-4">
								<Form.Item className="col-span-2" label="Tên nhóm" name="Name" rules={formRequired}>
									<Input className="primary-input" placeholder="" />
								</Form.Item>

								<Form.Item className="col-span-2" label="Loại" name="Type" rules={formRequired}>
									<Select disabled={loading || isEdit} className="primary-input primary-select" onChange={(event) => setCurrentType(event)}>
										<Select.Option value={QUESTION_TYPES.MultipleChoice}>Trắc nghiệm</Select.Option>
										<Select.Option value={QUESTION_TYPES.Write}>Tự luận</Select.Option>
										<Select.Option value={QUESTION_TYPES.TrueOrFalse}>True or false</Select.Option>
										<Select.Option value={QUESTION_TYPES.Mindmap}>Mindmap</Select.Option>
										<Select.Option value={QUESTION_TYPES.Speak}>Speaking</Select.Option>
										<Select.Option value={QUESTION_TYPES.FillInTheBlank}>Điền vào ô trống</Select.Option>
										<Select.Option value={QUESTION_TYPES.DragDrop}>Chọn đáp án đúng</Select.Option>
									</Select>
								</Form.Item>

								<Form.Item className="col-span-2" label="Cấp độ" name="Level" rules={formRequired}>
									<Select disabled={loading} className="primary-input primary-select">
										<Select.Option value={1}>Dễ</Select.Option>
										<Select.Option value={2}>Trung bình</Select.Option>
										<Select.Option value={3}>Khó</Select.Option>
									</Select>
								</Form.Item>

								<Form.Item className="col-span-2" label="Từ khóa" name="TagIds" rules={formNoneRequired}>
									<Select mode="tags" disabled={loading} className="primary-input primary-select">
										{tags.map((tag, index) => (
											<Select.Option key={`te-${tag?.Id}`} id={`i-te-${tag?.Id}`} value={tag?.Id + ''}>
												{tag?.Name}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
							</div>

							{showEditor && (
								<Form.Item className="col-span-4 mb-0" label="Nội dung" name="Content">
									<PrimaryEditor
										noFullscreen
										isFillInBlank={currentType == QUESTION_TYPES.FillInTheBlank || currentType == QUESTION_TYPES.DragDrop}
										id={`content-${new Date().getTime()}`}
										height={350}
										initialValue={defaultData?.Content || ''}
										onChange={(event) => form.setFieldValue('Content', event)}
									/>
								</Form.Item>
							)}
							{!showEditor && (
								<div className="h-[213px]">
									<Skeleton active />
								</div>
							)}
						</div>

						<div className="cc-group-quest-list">
							{textError && <div className="mb-2 text-danger">{textError}</div>}

							{currentType == QUESTION_TYPES.MultipleChoice && <MultipleChoiceForm />}
							{currentType == QUESTION_TYPES.Write && <CreateWriting />}
							{currentType == QUESTION_TYPES.TrueOrFalse && <TrueFalseForm />}
							{currentType == QUESTION_TYPES.Mindmap && <MindMapForm />}
							{currentType == QUESTION_TYPES.Speak && <CreateSpeaking />}
							{currentType == QUESTION_TYPES.FillInTheBlank && <CreateTyping isEdit={isEdit} />}
							{currentType == QUESTION_TYPES.DragDrop && <CreateDragAndDrop isEdit={isEdit} />}
						</div>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default GroupForm
