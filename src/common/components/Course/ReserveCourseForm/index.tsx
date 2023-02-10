import { DatePicker, Form, Input, Modal, Select, Spin, Tooltip } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import { Edit } from 'react-feather'
import { useForm } from 'react-hook-form'
import { MdSave } from 'react-icons/md'
import { courseReserveApi } from '~/api/course-reserve'
// import { useWrap } from '~/src/context/wrap'
import { ShowNoti } from '~/common/utils'

moment.locale('vn')

const ReserveCourseForm = React.memo((props: any) => {
	const { TextArea } = Input
	const { Option } = Select
	const [isModalVisible, setIsModalVisible] = useState(false)
	const { reloadData, infoDetail, currentPage } = props
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)
	const { setValue } = useForm()

	const onSubmit = async (data: any) => {
		setLoading(true)
		try {
			console.log('date check', data)
			let res = await courseReserveApi.add({
				...data,
				CourseOfStudentID: infoDetail.ID
			})
			afterSubmit(res?.data.message)
			reloadData(1)
			form.resetFields()
		} catch (error) {
			ShowNoti('error', error.message)
			setLoading(false)
		}
	}

	const afterSubmit = (mes) => {
		ShowNoti('success', mes)
		setLoading(false)
		setIsModalVisible(false)
	}

	return (
		<>
			<button
				className="btn btn-icon edit"
				onClick={() => {
					setIsModalVisible(true)
				}}
			>
				<Tooltip title="Bảo lưu khóa">
					<Edit />
				</Tooltip>
			</button>

			<Modal title="Bảo lưu khóa" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						{/*  */}
						<div className="row">
							<div className="col-12">
								<Form.Item label="Học viên" rules={[{ required: true, message: 'Vui lòng điền đủ thông tin!' }]}>
									<Input disabled={true} className="style-input" readOnly={true} defaultValue={infoDetail.FullNameUnicode} />
								</Form.Item>
							</div>
						</div>

						<div className="row">
							<div className="col-12">
								<Form.Item name="ExpirationDate" label="Hạn bảo lưu" rules={[{ required: true, message: 'Vui lòng điền đủ thông tin!' }]}>
									<DatePicker placeholder="Chọn ngày" className="style-input" onChange={(e) => setValue('ExpirationDate', e)} />
								</Form.Item>
							</div>
						</div>

						<div className="row">
							<div className="col-12">
								<Form.Item name="Note" label="Ghi chú">
									<TextArea onChange={(e) => setValue('Note', e.target.value)} />
								</Form.Item>
							</div>
						</div>

						<div className="row ">
							<div className="col-12">
								<button type="submit" className="btn btn-primary w-100">
									<MdSave size={18} className="mr-2" />
									Lưu
									{loading == true && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
})

export default ReserveCourseForm
