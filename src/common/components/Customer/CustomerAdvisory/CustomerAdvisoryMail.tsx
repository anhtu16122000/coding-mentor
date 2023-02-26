import React, { useState } from 'react'
import { Modal, Form, Spin, Tooltip } from 'antd'
import InputTextField from '~/common/components/FormControl/InputTextField'
import { customerAdviseApi } from '~/api/customer'
import { SendOutlined } from '@ant-design/icons'
import { ShowNoti } from '~/common/utils'
import EditorField from '../../FormControl/EditorField'
import { FiSend } from 'react-icons/fi'
import IconButton from '../../Primary/IconButton'
import Head from 'next/head'
import appConfigs from '~/appConfig'

const StudentAdvisoryMail = (props) => {
	const { dataRow, listTodoApi, setTodoApi } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [form] = Form.useForm()
	const showModal = () => {
		setIsModalVisible(true)
	}

	const handleCancel = () => {
		setIsModalVisible(false)
	}

	const onSubmit = async (data: any) => {
		setIsLoading(true)
		const DATA_SUBMIT = {
			...data,
			Ids: dataRow?.Id.toString()
		}
		try {
			let res = await customerAdviseApi.sendEmail(DATA_SUBMIT)
			if (res.status === 200) {
				setIsModalVisible(false)
				form.resetFields()
				setTodoApi(listTodoApi)
				ShowNoti('success', 'Gửi email thành công')
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div>
			<Head>
				<title>{appConfigs.appName} | Danh sách khách hàng</title>
			</Head>

			<IconButton onClick={showModal} icon="send" type="button" color="blue" tooltip="Gửi thông báo cá nhân" />

			<Modal footer={null} title={'Gửi mail'} visible={isModalVisible} onCancel={handleCancel} width={1400} centered>
				<Form form={form} layout="vertical" onFinish={onSubmit}>
					<div className="row">
						<div className="col-12">
							<InputTextField name="Title" label="Tiêu đề" placeholder="" />
						</div>
						{dataRow && (
							<div className="col-12">
								<EditorField
									id={dataRow?.Id}
									height={420}
									name="Content"
									label="Nội dung"
									placeholder=""
									onChangeEditor={(value) => form.setFieldsValue({ Content: value })}
								/>
							</div>
						)}

						<div className="col-12">
							<button type="submit" className="btn btn-primary w-100">
								<FiSend size={18} className="mr-2" />
								Gửi
								{isLoading && <Spin className="loading-base" />}
							</button>
						</div>
					</div>
				</Form>
			</Modal>
		</div>
	)
}

export default StudentAdvisoryMail
