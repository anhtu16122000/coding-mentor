import React, { useEffect, useState } from 'react'
import { Modal, Form, Divider } from 'antd'
import { customerStatusApi } from '~/api/configs/customer-status'
import { ShowNoti } from '~/common/utils'
import * as yup from 'yup'
import InputTextField from '~/common/components/FormControl/InputTextField'
import IconButton from '../Primary/IconButton'
import PrimaryButton from '../Primary/Button'
import { BsCheck } from 'react-icons/bs'
import ModalFooter from '../ModalFooter'

const colorCategories = ['#1565C0', '#1E88E5', '#009688', '#E53935', '#E91E63', '#8E24AA', '#5E35B1', '#43A047', '#FBC02D', '#F4511E']

const ConsultationStatusForm = React.memo((props: any) => {
	const { infoDetail, getDataConsultationStatus } = props

	const [form] = Form.useForm()

	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	let schema = yup.object().shape({
		Name: yup.string().required('Bạn không được để trống')
	})

	const yupSync = {
		async validator({ field }, value) {
			await schema.validateSyncAt(field, { [field]: value })
		}
	}

	const onSubmit = async (data: any) => {
		setIsLoading(true)
		try {
			let DATA_SUBMIT = null

			if (infoDetail?.Id) {
				DATA_SUBMIT = { ...data, ID: infoDetail?.Id, ColorCode: selectedColor }
			} else {
				DATA_SUBMIT = { ...data, ColorCode: selectedColor }
			}

			const res = await (infoDetail?.Id ? customerStatusApi.update(DATA_SUBMIT) : customerStatusApi.add(DATA_SUBMIT))
			if (res.status == 200) {
				getDataConsultationStatus(1)
				form.resetFields()
				setIsModalVisible(false)
				ShowNoti('success', res.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		if (infoDetail) {
			form.setFieldsValue(infoDetail)
			setSelectedColor(infoDetail?.ColorCode)
			setText(infoDetail?.Name)
		}
	}, [isModalVisible])

	// ----------------------------------------------------------------

	const [text, setText] = useState('')
	const [selectedColor, setSelectedColor] = useState('#1565C0')

	return (
		<>
			{infoDetail?.Id ? (
				<IconButton type="button" tooltip="Cập nhật" icon="edit" onClick={() => setIsModalVisible(true)} color="yellow" />
			) : (
				<PrimaryButton type="button" onClick={() => setIsModalVisible(true)} icon="add" background="green">
					Thêm mới
				</PrimaryButton>
			)}

			<Modal
				title={infoDetail ? 'Cập nhật' : 'Thêm trạng thái tư vấn'}
				open={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={<ModalFooter onCancel={() => setIsModalVisible(false)} loading={isLoading} onOK={form.submit} okText="Lưu trạng thái" />}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="col-12">
							<InputTextField
								disabled={infoDetail?.Type != 2 && infoDetail?.Id}
								placeholder="Ví dụ: khách mới, ưu tiên..."
								name="Name"
								label="Trạng thái tư vấn"
								isRequired
								rules={[yupSync]}
								onChange={(e) => setText(e.target.value)}
							/>

							{infoDetail?.Type != 2 && infoDetail?.Id && (
								<div className="text-[#e21f1f] text-[16px] mb-[8px] mt-[-8px]">Không thể đổi tên trạng thái mặc định</div>
							)}

							<div className="flex justify-start items-center pb-[8px] pt-[4px]">
								<div className="mr-[8px] text-[14px] font-[500]">Kết quả:</div>
								<div
									className="px-[8px] py-[2px] rounded-[4px] in-1-line font-[500]"
									style={{ background: selectedColor, color: selectedColor == '#FBC02D' ? '#000' : '#fff' }}
								>
									{text || 'Trạng thái'}
								</div>
							</div>

							<Divider>Chọn màu</Divider>

							<div className="mb-[8px] grid grid-cols-5 gap-[8px] cursor-pointer none-selection">
								{colorCategories.map((item) => {
									return (
										<div
											onClick={() => setSelectedColor(item)}
											className="h-[32px] rounded-[4px] hover:opacity-90 flex items-center justify-center"
											style={{ background: item, color: item == '#FBC02D' ? '#000' : '#fff' }}
										>
											{item == selectedColor && <BsCheck size={28} />}
										</div>
									)
								})}
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
})

export default ConsultationStatusForm
