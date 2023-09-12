import React, { useEffect, useState } from 'react'
import PrimaryButton from '../../Primary/Button'
import { DatePicker, Form, Input, Modal, Select } from 'antd'
import { ShowNostis } from '~/common/utils'
import ModalFooter from '../../ModalFooter'
import { useRouter } from 'next/router'
import InputTextField from '../../FormControl/InputTextField'
import { formRequired } from '~/common/libs/others/form'
import moment from 'moment'
import { ieltsExamApi } from '~/api/IeltsExam'
import { homeWorkApi } from '~/api/home-work'
import PrimaryTooltip from '../../PrimaryTooltip'
import { FaEdit } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

const ModalCreateHomeWork = (props) => {
	const { onRefresh, isEdit, defaultData } = props

	const [form] = Form.useForm()

	const [visible, setVisible] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)

	const user = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return user?.RoleId == 1
	}

	function isTeacher() {
		return user?.RoleId == 2
	}

	async function postCreate(params) {
		try {
			const res = await homeWorkApi.post(params)
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
			const res = await homeWorkApi.put(params)
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
		if (teachers.length == 0) {
			getTeacher()
		}
	}

	const router = useRouter()

	// SUBMI FORM
	const handleSubmit = async (data: any) => {
		setLoading(true)

		const ClassId = router.query?.class || null

		if (!ClassId) {
			ShowNostis.error('Không tìm thấy lớp học')
			return
		}

		const dataSubmit = {
			ClassId: ClassId,
			...defaultData,
			...data,
			FromDate: new Date(data?.FromDate).toISOString(),
			ToDate: new Date(data?.ToDate).toISOString(),
			TeacherId: isTeacher() ? user?.UserInformationId : data?.TeacherId || null
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
		await form.setFieldsValue({
			...defaultData,
			FormDate: moment(new Date(defaultData?.FromDate)).format('DD/MM/YYYY'),
			ToDate: new Date(defaultData?.ToDate)
		})

		toggle()
		await getExams()
	}

	const [teachers, setTeachers] = useState([])

	async function getTeacher() {
		try {
			const res = await homeWorkApi.getTeacher()
			if (res.status == 200) {
				setTeachers(res.data?.data)
			}
		} catch (error) {
			ShowNostis.error('')
		}
	}

	return (
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

			<Modal
				title={isEdit ? 'Cập nhật bài tập' : 'Thêm bài tập'}
				open={visible}
				width={500}
				onCancel={toggle}
				footer={<ModalFooter loading={loading} onCancel={toggle} onOK={form.submit} />}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={handleSubmit}>
						<InputTextField isRequired name="Name" label="Tên bài tập" rules={formRequired} />

						<Form.Item name="IeltsExamId" label="Đề" rules={formRequired}>
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

						{!isTeacher() && (
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
						)}

						<div className="grid grid-cols-2 gap-x-4">
							<Form.Item valuePropName={'date'} className="col-span-1" name="FromDate" label="Bắt đầu" rules={formRequired}>
								<DatePicker
									defaultValue={!defaultData?.FromDate ? null : moment(new Date(defaultData?.FromDate))}
									placeholder="Chọn ngày"
									className="style-input"
									format="DD/MM/YYYY"
								/>
							</Form.Item>

							<Form.Item valuePropName={'date'} className="col-span-1" name="ToDate" label="Kết thúc" rules={formRequired}>
								<DatePicker
									defaultValue={!defaultData?.ToDate ? null : moment(new Date(defaultData?.ToDate))}
									placeholder="Chọn ngày"
									className="style-input"
									format="DD/MM/YYYY"
								/>
							</Form.Item>
						</div>

						<Form.Item name="Note" label="Ghi chú">
							<Input.TextArea rows={4} placeholder="" disabled={loading} />
						</Form.Item>
					</Form>
				</div>
			</Modal>
		</>
	)
}

export default ModalCreateHomeWork
