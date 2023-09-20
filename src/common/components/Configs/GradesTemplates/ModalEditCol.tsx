import { Form, Input, Modal, Select } from 'antd'
import InputTextField from '../../FormControl/InputTextField'
import { useEffect, useState } from 'react'
import { gradesTemplatesApi } from '~/api/configs/score-broad-templates'
import PrimaryButton from '../../Primary/Button'
import { ShowNoti } from '~/common/utils'
import { gradesColTemplatesApi } from '~/api/configs/score-column-templates'

function ModalEditCol(props) {
	const { isShow, onCancel, data, handleRefresh } = props
	const [form] = Form.useForm()
	const [isLoading, setIsLoading] = useState(false)

	const handleFinishForm = async (dataForm) => {
		setIsLoading(true)
		try {
			const res = await gradesColTemplatesApi.put({
				ScoreBoardTemplateId: data?.ScoreBoardTemplateId,
				Index: data?.Index,
				Id: data?.Id,
				...dataForm
			})
			if (res?.status === 200) {
				ShowNoti('success', res?.data?.message)
				handleRefresh()
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
				name: 'Name',
				value: data?.Name,
				errors: []
			},
			{
				name: 'Factor',
				value: data?.Factor,
				errors: []
			}
		])
	}, [isShow])

	return (
		<Modal
			footer={null}
			title="Sửa cột"
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
							name="Name"
							label="Tên cột"
							rules={[
								{
									required: true,
									message: 'Vui lòng nhập tên cột'
								}
							]}
						>
							<Input placeholder="Nhập tên cột" className="primary-input" />
						</Form.Item>
					</div>
				</div>
				{Number(data?.Type) === 1 && ( // loại = điểm
					<div className="row">
						<div className="col-12">
							<Form.Item
								name="Factor"
								label="Hệ số"
								rules={[
									{
										required: true,
										message: 'Vui lòng nhập hệ số'
									}
								]}
							>
								<Input type="number" placeholder="Nhập hệ số" className="primary-input" />
							</Form.Item>
						</div>
					</div>
				)}
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

export default ModalEditCol
