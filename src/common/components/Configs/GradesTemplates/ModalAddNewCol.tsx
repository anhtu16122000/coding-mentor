import { Form, Input, Modal, Select } from 'antd'
import InputTextField from '../../FormControl/InputTextField'
import { useEffect, useState } from 'react'
import { gradesTemplatesApi } from '~/api/configs/score-broad-templates'
import PrimaryButton from '../../Primary/Button'
import { ShowNoti } from '~/common/utils'
import { gradesColTemplatesApi } from '~/api/configs/score-column-templates'
import { scoreColumnApi } from '~/api/configs/score-column'

function ModalAddNewCol(props) {
	const { isShow, onCancel, dataTemplates, handleRefresh, classId, isClass } = props
	const [form] = Form.useForm()
	const [isLoading, setIsLoading] = useState(false)
	const type = Form.useWatch('Type', form)

	const handleFinishForm = async (dataForm) => {
		setIsLoading(true)
		try {
			let res
			if (isClass) {
				res = await scoreColumnApi.post({
					...dataForm,
					ClassId: classId
				})
			} else {
				res = await gradesColTemplatesApi.post({
					...dataForm,
					ScoreBoardTemplateId: dataTemplates?.Id
				})
			}

			if (res?.status === 200) {
				handleRefresh()
				ShowNoti('success', res?.data?.message)
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
				name: 'Type',
				value: null,
				errors: []
			},
			{
				name: 'Name',
				value: '',
				errors: []
			},
			{
				name: 'Factor',
				value: '',
				errors: []
			}
		])
	}, [isShow])

	return (
		<Modal
			footer={null}
			title="Thêm cột"
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
							name="Type"
							label="Loại"
							rules={[
								{
									required: true,
									message: 'Vui lòng chọn loại'
								}
							]}
						>
							<Select
								className="primary-input"
								placeholder="Chọn loại cột"
								options={[
									{ value: '1', label: 'Điểm' },
									{ value: '3', label: 'Nhận xét' }
								]}
							/>
						</Form.Item>
					</div>
				</div>
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
				{type === '1' && ( // loại = điểm
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

export default ModalAddNewCol
