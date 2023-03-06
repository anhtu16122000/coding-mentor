import { message, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { ShowNoti } from '~/common/utils'
import { userApi } from '~/services/auth'
import IconButton from '../../Primary/IconButton'
import PrimaryTable from '../../Primary/Table'
import PrimaryTag from '../../Primary/Tag'

export const ListAccountPage = (props) => {
	const { setUsername, setPassword } = props
	const [loading, setLoading] = useState(false)

	function removeFullNameContainingChau(arr) {
		return arr.filter((person) => !person.FullName.includes('Châu') && !person.FullName.includes('Chau'))
	}

	const [dataTable, setDataTable] = useState([])

	const getListAccount = async () => {
		try {
			setLoading(true)
			const res = await userApi.getListAccount()
			if (res.status === 200) {
				setDataTable(removeFullNameContainingChau(res.data.data))
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

	const handleCoppy = (item) => {
		try {
			setPassword('mon4medi4')
			setUsername(item.UserName)
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
					<p className="cursor-pointer">{text}</p>
				</Tooltip>
			)
		},

		{
			title: '',
			width: 100,
			dataIndex: 'Action',
			render: (text, item) => (
				<div className="cursor-pointer" onClick={() => handleCoppy(item)}>
					<PrimaryTag color="blue" children="COPY" />
				</div>
			)
		}
	]

	return (
		<>
			<PrimaryTable loading={loading} columns={columns} data={dataTable} />
		</>
	)
}
