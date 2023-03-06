import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { teacherOffApi } from '~/api/teacher-off'
import DeleteTableRow from '~/common/components/Elements/DeleteTableRow'
import FilterColumn from '~/common/components/FilterTable/Filter/FilterColumn'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import TeacherOffForm from '~/common/components/Teacher/TeacherOffForm'
import TeacherOffUpdateForm from '~/common/components/Teacher/TeacherOffUpdateForm'
import TeacherOffViewNote from '~/common/components/Teacher/TeacherOffViewNote'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import ExpandTeacherOff from './ExpandTeacherOff'

let pageIndex = 1
const TeacherOff = () => {
	const { information: userInformation } = useSelector((state: RootState) => state.user)

	const listTodoApi = {
		fullName: null,
		userCode: null,
		status: null,
		pageSize: PAGE_SIZE,
		pageIndex: pageIndex
	}

	const [todoApi, setTodoApi] = useState(listTodoApi)
	const [isLoading, setIsLoading] = useState(false)
	const [teacherOff, setTeacherOff] = useState<ITeacherOff[]>([])
	const [totalRow, setTotalRow] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)

	// RESET SEARCH
	const onResetSearch = () => {
		setTodoApi({
			...listTodoApi
		})
	}

	// ACTION SEARCH
	const onSearch = (valueSearch, dataIndex) => {
		setTodoApi({
			...listTodoApi,
			[dataIndex]: valueSearch
		})
	}

	const theInformation = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return theInformation?.RoleId == 1
	}

	function isTeacher() {
		return theInformation?.RoleId == 2
	}

	function isManager() {
		return theInformation?.RoleId == 4
	}

	function isStdent() {
		return theInformation?.RoleId == 3
	}

	const columnsTeacher = [
		{
			title: 'Từ ngày',
			dataIndex: 'StartTime',
			key: 'StartTime',
			render: (text, data) => <span className="font-[600] text-[#1976D2]">{!!text ? moment(text).format('DD/MM/YYYY') : ''}</span>
		},
		{
			title: 'Đến ngày',
			dataIndex: 'EndTime',
			key: 'EndTime',
			render: (text, data) => <span className="font-[600] text-[#388E3C]">{!!text ? moment(text).format('DD/MM/YYYY') : ''}</span>
		},
		{
			title: 'Trạng thái',
			dataIndex: 'Status',
			key: 'Status',
			filters: [
				{
					text: 'Chờ duyệt',
					value: 1
				},
				{
					text: 'Duyệt',
					value: 2
				},
				{
					text: 'Không duyệt',
					value: 3
				}
			],
			onFilter: (value: string, record) => {
				return record.Status === value
			},
			render: (status, data) => {
				switch (status) {
					case 1:
						return <p className="tag red">{data.StatusName}</p>
					case 2:
						return <p className="tag blue">{data.StatusName}</p>
					case 3:
						return <p className="tag gray">{data.StatusName}</p>
				}
			}
		},
		{
			title: 'Chức năng',
			dataIndex: '',
			key: '',
			width: '120px',
			fixed: 'right',
			render: (data) => {
				{
					return (
						<>
							{data.Status === 1 && <DeleteTableRow handleDelete={() => handleDelete(data.Id)} />}
							{!!data.Note && <TeacherOffViewNote dataRow={data} />}
						</>
					)
				}
			}
		}
	]

	const columnsAdmin = [
		{
			title: 'Mã',
			dataIndex: 'UserCode',
			key: 'UserCode',
			...FilterColumn('UserCode', onSearch, onResetSearch, 'text')
		},
		{
			title: 'Tên nhân viên',
			dataIndex: 'FullName',
			key: 'FullName',
			className: 'text-[#1b73e8] font-[500]',
			...FilterColumn('FullName', onSearch, onResetSearch, 'text')
		},
		{
			title: 'Từ ngày',
			dataIndex: 'StartTime',
			key: 'StartTime',
			render: (text, data) => <span>{!!text ? moment(text).format('DD/MM/YYYY') : ''}</span>
		},
		{
			title: 'Đến ngày',
			dataIndex: 'EndTime',
			key: 'EndTime',
			render: (text, data) => <span>{!!text ? moment(text).format('DD/MM/YYYY') : ''}</span>
		},
		{
			title: 'Trạng thái',
			dataIndex: 'Status',
			key: 'Status',
			filters: [
				{
					text: 'Chờ duyệt',
					value: 1
				},
				{
					text: 'Duyệt',
					value: 2
				},
				{
					text: 'Không duyệt',
					value: 3
				}
			],
			onFilter: (value: string, record) => {
				return record.Status === value
			},
			render: (status, data) => {
				switch (status) {
					case 1:
						return <p className="tag red">{data.StatusName}</p>
					case 2:
						return <p className="tag blue">{data.StatusName}</p>
					case 3:
						return <p className="tag gray">{data.StatusName}</p>
				}
			}
		},
		{
			title: 'Chức năng',
			dataIndex: '',
			key: '',
			width: '120px',
			fixed: 'right',
			render: (data) => {
				{
					return (
						<>
							<TeacherOffUpdateForm dataRow={data} setTodoApi={setTodoApi} listTodoApi={listTodoApi} />
							<DeleteTableRow handleDelete={() => handleDelete(data.Id)} />
						</>
					)
				}
			}
		}
	]

	const handleDelete = async (id) => {
		try {
			const res = await teacherOffApi.delete(id)
			if (res.status === 200) {
				setTodoApi(listTodoApi)
				ShowNoti('success', res.data.message)
				return res
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getAllTeacherOff = async () => {
		setIsLoading(true)
		try {
			const res = await teacherOffApi.getAll(todoApi)
			if (res.status === 200) {
				setTeacherOff(res.data.data)
				setTotalRow(res.data.totalRow)
			}
			if (res.status === 204) {
				setTeacherOff([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber
		setCurrentPage(pageNumber)
		setTodoApi({
			...todoApi,
			pageIndex: pageIndex
		})
	}

	useEffect(() => {
		getAllTeacherOff()
	}, [todoApi])

	const expandedRowRender = (data) => {
		return (
			<>
				<p>
					<span>Lý do: </span>
					{data.Reason}
				</p>

				<ExpandTeacherOff item={data} />
			</>
		)
	}
	return (
		<ExpandTable
			currentPage={currentPage}
			loading={isLoading}
			dataSource={teacherOff}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			totalPage={totalRow}
			columns={userInformation?.RoleId == 2 ? columnsTeacher : columnsAdmin}
			expandable={expandedRowRender}
			Extra={isTeacher() && <TeacherOffForm setTodoApi={setTodoApi} listTodoApi={listTodoApi} />}
			TitleCard="Danh sách lịch nghỉ"
		/>
	)
}

export default TeacherOff
