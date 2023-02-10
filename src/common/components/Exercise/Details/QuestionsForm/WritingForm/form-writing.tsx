/**
 * Form create new writing question
 * Created by https://ischau.org
 */
import { Modal, Form, Input, Checkbox } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PrimaryButton from '~/common/components/Primary/Button'
import { setCurrentExerciseForm } from '~/store/globalState'
import { FiEdit } from 'react-icons/fi'
import { RootState } from '~/store'
import { X } from 'react-feather'
import { formNoneRequired, formRequired } from '~/common/libs/others/form'
import { NumericFormat } from 'react-number-format'
import PrimaryEditor from '~/common/components/Editor'
import { removeChoiceAnswer } from '../utils'

const FormWriting: FC<IGroupForm> = (props) => {
	const { isEdit, defaultData, isChangeInfo, onOpen, section, isWriting } = props

	const dispatch = useDispatch()

	const exercises = useSelector((state: RootState) => state.globalState.currentExerciseForm)

	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)
	const [answers, setAnswers] = useState([])
	const [textError, setTextError] = useState('')

	useEffect(() => {
		if (!!visible && !!onOpen) {
			onOpen()
		}
	}, [visible])

	function onEnded() {
		setAnswers([])
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

	function _checkSubmit() {
		const contentChecker = form.getFieldValue('Content')
		if (!contentChecker) {
			return 'Vui lòng thêm nội dung câu hỏi'
		}
		return ''
	}

	async function _submit(param) {
		console.log('-- submit param: ', { ...param, AnswerCreates: [] })

		setLoading(true)
		setTextError('')

		const checkSubmit = await _checkSubmit()

		if (checkSubmit) {
			setTextError(checkSubmit)
			return null
		}

		const DATA_SUBMIT = { ...param, Answers: answers }
		if (!!defaultData) {
			postEditQuestion({ ...defaultData, ...DATA_SUBMIT, AnswerUpdates: answers })
		} else {
			postCreateQuestion({ ...DATA_SUBMIT, Id: 0, timestamp: new Date().getTime() })
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
				<div className="grid grid-cols-4 gap-x-4">
					<Form form={form} onFinish={_submit} layout="vertical" className="col-span-4 grid grid-cols-4 gap-x-4">
						<Form.Item className="col-span-4" name="Content" label="Nội dung câu hỏi" required rules={formRequired}>
							<PrimaryEditor
								id={`quest-content-${new Date().getTime()}`}
								height={200}
								initialValue={defaultData?.Content || ''}
								onChange={(event) => form.setFieldValue('Content', event)}
							/>
						</Form.Item>

						<Form.Item className="col-span-4" name="DescribeAnswer" label="Đáp án mẫu" rules={formNoneRequired}>
							<PrimaryEditor
								id={`quest-desc-${new Date().getTime()}`}
								height={160}
								initialValue={defaultData?.DescribeAnswer || ''}
								onChange={(event) => form.setFieldValue('DescribeAnswer', event)}
							/>
						</Form.Item>
					</Form>
				</div>
			</Modal>
		</>
	)
}

export default FormWriting
