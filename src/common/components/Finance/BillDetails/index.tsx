import { Tooltip } from 'antd'
import React, { useEffect } from 'react'
import { FiCopy } from 'react-icons/fi'
import RestApi from '~/api/RestApi'
import PrimaryTable from '~/common/components/Primary/Table'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNostis } from '~/common/utils'
import { parseToMoney } from '~/common/utils/common'

const BillDetails = ({ bill }) => {
	const [totalPage, setTotalPage] = React.useState(1)
	const [data, setData] = React.useState(null)
	const [filters, setFilter] = React.useState({ PageSize: PAGE_SIZE, PageIndex: 1, Search: '' })

	useEffect(() => {
		getData()
	}, [])

	async function getData() {
		try {
			const res = await RestApi.getByID<any>('Bill/detail', bill?.Id)
			if (res.status == 200) {
				setData(res.data.data)
				setTotalPage(res.data.totalRow)
			} else {
				setData(null)
				setTotalPage(1)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

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
		bill?.Type == 1
			? [...type1Colums, ...defaultColumns]
			: bill?.Type == 2
			? [...type2Colums, ...defaultColumns]
			: [...type3Colums, ...defaultColumns]

	return (
		<>
			<div>
				<div className="font-[600]">Ghi chú:</div> {bill?.Note}
			</div>
			<div className="w-[1300px]">
				<PrimaryTable
					current={filters.PageIndex}
					total={totalPage && totalPage}
					onChangePage={(page: number) => setFilter({ ...filters, PageIndex: page })}
					data={data}
					columns={columns}
				/>
			</div>
		</>
	)
}

export default BillDetails
