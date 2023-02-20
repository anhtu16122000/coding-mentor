import React, { useEffect, useState } from 'react'
import NestedTable from '~/common/components/Primary/Table/NestedTable'
import { parseToMoney } from '~/common/utils/common'
import { billApi } from '~/api/bill'

type IBillDetail = {
	dataRow?: any
}
export const BillDetail: React.FC<IBillDetail> = ({ dataRow }) => {
	const [loading, setLoading] = useState(false)
	const [dataTable, setDataTable] = useState([])

	const getBillDetail = async (Id) => {
		try {
			setLoading(true)
			const res = await billApi.getBillDetail(Id)
			if (res.status === 200) {
				setDataTable(res.data.data)
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
		if (dataRow) {
			getBillDetail(dataRow?.Id)
		}
	}, [dataRow])

	const columns = [
		{
			title: 'Khóa học',
			width: 200,
			dataIndex: 'ProgramName',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Số lượng',
			width: 100,
			dataIndex: 'Quantity'
		},
		{
			title: 'Giá',
			width: 200,
			dataIndex: 'Price',
			render: (text) => <>{parseToMoney(text)}</>
		},
		{
			title: 'Thành tiền',
			width: 200,
			dataIndex: 'TotalPrice',
			render: (text) => <>{parseToMoney(text)}</>
		}
	]

	return (
		<>
			<NestedTable loading={loading} addClass="basic-header" dataSource={dataTable} columns={columns} haveBorder={true} />
		</>
	)
}
