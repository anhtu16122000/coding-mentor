import { DatePicker, Form, Input, Modal, Spin, Tooltip } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import { Edit } from 'react-feather'
import { useForm } from 'react-hook-form'
import { MdSave } from 'react-icons/md'
// import { useWrap } from '~/src/context/wrap'
import { ShowNoti } from '~/common/utils'

moment.locale('vn')

const UpdateStudentReserveDate = React.memo((props: any) => {
	const { TextArea } = Input
	const [isModalVisible, setIsModalVisible] = useState(false)
	const { reloadData, infoDetail, onUpdateStudentReserveDate } = props
	const [form] = Form.useForm()
	// const { showNoti } = useWrap()
	const [loading, setLoading] = useState(false)
	const { setValue } = useForm()

	const onSubmit = async (data: any) => {
		setLoading(true)
		try {
			data = { ...data, ID: infoDetail.ID }
			console.log('data', data)
			let res = await onUpdateStudentReserveDate(data)
			reloadData(1)
			form.resetFields()
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
			setIsModalVisible(false)
		}
	}

	return (
		<>
			<button
				className="btn btn-icon edit"
				onClick={() => {
					setIsModalVisible(true)
				}}
			>
				<Tooltip title="Cập nhật hạn bảo lưu">
					<Edit />
				</Tooltip>
			</button>

			<Modal title="Cập nhật hạn bảo lưu" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
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
									<DatePicker
										placeholder="Chọn ngày"
										className="style-input"
										onChange={(e) => setValue('ExpirationDate', e)}
										defaultValue={moment(infoDetail.ExpirationDate, 'YYYY-MM-DD')}
									/>
								</Form.Item>
							</div>
						</div>

						<div className="row ">
							<div className="col-12">
								<button type="submit" className="btn btn-primary w-100">
									<MdSave size={18} className="mr-2" />
									Cập nhật
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

export default UpdateStudentReserveDate
