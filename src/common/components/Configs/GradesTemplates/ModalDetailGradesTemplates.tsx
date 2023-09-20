import { Form, Input, Modal } from 'antd'
import InputTextField from '../../FormControl/InputTextField'
import { useEffect, useState } from 'react'
import { gradesTemplatesApi } from '~/api/configs/score-broad-templates'
import PrimaryButton from '../../Primary/Button'
import { ShowNoti } from '~/common/utils'

function ModalDetailGradesTemplates(props) {
	const { isShow, onCancel, data, refreshDataTable } = props
	const [form] = Form.useForm()
	const [isLoading, setIsLoading] = useState(false)

	const handleFinishForm = (dataForm) => {
		setIsLoading(true)
		try {
			const editGradesTemplate = async () => {
				const res = await gradesTemplatesApi.put({
					...dataForm,
					Id: data?.Id
				})
				ShowNoti('success', res?.data?.message)
				onCancel()
				refreshDataTable()
			}
			editGradesTemplate()
		} catch (error) {
			ShowNoti('error', error?.message || '')
		}

		setIsLoading(false)
	}

	useEffect(() => {
		form.setFields([
			{
				name: 'Code',
				value: data?.Code || '',
				errors: []
			},
			{
				name: 'Name',
				value: data?.Name || '',
				errors: []
			}
		])
	}, [data, isShow])

	return (
		<Modal
			footer={null}
			title="Cập nhật bảng điểm"
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

export default ModalDetailGradesTemplates
