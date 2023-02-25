import moment from 'moment'
import React, { useEffect, useState } from 'react'
import RestApi from '~/api/RestApi'
import DeleteTableRow from '~/common/components/Elements/DeleteTableRow'
import PaymentPerForm from '~/common/components/PaymentPermisstion/form'
import PrimaryTable from '~/common/components/Primary/Table'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { ShowNoti } from '~/common/utils'

const initParameters = { fullName: '', userCode: '', pageIndex: 1, pageSize: 10 }

const PaymentPage = () => {
	const [loading, setLoading] = useState(false)
	const [totalRow, setTotalRow] = useState(1)
	const [apiParameters, setApiParameters] = useState(initParameters)
	const [dataTable, setDataTable] = useState([])

	const handleDelete = async (id: string) => {
		try {
			const res = await RestApi.delete('/PaymentAllow', id)
			getUserPaymentAllow()
			ShowNoti('success', res.data.message)
			return res
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const columns = [
		{
			width: 160,
			title: 'Mã',
			dataIndex: 'UserCode',
			render: (text) => <p className="font-semibold">{text}</p>
		},
		{
			title: 'Họ tên',
			dataIndex: 'FullName',
			render: (text) => <p className="font-semibold text-[#1b73e8]">{text}</p>
		},
		{
			title: 'Ngày cấp',
			dataIndex: 'CreatedOn',
			render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
		},
		{
			title: 'Người cấp',
			dataIndex: 'CreatedBy',
			render: (text) => <p className="font-semibold text-[#1b73e8]">{text}</p>
		},
		{
			title: 'Chức năng',
			render: (data) => {
				return (
					<div className="flex items-center">
						<DeleteTableRow handleDelete={() => handleDelete(data.Id)} />
					</div>
				)
			}
		}
	]

	const getUserPaymentAllow = async () => {
		try {
			setLoading(true)
			const res = await RestApi.get<any>('/PaymentAllow', apiParameters)
			if (res.status === 200) {
				setDataTable(res.data.data)
				setTotalRow(res.data.totalRow)
			}
			if (res.status === 204) {
				setDataTable([])
			}
		} catch (error) {
			setLoading(true)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		getUserPaymentAllow()
	}, [apiParameters])

	return (
		<PrimaryTable
			loading={loading}
			total={totalRow}
			onChangePage={(event: number) => setApiParameters({ ...apiParameters, pageIndex: event })}
			TitleCard={
				<div className="flex justify-end w-full">
					<PaymentPerForm onRefresh={getUserPaymentAllow} />
				</div>
			}
			data={dataTable}
			columns={columns}
		/>
	)
}

export default PaymentPage
