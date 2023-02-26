import React, { useEffect, useState } from 'react'
import PrimaryTable from '~/common/components/Primary/Table'
import RoomForm from '~/common/components/Room/RoomForm'
import FilterColumn from '~/common/components/FilterTable/Filter/FilterColumn'
import router from 'next/router'
import { roomApi } from '~/api/room'
import { branchApi } from '~/api/branch'
import { ShowNoti } from '~/common/utils'
import moment from 'moment'
import DeleteTableRow from '~/common/components/Elements/DeleteTableRow'
import { parseSelectArray } from '~/common/utils/common'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

const RoomsDetail = () => {
	const listTodoApi = {
		pageSize: PAGE_SIZE,
		pageIndex: 1,
		Code: null,
		Name: null,
		branchID: parseInt(router.query.slug as string)
	}
	const [todoApi, setTodoApi] = useState(listTodoApi)
	const [roomData, setRoomData] = useState<IRoom[]>([])
	const [dataCenter, setDataCenter] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [totalPage, setTotalPage] = useState(null)
	const theInformation = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return theInformation?.RoleId == 1
	}

	// DELETE ITEM
	const onDelete = async (roomID: number) => {
		let res = null
		try {
			res = await roomApi.delete(roomID)
			if (res.status === 200) {
				ShowNoti('success', res.data.message)
				setTodoApi(listTodoApi)
				return res
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	// GET DATA ROOM
	const getDataRoom = async () => {
		setIsLoading(true)
		try {
			let res = await roomApi.getAll(todoApi)
			if (res.status === 200) {
				setRoomData(res.data.data)
				setTotalPage(res.data.totalRow)
			}
			if (res.status === 204) {
				setRoomData([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	// ON SEARCH
	const onSearch = (valueSearch, dataIndex) => {
		setTodoApi({ ...todoApi, [dataIndex]: valueSearch })
	}

	const handleReset = () => {
		setTodoApi({ ...listTodoApi })
	}

	// GET DATA CENTER
	const getDataCenter = async () => {
		setIsLoading(true)
		try {
			let res = await branchApi.getAll({
				pageIndex: 1,
				pageSize: 9999
			})
			if (res.status === 200) {
				const convertData = parseSelectArray(res.data.data, 'Name', 'Id')
				setDataCenter(convertData)
			}
			if (res.status === 204) {
				setDataCenter([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		getDataCenter()
	}, [])

	// Fetch Data
	useEffect(() => {
		if (todoApi.branchID) {
			getDataRoom()
		}
	}, [todoApi])

	useEffect(() => {
		if (router.query.slug) {
			setTodoApi({ ...todoApi, branchID: parseInt(router.query.slug as string) })
		}
	}, [router.query.slug])

	const columns = isAdmin()
		? [
				{
					title: 'Mã phòng',
					dataIndex: 'Code',
					...FilterColumn('Code', onSearch, handleReset, 'text')
				},
				{
					title: 'Tên phòng',
					dataIndex: 'Name',
					...FilterColumn('Name', onSearch, handleReset, 'text')
				},
				{
					title: 'Người cập nhật',
					dataIndex: 'ModifiedBy'
				},
				{
					title: 'Ngày cập nhật',
					dataIndex: 'ModifiedOn',
					render: (date) => moment(date).format('DD/MM/YYYY')
				},
				{
					title: 'Chức năng',
					render: (text, data, index) => (
						<>
							<RoomForm dataCenter={dataCenter} rowData={data} getDataRoom={getDataRoom} />
							<DeleteTableRow handleDelete={() => onDelete(data.Id)} text={data.Name} />
						</>
					)
				}
		  ]
		: [
				{
					title: 'Mã phòng',
					dataIndex: 'Code',
					...FilterColumn('Code', onSearch, handleReset, 'text')
				},
				{
					title: 'Tên phòng',
					dataIndex: 'Name',
					...FilterColumn('Name', onSearch, handleReset, 'text')
				},
				{
					title: 'Người cập nhật',
					dataIndex: 'ModifiedBy'
				},
				{
					title: 'Ngày cập nhật',
					dataIndex: 'ModifiedOn',
					render: (date) => moment(date).format('DD/MM/YYYY')
				}
		  ]

	return (
		<>
			<PrimaryTable
				loading={isLoading}
				total={totalPage && totalPage}
				Extra={isAdmin() ? <RoomForm dataCenter={dataCenter} getDataRoom={getDataRoom} /> : ''}
				data={roomData}
				onChangePage={(event: number) => setTodoApi({ ...todoApi, pageIndex: event })}
				columns={columns}
			/>
		</>
	)
}

export default RoomsDetail
