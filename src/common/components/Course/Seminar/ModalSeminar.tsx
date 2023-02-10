import { Form, Modal } from 'antd'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { getPreviousDay } from '~/common/utils/common'
import DatePickerField from '../../FormControl/DatePickerField'
import InputNumber from '../../FormControl/InputNumberField'
import InputText from '../../FormControl/InputTextField'
import SelectField from '../../FormControl/SelectField'
import TextBoxField from '../../FormControl/TextBoxField'
import UploadImageField from '../../FormControl/UploadImageField'
import PrimaryButton from '../../Primary/Button'
import Lottie from 'react-lottie-player'

import deleteJson from '~/common/components/json/15120-delete.json'

type Props = {
	mode: 'add' | 'edit' | 'delete'
	item?: ISeminar
	onFetchData: Function
	onSubmit: Function
	selectOptions: { videoCourseList: Array<{ title: string; value: any }>; teacherList: Array<{ title: string; value: any }> }
	isLoading?: { type: string; status: boolean }
	onOpen?: Function
}

export default function ModalSeminar(props: Props) {
	const { mode, item, onFetchData, onSubmit, isLoading, selectOptions, onOpen } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoadingImage, setIsLoadingImage] = useState(false)

	const [form] = Form.useForm()

	const onOpenModal = () => {
		!!onOpen && onOpen()
		setIsModalVisible(true)
	}

	const onCloseModal = () => {
		setIsModalVisible(false)
	}

	useEffect(() => {
		if (item) {
			form.setFieldsValue({ Time: [moment(item?.StartTime), moment(item?.EndTime)] })
			form.setFieldsValue(item)
		}
	}, [isModalVisible])

	const _onFinish = (data) => {
		data.mode = mode
		if (data.mode == 'add' || data.mode == 'edit') {
			data.StartTime = data.Time[0]
			data.EndTime = data.Time[1]
		}
		if (item) {
			data.Id = item.Id
		}
		if (onSubmit) {
			onSubmit(data).then((res) => {
				if (!!res) {
					if (res.status == 200) {
						onCloseModal()
						form.resetFields()
						onFetchData && onFetchData()
					}
				}
			})
		}
	}

	const disabledDate = (current) => {
		const preDate = getPreviousDay(new Date())
		return current && current < moment(preDate)
	}

	return (
		<div>
			{mode == 'add' && (
				<PrimaryButton background="green" type="button" children={<span>Thêm mới</span>} icon="add" onClick={() => onOpenModal()} />
			)}

			{mode == 'edit' && (
				<PrimaryButton
					type="button"
					icon={'edit'}
					background="green"
					onClick={() => onOpenModal()}
					className="!w-[160px]"
					children={'Cập nhật'}
				/>
			)}

			{mode == 'delete' && (
				<PrimaryButton className="!w-[160px]" type="button" icon={'remove'} background="red" onClick={() => onOpenModal()}>
					Xóa Webinar
				</PrimaryButton>
			)}

			<Modal
				centered
				title={mode == 'add' ? 'Thêm Webinar' : mode == 'edit' ? 'Cập nhật Webinar' : 'Xóa Webinar'}
				visible={isModalVisible}
				onCancel={onCloseModal}
				footer={null}
				width={mode == 'delete' ? 440 : 800}
			>
				<Form form={form} layout="vertical" onFinish={_onFinish}>
					<div className="grid grid-flow-row antd-custom-wrap">
						{mode == 'delete' ? (
							<>
								<div className="grid-cols-1 flex flex-col items-center justify-center">
									<Lottie loop animationData={deleteJson} play className="w-[120px] mt-[-10px]" />
									<p className="text-center text-[16px] mt-3 mb-4">
										Bạn có chắc muốn xóa khóa học <span className="text-[red]">{item?.Name}</span>
									</p>
								</div>

								<div className="grid-cols-1 flex justify-center">
									<PrimaryButton background="red" type="submit" icon="remove" loading={isLoading.type == 'SUBMIT' && isLoading.status}>
										Xóa
									</PrimaryButton>
								</div>
							</>
						) : (
							<div className="antd-custom-wrap">
								<div className="grid-cols-1">
									<InputText
										label="Tên"
										isRequired={true}
										name="Name"
										placeholder="Nhập tên"
										rules={[{ required: true, message: 'Xin hãy nhập tên!' }]}
									/>
								</div>

								<div className="grid grid-flow-row grid-cols-2 gap-x-4">
									<InputNumber
										label="Số người tham gia"
										name="Member"
										isRequired={true}
										placeholder="Nhập số người"
										rules={[{ required: true, message: 'Không được bỏ trống' }]}
									/>

									<DatePickerField
										form={form}
										disabledDate={disabledDate}
										mode="range"
										isRequired={true}
										label="Thời gian"
										name="Time"
										placeholder="Chọn thời gian"
										format="DD/MM/YY, HH:mm"
										picker="showTime"
										rules={[{ required: true, message: 'Không được bỏ trống' }]}
									/>

									<SelectField
										label="Giảng viên"
										name="LeaderId"
										isRequired={true}
										optionList={selectOptions.teacherList}
										placeholder="Chọn giảng viên"
										rules={[{ required: true, message: 'Xin hãy chọn giảng viên!' }]}
									/>

									<SelectField
										label="Khóa học"
										name="VideoCourseId"
										optionList={selectOptions.videoCourseList}
										placeholder="Chọn khóa học"
									/>
								</div>

								<div className="grid-cols-1">
									<TextBoxField label="Mô tả" rows={4} name="Description" placeholder="Nhập mô tả" />
								</div>

								<div className="grid-cols-1">
									<UploadImageField label="Ảnh thu nhỏ" name="Thumbnail" form={form} setIsLoadingImage={setIsLoadingImage} />
								</div>

								<div className="grid-cols-1 flex justify-center mt-4">
									<PrimaryButton className="mr-2" onClick={onCloseModal} icon="cancel" type="button" background="red">
										Huỷ
									</PrimaryButton>
									<PrimaryButton
										background="blue"
										type="submit"
										disable={isLoadingImage}
										icon="save"
										loading={isLoading.type == 'SUBMIT' && isLoading.status}
									>
										Lưu
									</PrimaryButton>
								</div>
							</div>
						)}
					</div>
				</Form>
			</Modal>
		</div>
	)
}
