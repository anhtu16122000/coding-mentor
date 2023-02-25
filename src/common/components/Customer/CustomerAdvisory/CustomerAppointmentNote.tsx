import React, { useEffect, useState } from 'react'
import NestedTable from '~/common/components/Primary/Table/NestedTable'
import moment from 'moment'
import { Modal, Tooltip, Spin, Form } from 'antd'
import ReactHtmlParser from 'react-html-parser'
import { ShowNoti } from '~/common/utils'
import DeleteTableRow from '../../Elements/DeleteTableRow'
import TextBoxField from '../../FormControl/TextBoxField'
import { testAppointmentNoteApi } from '~/api/test-appointment-note'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import PrimaryTable from '../../Primary/Table'
import { MdAddCircleOutline } from 'react-icons/md'
import PrimaryButton from '../../Primary/Button'

const CustomerAppointmentNote = (props) => {
	const { dataRow } = props
	const [form] = Form.useForm()
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [dataSource, setDataSource] = useState<ITestCustomerNote[]>([])

	const handleDelete = async (id) => {
		try {
			const res = await testAppointmentNoteApi.deleteNote(id)
			if (res.status === 200) {
				setIsModalVisible(false)
				handleAllNoteAppointment()
				ShowNoti('success', res.data.message)
				return res
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const columns = [
		{
			width: 300,
			title: 'Ghi chú',
			dataIndex: 'Note',
			render: (text) => <div className="max-w-[300px]">{ReactHtmlParser(text)}</div>
		},
		{
			title: 'Tạo ngày',
			dataIndex: 'ModifiedOn',
			render: (date) => <p>{moment(date).format('DD/MM/YYYY HH:mm')}</p>
		},
		{
			title: 'Người tạo',
			dataIndex: 'ModifiedBy'
		},
		{
			title: 'Chức năng',
			render: (data) => <DeleteTableRow handleDelete={() => handleDelete(data?.Id)} />
		}
	]

	const handleAllNoteAppointment = async () => {
		try {
			const res = await testAppointmentNoteApi.getAll({ testAppointmentId: dataRow?.Id, pageSize: PAGE_SIZE })
			if (res.status === 200) {
				setDataSource(res.data.data)
			}
			if (res.status === 204) {
				setDataSource([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	useEffect(() => {
		if (dataRow?.Id) {
			handleAllNoteAppointment()
		}
	}, [])

	const addNote = async (data) => {
		let DATA_SUBMIT = { ...data, TestAppointmentId: dataRow?.Id }
		setIsLoading(true)
		try {
			const res = await testAppointmentNoteApi.addNote(DATA_SUBMIT)
			if (res.status === 200) {
				setIsModalVisible(false)
				form.resetFields()
				handleAllNoteAppointment()
				ShowNoti('success', res.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	const showModal = () => {
		setIsModalVisible(true)
	}

	const handleOk = () => {
		setIsModalVisible(false)
	}

	const handleCancel = () => {
		setIsModalVisible(false)
	}

	return (
		<div className="mt-[24px]">
			<Modal footer={null} title="Thêm ghi chú" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={1200} centered>
				<Form layout="vertical" form={form} onFinish={addNote}>
					<TextBoxField rows={16} name="Note" label="" />
					<div className="flex-all-center mt-3">
						{/* <button type="submit" className="btn btn-primary w-100">
							Lưu {isLoading && <Spin className="loading-base" />}
						</button> */}
						<PrimaryButton background="blue" icon="save" type="submit" disable={isLoading} loading={isLoading}>
							Lưu
						</PrimaryButton>
					</div>
				</Form>
			</Modal>
			<PrimaryTable
				TitleCard={
					<PrimaryButton
						onClick={() => {
							showModal()
						}}
						type="button"
						background="green"
						icon="add"
					>
						Thêm ghi chú
					</PrimaryButton>
				}
				className="w-[1176px]"
				data={dataSource}
				columns={columns}
			/>
		</div>
	)
}

export default CustomerAppointmentNote
