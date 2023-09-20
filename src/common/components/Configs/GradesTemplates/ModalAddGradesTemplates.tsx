import { Form, Input, Modal } from 'antd'
import InputTextField from '../../FormControl/InputTextField'
import { useEffect, useState } from 'react'
import { gradesTemplatesApi } from '~/api/configs/score-broad-templates'
import PrimaryButton from '../../Primary/Button'
import { ShowNoti } from '~/common/utils'

function ModalAddGradesTemplates(props) {
	const { isShow, onCancel, refreshDataTable } = props
	const [form] = Form.useForm()
	const [isLoading, setIsLoading] = useState(false)

	const handleFinishForm = async (dataForm) => {
		setIsLoading(true)
		try {
			const res = await gradesTemplatesApi.post(dataForm)
			if (res.status == 200) {
				ShowNoti('success', res?.data?.message || '')
				refreshDataTable()
				onCancel()
			}
		} catch (error) {
			ShowNoti('error', error?.message || '')
		}

		setIsLoading(false)
	}

	useEffect(() => {
		form.setFields([
			{
				name: 'Code',
				value: '',
				errors: []
			},
			{
				name: 'Name',
				value: '',
				errors: []
			}
		])
	}, [isShow])

	return (
		<Modal
			footer={null}
			title="Tạo bảng điểm"
			open={isShow}
			onOk={() => {
				form.submit()
			}}
			onCancel={onCancel}
			width={600}
		>
			<Form onFinish={handleFinishForm} form={form} layout="vertical">
				<div className="row">
					<div className="col-12">
						<Form.Item
							name="Code"
							label="Mã"
							rules={[
								{
									required: true,
									message: 'Vui lòng nhập mã'
								}
							]}
						>
							<Input placeholder="Nhập mã" className="primary-input" />
						</Form.Item>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<Form.Item
							name="Name"
							label="Tên bảng điểm"
							rules={[
								{
									required: true,
									message: 'Vui lòng nhập tên bảng điểm'
								}
							]}
						>
							<Input placeholder="Nhập tên bảng điểm" className="primary-input" />
						</Form.Item>
					</div>
				</div>
				<div className="row">
					<div className="col-12 flex-all-center">
						<PrimaryButton icon="save" type="submit" background="blue" disable={isLoading} loading={isLoading}>
							Lưu
						</PrimaryButton>
					</div>
				</div>
			</Form>
		</Modal>
	)
}

export default ModalAddGradesTemplates
