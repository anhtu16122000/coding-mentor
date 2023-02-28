import { message, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { ShowNoti } from '~/common/utils'
import { userApi } from '~/services/auth'
import PrimaryTable from '../../Primary/Table'

export const ListAccountPage = () => {
	const [dataTable, setDataTable] = useState([])
	const [loading, setLoading] = useState(false)

	const getListAccount = async () => {
		try {
			setLoading(true)
			const res = await userApi.getListAccount()
			if (res.status === 200) {
				setDataTable(res.data.data)
				setLoading(false)
			}
			if (res.status === 204) {
				setDataTable([])
				setLoading(true)
			}
		} catch (error) {
			setLoading(true)
		} finally {
			setLoading(false)
		}
	}
	useEffect(() => {
		getListAccount()
	}, [])

	const handleCoppy = (code) => {
		try {
			navigator.clipboard.writeText(code)
			ShowNoti('success', 'Sao chép thành công!')
		} catch (error) {
			console.log(error)
			ShowNoti('success', 'Sao chép thất bại!')
		}
	}

	const columns = [
		{
			title: 'Họ tên',
			width: 150,
			dataIndex: 'FullName',
			render: (text) => <p className="font-semibold text-[#1b73e8]">{text}</p>
		},
		{
			title: 'Chức vụ',
			width: 100,
			dataIndex: 'RoleName'
		},
		{
			title: 'Tài Khoản',
			width: 150,
			dataIndex: 'UserName',
			render: (text, item) => (
				<Tooltip title="Sao chép">
					<p className="cursor-pointer" onClick={() => handleCoppy(text)}>
						{text}
					</p>
				</Tooltip>
			)
		},
		{
			title: 'Mật khẩu',
			width: 100,
			dataIndex: 'Password',
			render: (text, item) => (
				<Tooltip title="Sao chép">
					<p className="cursor-pointer" onClick={() => handleCoppy(text)}>
						monamedia
					</p>
				</Tooltip>
			)
		}
	]

	return (
		<>
			<PrimaryTable loading={loading} columns={columns} data={dataTable} />
		</>
	)
}
