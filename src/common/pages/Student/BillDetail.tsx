import React, { useEffect, useState } from 'react'
import NestedTable from '~/common/components/Primary/Table/NestedTable'
import { parseToMoney } from '~/common/utils/common'
import { billApi } from '~/api/bill'
import { Tooltip } from 'antd'
import { ShowNostis } from '~/common/utils'
import { FiCopy } from 'react-icons/fi'

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

	const type1Colums = [
		{
			title: 'Lớp',
			dataIndex: 'ClassName',
			width: 130,
			render: (value, item) => <p className="font-[600] text-[#1E88E5]">{value}</p>
		},
		{
			title: 'Chương trình học',
			dataIndex: 'ProgramName',
			width: 130,
			render: (value, item) => <p className="font-[600] text-[#1E88E5]">{value}</p>
		}
	]

	const type2Colums = [
		{
			title: 'Sản phẩm',
			dataIndex: 'ProductName',
			width: 130,
			render: (value, item) => <p className="font-[600] text-[#1E88E5]">{value}</p>
		}
	]

	const type3Colums = [
		{
			title: 'Giáo trình',
			dataIndex: 'CurriculumName',
			width: 130,
			render: (value, item) => <p className="font-[600] text-[#1E88E5]">{value}</p>
		},
		{
			title: 'Chương trình học',
			dataIndex: 'ProgramName',
			width: 130,
			render: (value, item) => <p className="font-[600] text-[#1E88E5]">{value}</p>
		}
	]

	const defaultColumns = [
		{
			title: 'Giá tiền',
			dataIndex: 'Price',
			width: 116,
			render: (value, item) => <p className="font-[600] text-[#000]">{parseToMoney(value)}</p>
		},
		{
			title: 'Tổng số tiền',
			dataIndex: 'TotalPrice',
			width: 116,
			render: (value, item) => <p className="font-[600] text-[#000]">{parseToMoney(value)}</p>
		},
		{
			title: 'Số lượng',
			dataIndex: 'Quantity',
			width: 126
		},
		{
			title: 'Mã kích hoạt',
			dataIndex: 'ActiveCode',
			width: 170,
			render: (value, item) => {
				if (!value) return ''
				return (
					<Tooltip title="Sao chép" placement="right">
						<span
							className="tag blue is-button bold cursor-pointer"
							onClick={() => {
								navigator.clipboard.writeText(value || '')
								ShowNostis.success('Đã sao chép')
							}}
						>
							{value}
							<FiCopy size={14} className="ml-2" />
						</span>
					</Tooltip>
				)
			}
		}
	]

	const columns =
		dataRow?.Type == 1
			? [...type1Colums, ...defaultColumns]
			: dataRow?.Type == 2
			? [...type2Colums, ...defaultColumns]
			: [...type3Colums, ...defaultColumns]

	return <NestedTable loading={loading} addClass="basic-header" dataSource={dataTable} columns={columns} haveBorder={true} />
}
