import React, { useEffect, useState } from 'react'
import { accountApi } from '~/api/dev/account'
import { Spin, Table, Form, Input } from 'antd'
import { parseJwt } from '~/common/utils'
import { useDispatch } from 'react-redux'
import { setUser } from '~/store/userReducer'
import { setAuthData, setAuthLoading } from '~/store/authReducer'
import Router from 'next/router'
import { setListClass, setStatusData, setTotalClass } from '~/store/classReducer'
import { playWithToken } from '~/common/utils/token-handle'

const MonaSupportPattern = () => {
	const [form] = Form.useForm()
	const dispatch = useDispatch()
	const [loading, setLoading] = useState(false)
	const [accounts, setAccounts] = useState<IDataAccount[]>([])

	const columns = [
		{
			title: 'ID',
			dataIndex: 'Id',
			key: 'Id'
		},
		{
			title: 'Role',
			dataIndex: 'RoleName',
			key: 'RoleName'
		},
		{
			title: 'Full Name',
			dataIndex: 'FullName',
			key: 'FullName'
		}
	]

	const getAccounts = async () => {
		try {
			const res = await accountApi.getAccount()
			if (res.status === 200) {
				setAccounts(res.data.data)
			}
		} catch (error) {
			alert(error.message)
		}
	}

	useEffect(() => {
		getAccounts()

		dispatch(setUser(null))

		dispatch(setListClass([]))
		dispatch(setTotalClass(0))
		dispatch(setStatusData({ closing: 0, opening: 0, totalRow: 0, upcoming: 0 }))
	}, [])

	const onSubmit = async (data) => {
		console.log('---- onSubmit: ', data)

		try {
			setLoading(true)
			const res = await accountApi.loginDev(data)
			if (res.status == 200) {
				playWithToken(res?.data, dispatch)
			}
		} catch (error) {
			alert(`Login Error: ${error?.message}`)
		}
	}

	return (
		<div>
			<Form form={form} onFinish={onSubmit}>
				<div className="m-4 flex">
					<Form.Item name="PassDev" className="mr-4">
						<Input defaultValue="m0n4medi" placeholder="PassDev" className="border-2 rounded-md mr-4 p-2 text-xl" />
					</Form.Item>

					<Form.Item name="Id" className="mr-4">
						<Input className="border-2 rounded-md mr-4 p-2 text-xl" placeholder="Id" />
					</Form.Item>
					<button className="bg-tw-orange text-white h-[42.5px] px-4 rounded font-semibold" type="submit">
						Go {loading && <Spin className="loading-spin" />}
					</button>
				</div>
			</Form>
			<div className="w-3/4 mx-4 border-2">
				<Table pagination={false} size="small" columns={columns} dataSource={accounts} />
			</div>
		</div>
	)
}

export default MonaSupportPattern
