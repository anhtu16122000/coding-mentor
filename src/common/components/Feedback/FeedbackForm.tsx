import { Form, Input, Modal, Select, Spin, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { Edit } from 'react-feather'
import { useForm } from 'react-hook-form'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
import { feedbackApi } from '~/api/feedback'
import { roleApi } from '~/api/user'
// import { useWrap } from '~/src/context/wrap'
import { ShowNoti } from '~/common/utils'

const FeedbackForm = React.memo((props: any) => {
	const { Option } = Select
	const [isModalVisible, setIsModalVisible] = useState(false)
	const { feedbackId, reloadData, feedbackDetail, currentPage } = props
	const [form] = Form.useForm()
	const [useAllRoles, setUseAllRoles] = useState([])
	// const { showNoti, useAllRoles } = useWrap()
	const [loading, setLoading] = useState(false)
	const { setValue } = useForm()

	const getRoles = async () => {
		try {
			let res = await roleApi.getRole(0)
			// res.status == 200 && roleType == 0 ? setRoles(res.data.data) : setStaffRoles(res.data.data)
			if (res.status === 200) {
				// return res.data.data
				setUseAllRoles(res.data.data)
			}
		} catch (error) {
			console.log('Lỗi lấy thông tin roles: ', error)
			ShowNoti('error', error.message)
		}
	}

	useEffect(() => {
		getRoles()
	}, [])

	const onSubmit = async (data: any) => {
		setLoading(true)
		if (feedbackId) {
			try {
				let res = await feedbackApi.update({
					...data,
					Enable: true,
					ID: feedbackId
				})
				reloadData(currentPage)
				afterSubmit(res?.data.message)
			} catch (error) {
				ShowNoti('error', error.message)
				setLoading(false)
			}
		} else {
			try {
				let res = await feedbackApi.add({ ...data, Enable: true })
				afterSubmit(res?.data.message)
				reloadData(1)
				form.resetFields()
			} catch (error) {
				ShowNoti('error', error.message)
				setLoading(false)
			}
		}
	}

	const afterSubmit = (mes) => {
		ShowNoti('success', mes)
		setLoading(false)
		setIsModalVisible(false)
	}

	useEffect(() => {
		if (feedbackDetail) {
			form.setFieldsValue(feedbackDetail)
		}
	}, [isModalVisible])

	return (
		<>
			{feedbackId ? (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsModalVisible(true)
					}}
				>
					<Tooltip title="Cập nhật">
						<Edit />
					</Tooltip>
				</button>
			) : (
				<button
					className="btn btn-warning add-new"
					onClick={() => {
						setIsModalVisible(true)
					}}
				>
					<MdAddCircleOutline size={18} className="mr-2" />
					Thêm mới
				</button>
			)}

			<Modal
				title={<>{feedbackId ? 'Cập nhật loại phản hồi' : 'Tạo loại phản hồi'}</>}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								<Form.Item name="Role" label="Role" rules={[{ required: true, message: 'Vui lòng điền đủ thông tin!' }]}>
									<Select className="w-100 style-input" placeholder="Chọn role người tạo ...">
										{useAllRoles &&
											useAllRoles.map((row) => (
												<Option key={row.ID} value={row.ID}>
													{row.name}
												</Option>
											))}
									</Select>
								</Form.Item>
							</div>
						</div>
						{/*  */}
						<div className="row">
							<div className="col-12">
								<Form.Item name="Name" label="Loại phản hồi" rules={[{ required: true, message: 'Vui lòng điền đủ thông tin!' }]}>
									<Input
										placeholder="Nhập vào loại phản hồi..."
										className="style-input"
										onChange={(e) => setValue('Name', e.target.value)}
										allowClear={true}
									/>
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

export default FeedbackForm
