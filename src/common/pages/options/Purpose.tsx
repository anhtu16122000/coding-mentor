import React, { Fragment, useEffect, useState } from 'react'
import PrimaryTable from '~/common/components/Primary/Table'
import PurposeForm from '~/common/components/Purpose/PurposeForm'
import { purposeApi } from '~/api/purpose'
import moment from 'moment'
import { ShowNoti } from '~/common/utils'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import DeleteTableRow from '~/common/components/Elements/DeleteTableRow'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { useDispatch } from 'react-redux'
import { setPurpose } from '~/store/purposeReducer'

const Purpose = () => {
	const state = useSelector((state: RootState) => state)
	const dispatch = useDispatch()
	const [isLoading, setIsLoading] = useState(false)
	const [totalPage, setTotalPage] = useState(null)

	// PARAMS API GETALL
	const listTodoApi = {
		pageSize: PAGE_SIZE,
		pageIndex: 1
	}
	const [todoApi, setTodoApi] = useState(listTodoApi)

	// GET DATA STAFFSALARY
	const getDataTable = async () => {
		setIsLoading(true)
		try {
			let res = await purposeApi.getAll(todoApi)
			if (res.status == 204) {
				dispatch(setPurpose([]))
			}
			if (res.status == 200) {
				dispatch(setPurpose(res.data.data))
				setTotalPage(res.data.totalRow)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	// DELETE
	const handleDelete = async (id) => {
		try {
			const res = await purposeApi.delete(id)
			if (res.status === 200) {
				setTodoApi(listTodoApi)
				ShowNoti('success', res.data.message)
				return res
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	// COLUMNS TABLE
	const columns = [
		{
			title: 'Mục đích học',
			dataIndex: 'Name',
			render: (text) => {
				return <p className="font-[600] text-[#1976D2]">{text}</p>
			}
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'CreatedOn',
			render: (date) => {
				return <p className="">{moment(date).format('DD/MM/YYYY HH:mm')}</p>
			}
		},
		{
			title: 'Người tạo',
			dataIndex: 'CreatedBy'
		},
		{
			title: '',
			render: (record) => (
				<>
					<PurposeForm rowData={record} getDataTable={getDataTable} />
					<DeleteTableRow text={record.Name} handleDelete={() => handleDelete(record.Id)} />
				</>
			)
		}
	]

	useEffect(() => {
		getDataTable()
	}, [todoApi])

	return (
		<Fragment>
			<PrimaryTable
				loading={isLoading}
				total={totalPage && totalPage}
				Extra={<PurposeForm getDataTable={getDataTable} />}
				data={state.purpose.Purpose}
				columns={columns}
				onChangePage={(event: number) => setTodoApi({ ...todoApi, pageIndex: event })}
			/>
		</Fragment>
	)
}

export default Purpose
