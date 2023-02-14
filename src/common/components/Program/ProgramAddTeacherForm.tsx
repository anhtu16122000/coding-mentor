import { Modal, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineUsergroupAdd } from 'react-icons/ai'
import { programApi } from '~/api/program'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'
import PrimaryTable from '../Primary/Table'

const ProgramAddTeacherForm = (props) => {
	const { rowData } = props
	const listTodoApi = {
		programId: rowData?.Id,
		pageSize: PAGE_SIZE,
		pageIndex: 1
	}
	const [isLoading, setIsLoading] = useState(false)
	const [todoApi, setTodoApi] = useState(listTodoApi)
	const [listTeacher, setListTeacher] = useState<ITeacher[]>([])
	const [totalRow, setTotalRow] = useState(0)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const columns = [
		{
			title: 'Mã giáo viên',
			width: 250,
			dataIndex: 'TeacherCode',
			render: (text) => {
				return <p className="font-weight-black">{text}</p>
			}
		},
		{
			title: 'Tên giáo viên',
			width: 300,
			dataIndex: 'TeacherName'
		},
		{
			title: 'Giảng dạy',
			dataIndex: 'Allow',
			align: 'center',
			render: (allow, data) => {
				if (allow) {
					return (
						<button className="text-tw-green" onClick={() => handleUpdateAllowTeacher(data)}>
							<Tooltip title="Cho phép">
								<AiOutlineCheckCircle size={24} />
							</Tooltip>
						</button>
					)
				} else {
					return (
						<button className="text-tw-red" onClick={() => handleUpdateAllowTeacher(data)}>
							<Tooltip title="Không cho phép">
								<AiOutlineCloseCircle size={24} />
							</Tooltip>
						</button>
					)
				}
			}
		}
	]

	const handleUpdateAllowTeacher = async (data) => {
		try {
			const DATA_SUBMIT = {
				teacherId: data.TeacherId,
				programId: data.ProgramId
			}
			const res = await programApi.updateAllowTeacher(DATA_SUBMIT)
			if (res.status === 200) {
				setTodoApi(listTodoApi)
				ShowNoti('success', res.data.message)
			}
			console.log('Data: ', data)
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getAllTeacher = async () => {
		setIsLoading(true)
		try {
			const res = await programApi.getTeacherInProgram(listTodoApi)
			if (res.status === 200) {
				setListTeacher(res.data.data)
				setTotalRow(res.data.totalRow)
			}
			if (res.status === 204) {
				setListTeacher([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}
	useEffect(() => {
		if (isModalOpen) {
			getAllTeacher()
		}
	}, [isModalOpen, todoApi])
	return (
		<>
			{/* <button className="btn btn-icon view" onClick={() => setIsModalOpen(true)}>
				<Tooltip title="Thêm giáo viên">
					<AiOutlineUsergroupAdd size={20} />
				</Tooltip>
			</button> */}
			<IconButton onClick={() => setIsModalOpen(true)} icon="user-group" type="button" tooltip="Thêm giáo viên" color="green" />
			<Modal
				title={
					<>
						Thêm giáo viên vào chương trình: <span className="font-semibold text-tw-primary">{rowData?.Name}</span>
					</>
				}
				open={isModalOpen}
				width={800}
				footer={null}
				onCancel={() => setIsModalOpen(false)}
			>
				<PrimaryTable
					total={totalRow}
					loading={isLoading}
					onChangePage={(event: number) => setTodoApi({ ...listTodoApi, pageIndex: event })}
					columns={columns}
					data={listTeacher}
				/>
			</Modal>
		</>
	)
}

export default ProgramAddTeacherForm
