import React, { useEffect, useState } from 'react'
import NestedTable from '~/common/components/Primary/Table/NestedTable'
import moment from 'moment'
import { Modal, Tooltip, Spin, Form } from 'antd'
import { customerAdviseApi } from '~/api/customer'
import ReactHtmlParser from 'react-html-parser'
import { ShowNoti } from '~/common/utils'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import DeleteTableRow from '../../Elements/DeleteTableRow'
import TextBoxField from '../../FormControl/TextBoxField'

const CustomerAdvisoryNote = (props) => {
	const { customerID, setTodoApiCustomer, listTodoApiCustomer } = props
	const listTodoApi = {
		customerId: customerID,
		pageSize: PAGE_SIZE,
		pageIndex: 1
	}
	const [form] = Form.useForm()
	const [todoApi, setTodoApi] = useState(listTodoApi)
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [loading, setLoading] = useState(false)
	const [dataSource, setDataSource] = useState([])

	const handleDelete = async (id) => {
		try {
			const res = await customerAdviseApi.deleteNote(id)
			if (res.status === 200) {
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

	const handleGetAllCustomerNoteByID = async () => {
		try {
			const res = await customerAdviseApi.getNoteByCustomer(todoApi)
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
		if (customerID) {
			handleGetAllCustomerNoteByID()
		}
	}, [todoApi])

	const addNote = async (data) => {
		let DATA_SUBMIT = { ...data, CustomerId: customerID }
		setLoading(true)
		try {
			const res = await customerAdviseApi.addNote(DATA_SUBMIT)
			if (res.status === 200) {
				setIsModalVisible(false)
				form.resetFields()
				setTodoApiCustomer(listTodoApiCustomer)
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
				<button
					className="btn btn-warning"
					onClick={() => {
						showModal()
					}}
				>
					Thêm ghi chú
				</button>
			</Tooltip>

			<Modal footer={null} title="Thêm ghi chú" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={1200} centered>
				<Form layout="vertical" form={form} onFinish={addNote}>
					<TextBoxField rows={16} name="Note" label="" />
					<div className="text-center mt-3">
						<button type="submit" className="btn btn-primary w-100">
							Lưu {loading && <Spin className="loading-base" />}
						</button>
					</div>
				</Form>
			</Modal>
			<div className="row">
				<div className="col-md-9">
					<NestedTable addClass="basic-header" dataSource={dataSource} columns={columns} haveBorder={true} />
				</div>
			</div>
		</div>
	)
}

export default CustomerAdvisoryNote
