import { Form, Modal, Select } from 'antd'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { testAppointmentApi } from '~/api/learn/test-appointment'
import { ShowNoti } from '~/common/utils'
import { is, parseSelectArray, parseSelectArrayUser } from '~/common/utils/common'
import { RootState } from '~/store'
import DatePickerField from '../FormControl/DatePickerField'
import SelectField from '../FormControl/SelectField'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'
import * as yup from 'yup'
import { userInformationApi } from '~/api/user/user'
import ModalFooter from '../ModalFooter'
import { ieltsExamApi } from '~/api/IeltsExam'
import { formRequired } from '~/common/libs/others/form'

const StudentForm = (props) => {
	const { rowData, listExamination, setTodoApi, listTodoApi } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const state = useSelector((state: RootState) => state)
	const [form] = Form.useForm()

	const [listStudent, setListStudent] = useState([])
	const [listTeacher, setListTeacher] = useState([])

	const userInfo = useSelector((state: RootState) => state.user.information)

	let schema = yup.object().shape({
		BranchId: yup.string().required('Bạn không được để trống'),
		StudentId: yup.string().required('Bạn không được để trống')
	})

	const yupSync = {
		async validator({ field }, value) {
			await schema.validateSyncAt(field, { [field]: value })
		}
	}

	const branch = useMemo(() => {
		if (state.branch.Branch.length > 0) {
			return parseSelectArray(state.branch.Branch, 'Name', 'Id')
		}
	}, [state.branch])

	const getStudents = async (branchId) => {
		getTeachers(branchId)

		form.setFieldValue('StudentId', null)
		form.setFieldValue('TeacherId', null)

		if (!branchId) {
			setListStudent([])
			return
		}

		try {
			const res = await userInformationApi.getAvailableUser({ roleId: 3, branchId: branchId })
			if (res.status == 200) {
				setListStudent(parseSelectArrayUser(res.data.data, 'FullName', 'UserCode', 'UserInformationId'))
			} else {
				setListStudent([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getTeachers = async (branchId) => {
		if (!branchId) {
			setListTeacher([])
			return
		}

		try {
			const res = await userInformationApi.getAvailableUser({ roleId: 2, branchId: branchId })
			if (res.status == 200) {
				setListTeacher(parseSelectArrayUser(res.data.data, 'UserCode', 'FullName', 'UserInformationId'))
			} else {
				setListTeacher([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const onSubmit = async (data) => {
		setIsLoading(true)
		try {
			let DATA_SUBMIT = null
			if (rowData) {
				DATA_SUBMIT = { ...rowData, ...data, Time: moment(data.Time).format() }
			} else {
				DATA_SUBMIT = { ...data, Time: moment(data.Time).format() }
			}
			const res = await (rowData?.Id ? testAppointmentApi.update(DATA_SUBMIT) : testAppointmentApi.add(DATA_SUBMIT))
			if (res.status === 200) {
				setIsModalVisible(false)
				form.resetFields()
				ShowNoti('success', res.data.message)
				setTodoApi(listTodoApi)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	const handleCancel = () => {
		setIsModalVisible(false)
	}

	useEffect(() => {
		if (rowData) {
			form.setFieldsValue(rowData)
			form.setFieldsValue({ TeacherId: !!rowData?.TeacherId ? rowData.TeacherId : null })
			form.setFieldsValue({ ExamId: !!rowData?.ExamId ? rowData.ExamId : null })
			form.setFieldsValue({ Time: moment(rowData.Time) })
		} else {
			form.setFieldsValue({ Type: 1 })
		}
	}, [isModalVisible])

	function showEdit() {
		getStudents(rowData?.BranchId)
		getTeachers(rowData?.BranchId)
		setIsModalVisible(true)
	}

	const [testType, setTestType] = useState(1)

	const [exams, setExams] = useState([])
	const [examLoading, setExamLoading] = useState(false)

	async function getExams() {
		setExamLoading(true)
		try {
			const res = await ieltsExamApi.getOptions()
			if (res.status == 200) {
				setExams(res.data?.data)
			} else {
				setExams([])
			}
		} catch (error) {
		} finally {
			setExamLoading(false)
		}
	}

	useEffect(() => {
		if (isModalVisible && testType == 2 && exams.length == 0) {
			getExams()
		}
	}, [testType, isModalVisible])

	return (
		<>
			{!!rowData ? (
				<IconButton tooltip="Cập nhật" onClick={showEdit} color="yellow" type="button" icon="edit" />
			) : (
				<PrimaryButton background="green" icon="add" type="button" onClick={() => setIsModalVisible(true)}>
					Thêm mới
				</PrimaryButton>
			)}

			<Modal
				title="Phiếu thông tin cá nhân"
				open={isModalVisible}
				onCancel={handleCancel}
				footer={<ModalFooter onOK={form.submit} onCancel={handleCancel} loading={isLoading} />}
				width={600}
			>
				<Form form={form} layout="vertical" onFinish={onSubmit}>
					<div className="row">
						{!rowData && (
							<div className="col-md-6 col-12">
								<SelectField
									name="BranchId"
									label="Trung tâm"
									placeholder="Chọn trung tâm"
									optionList={branch}
									isRequired
									rules={[yupSync]}
									onChangeSelect={(e) => getStudents(e)}
								/>
							</div>
						)}

						<div className="col-md-6 col-12">
							<SelectField
								disabled={!!rowData}
								name="StudentId"
								label="Học viên"
								placeholder="Chọn học viên"
								optionList={listStudent}
								isRequired
								rules={[yupSync]}
							/>
						</div>

						<div className="col-md-6 col-12">
							<SelectField
								disabled={!is(userInfo).admin && !is(userInfo).manager}
								name="TeacherId"
								label="Giáo viên test"
								placeholder="Chọn giáo viên"
								optionList={listTeacher}
							/>
						</div>

						<div className="col-md-6 col-12">
							<SelectField
								name="Type"
								label="Địa điểm làm bài"
								placeholder="Chọn địa điểm làm bài"
								onChangeSelect={(e) => setTestType(e)}
								optionList={[
									{ title: 'Tại trung tâm', value: 1 },
									{ title: 'Làm bài trực tuyến', value: 2 }
								]}
							/>
						</div>

						<div className="col-md-6 col-12">
							<DatePickerField
								format="DD/MM/YYYY HH:mm"
								name="Time"
								label="Thời gian test"
								picker="showTime"
								showTime={'HH:mm'}
								mode="single"
							/>
						</div>

						{form.getFieldValue('Type') === 2 && (
							<Form.Item className="col-md-6 col-12" name="IeltsExamId" label="Đề" rules={formRequired}>
								<Select
									showSearch
									optionFilterProp="children"
									className="primary-input"
									loading={examLoading}
									disabled={examLoading}
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
						)}
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default StudentForm
