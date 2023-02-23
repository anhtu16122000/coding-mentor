import { Form, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import InputNumberField from '~/common/components/FormControl/InputNumberField'
import TextBoxField from '~/common/components/FormControl/TextBoxField'
import SelectField from '~/common/components/FormControl/SelectField'
import PrimaryButton from '~/common/components/Primary/Button'
import IconButton from '~/common/components/Primary/IconButton'
import { ShowNoti } from '~/common/utils'
import { salaryConfigApi } from '~/api/salary'
import { tutoringFeeApi } from '~/api/tutoring-fee'

type IModalSalary = {
	mode: 'add' | 'edit' | 'delete'
	dataRow?: any
	onRefresh?: Function
}

export const ModalSalaryTutoringConfigCRUD: React.FC<IModalSalary> = ({ mode, dataRow, onRefresh }) => {
	const [visible, setVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [form] = Form.useForm()
	const [user, setUser] = useState<{ title: string; value: string }[]>([])
	const getTeachers = async () => {
		try {
			const response = await tutoringFeeApi.getTeacherAvailable()
			if (response.status === 200) {
				let temp = []
				response?.data?.data?.forEach((item) => {
					temp.push({ title: `${item?.TeacherName} - ${item?.TeacherCode}`, value: item?.TeacherId })
				})
				setUser(temp)
			}
			if (response.status === 204) {
				setUser([])
			}
		} catch (error) {
			console.error(error)
		} finally {
		}
	}
	const onClose = () => {
		setVisible(false)
	}
	const onOpen = () => {
		if (mode !== 'delete') {
			getTeachers()
		}
		setVisible(true)
	}

	const handleRemove = async (Id) => {
		try {
			setIsLoading(true)
			const res = await tutoringFeeApi.delete(Id)
			if (res.status === 200) {
				onClose()
				onRefresh()
				setIsLoading(false)
				form.resetFields()
				ShowNoti('success', res.data.message)
				getTeachers()
			}
		} catch (error) {
			setIsLoading(true)
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	const handleUpdate = async (data) => {
		try {
			setIsLoading(true)
			const res = await tutoringFeeApi.add(data)
			if (res.status === 200) {
				onClose()
				onRefresh()
				setIsLoading(false)
				form.resetFields()
				ShowNoti('success', res.data.message)
			}
		} catch (error) {
			setIsLoading(true)
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}
	const handleCreateSalary = async (data) => {
		try {
			setIsLoading(true)
			const res = await tutoringFeeApi.add(data)
			if (res.status === 200) {
				onClose()
				onRefresh()
				setIsLoading(false)
				form.resetFields()
				ShowNoti('success', res.data.message)
				getTeachers()
			}
		} catch (error) {
			setIsLoading(true)
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	const _onSubmit = (data) => {
		if (typeof data.Value == 'string') {
			data.Value = Number(data.Value.replace(/\$\s?|(,*)/g, ''))
		}
		if (mode !== 'add') {
			data.Id = dataRow?.Id
		}
		if (mode === 'add') {
			handleCreateSalary(data)
		}
		if (mode === 'edit') {
			data.TeacherId = dataRow?.TeacherId
			handleUpdate(data)
		}
		if (mode === 'delete') {
			handleRemove(data.Id)
		}
	}

	useEffect(() => {
		if (dataRow) {
			form.setFieldsValue(dataRow)
		}
	}, [dataRow])

	return (
		<>
			{mode == 'add' && (
				<PrimaryButton
					background="green"
					type="button"
					children={<span>Tạo mới</span>}
					icon="add"
					onClick={() => {
						onOpen()
					}}
				/>
			)}
			{mode == 'edit' && (
				<>
					<div
						className="flex items-center cursor-pointer"
						onClick={() => {
							onOpen()
						}}
					>
						<IconButton type="button" icon={'edit'} color="yellow" className="Sửa" tooltip="Sửa" />
					</div>
				</>
			)}
			{mode == 'delete' && (
				<>
					<div
						className="flex items-center cursor-pointer"
						onClick={() => {
							onOpen()
						}}
					>
						<IconButton type="button" icon={'remove'} color="red" className="" tooltip="Xóa" />
					</div>
				</>
			)}
			<Modal
				title={mode === 'add' ? 'Thêm lương nhân viên' : mode === 'edit' ? 'Cập nhật lương nhân viên' : 'Xác nhận xóa'}
				open={visible}
				onCancel={onClose}
				footer={
					<>
						<PrimaryButton onClick={() => onClose()} background="red" icon="cancel" type="button">
							Huỷ
						</PrimaryButton>
						<PrimaryButton
							loading={isLoading}
							onClick={() => form.submit()}
							className="ml-2"
							background="blue"
							icon={mode !== 'delete' ? 'save' : 'remove'}
							type="button"
							children={mode !== 'delete' ? 'Lưu' : 'Xóa'}
						/>
					</>
				}
				width={mode != 'delete' ? 500 : 400}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={_onSubmit}>
						<div className="grid grid-cols-2 gap-x-4 antd-custom-wrap">
							{mode == 'delete' && (
								<div className="col-span-2 mb-4 text-center text-[16px]">
									<p>Bạn có chắc muốn xóa?</p>
								</div>
							)}
							{mode != 'delete' && (
								<>
									{mode === 'add' && (
										<div className="col-span-2">
											<SelectField
												// form={form}
												label="Giáo viên"
												name="TeacherId"
												optionList={user}
												placeholder="Chọn giáo viên"
												isRequired
												rules={[{ required: true, message: 'Bạn không được để trống' }]}
											/>
										</div>
									)}
									<div className="col-span-2">
										<InputNumberField
											name="Fee"
											label="Mức lương"
											placeholder="Nhập mức lương"
											isRequired
											rules={[{ required: true, message: 'Bạn không được để trống' }]}
										/>
									</div>
									<div className="col-span-2">
										<TextBoxField name="Note" label="Ghi chú" />
									</div>
								</>
							)}
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}
