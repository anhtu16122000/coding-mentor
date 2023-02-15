import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { salaryConfigApi } from '~/api/salary'
import PrimaryTable from '~/common/components/Primary/Table'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import FilterTable from '~/common/utils/table-filter'
import CCSearch from '../../components/CCSearch'
import { ModalSalaryConfigCRUD } from './ModalSalaryConfigCRUD'
const initParameters = { fullName: '', userCode: '', pageIndex: 1, pageSize: PAGE_SIZE }
export const SalaryConfigPage = () => {
	const [apiParameters, setApiParameters] = useState(initParameters)
	const [totalRow, setTotalRow] = useState(1)
	const [dataTable, setDataTable] = useState([])
	const [loading, setLoading] = useState(false)

	const getSalaryConfig = async (params) => {
		try {
			setLoading(true)
			const res = await salaryConfigApi.getAll(params)
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
		if (apiParameters) {
			getSalaryConfig(apiParameters)
		}
	}, [apiParameters])

	const columns = [
		{
			...FilterTable({
				type: 'search',
				dataIndex: 'UserCode',
				handleSearch: (event) => setApiParameters({ ...apiParameters, userCode: event }),
				handleReset: (event) => setApiParameters(initParameters)
			}),
			width: 160,
			title: 'Mã người dùng',
			dataIndex: 'UserCode',
			render: (text) => <p className="font-semibold">{text}</p>
		},
		{
			...FilterTable({
				type: 'search',
				dataIndex: 'FullName',
				handleSearch: (event) => setApiParameters({ ...apiParameters, fullName: event }),
				handleReset: (event) => setApiParameters(initParameters)
			}),
			title: 'Họ tên',
			dataIndex: 'FullName',
			render: (text) => <p className="font-semibold">{text}</p>
		},
		{
			title: 'Chức vụ',
			dataIndex: 'RoleName',
			render: (text) => <>{text}</>
		},
		{
			title: 'Mức lương',
			dataIndex: 'Value',
			render: (text) => <>{Intl.NumberFormat('ja-JP').format(text)}</>
		},
		{
			title: 'Thêm lúc',
			dataIndex: 'CreatedOn',
			render: (date) => moment(date).format('DD/MM/YYYY')
		},
		{
			title: 'Chức năng',
			dataIndex: 'Action',
			render: (text, item) => {
				return (
					<div className="flex items-center">
						<ModalSalaryConfigCRUD mode="edit" onRefresh={() => getSalaryConfig(apiParameters)} dataRow={item} />
						<ModalSalaryConfigCRUD mode="delete" onRefresh={() => getSalaryConfig(apiParameters)} dataRow={item} />
					</div>
				)
			}
		}
	]

	return (
		<div className="salaryConfig-page-list">
			<PrimaryTable
				loading={loading}
				total={totalRow}
				onChangePage={(event: number) => setApiParameters({ ...apiParameters, pageIndex: event })}
				TitleCard={
					<div className="extra-table">
						<div className="flex-1 max-w-[350px] mr-[16px]">
							<CCSearch onSubmit={(value) => setApiParameters({ ...apiParameters, fullName: value })} />
						</div>
					</div>
				}
				data={dataTable}
				columns={columns}
				Extra={
					<>
						<ModalSalaryConfigCRUD mode="add" onRefresh={() => getSalaryConfig(apiParameters)} />
					</>
				}
			/>
		</div>
	)
}
