import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { ZoomConfigApi } from '~/api/configs/zoom/zoom-config'
import ModalZoomConfig from '~/common/components/Configs/Zoom/ModalZoomConfig'
import MainLayout from '~/common/components/MainLayout'
import PrimaryTable from '~/common/components/Primary/Table'
import PrimaryTag from '~/common/components/Primary/Tag'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'

export default function ZoomConfig(props) {
	const [dataSource, setDataSource] = useState<IZoomConfig[]>()
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [todoApi, setTodoApi] = useState({ pageIndex: 1, pageSize: PAGE_SIZE })

	const columns = [
		{
			title: 'Tài khoản',
			dataIndex: 'UserZoom',
			align: 'left',
			render: (text, data) => <>{text}</>
		},
		{
			title: 'APIKey',
			dataIndex: 'APIKey',
			align: 'left',
			render: (text, data) => <>{text}</>
		},
		{
			title: 'APISecret',
			dataIndex: 'APISecret',
			align: 'left',
			render: (text, data) => <>{text}</>
		},
		{
			title: 'Trạng thái',
			width: 150,
			dataIndex: 'Active',
			align: 'left',
			render: (text, data) => (
				<>
					<PrimaryTag color={text ? 'green' : 'disabled'} children={text ? 'Đang mở' : 'Dừng'} />
				</>
			)
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'CreatedOn',
			align: 'left',
			render: (text, data) => <>{moment(text).format('HH:mm - DD/MM/YYYY')}</>
		},
		{
			title: '',
			dataIndex: 'Action',
			align: 'left',
			render: (text, data) => (
				<div className="flex justify-center items-center">
					<ModalZoomConfig
						mode="edit"
						onSubmit={onSubmit}
						isLoading={isLoading}
						item={data}
						onFetchData={() => {
							setTodoApi({ ...todoApi })
						}}
					/>
					<ModalZoomConfig
						mode="delete"
						isLoading={isLoading}
						onSubmit={onSubmit}
						item={data}
						onFetchData={() => {
							setTodoApi({ ...todoApi })
						}}
					/>
				</div>
			)
		}
	]

	const getDataSource = async () => {
		setIsLoading({ type: '', status: true })
		try {
			let res = await ZoomConfigApi.getAll()
			if (res.status == 200) {
				setDataSource(res.data.data)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
		}
	}

	useEffect(() => {
		getDataSource()
	}, [todoApi])

	const onSubmit = async (data) => {
		setIsLoading({ type: 'SUBMIT', status: true })
		try {
			let res = null
			if (data.mode == 'add') {
				res = await ZoomConfigApi.add(data)
			}
			if (data.mode == 'edit') {
				res = await ZoomConfigApi.edit(data)
			}
			if (data.mode == 'delete') {
				res = await ZoomConfigApi.delete(data.Id)
			}
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				return res
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'SUBMIT', status: false })
		}
	}

	return (
		<div className="container">
			<PrimaryTable
				loading={isLoading.type == 'GET_ALL' && isLoading.status}
				Extra={
					<div>
						<ModalZoomConfig
							mode="add"
							isLoading={isLoading}
							onSubmit={onSubmit}
							onFetchData={() => {
								setTodoApi({ ...todoApi })
							}}
						/>
					</div>
				}
				data={dataSource}
				columns={columns}
			/>
		</div>
	)
}
ZoomConfig.Layout = MainLayout
