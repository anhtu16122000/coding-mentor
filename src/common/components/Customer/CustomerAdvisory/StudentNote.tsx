import React, { useEffect, useState } from 'react'
import NestedTable from '~/common/components/Primary/Table/NestedTable'
import moment from 'moment'
import { Modal, Tooltip, Form, Table } from 'antd'
import { customerAdviseApi } from '~/api/user/customer'
import ReactHtmlParser from 'react-html-parser'
import { ShowNoti } from '~/common/utils'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import DeleteTableRow from '../../Elements/DeleteTableRow'
import TextBoxField from '../../FormControl/TextBoxField'
import ModalFooter from '../../ModalFooter'
import Router from 'next/router'
import EntryHistories from '~/common/pages/InfoCourse/Histories'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { is } from '~/common/utils/common'

const sharedOnCell = (_, index) => {
	if (index === 1) {
		return {
			colSpan: 0
		}
	}
	return {}
}

const _columnGrades = [
	{
		title: 'Listening',
		dataIndex: 'ListeningPoint',
		rowScope: 'row'
	},
	{
		title: 'Speaking',
		dataIndex: 'SpeakingPoint',
		render: (text, _, index) => <div className="whitespace-pre-wrap min-h-[21px]">{text}</div>
	},
	{
		title: 'Reading',
		dataIndex: 'ReadingPoint',
		onCell: sharedOnCell
	},
	{
		title: 'Writing',
		dataIndex: 'WritingPoint',
		onCell: sharedOnCell
	},
	{
		title: 'Vocabulary',
		dataIndex: 'Vocab',
		onCell: sharedOnCell
	},
	{
		title: 'Học phí tư vấn',
		dataIndex: 'Tuitionfee',
		onCell: sharedOnCell
	}
]

const StudentNote = (props) => {
	const { studentId, rowData, isStaff } = props
	const [grades, setGrades] = useState([])

	const listTodoApi = isStaff
		? { StaffId: studentId, pageSize: PAGE_SIZE, pageIndex: 1 }
		: { studentId: studentId, pageSize: PAGE_SIZE, pageIndex: 1 }

	const [form] = Form.useForm()
	const [todoApi, setTodoApi] = useState(listTodoApi)
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState([])
	const [columnGrades] = useState(_columnGrades)

	const userInfo = useSelector((state: RootState) => state.user.information)

	useEffect(() => {
		if (studentId) {
			handleGetNotes()
		}
	}, [todoApi, studentId])

	useEffect(() => {
		setGrades([{ ...rowData }])
	}, [rowData])

	const handleDelete = async (id) => {
		try {
			const res = await (isStaff ? customerAdviseApi.deleteStaffNote(id) : customerAdviseApi.deleteStudentNote(id))
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
			render: (data) => (
				<>
					{(is(userInfo).admin || is(userInfo).manager || is(userInfo).teacher || is(userInfo).academic) && (
						<DeleteTableRow handleDelete={() => handleDelete(data?.Id)} />
					)}
				</>
			)
		}
	]

	const handleGetNotes = async () => {
		try {
			const res = await (isStaff ? customerAdviseApi.getStaffNotes(todoApi) : customerAdviseApi.getStudentNotes(todoApi))
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
		setLoading(true)
		try {
			const res = await (isStaff
				? customerAdviseApi.addStaffNote({ ...data, StaffId: studentId })
				: customerAdviseApi.addStudentNote({ ...data, studentId: studentId }))

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

			<div className="flex items-start flex-col">
				{/* Khi nó là bài ONLINE */}
				{!Router.asPath.includes('/users/personnel') && rowData?.Type == 2 && <EntryHistories isEntry={true} item={rowData} />}

				{/* Khi nó là bài OFFLINE */}
				{!Router.asPath.includes('/users/personnel') && rowData?.Type == 1 && (
					<div className="mb-[16px]">
						<div className="mb-[8px]">Ghi chú: {rowData?.Note}</div>
						<Table pagination={false} size="small" columns={columnGrades} dataSource={grades} />
					</div>
				)}
			</div>

			{(is(userInfo).admin || is(userInfo).manager || is(userInfo).teacher || is(userInfo).academic) && (
				<Tooltip className="" title="Thêm ghi chú">
					<button className="btn btn-warning" onClick={showModal}>
						Thêm ghi chú
					</button>
				</Tooltip>
			)}

			<NestedTable addClass="basic-header" dataSource={data} columns={columns} haveBorder={true} />
		</div>
	)
}

export default StudentNote
