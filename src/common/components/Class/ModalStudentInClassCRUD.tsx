import { Form, Modal, Switch } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { studentInClassApi } from '~/api/student-in-class'
import { ShowNoti } from '~/common/utils'
import SelectField from '../FormControl/SelectField'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'
import InputTextField from '~/common/components/FormControl/InputTextField'
import TextBoxField from '../FormControl/TextBoxField'

type IModalStudentInClass = {
	mode: 'add' | 'edit' | 'delete'
	dataRow?: any
	onRefresh?: Function
}
export const ModalStudentInClassCRUD: React.FC<IModalStudentInClass> = ({ dataRow, onRefresh, mode }) => {
	const [visible, setVisible] = useState(false)
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [loadingStudent, setLoadingStudent] = useState(false)
	const [form] = Form.useForm()
	const [student, setStudent] = useState<{ title: string; value: string }[]>([])
	const [checkedWarning, setCheckWarning] = useState(false)

	const onClose = () => {
		setVisible(false)
	}
	const onOpen = () => {
		if (mode === 'add') {
			getStudent()
		}
		setVisible(true)
	}

	const handleCheckedWarning = (val) => {
		setCheckWarning(val)
	}

	const getStudent = async () => {
		try {
			setLoadingStudent(true)
			const res = await studentInClassApi.getStudentAvailable(router?.query?.class)
			if (res.status === 200) {
				let temp = []
				res?.data?.data?.forEach((item) => {
					temp.push({ title: `${item?.FullName} - ${item?.UserCode}`, value: item?.UserInformationId })
				})
				setStudent(temp)
				setLoadingStudent(false)
			}
			if (res.status == 204) {
				setStudent([])
			}
		} catch (error) {
			console.log(error)
			setLoadingStudent(true)
		} finally {
			setLoadingStudent(false)
		}
	}

	const handleRemove = async (Id) => {
		try {
			setIsLoading(true)
			const res = await studentInClassApi.delete(Id)
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

	const handleUpdate = async (data) => {
		try {
			setIsLoading(true)
			const res = await studentInClassApi.update(data)
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

	const handleCreate = async (data) => {
		try {
			setIsLoading(true)
			const res = await studentInClassApi.add(data)
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

	const _onSubmit = (data) => {
		if (mode !== 'add') {
			data.Id = dataRow?.Id
		}

		if (mode === 'edit') {
			handleUpdate(data)
		}

		if (mode === 'add') {
			const dataSubmit = {
				ClassId: Number(router?.query?.class),
				...data
			}
			handleCreate(dataSubmit)
		}

		if (mode === 'delete') {
			handleRemove(data.Id)
		}
	}

	useEffect(() => {
		if (dataRow) {
			form.setFieldsValue(dataRow)
			setCheckWarning(dataRow?.Warning)
		}
	}, [dataRow])

	return (
		<>
			{mode == 'add' && (
				<PrimaryButton
					background="green"
					type="button"
					children={<span>Thêm học viên</span>}
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
				title={mode === 'add' ? 'Thêm học viên' : mode == 'edit' ? 'Cập nhật học viên' : 'Xác nhận xóa'}
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

							{mode !== 'delete' && (
								<>
									{mode === 'add' && (
										<>
											<div className="col-span-2">
												<SelectField
													label="Học viên"
													name="StudentId"
													isLoading={loadingStudent}
													optionList={student}
													placeholder="Chọn học viên"
													isRequired
													rules={[{ required: true, message: 'Bạn không được để trống' }]}
												/>
											</div>

											<div className="col-span-2">
												<SelectField
													label="Loại"
													name="Type"
													optionList={[
														{ title: 'Chính thức', value: 1 },
														{ title: 'Học thử', value: 2 }
													]}
													placeholder="Chọn loại"
													isRequired
													rules={[{ required: true, message: 'Bạn không được để trống' }]}
												/>
											</div>
										</>
									)}

									{mode === 'edit' && (
										<>
											<Form.Item name="Warning" label="Cảnh báo" className="custom-form-row-warning">
												<Switch checked={checkedWarning} onChange={handleCheckedWarning} />
											</Form.Item>
										</>
									)}

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
