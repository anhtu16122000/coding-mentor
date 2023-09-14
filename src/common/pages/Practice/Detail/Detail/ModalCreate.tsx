import React, { useEffect, useState } from 'react'
import { Form, Modal, Select } from 'antd'
import { ShowNostis } from '~/common/utils'
import { formRequired } from '~/common/libs/others/form'
import { ieltsExamApi } from '~/api/IeltsExam'
import { FaEdit } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { PrimaryTooltip } from '~/common/components'
import PrimaryButton from '~/common/components/Primary/Button'
import ModalFooter from '~/common/components/ModalFooter'
import InputTextField from '~/common/components/FormControl/InputTextField'
import { trainingRouteDetailApi } from '~/api/practice/TrainingRouteDetail'

const ModalCreateTrainingRouteDetail = (props) => {
	const { onRefresh, isEdit, defaultData, TrainingRouteFormId, TrainingRouteId } = props

	const [form] = Form.useForm()

	const [visible, setVisible] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)

	const user = useSelector((state: RootState) => state.user.information)

	async function postCreate(params) {
		try {
			const res = await trainingRouteDetailApi.post(params)
			if (res.status == 200) {
				ShowNostis.success('Thành công')
				!!onRefresh && onRefresh()
				setVisible(false)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

	async function putUpdate(params) {
		try {
			const res = await trainingRouteDetailApi.put(params)
			if (res.status == 200) {
				ShowNostis.success('Thành công')
				!!onRefresh && onRefresh()
				setVisible(false)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

	function toggle() {
		setVisible(!visible)
	}

	// SUBMI FORM
	const handleSubmit = async (data: any) => {
		setLoading(true)

		const dataSubmit = {
			Name: data?.Skill, // Cái này Đặng nó lỡ bắt, thêm dô cho nó đỡ sửa
			...defaultData,
			...data,
			TrainingRouteId: TrainingRouteId,
			TrainingRouteFormId: TrainingRouteFormId
		}

		await (!isEdit ? postCreate(dataSubmit) : putUpdate(dataSubmit))

		setLoading(false)
	}

	const [exams, setExams] = useState([])

	async function getExams() {
		try {
			const res = await ieltsExamApi.getOptions()
			if (res.status == 200) {
				setExams(res.data?.data)
			} else {
				setExams([])
			}
		} catch (error) {}
	}

	useEffect(() => {
		if (visible && exams.length == 0) {
			getExams()
		}
	}, [visible])

	async function openEdit() {
		await form.setFieldsValue({ ...defaultData })

		toggle()

		await getExams()
	}

	return (
		<>
			{(user?.RoleId == 1 || user?.RoleId == 2) && (
				<>
					{isEdit ? (
						<PrimaryTooltip place="left" id={`hw-take-${defaultData?.Id}`} content="Cập nhật">
							<div onClick={openEdit} className="w-[28px] text-[#FFBA0A] h-[30px] all-center hover:opacity-70 cursor-pointer">
								<FaEdit size={20} />
							</div>
						</PrimaryTooltip>
					) : (
						<PrimaryButton icon="add" type="button" onClick={toggle} background="green">
							Thêm mới
						</PrimaryButton>
					)}
				</>
			)}

			<Modal
				title={isEdit ? 'Cập nhật bài tập' : 'Thêm bài tập'}
				open={visible}
				width={500}
				onCancel={toggle}
				footer={<ModalFooter loading={loading} onCancel={toggle} onOK={form.submit} />}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={handleSubmit}>
						<InputTextField isRequired name="Skill" label="Tên kỹ năng" rules={formRequired} />

						<Form.Item name="ExamId" label="Đề" rules={formRequired}>
							<Select
								showSearch
								optionFilterProp="children"
								className="primary-input"
								loading={loading}
								disabled={loading}
								placeholder="Chọn đề"
							>
								{exams.map((item) => {
									return (
										<Select.Option key={item.Id} value={item.Id}>
											[{item?.Code}] - {item?.Name}
										</Select.Option>
									)
								})}
							</Select>
						</Form.Item>

						<Form.Item name="Level" label="Level" rules={formRequired}>
							<Select
								showSearch
								optionFilterProp="children"
								className="primary-input"
								loading={loading}
								disabled={loading}
								placeholder="Chọn level"
							>
								{[
									{ id: 0, name: 'Basic' },
									{ id: 1, name: 'Advance' },
									{ id: 2, name: 'Master' }
								].map((item) => {
									return (
										<Select.Option key={item.id} value={item.id}>
											{item?.name}
										</Select.Option>
									)
								})}
							</Select>
						</Form.Item>

						{/* {!isTeacher() && (
							<Form.Item name="TeacherId" label="GV chấm bài" rules={formRequired}>
								<Select
									showSearch
									optionFilterProp="children"
									className="primary-input"
									loading={loading}
									disabled={loading}
									placeholder="Chọn đề"
								>
									{teachers.map((item) => {
										return (
											<Select.Option key={item.Id} value={item.Id}>
												[{item?.TeacherCode}] - {item?.TeacherName}
											</Select.Option>
										)
									})}
								</Select>
							</Form.Item>
						)} */}
					</Form>
				</div>
			</Modal>
		</>
	)
}

export default ModalCreateTrainingRouteDetail
