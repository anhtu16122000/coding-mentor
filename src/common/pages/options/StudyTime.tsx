import React, { useEffect, useState } from 'react'
import PrimaryTable from '~/common/components/Primary/Table'
import StudyTimeForm from '~/common/components/StudyTime/StudyTimeForm'
import { studyTimeApi } from '~/api/study-time'
import Router from 'next/router'
import { RootState } from '~/store'
import { useSelector } from 'react-redux'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import DeleteTableRow from '~/common/components/Elements/DeleteTableRow'
import { useDispatch } from 'react-redux'
import { setStudyTime } from '~/store/studyTimeReducer'

let pageIndex = 1

const StudyTime = () => {
	const state = useSelector((state: RootState) => state)
	const dispatch = useDispatch()
	const { information: userInformation } = useSelector((state: RootState) => state.user)
	const [isLoading, setIsLoading] = useState(false)
	const [totalPage, setTotalPage] = useState(null)

	const listTodoApi = {
		pageSize: PAGE_SIZE,
		pageIndex: pageIndex,
		sort: null,
		sortType: null
	}
	const [todoApi, setTodoApi] = useState(listTodoApi)

	// GET DATA COURSE
	const getDataSource = async () => {
		setIsLoading(true)
		try {
			let res = await studyTimeApi.getAll({ pageIndex: 1, pageSize: 99999 })
			if (res.status === 200) {
				dispatch(setStudyTime(res.data.data))
				setTotalPage(res.data.totalRow)
			}
			if (res.status === 204) {
				dispatch(setStudyTime([]))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	const handleDelete = async (id) => {
		setIsLoading(true)
		try {
			const res = await studyTimeApi.delete(id)
			if (res.status === 200) {
				setTodoApi(listTodoApi)
				ShowNoti('success', res.data.message)
				return res
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	// USE EFFECT - FETCH DATA
	useEffect(() => {
		getDataSource()
	}, [todoApi])

	const columns = [
		{
			title: 'Ca học',
			dataIndex: 'Name',
			key: 'name',
			render: (value) => <span className="text-primary weight-600">{value}</span>
		},
		{
			title: 'Thời gian (phút)',
			width: 150,
			dataIndex: 'Time',
			key: 'time',
			align: 'center',
			render: (value) => <span className="weight-600">{value}</span>
		},
		{
			width: 150,
			align: 'center',
			title: 'Bắt đầu',
			dataIndex: 'StartTime'
		},
		{
			width: 150,
			align: 'center',
			title: 'Kết thúc',
			dataIndex: 'EndTime'
		},
		{
			title: 'Chức năng',
			align: 'right',
			render: (text, data, index) => (
				<>
					<StudyTimeForm rowData={data} getDataSource={getDataSource} />
					<DeleteTableRow text={`ca học ${data.Name}`} handleDelete={() => handleDelete(data.Id)} />
				</>
			)
		}
	]

	useEffect(() => {
		if (!!userInformation && userInformation?.RoleId != 1) {
			Router.push('/')
		}
	}, [userInformation])

	return (
		<>
			{userInformation?.RoleId == 1 && (
				<PrimaryTable
					// currentPage={currentPage}
					total={totalPage && totalPage}
					// getPagination={(pageNumber: number) => getPagination(pageNumber)}
					loading={isLoading}
					// addClass="basic-header modal-medium table-study-time"
					// TitlePage="Danh sách ca học"
					onChangePage={(event: number) => setTodoApi({ ...todoApi, pageIndex: event })}
					Extra={<StudyTimeForm getDataSource={getDataSource} />}
					data={state.studyTime.StudyTime}
					columns={columns}
				/>
			)}
		</>
	)
}

export default StudyTime
