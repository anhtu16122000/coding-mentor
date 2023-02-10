import { Modal, Form, Input, Checkbox } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PrimaryButton from '~/common/components/Primary/Button'
import { setCurrentExerciseForm } from '~/store/globalState'
import { FiEdit } from 'react-icons/fi'
import { RootState } from '~/store'
import { formRequired } from '~/common/libs/others/form'
import { NumericFormat } from 'react-number-format'
import PrimaryEditor from '~/common/components/Editor'
import { getTimeStamp } from '~/common/utils/super-functions'

const INIT_ANSWER = [
	{ AnswerContent: 'True', Id: 0, IsTrue: false, Type: 'Text', Enable: true, isAdd: true, timestamp: getTimeStamp() },
	{ AnswerContent: 'False', Id: 0, IsTrue: false, Type: 'Text', Enable: true, isAdd: true, timestamp: getTimeStamp() },
	{ AnswerContent: 'Not given', Id: 0, IsTrue: false, Type: 'Text', Enable: true, isAdd: true, timestamp: getTimeStamp() }
]

const InputTrueFalse: FC<IGroupForm> = (props) => {
	const { isEdit, defaultData, isChangeInfo, onOpen, section } = props

	const dispatch = useDispatch()

	const exercises = useSelector((state: RootState) => state.globalState.currentExerciseForm)

	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)
	const [textError, setTextError] = useState('')

	const [answers, setAnswers] = useState<any>(INIT_ANSWER)

	useEffect(() => {
		if (!!visible && !!onOpen) {
			onOpen()
		}
	}, [visible])

	function onEnded() {
		setAnswers(INIT_ANSWER)
		form.resetFields()
		setVisible(false)
		setLoading(false)
	}

	// Call api update new section data
	async function postEditQuestion(param) {
		let temp = []
		exercises.forEach((element) => {
			if (!!element.Id) {
				if (element.Id == param.Id) {
					temp.push(param)
				} else {
					temp.push(element)
				}
			} else {
				if (element?.timestamp == param?.timestamp) {
					temp.push(param)
				} else {
					temp.push(element)
				}
			}
		})
		dispatch(setCurrentExerciseForm(temp))
		onEnded()
	}

	// Call api update new section data
	async function postCreateQuestion(param) {
		console.log('DATA_SUBMIT: ', param)
		let temp = []
		let count = 1
		exercises.forEach((element) => {
			temp.push(element)
			if (element.Enable !== false) {
				count++
			}
		})
		temp.push({ ...param, Index: count })
		dispatch(setCurrentExerciseForm(temp))
		onEnded()
	}

	// Assign current data to this form
	async function openEdit() {
		form.setFieldsValue({ ...defaultData })
		setAnswers(defaultData?.Answers)
		setVisible(true)
	}

	async function openCreate() {
		setVisible(true)
	}

	function onChangeAnswerCheck(params, fIndex) {
		if (params) {
			let temp = []
			answers.forEach((answer, index) => {
				if (fIndex == index) {
					temp.push({ ...answer, IsTrue: params })
				} else {
					temp.push({ ...answer, IsTrue: !params })
				}
			})
			setAnswers(temp)
		}
	}

	function _checkSubmit() {
		const contentChecker = form.getFieldValue('Content')
		if (!contentChecker) {
			return 'Vui lòng thêm nội dung câu hỏi'
		}
		if (answers.length == 0) {
			return 'Vui lòng thêm đáp án'
		}
		let flag = false
		answers.forEach((element) => {
			if (!!element.IsTrue && element.Enable !== false) {
				flag = true
			}
		})
		if (!flag) {
			return 'Vui lòng thêm ít nhất một đáp án đúng'
		}
		return ''
	}

	async function _submit(param) {
		setLoading(true)
		setTextError('')
		const checkSubmit = await _checkSubmit()
		if (!checkSubmit) {
			const DATA_SUBMIT = { ...param, Answers: answers }
			if (!!defaultData) {
				postEditQuestion({ ...defaultData, ...DATA_SUBMIT, AnswerUpdates: answers })
			} else {
				postCreateQuestion({ ...DATA_SUBMIT, Id: 0, timestamp: new Date().getTime() })
			}
		} else {
			setTextError(checkSubmit)
		}
	}

	function submitQuestion() {
		if (!form.getFieldValue('Point')) {
			const nodes = document.getElementById('input-point')
			!!nodes && nodes.focus()
		}
		form.submit()
	}

	return (
		<>
			{!isEdit && !isChangeInfo && (
				<PrimaryButton onClick={openCreate} icon="add" background="green" type="button">
					Thêm câu hỏi
				</PrimaryButton>
			)}

			{!!isEdit && (
				<div onClick={openEdit} className="cc-update-group-button">
					<FiEdit size={18} className="mr-2 mt-[-2px]" />
					Cập nhật
				</div>
			)}

			<Modal
				centered
				title={isEdit ? 'Cập nhật câu hỏi' : 'Thêm câu hỏi'}
				width={700}
				open={visible}
				onCancel={() => !loading && setVisible(false)}
				footer={
					<>
						<PrimaryButton disable={loading} onClick={() => setVisible(false)} background="red" icon="cancel" type="button">
							Huỷ
						</PrimaryButton>
						<PrimaryButton loading={loading} onClick={submitQuestion} className="ml-2" background="blue" icon="save" type="button">
							Lưu
						</PrimaryButton>
					</>
				}
			>
				<div className="grid grid-cols-12 gap-x-4">
					<Form form={form} onFinish={_submit} layout="vertical" className="col-span-12 grid grid-cols-12 gap-x-4">
						<Form.Item label="Điểm" name="Point" className="col-span-12" required rules={formRequired}>
							<NumericFormat
								id="input-point"
								onChange={(event) => form.setFieldValue('Point', event.target.value)}
								className="primary-input px-2 w-full"
								thousandSeparator
							/>
						</Form.Item>

						<Form.Item className="col-span-12" name="Content" label="Nội dung câu hỏi" required rules={formRequired}>
							<PrimaryEditor
								id={`quest-content-${new Date().getTime()}`}
								height={200}
								initialValue={defaultData?.Content || ''}
								onChange={(event) => form.setFieldValue('Content', event)}
							/>
						</Form.Item>
					</Form>

					{!!textError && <div className="col-span-12 text-danger mb-[10px]">{textError}</div>}

					{answers.map((answer, index) => {
						return (
							<>
								{answer?.Enable != false && (
									<div className="col-span-12 w800:col-span-4 mt-3 inline-flex items-center">
										<Checkbox
											checked={answer?.IsTrue}
											onChange={(event) => onChangeAnswerCheck(event.target.checked, index)}
											className="mr-3 h-[36px] custom-checkbox"
										/>

										<div className="h-[34px] flex-1 border-[1px] border-[#bebebe] rounded-[6px] px-[8px] flex items-center">
											{answer?.AnswerContent}
										</div>
									</div>
								)}
							</>
						)
					})}
				</div>
			</Modal>
		</>
	)
}

export default InputTrueFalse
