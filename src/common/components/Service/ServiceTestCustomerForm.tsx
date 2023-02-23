import { Form, Input, Modal, Select, Spin, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { Edit } from 'react-feather'
import { MdSave } from 'react-icons/md'
import DatePickerField from '~/common/components/FormControl/DatePickerField'
import SelectField from '~/common/components/FormControl/SelectField'
import TextBoxField from '~/common/components/FormControl/TextBoxField'
import TimePickerField from '~/common/components/FormControl/TimePickerField'

const ServiceTestCustomerForm = (props) => {
	const [isModalVisible, setIsModalVisible] = useState(false)
	const { isLoading, rowID, _onSubmit, getIndex, index, rowData, listData, dataTeacher } = props

	const [form] = Form.useForm()

	// SUBMI FORM
	const onSubmit = (data: any) => {
		let res = _onSubmit(data)

		res.then(function (rs: any) {
			rs && rs.status == 200 && (setIsModalVisible(false), form.resetFields())
		})
	}

	useEffect(() => {
		if (isModalVisible) {
			if (rowData) {
				rowData.ExamTopicID = null
				if (rowData.TeacherID == 0) {
					rowData.TeacherID = null
				}

				form.resetFields()
			}
		}
	}, [isModalVisible])

	return (
		<>
			<Tooltip title="Cập nhật lịch hẹn test">
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsModalVisible(true)
						getIndex(index)
					}}
				>
					<Edit size={20} />
				</button>
			</Tooltip>

			<Modal title="Thông tin hẹn test" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
				<div className="wrap-form">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						{/*  */}
						<div className="row">
							<div className="col-md-6 col-12">
								<SelectField disabled={true} name="UserInformationID" label="Học viên" optionList={listData.Student} />
							</div>
							<div className="col-md-6 col-12">
								<SelectField name="BranchID" label="Trung tâm" optionList={listData.Branch} />
							</div>
						</div>
						{/*  */}
						<div className="row">
							<div className="col-md-6 col-12">
								<DatePickerField mode="single" name="AppointmentDate" label="Ngày hẹn" />
							</div>
							<div className="col-md-6 col-12">
								<TimePickerField form={form} name="Time" label="Giờ hẹn" />
							</div>
						</div>
						{/*  */}

						<div className="row">
							<div className="col-12">
								<SelectField name="TeacherID" label="Giáo viên chấm bài" optionList={listData.Teacher} />
							</div>
						</div>
						<div className="row mb-5">
							<div className="col-12">
								<TextBoxField rows={3} name="Note" label="Ghi chú" />
							</div>
						</div>
						{/*  */}
						<div className="row">
							<div className="col-12 mt-3">
								<button type="submit" className="btn btn-primary w-100">
									<MdSave size={18} className="mr-2" />
									Lưu
									{isLoading?.type == 'ADD_DATA' && isLoading?.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}

export default ServiceTestCustomerForm
