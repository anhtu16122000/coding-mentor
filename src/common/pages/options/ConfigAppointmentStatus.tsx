import React, { useState, useEffect } from 'react'
import { configAppointmentStatusApi } from '~/api/config-appointment-status'
import ModalAppointmentStatus from '~/common/components/ConfigAppointmentStatus/ModalAppointmentStatus'
import PrimaryTable from '~/common/components/Primary/Table'
// import { useWrap } from '~/src/context/wrap'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'

export interface IConfigAppointmentStatusProps {}

export default function ConfigAppointmentStatus(props: IConfigAppointmentStatusProps) {
	// const { pageSize, showNoti } = useWrap()
	const [dataSource, setDataSource] = useState<IConfigAppointmentStatus[]>()
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [todoApi, setTodoApi] = useState({ pageIndex: 1, pageSize: PAGE_SIZE })
	const [totalPage, setTotalPage] = useState(0)

	const getDataSource = async () => {
		setIsLoading({ type: '', status: true })
		try {
			let res = await configAppointmentStatusApi.getAll(todoApi)
			if (res.status == 200) {
				setDataSource(res.data.data)
				setTotalPage(res.data.totalRow)
			}
			if (res.status == 204) {
				setDataSource([])
				setTotalPage(0)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
		}
	}

	const columns = [
		{
			title: 'ID',
			width: 120,
			dataIndex: 'Id',
			render: (text, data) => <>{text}</>
		},
		{
			title: 'Loại trạng thái',
			width: 120,
			dataIndex: 'Name',
			render: (text, data) => <>{text}</>
		},
		{
			title: '',
			width: 150,
			dataIndex: 'Active',
			render: (text, data) => (
				<div className="d-flex justify-content-start align-items-center">
					<ModalAppointmentStatus
						onFetchData={() => {
							setTodoApi({ ...todoApi })
						}}
						dataRow={data}
						mode="edit"
					/>
					<ModalAppointmentStatus
						onFetchData={() => {
							setTodoApi({ ...todoApi })
						}}
						dataRow={data}
						mode="delete"
					/>
				</div>
			)
		}
	]

	useEffect(() => {
		getDataSource()
	}, [todoApi])

	return (
		<>
			<PrimaryTable
				// loading={isLoading}
				// totalPage={totalPage}
				onChangePage={(event: number) => setTodoApi({ ...todoApi, pageIndex: event })}
				data={dataSource}
				// getPagination={getPagination}
				columns={columns}
				// Size="table-small"
				Extra={
					<>
						{
							<ModalAppointmentStatus
								onFetchData={() => {
									setTodoApi({ ...todoApi })
								}}
								mode="add"
							/>
						}
					</>
				}
			/>
		</>
	)
}
