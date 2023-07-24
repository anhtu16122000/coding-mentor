import { Form, Input, Modal, Select, Spin, Switch } from 'antd'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
import { roleApi } from '~/api/user/user'
import EditorField from '~/common/components/FormControl/EditorField'
import InputTextField from '~/common/components/FormControl/InputTextField'
import SelectField from '~/common/components/FormControl/SelectField'
// import { useWrap } from '~/src/context/wrap'
import { ShowNoti } from '~/common/utils'

const NotificationForm = React.memo((props: any) => {
	const { Option } = Select

	const [isModalVisible, setIsModalVisible] = useState(false)
	const [useAllRoles, setUseAllRoles] = useState([])
	const [form] = Form.useForm()

	// const { useAllRoles, useStaffRoles } = useWrap()

	const [sendMail, setSendMail] = useState(false)

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

	const onChange = () => {
		setSendMail(!sendMail)
	}

	const {
		register,
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors, isSubmitted }
	} = useForm()
	// const { showNoti } = useWrap();

	const onSubmit = handleSubmit((data: any) => {
		data.IsSendMail = sendMail

		console.log('Data submit: ', data)

		let res = props._onSubmit(data)
		res.then(function (rs: any) {
			rs && rs.status == 200 && setIsModalVisible(false), form.resetFields()
		})
	})

	const changeContractContent = (value) => {
		// console.log(value);
		setValue('NotificationContent', value)
	}

	useEffect(() => {
		if (isModalVisible) {
			if (props.rowData) {
				Object.keys(props.rowData).forEach(function (key) {
					setValue(key, props.rowData[key])
				})
			}
		}
	}, [isModalVisible])

	console.log('useAllRoles: ', useAllRoles)

	return (
		<>
			<button
				className="btn btn-warning add-new"
				onClick={() => {
					setIsModalVisible(true)
				}}
			>
				<MdAddCircleOutline size={18} className="mr-2" />
				Thêm mới
			</button>

			{/*  */}
			<Modal width={'40%'} title="Tạo thông báo" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
				<div className="container-fluid antd-custom-wrap">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						{/*  */}
						<div className="row">
							<div className="col-8">
								<InputTextField label="Tên thông báo" name="Tên thông báo" placeholder="Tên thông báo" />
							</div>
							<div className="col-4">
								<Form.Item label="Send email">
									<Switch onChange={onChange} checked={sendMail} />
								</Form.Item>
							</div>
						</div>
						{/*  */}
						<div className="row">
							<div className="col-6">
								<SelectField
									label="Trung tâm"
									name="LeaderId"
									isRequired={true}
									optionList={[{ value: 1, title: 'Trung tâm' }]}
									placeholder="Chọn trung tâm"
									rules={[{ required: true, message: 'Xin hãy chọn trung tâm!' }]}
								/>
								{/* <Form.Item label="Trung tâm" name="Trung tâm" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
									<SelectField
										mode="multiple"
										style={{ width: '100%' }}
										className="style-input multiple-select"
										optionLabelProp="label"
										onChange={(value) => setValue('BranchID', value.toString())}
										allowClear={true}
									>
										<Option value={0} label="Tất cả">
											<div className="demo-option-label-item">Tất cả</div>
										</Option>
										{props.dataBranch &&
											props.dataBranch.map((item) => (
												<Option value={item.ID} label={item.BranchName} key={item.ID}>
													<div className="demo-option-label-item">{item.BranchName}</div>
												</Option>
											))}
									</SelectField>
								</Form.Item> */}
							</div>
							<div className="col-6">
								{/* <Form.Item label="Người nhận" name="Người nhận" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
									<Select
										mode="multiple"
										style={{ width: '100%' }}
										optionLabelProp="label"
										className="style-input multiple-select"
										onChange={(value) => setValue('RoleID', value.toString())}
										allowClear={true}
									>
										<Option value={0} label="Tất cả">
											<div className="demo-option-label-item">Tất cả</div>
										</Option>
										{useAllRoles !== null &&
											useAllRoles.map((item) => (
												<Option key={item.ID} value={item.ID} label={item.name}>
													<div className="demo-option-label-item">{item.name}</div>
												</Option>
											))}
									</Select>
								</Form.Item> */}
								<SelectField
									label="Người nhận"
									name="LeaderId"
									isRequired={true}
									optionList={[{ value: 1, title: 'Người nhận' }]}
									placeholder="Chọn người nhận"
									rules={[{ required: true, message: 'Xin hãy chọn người nhận!' }]}
								/>
							</div>
						</div>
						{/*  */}
						{/* <Form.Item label="Nội dung thông báo"> */}
						<div className="textarea-editor">
							{/* <EditorBase handleChangeDataEditor={changeContractContent} /> */}
							<EditorField label="Nội dung thông báo" onChangeEditor={changeContractContent} name="Noti" />
						</div>
						{/* </Form.Item> */}
						<div className="row ">
							<div className="col-12">
								<button type="submit" className="btn btn-primary w-100">
									<MdSave size={18} className="mr-2" />
									Lưu
									{props.isLoading.type == 'ADD_DATA' && props.isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
})

export default NotificationForm
