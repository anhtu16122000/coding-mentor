import React, { useEffect, useState } from 'react'
import { requestApi } from '~/api/user'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'

import PrimaryTable from '../../Primary/Table'
import AcceptRequest from './accept-modal'

const initParamters = {
	pageSize: PAGE_SIZE,
	pageIndex: 1
}

const RequestChange = () => {
	const [apiParameters, setApiParameters] = useState<IUserInputGetall>(initParamters)

	const [request, setRequest] = useState([])
	const [totalRow, setTotalRow] = useState(1)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		getRequest(apiParameters)
	}, [apiParameters])

	async function deleteRequest(param) {
		setLoading(true)
		try {
			const response = await requestApi.delete(param)
			if (response.status === 200) {
				getRequest(apiParameters)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	const columns = [
		{
			width: 160,
			title: 'Mã người dùng',
			dataIndex: 'UserCode',
			render: (text, item) => <p className="font-semibold">{item.Info.UserCode}</p>
		},
		{
			title: 'Họ tên',
			dataIndex: 'FullName',
			render: (text, item) => <p className="font-semibold">{item.Info.FullName}</p>
		},
		{
			title: 'Email',
			dataIndex: 'Email',
			render: (text, item) => <>{item.Info.Email}</>
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'Mobile',
			render: (text, item) => <>{item.Info.Mobile}</>
		},
		{
			align: 'center',
			width: 120,
			title: 'Chức năng',
			dataIndex: 'StatusId',
			render: (data, item) => {
				return <AcceptRequest data={item} onRefresh={() => getRequest(apiParameters)} onDelete={deleteRequest} />
			}
		}
	]

	const getRequest = async (param) => {
		setLoading(true)
		try {
			const response = await requestApi.getAll(param)
			if (response.status === 200) {
				setRequest(response.data.data)
				setTotalRow(response.data.totalRow)
			}
			if (response.status === 204) {
				setRequest([])
				setTotalRow(1)
			}
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<PrimaryTable
			columns={columns}
			data={request}
			total={totalRow}
			loading={loading}
			onChangePage={(event: number) => setApiParameters({ ...apiParameters, pageIndex: event })}
		/>
	)
}

export default RequestChange
