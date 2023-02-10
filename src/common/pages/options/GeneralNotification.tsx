import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { generalNotificationApi } from '~/api/general-notification'
import GeneralNotificationUserReceiver from '~/common/components/GeneralNotification/GeneralNotificationUserReceiver'
import GeneralNotificationForm from '~/common/components/GeneralNotification/GeneralNotificationForm'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import ReactHtmlParser from 'react-html-parser'

let pageIndex = 1
const GeneralNotification = () => {
	const paramsApi = {
		pageSize: PAGE_SIZE,
		pageIndex: 1
	}
	const [todoApi, setTodoApi] = useState(paramsApi)
	const [isLoading, setIsLoading] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [generalNotification, setGeneralNotification] = useState<IGeneralNotification[]>([])
	const [totalPage, setTotalPage] = useState(0)
	const getAllGeneralNotifications = async () => {
		setIsLoading(true)
		try {
			const res = await generalNotificationApi.getAll(paramsApi)
			if (res.status === 200) {
				setGeneralNotification(res.data.data)
				setTotalPage(res.data.totalRow)
			}
			if (res.status === 204) {
				setGeneralNotification([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		getAllGeneralNotifications()
	}, [todoApi])

	const columns = [
		{
			title: 'Date',
			dataIndex: 'ModifiedOn',
			render: (date) => <p className="font-weight-black">{moment(date).format('DD/MM/YYYY')}</p>
		},
		{
			title: 'Tiêu đề',
			dataIndex: 'Title'
		},
		{
			title: 'Chức năng',
			width: 100,
			align: 'center',
			render: (data) => (
				<>
					<GeneralNotificationUserReceiver dataRow={data} />
				</>
			)
		}
	]

	const expandedRowRender = (data, index) => {
		return (
			<div className="pt-2 pb-2">
				<span className="weight-600">Nội dung:</span> {ReactHtmlParser(data?.Content)}
			</div>
		)
	}

	// PAGINATION
	const getPagination = (pageNumber: number, pageSize: number) => {
		if (!pageSize) pageSize = 10
		pageIndex = pageNumber
		setCurrentPage(pageNumber)
		setTodoApi({ ...todoApi, pageIndex: pageIndex, pageSize: pageSize })
	}

	return (
		<>
			<GeneralNotificationForm getAllGeneralNotifications={getAllGeneralNotifications} />
			<div style={{ marginTop: '24px' }}>
				<ExpandTable
					currentPage={currentPage}
					loading={isLoading}
					columns={columns}
					dataSource={generalNotification}
					totalPage={totalPage}
					Extra="Lịch sử thông báo"
					getPagination={getPagination}
					expandable={expandedRowRender}
				/>
			</div>
		</>
	)
}

export default GeneralNotification
