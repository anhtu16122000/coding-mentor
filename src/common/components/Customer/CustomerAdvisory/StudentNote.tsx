import React, { useEffect, useState } from 'react'
import NestedTable from '~/common/components/Primary/Table/NestedTable'
import moment from 'moment'
import { Modal, Tooltip, Form } from 'antd'
import { customerAdviseApi } from '~/api/customer'
import ReactHtmlParser from 'react-html-parser'
import { ShowNoti, log } from '~/common/utils'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import DeleteTableRow from '../../Elements/DeleteTableRow'
import TextBoxField from '../../FormControl/TextBoxField'
import ModalFooter from '../../ModalFooter'

const StudentNote = (props: { studentId: any }) => {
	const { studentId } = props

	const listTodoApi = {
		studentId: studentId,
		pageSize: PAGE_SIZE,
		pageIndex: 1
	}

	const [form] = Form.useForm()
	const [todoApi, setTodoApi] = useState(listTodoApi)
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState([])

	useEffect(() => {
		if (studentId) {
			handleGetNotes()
		}
	}, [todoApi, studentId])

	const handleDelete = async (id) => {
		try {
			const res = await customerAdviseApi.deleteStudentNote(id)
			if (res.status == 200) {
				setIsModalVisible(false)
				setTodoApi(listTodoApi)
				ShowNoti('success', res.data.message)
				return res
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const columns = [
		{
			width: 550,
			title: 'Ghi chú',
			dataIndex: 'Note',
			render: (text) => <p>{ReactHtmlParser(text)}</p>
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

	const handleGetNotes = async () => {
		try {
			const res = await customerAdviseApi.getStudentNotes(todoApi)
			if (res.status == 200) {
				setData(res.data.data)
			} else {
				setData([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const addNote = async (data) => {
		let DATA_SUBMIT = { ...data, studentId: studentId }
		setLoading(true)
		try {
			const res = await customerAdviseApi.addStudentNote(DATA_SUBMIT)
			if (res.status === 200) {
				setIsModalVisible(false)
				form.resetFields()
				handleGetNotes()
				setTodoApi(listTodoApi)
				ShowNoti('success', res.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setLoading(false)
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
		<div className="mt-2">
			<Tooltip title="Thêm ghi chú">
				<button className="btn btn-warning" onClick={showModal}>
					Thêm ghi chú
				</button>
			</Tooltip>

			<Modal
				footer={<ModalFooter loading={loading} onOK={form.submit} onCancel={handleCancel} />}
				title="Thêm ghi chú"
				open={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				width={500}
			>
				<Form layout="vertical" form={form} onFinish={addNote}>
					<TextBoxField className="primary-input !h-auto !mb-0" rows={8} name="Note" label="" />
				</Form>
			</Modal>

			<NestedTable addClass="basic-header" dataSource={data} columns={columns} haveBorder={true} />
		</div>
	)
}

export default StudentNote
