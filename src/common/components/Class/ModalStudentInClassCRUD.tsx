import { Form, Modal, Select, Switch } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { studentInClassApi } from '~/api/user/student-in-class'
import { ShowNoti } from '~/common/utils'
import SelectField from '../FormControl/SelectField'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'
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
	const [students, setStudents] = useState([])
	const [classList, setClassList] = useState<any>([])
	const [checkedWarning, setCheckWarning] = useState(false)

	const onClose = () => {
		setVisible(false)
	}
	const onOpen = () => {
		if (mode === 'add') {
			getClass()
			getStudents()
		}
		setVisible(true)
	}

	const handleCheckedWarning = (val) => {
		setCheckWarning(val)
	}

	const getStudents = async () => {
		try {
			setLoadingStudent(true)
			const res = await studentInClassApi.getStudentAvailableV2(router?.query?.class)
			if (res.status == 200) {
				setStudents(res.data.data)
			} else {
				setStudents([])
			}
		} catch (error) {
			console.log(error)
		} finally {
			setLoadingStudent(false)
		}
	}

	const getClass = async () => {
		try {
			const res = await studentInClassApi.getAllClass()
			if (res.status === 200) {
				let temp = []
				res?.data?.data?.forEach((item) => {
					temp.push({ label: item?.Name, value: item?.Id })
				})
				setClassList(temp)
			}
			if (res.status == 204) {
				setClassList([])
			}
		} catch (error) {
			console.log(error)
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
		console.log('--- Submit data: ', data)

		try {
			setIsLoading(true)
			const res = await studentInClassApi.adds(data)
			if (res.status == 200) {
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
				width={mode != 'delete' ? (mode === 'add' ? 500 : 500) : 400}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={_onSubmit}>
						<div className="grid grid-cols-2 gap-x-4">
							{mode == 'delete' && (
								<div className="col-span-2 mb-4 text-center text-[16px]">
									<p>Bạn có chắc muốn xóa?</p>
								</div>
							)}

							{mode !== 'delete' && (
								<>
									{mode === 'add' && (
										<>
											<Form.Item
												className="col-span-2"
												name="StudentIds"
												label="Chọn học viên"
												rules={[{ required: true, message: 'Vui lòng chọn học viên' }]}
											>
												<Select className="primary-input" mode="multiple" maxTagCount={2} allowClear showSearch placeholder="Chọn học viên">
													{students?.map((item: any) => {
														return (
															<Select.Option value={item?.UserInformationId} label={item?.UserInformationId} key={item?.UserInformationId}>
																<div className="selected-option">{item?.FullName}</div>
																<div className="select-option-propdown">
																	<div className="ml-[8px]">
																		<div className="font-[500]">
																			{item?.FullName} - {item?.UserCode}
																		</div>
																		<div>Lớp hiện tại: {item?.CurrentClassName ? item?.CurrentClassName : 'Chưa có lớp'}</div>
																	</div>
																</div>
															</Select.Option>
														)
													})}
												</Select>
											</Form.Item>

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
