import { Modal, Form, Input } from 'antd'
import React, { FC, useState } from 'react'
import { formRequired } from '~/common/libs/others/form'
import { useDispatch } from 'react-redux'
import Router from 'next/router'
import { setCurrentPackage, setTotalPoint } from '~/store/globalState'
import { FiEdit } from 'react-icons/fi'
import ButtonAdd from '~/common/components/DirtyButton/Button-Add'
import ButtonCancel from '~/common/components/DirtyButton/Button-Cancel'
import ButtonSave from '~/common/components/DirtyButton/Button-Save'
import { postNewSection, putUpdateSection } from './section-utils'
import { decode } from '~/common/utils/super-functions'
import { getExamDetails } from '../exam-detail-utils'

const SectionForm: FC<ISectionForm> = (props) => {
	const { isEdit, defaultData, isChangeInfo, onOpen } = props

	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)

	const dispatch = useDispatch()

	// Get details of the exam from the exam id
	async function getDetail() {
		await getExamDetails((event) => {
			if (!!event) {
				dispatch(setCurrentPackage(event?.data))
				dispatch(setTotalPoint(event?.totalPoint))
			} else {
				dispatch(setCurrentPackage([]))
				dispatch(setTotalPoint(0))
			}
		})
	}

	//  Reset form state and close the modal
	function reset() {
		form.resetFields()
		getDetail()
		setVisible(false)
	}

	/**
	 * Call api create a new section
	 * @param params
	 */
	async function post(params) {
		await postNewSection(params, (event) => {
			if (event) reset()
			setLoading(false)
		})
	}

	/**
	 * Call api update a section
	 * @param params
	 */
	async function put(params) {
		await putUpdateSection(params, (event) => {
			if (event) reset()
			setLoading(false)
		})
	}

	/**
	 * Submit the form to create a new section or update a section
	 * @param values | all values of the form
	 */
	const onFinish = (values) => {
		setLoading(true)

		const DATA_SUBMIT = {
			...values
		}

		if (!isEdit && !isChangeInfo) {
			post({ ...DATA_SUBMIT, ExamId: parseInt(decode(Router.query?.exam + '')) })
		}

		if (!!isEdit || !!isChangeInfo) {
			put({ ...DATA_SUBMIT, Id: defaultData.Id })
		}
	}

	/**
	 * Function show create section button
	 * @returns boolean
	 */
	function showCreate() {
		if (!isEdit && !isChangeInfo) {
			return true
		}
		return false
	}

	/**
	 * Function show edit section button
	 * @returns boolean
	 */
	function showEdit() {
		if (!!isEdit) {
			return true
		}
		return false
	}

	// Open create modal and call callback function
	function openCreateModal() {
		!!onOpen && onOpen()
		setVisible(true)
	}

	// Open edit modal, set default values for sections form and call callback function
	function openEditModal() {
		!!onOpen && onOpen()
		form.setFieldsValue({ Name: defaultData.Name })
		form.setFieldsValue({ Explanations: defaultData.Explanations })
		setVisible(true)
	}

	return (
		<>
			{showCreate() && (
				<ButtonAdd onClick={openCreateModal} icon="inline">
					Thêm mới
				</ButtonAdd>
			)}

			{showEdit() && (
				<div
					onClick={openEditModal}
					className="p-2 w-full text-[#2666c7] rounded-[4px] inline-flex items-center font-[600] hover:bg-[rgba(0,0,0,0.08)] cursor-pointer active:!bg-[rgba(0,0,0,0.1)]"
				>
					<FiEdit size={18} className="mr-2 mt-[-2px]" />
					Cập nhật phần
				</div>
			)}

			<Modal
				centered
				title={isEdit ? 'Cập nhật phần' : 'Thêm phần'}
				width={500}
				open={visible}
				onCancel={() => !loading && setVisible(false)}
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
						<Form.Item className="col-span-4" label="Tên phần" name="Name" rules={formRequired}>
							<Input disabled={loading} className="primary-input" />
						</Form.Item>
						<Form.Item className="col-span-4" label="Ghi chú" name="Explanations">
							<Input.TextArea rows={7} disabled={loading} className="primary-input" />
						</Form.Item>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default SectionForm
