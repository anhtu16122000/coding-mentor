import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { notificationInClassApi } from '~/api/notification-in-class'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import PrimaryTable from '../Primary/Table'
import { ModalNotificationInClassCRUD } from './ModalNotificationInClassCRUD'

export const NotificationInClassPage = () => {
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const initParameters = { classId: router.query.class, pageIndex: 1, pageSize: PAGE_SIZE }
	const [apiParameters, setApiParameters] = useState(initParameters)
	const [totalRow, setTotalRow] = useState(1)
	const [dataTable, setDataTable] = useState([])

	const columns = [
		{
			title: 'Thông báo qua email',
			dataIndex: 'Title',
			width: 200,
			render: (text) => <p className="font-semibold text-[#1b73e8]">{text}</p>
		},
		{
			title: 'Nội dung',
			width: 200,
			dataIndex: 'Content'
		},
		{
			title: 'Người tạo',
			width: 200,
			dataIndex: 'CreatedBy'
		},
		{
			title: 'Ngày tạo',
			width: 200,
			dataIndex: 'CreatedOn',
			render: (text) => <>{moment(text).format('DD-MM-YYYY')}</>
		}
	]

	const getNotificationInClass = async (params) => {
		try {
			setLoading(true)
			const res = await notificationInClassApi.getAll(params)
			if (res.status === 200) {
				setDataTable(res.data.data)
				setTotalRow(res.data.totalRow)
				setLoading(false)
			}
			if (res.status === 204) {
				setLoading(true)
				setDataTable([])
			}
		} catch (error) {
			setLoading(true)
		} finally {
			setLoading(false)
		}
	}
	useEffect(() => {
		if (router?.query?.class) {
			getNotificationInClass(apiParameters)
		}
	}, [router?.query?.class])
	return (
		<>
			<PrimaryTable
				loading={loading}
				total={totalRow}
				onChangePage={(event: number) => setApiParameters({ ...apiParameters, pageIndex: event })}
				TitleCard={<div className="extra-table">Thông báo lớp học</div>}
				data={dataTable}
				columns={columns}
				Extra={
					<>
						<ModalNotificationInClassCRUD onRefresh={() => getNotificationInClass(apiParameters)} mode="add" />
					</>
				}
			/>
		</>
	)
}
