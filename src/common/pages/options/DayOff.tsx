import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { dayOffApi } from '~/api/day-off'
import DeleteTableRow from '~/common/components/Elements/DeleteTableRow'
import DayOffForm from '~/common/components/DayOff/DayOffForm'
import PrimaryTable from '~/common/components/Primary/Table'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'

const DayOff = () => {
	const [dayOffList, setDayOffList] = useState<IDayOff[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [totalPage, setTotalPage] = useState(null)
	const { information: userInformation } = useSelector((state: RootState) => state.user)
	const todoListApi = { pageIndex: 1, pageSize: PAGE_SIZE }
	const [todoApi, setTodoApi] = useState(todoListApi)

	// GET DATA IN FIRST TIME
	const getAllDayOffList = async () => {
		setIsLoading(true)
		try {
			let res = await dayOffApi.getAll(todoApi)
			if (res.status === 200) {
				setDayOffList(res.data.data)
				setTotalPage(res.data.totalRow)
			}
			if (res.status === 204) {
				setDayOffList([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		getAllDayOffList()
	}, [todoApi])

	// DELETE
	const onDeleteDayOff = async (id: number) => {
		try {
			const res = await dayOffApi.delete(id)
			if (res.status === 200) {
				setTodoApi(todoListApi)
				ShowNoti('success', res.data.message)
				return res
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
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

	function isAcademic() {
		return theInformation?.RoleId == 7
	}

	// COLUMN FOR TABLE
	const columns = [
		{
			title: 'Ngày nghỉ',
			dataIndex: 'Name'
		},
		{
			title: 'Từ ngày',
			dataIndex: 'sDate',
			render: (date) => moment(date).format('DD/MM/YYYY')
		},
		{
			title: 'Đến ngày',
			dataIndex: 'eDate',
			render: (date) => moment(date).format('DD/MM/YYYY')
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'CreatedOn',
			render: (date) => moment(date).format('DD/MM/YYYY')
		},
		{
			title: 'Tạo bởi',
			width: 120,
			dataIndex: 'CreatedBy'
		},
		{
			title: '',
			fixed: 'right',
			render: (value, record, idx) => (
				<div onClick={(e) => e.stopPropagation()}>
					{(isAdmin() || isManager() || isAcademic()) && (
						<>
							<DayOffForm dataRow={record} getAllDayOffList={getAllDayOffList} />
							<DeleteTableRow text={record.Name} handleDelete={() => onDeleteDayOff(record.Id)} />
						</>
					)}
				</div>
			)
		}
	]

	// RETURN
	return (
		<PrimaryTable
			total={totalPage}
			loading={isLoading}
			Extra={(isAdmin() || isManager() || isAcademic()) && <DayOffForm getAllDayOffList={getAllDayOffList} />}
			data={dayOffList}
			columns={columns}
			onChangePage={(event: number) => setTodoApi({ ...todoApi, pageIndex: event })}
		/>
	)
}

export default DayOff
