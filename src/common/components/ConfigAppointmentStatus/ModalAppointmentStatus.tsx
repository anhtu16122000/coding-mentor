import { Form, Modal, Tooltip } from 'antd'
import React, { useState, useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Edit, Trash, Trash2 } from 'react-feather'
// import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import InputTextField from '../FormControl/InputTextField'
import { configAppointmentStatusApi } from '~/api/config-appointment-status'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'
import { IoMdTrash } from 'react-icons/io'
// import { useWrap } from '~/src/context/wrap'
import { ShowNoti } from '~/common/utils'

export interface IModalAppointmentStatusProps {
	mode: string
	dataRow?: { Id: number; Name: string }
	onFetchData: Function
}

export default function ModalAppointmentStatus(props: IModalAppointmentStatusProps) {
	const { mode, dataRow, onFetchData } = props
	const [visible, setVisible] = useState(false)
	visible && console.log('🚀 ~ file: ModalAppointmentStatus.tsx ~ line 19 ~ ModalAppointmentStatus ~ dataRow', dataRow)
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	// const { showNoti } = useWrap()

	const handleCancel = () => {
		setVisible(false)
	}
	const handleOpen = () => {
		setVisible(true)
	}

	// const schema = yup.object().shape({
	// 	Name: yup.string().nullable()
	// })
	// const defaultValuesInit = {
	// 	Name: ''
	// }
	// const form = useForm({
	// 	defaultValues: defaultValuesInit,
	// 	resolver: yupResolver(schema),
	// 	mode: 'onChange'
	// })

	const [form] = Form.useForm()

	useEffect(() => {
		if (dataRow) {
			// form.resetFields({Name: dataRow.Name})
			form.resetFields()
		}
	}, [dataRow])

	const _onSubmit = async (data) => {
		setIsLoading({ type: 'SUBMIT', status: true })
		try {
			let res = null
			if (mode == 'add') {
				res = await configAppointmentStatusApi.add({ Name: data.Name })
			}
			if (mode == 'edit') {
				res = await configAppointmentStatusApi.update({ Name: data.Name, Id: dataRow.Id })
			}
			if (mode == 'delete') {
				res = await configAppointmentStatusApi.delete(dataRow.Id)
			}
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				handleCancel()
				onFetchData && onFetchData()
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'SUBMIT', status: false })
		}
	}

	return (
		<div>
			{mode === 'add' && (
				<button className="btn btn-warning add-new" onClick={handleOpen}>
					<MdAddCircleOutline size={18} className="mr-2" />
					Thêm trạng thái
				</button>
			)}
			{mode === 'edit' && (
				<Tooltip title="Sửa trạng thái">
					<button className="btn btn-icon edit" onClick={handleOpen}>
						<Edit />
					</button>
				</Tooltip>
			)}
			{mode === 'delete' && (
				<Tooltip title="Xóa trạng thái">
					<button className="btn btn-icon delete" onClick={handleOpen}>
						<Trash />
					</button>
				</Tooltip>
			)}
			<Modal
				title={mode == 'add' ? 'Thêm trạng thái' : mode == 'edit' ? 'Sửa trạng thái' : 'Xóa trạng thái'}
				visible={visible}
				onCancel={handleCancel}
				footer={null}
			>
				<Form form={form} onFinish={_onSubmit} layout="vertical">
					<div className="row">
						{mode == 'delete' && (
							<>
								<div className="col-12">
									<p className="text-base mb-4">Bạn có chắc muốn xóa trạng thái này?</p>
								</div>
								<div className="col-12">
									<button className="btn btn-cancel w-100" type="submit" disabled={isLoading.type == 'ADD_DATA' && isLoading.status}>
										<IoMdTrash size={18} className="mr-2" />
										Xóa
									</button>
								</div>
							</>
						)}
						{(mode == 'add' || mode == 'edit') && (
							<>
								<div className="col-12">
									<InputTextField placeholder="Nhập tên trạng thái" name="Name" label="Tên trạng thái" />
								</div>
								<div className="col-12">
									<button className="btn btn-primary w-100" type="submit" disabled={isLoading.type == 'SUBMIT' && isLoading.status}>
										{mode == 'add' ? (
											<>
												<MdSave size={18} className="mr-2" />
												Thêm
											</>
										) : (
											<>
												<MdSave size={18} className="mr-2" />
												Sửa
											</>
										)}
									</button>
								</div>
							</>
						)}
					</div>
				</Form>
			</Modal>
		</div>
	)
}
