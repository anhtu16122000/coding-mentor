import { Form, Modal } from 'antd'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { testAppointmentApi } from '~/api/test-appointment'
import { ShowNoti } from '~/common/utils'
import { parseSelectArray } from '~/common/utils/common'
import { RootState } from '~/store'
import DatePickerField from '../FormControl/DatePickerField'
import SelectField from '../FormControl/SelectField'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'
import * as yup from 'yup'

const StudentForm = (props) => {
	const { rowData, listStudent, listTeacher, listExamination, setTodoApi, listTodoApi } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const state = useSelector((state: RootState) => state)
	const [form] = Form.useForm()
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
	return (
		<>
			{!!rowData ? (
				<IconButton
					tooltip="Cập nhật lịch hẹn test"
					onClick={() => {
						setIsModalVisible(true)
					}}
					color="yellow"
					type="button"
					icon="edit"
				/>
			) : (
				<PrimaryButton background="green" icon="add" type="button" onClick={() => setIsModalVisible(true)}>
					Thêm mới
				</PrimaryButton>
			)}

			<Modal title="Phiếu thông tin cá nhân" open={isModalVisible} onCancel={handleCancel} footer={null} width={600}>
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
								/>
							</div>
						)}
						<div className={rowData ? 'col-12' : 'col-md-6 col-12'}>
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
					</div>
					<div className="row">
						<div className="col-md-6 col-12">
							<SelectField name="TeacherId" label="Giáo viên test" placeholder="Chọn giáo viên" optionList={listTeacher} />
						</div>
						<div className="col-md-6 col-12">
							<SelectField
								name="Type"
								disabled
								label="Địa điểm làm bài"
								placeholder="Chọn địa điểm làm bài"
								optionList={[
									{ title: 'Tại trung tâm', value: 1 },
									{ title: 'Làm bài trực tuyến', value: 2 }
								]}
							/>
						</div>
					</div>
					<div className="row">
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
							<div className="col-md-6 col-12">
								<SelectField name="ExamId" label="Đề test" placeholder="Chọn đề test" optionList={listExamination} />
							</div>
						)}
					</div>
					<div className="flex-all-center">
						<PrimaryButton background="blue" icon="save" type="submit" disable={isLoading} loading={isLoading}>
							Lưu
						</PrimaryButton>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default StudentForm
