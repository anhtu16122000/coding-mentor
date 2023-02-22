import { Form, Input, Modal } from 'antd'
import React, { FC, useState } from 'react'
import RestApi from '~/api/RestApi'
import { ShowNostis } from '~/common/utils'
import PrimaryButton from '../Primary/Button'
import ModalFooter from '../ModalFooter'
import { formRequired } from '~/common/libs/others/form'

interface IModalConfigZooms {
	isEdit?: boolean
	onRefresh?: Function
	item?: any
	onOpen?: Function
}

const url = 'ZoomConfig'

const ModalConfigZoom: FC<IModalConfigZooms> = ({ isEdit, onRefresh, item }) => {
	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)

	function toggle() {
		setVisible(!visible)
	}

	function onFinish(params) {
		setLoading(true)

		const DATA_SUBMIT = {
			...params
		}

		console.log('-- DATA_SUBMIT', DATA_SUBMIT)

		post(DATA_SUBMIT)
	}

	async function post(params) {
		try {
			const response = await RestApi.post(url, params)
			if (response.status == 200) {
				ShowNostis.success('Thành công')
				!!onRefresh && onRefresh()
				setVisible(false)
				form.resetFields()
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	function submitForm() {
		form.submit()
	}

	return (
		<>
			<PrimaryButton background="green" icon="add" type="button" onClick={toggle}>
				Thêm mới
			</PrimaryButton>

			<Modal
				width={500}
				title="Thêm cấu hình Zoom"
				open={visible}
				onCancel={toggle}
				footer={<ModalFooter loading={loading} onCancel={toggle} onOK={submitForm} />}
			>
				<Form
					form={form}
					className="grid grid-cols-2 gap-x-4"
					layout="vertical"
					initialValues={{ remember: true }}
					onFinish={onFinish}
					autoComplete="on"
				>
					<Form.Item className="col-span-2" label="Tên" name="Name" rules={formRequired}>
						<Input disabled={loading} placeholder="Nhập tên" className="primary-input" />
					</Form.Item>

					<Form.Item className="col-span-2" label="AccountId" name="AccountId" rules={formRequired}>
						<Input disabled={loading} placeholder="Nhập AccountId" className="primary-input" />
					</Form.Item>

					<Form.Item className="col-span-2" label="ClientId" name="ClientId" rules={formRequired}>
						<Input disabled={loading} placeholder="Nhập ClientId" className="primary-input" />
					</Form.Item>

					<Form.Item className="col-span-2" label="ClientSecret" name="ClientSecret" rules={formRequired}>
						<Input disabled={loading} placeholder="Nhập ClientSecret" className="primary-input" />
					</Form.Item>

					<div className="col-12 mb-2">
						Cấu hình tài khoản Zoom
						<div
							style={{ color: 'blue', marginLeft: 4, display: 'inline-flex', textDecoration: 'underline', cursor: 'pointer' }}
							onClick={() => window.open('https://marketplace.zoom.us', '_blank')}
						>
							tại đây
						</div>
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default ModalConfigZoom
