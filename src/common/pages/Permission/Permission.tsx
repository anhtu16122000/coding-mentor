import { Card, Form, Table } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { permissionApi } from '~/api/permission'
import InputTextField from '~/common/components/FormControl/InputTextField'
import PermissionEditForm from '~/common/components/Permission/PermissionEditForm'
import PrimaryButton from '~/common/components/Primary/Button'
import PrimaryTable from '~/common/components/Primary/Table'
import { ShowNoti } from '~/common/utils'
import { parseSelectArray, wait } from '~/common/utils/common'

const Permission = () => {
	const [dataFunctionPermission, setDataFunctionPermission] = useState<IFunctionPermission[]>([])
	const [rolePermission, setRolePermission] = useState([])
	const [showTable, setShowTable] = useState(false)
	const convertRolePermissions = useMemo(() => {
		return rolePermission.map((role) => {
			return {
				text: role.title,
				value: role.value
			}
		})
	}, [rolePermission])

	const columns: any = [
		{
			title: 'ID',
			dataIndex: 'Id',
			key: 'Id',
			width: '150px'
		},
		{
			title: 'Controller',
			dataIndex: 'Controller',
			key: 'Controller',
			width: '150px'
		},
		{
			title: 'Action',
			dataIndex: 'Action',
			key: 'Action',
			width: '150px'
		},
		{
			title: 'Description',
			dataIndex: 'Description',
			key: 'Description',
			width: '250px'
		},
		{
			title: 'Allowed',
			dataIndex: 'Allowed',
			key: 'Allowed',
			width: '150px'
		},
		{
			title: 'RoleName',
			dataIndex: 'RoleName',
			key: 'RoleName',
			width: '150px',
			filters: convertRolePermissions,
			onFilter: (value: string, record) => {
				return record.Allowed.split(',').indexOf(value.toString()) !== -1
			}
		},
		{
			title: 'Chức năng',
			dataIndex: '',
			key: '',
			width: '100px',
			fixed: 'right',
			render: (text, item) => {
				return (
					<>
						<PermissionEditForm rolePermission={rolePermission} item={item} getFunctionPermission={getData} />
					</>
				)
			}
		}
	]

	const getRolePermission = async () => {
		try {
			const res = await permissionApi.getRolePermission()
			if (res.status === 200) {
				const convertData = parseSelectArray(res.data.data, 'Name', 'Id')
				setRolePermission(convertData)
			}
			if (res.status === 204) {
				setRolePermission([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const handShowTable = async () => {
		setShowTable(false)
		await wait(1)
		setShowTable(true)
	}

	useEffect(() => {
		getRolePermission()
	}, [])

	useEffect(() => {
		handShowTable()
	}, [])

	const [filters, setFilters] = useState({ search: '' })

	useEffect(() => {
		getData()
	}, [filters])

	async function getData() {
		try {
			const res = await permissionApi.searchPermession(filters)
			if (res.status === 200) {
				setDataFunctionPermission(res.data.data)
				if (res.data.data.length === 0) {
					ShowNoti('error', 'Xui tìm không ra')
				}
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const onSubmit = async (params) => {
		setFilters({ ...filters, ...params })
	}

	return (
		<div>
			<Form onFinish={onSubmit} layout={'inline'} className="w-96 flex items-center justify-end ml-auto my-4 mr-4">
				<InputTextField label="" name="search" placeholder="Muốn nhập gì nhập" />
				<PrimaryButton background="black" type="submit" icon="search">
					Tìm
				</PrimaryButton>
			</Form>
			{showTable && <PrimaryTable total={dataFunctionPermission.length} columns={columns} data={dataFunctionPermission} />}
		</div>
	)
}

export default Permission
