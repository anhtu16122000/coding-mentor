import { Button, Form, Modal, Select, Switch, Table } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import type { ColumnsType } from 'antd/es/table'
import { studentInClassApi } from '~/api/user/student-in-class'
import { ShowNoti } from '~/common/utils'
import SelectField from '../FormControl/SelectField'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'
import InputTextField from '~/common/components/FormControl/InputTextField'
import TextBoxField from '../FormControl/TextBoxField'
import styled from 'styled-components'

const SelcectClass = styled(Select)`
	width: 632px;
	@media (max-width: 700px) {
		width: 86.5vw;
	}
`

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
	const [classList, setClassList] = useState<any>([])
	const [checkedWarning, setCheckWarning] = useState(false)

	const onClose = () => {
		setVisible(false)
	}
	const onOpen = () => {
		if (mode === 'add') {
			getClass()
			getStudent(null)
		}
		setVisible(true)
	}

	const handleCheckedWarning = (val) => {
		setCheckWarning(val)
	}

	const getStudent = async (classId?: number) => {
		try {
			setLoadingStudent(true)
			const res = await studentInClassApi.getStudentAvailable(router?.query?.class, classId)
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

	const handleSelectedClass = (value) => {
		form.setFieldValue('StudentIds', [])
		getStudent(value)
	}

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
				width={mode != 'delete' ? (mode === 'add' ? 700 : 500) : 400}
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
											<div
												style={{
													marginBottom: 15
												}}
											>
												<div style={{ marginBottom: 10, fontWeight: '600' }}>Lớp học</div>
												<SelcectClass allowClear placeholder="Chọn lớp học" onChange={handleSelectedClass} options={classList} />
											</div>
											<div
												className="col-span-2"
												style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
											>
												<SelectField
													mode="multiple"
													label="Học viên"
													name="StudentIds"
													maxTagCount={2}
													isLoading={loadingStudent}
													optionList={student}
													placeholder="Chọn học viên"
													isRequired
													style={{
														width: '100%',
														marginRight: 10,
														maxWidth: 515
													}}
													rules={[{ required: true, message: 'Bạn không được để trống' }]}
												/>
												<Button
													disabled={student.length < 1}
													onClick={() => {
														const ids = student.map((_item) => _item.value)
														form.setFieldValue('StudentIds', ids)
													}}
													style={{
														height: 35,
														marginBottom: -5
													}}
													type="primary"
												>
													Chọn tất cả
												</Button>
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
