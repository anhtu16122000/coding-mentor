import React, { useEffect, useState } from 'react'
import PrimaryTable from '~/common/components/Primary/Table'
import CustomerSupplierForm from '~/common/components/Customer/CustomerSupplierForm'
import { sourceApi } from '~/api/source'
import moment from 'moment'
import { ShowNoti } from '~/common/utils'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import DeleteTableRow from '~/common/components/Elements/DeleteTableRow'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { useDispatch } from 'react-redux'
import { setSource } from '~/store/sourceReducer'

const CustomerSupplier = () => {
	const state = useSelector((state: RootState) => state)
	const dispatch = useDispatch()
	const [isLoading, setIsLoading] = useState(false)
	const [totalPage, setTotalPage] = useState(null)

	let pageIndex = 1

	// PARAMS API GETALL
	const listTodoApi = {
		pageSize: PAGE_SIZE,
		pageIndex: pageIndex
	}
	const [todoApi, setTodoApi] = useState(listTodoApi)

	// GET DATA STAFFSALARY
	const getDataTable = async () => {
		setIsLoading(true)
		try {
			let res = await sourceApi.getAll(todoApi)
			if (res.status == 200) {
				dispatch(setSource([...res.data.data]))
				setTotalPage(res.data.totalRow)
			}
			if (res.status == 204) {
				dispatch(setSource([]))
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	const handleDelete = async (id) => {
		try {
			const res = await sourceApi.delete(id)
			if (res.status === 200) {
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
			title: 'Tên nguồn',
			dataIndex: 'Name',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Thay đổi bởi',
			dataIndex: 'ModifiedBy'
		},
		{
			title: 'Thay đổi lúc',
			dataIndex: 'ModifiedOn',
			render: (date) => <p className="font-weight-primary">{moment(date).format('DD/MM/YYYY')}</p>
		},
		{
			title: 'Chức năng',
			render: (record) => (
				<>
					<CustomerSupplierForm rowData={record} getDataTable={getDataTable} />
					<DeleteTableRow text={record.Name} handleDelete={() => handleDelete(record.Id)} />
				</>
			)
		}
	]

	useEffect(() => {
		getDataTable()
	}, [todoApi])

	return (
		<PrimaryTable
			loading={isLoading}
			// currentPage={currentPage}
			total={totalPage && totalPage}
			// getPagination={getPagination}
			// addClass="basic-header"
			// TitlePage="Nguồn khách hàng"
			Extra={<CustomerSupplierForm getDataTable={getDataTable} />}
			data={state.source.Source}
			columns={columns}
			onChangePage={(event: number) => setTodoApi({ ...todoApi, pageIndex: event })}
		/>
	)
}
export default CustomerSupplier
