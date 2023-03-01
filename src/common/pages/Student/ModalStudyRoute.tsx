import { Form, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { studyRouteApi } from '~/api/study-route'
import { programApi } from '~/api/program'
import PrimaryButton from '~/common/components/Primary/Button'
import IconButton from '~/common/components/Primary/IconButton'
import { ShowNoti } from '~/common/utils'
import SelectField from '~/common/components/FormControl/SelectField'
import TextBoxField from '~/common/components/FormControl/TextBoxField'
import { useRouter } from 'next/router'
type IModalStudyRoute = {
	mode: 'add' | 'edit' | 'delete'
	onRefresh?: Function
	dataRow?: any
}
export const ModalStudyRoute: React.FC<IModalStudyRoute> = ({ mode, onRefresh, dataRow }) => {
	const status = [
		{ title: 'Chưa học', value: 1 },
		{ title: 'Đang học', value: 2 },
		{ title: 'Hoàn thành', value: 3 }
	]
	const router = useRouter()
	const [visible, setVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [form] = Form.useForm()
	const [program, setProgram] = useState<{ title: string; value: string }[]>([])

	const getProgram = async () => {
		try {
			const res = await programApi.getAll({ pageSize: 9999, pageIndex: 1 })
			if (res.status === 200) {
				let temp = []
				res?.data?.data?.forEach((item) => {
					temp.push({ title: item?.Name, value: item?.Id })
				})
				setProgram(temp)
			}
			if (res.status === 204) {
				setProgram([])
			}
		} catch (error) {
			console.log(error)
		}
	}

	const onClose = () => {
		setVisible(false)
	}
	const onOpen = () => {
		if (mode !== 'delete') {
			getProgram()
		}
		setVisible(true)
	}

	const handleRemove = async (Id) => {
		try {
			setIsLoading(true)
			const res = await studyRouteApi.delete(Id)
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
			const res = await studyRouteApi.update(data)
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
			const res = await studyRouteApi.add(data)
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
		if (mode != 'add') {
			data.Id = dataRow?.Id
		}

		if (mode === 'add') {
			const dataSubmit = {
				StudentId: router?.query?.StudentID,
				...data
			}
			handleCreate(dataSubmit)
		}
		if (mode == 'edit') {
			const dataSubmit = {
				StudentId: router?.query?.StudentID,
				...data
			}
			handleUpdate(dataSubmit)
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
					children={<span>Thêm mới</span>}
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
				title={mode === 'add' ? 'Thêm lộ trình' : mode === 'edit' ? 'Cập nhật lộ trình' : 'Xác nhận xóa'}
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
									<div className="col-span-2">
										<SelectField
											// form={form}
											label="Khóa học"
											name="ProgramId"
											optionList={program}
											placeholder="Chọn chương trình"
											// rules={[{ required: true, message: 'Bạn không được để trống' }]}
										/>
									</div>
									{mode == 'edit' && (
										<div className="col-span-2">
											<SelectField
												// form={form}
												label="Trạng thái"
												name="Status"
												optionList={status}
												placeholder="Chọn trạng thái"
												// rules={[{ required: true, message: 'Bạn không được để trống' }]}
											/>
										</div>
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
