import { DatePicker, Popconfirm } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { staffSalaryApi } from '~/api/staff-salary'
import PrimaryTable from '~/common/components/Primary/Table'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { parseToMoney } from '~/common/utils/common'
import FilterTable from '~/common/utils/table-filter'
import { ModalSalaryCRUD } from './ModalSalaryCRUD'
import { ModalTeachingDetail } from './ModalTeachingDetail'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

export const SalaryPage = () => {
	const [valueDate, setValueDate] = useState(moment().subtract(1, 'months'))
	const initParameters = { fullName: '', userCode: '', year: null, month: null, pageIndex: 1, pageSize: PAGE_SIZE }
	const [apiParameters, setApiParameters] = useState(initParameters)
	const [totalRow, setTotalRow] = useState(1)
	const [dataTable, setDataTable] = useState([])
	const [loading, setLoading] = useState(false)
	const [time, setTime] = useState(null)

	useEffect(() => {
		if (valueDate) {
			const year = Number(moment(valueDate).format('YYYY'))
			const month = Number(moment(valueDate).format('MM'))
			setApiParameters({ ...apiParameters, month: month, year: year })
			setTime({ month: month, year: year })
		}
	}, [valueDate])

	useEffect(() => {
		if (!!apiParameters?.year) {
			getSalary(apiParameters)
		}
	}, [apiParameters])

	const theInformation = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return theInformation?.RoleId == 1
	}

	function isTeacher() {
		return theInformation?.RoleId == 2
	}

	function isManager() {
		return theInformation?.RoleId == 4
	}

	function isStdent() {
		return theInformation?.RoleId == 3
	}

	function isSaler() {
		return theInformation?.RoleId == 5
	}

	function isAccountant() {
		return theInformation?.RoleId == 6
	}

	function isAcademic() {
		return theInformation?.RoleId == 7
	}

	const handleFilterMonth = (data) => {
		setValueDate(data)
	}

	const handleReset = () => {
		if (valueDate) {
			const year = Number(moment(valueDate).format('YYYY'))
			const month = Number(moment(valueDate).format('MM'))
			setApiParameters({ ...initParameters, month: month, year: year })
		}
	}

	const handleSalaryClosing = async () => {
		try {
			const res = await staffSalaryApi.addSalaryClosing()
			if (res.status === 200) {
				ShowNoti('success', res.data.message)
				const year = Number(moment(valueDate).format('YYYY'))
				const month = Number(moment(valueDate).format('MM'))
				setApiParameters({ ...initParameters, month: month, year: year })
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	const getSalary = async (params) => {
		try {
			setLoading(true)
			const res = await staffSalaryApi.getAll(params)
			if (res.status == 200) {
				setDataTable(res.data.data)
				setTotalRow(res.data.totalRow)
			} else {
				setDataTable([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	const columns = [
		{
			...FilterTable({
				type: 'search',
				dataIndex: 'FullName',
				handleSearch: (event) => setApiParameters({ ...apiParameters, fullName: event }),
				handleReset: (event) => handleReset()
			}),
			width: 200,
			title: 'Nhân viên',
			dataIndex: 'FullName',
			render: (text) => <p className="font-semibold text-[#1b73e8]">{text}</p>
		},
		{
			title: 'Năm',
			width: 80,
			dataIndex: 'Year',
			render: (text) => <>{text}</>
		},
		{
			title: 'Tháng',
			width: 80,
			dataIndex: 'Month',
			render: (text) => <>{text}</>
		},
		{
			title: 'Thưởng',
			width: 80,
			dataIndex: 'Bonus',
			render: (text) => <>{parseToMoney(text)}</>
		},
		{
			title: 'Ghi chú',
			width: 200,
			dataIndex: 'Note',
			render: (text) => <>{text}</>
		},
		{
			title: 'Trạng thái',
			width: 150,
			dataIndex: 'StatusName',
			render: (text, item) => (
				<>
					<span className={`tag ${item?.Status == 1 ? 'gray' : item?.Status == 2 ? 'green' : 'blue'}`}>{text}</span>
				</>
			)
		},
		{
			title: 'Trừ tạm ứng',
			width: 150,
			dataIndex: 'Deduction',
			render: (text) => <>{parseToMoney(text)}</>
		},
		{
			title: 'Lương cơ bản',
			width: 150,
			dataIndex: 'BasicSalary',
			render: (text) => <>{parseToMoney(text)}</>
		},
		{
			title: 'Lương giảng dạy',
			width: 150,
			dataIndex: 'TeachingSalary',
			render: (text, item) => <ModalTeachingDetail dataRow={item} />
		},
		{
			title: 'Lương tổng',
			width: 150,
			dataIndex: 'TotalSalary',
			render: (text) => <>{parseToMoney(text)}</>
		},
		{
			title: '',
			dataIndex: 'Action',
			render: (text, item) => {
				if (isSaler() || isAcademic() || isTeacher()) return ''
				return (
					<div className="flex items-center">
						<ModalSalaryCRUD mode="edit" onRefresh={() => getSalary(apiParameters)} dataRow={item} />
					</div>
				)
			}
		}
	]

	return (
		<div className="salary-page-list">
			<PrimaryTable
				loading={loading}
				total={totalRow}
				onChangePage={(event: number) => setApiParameters({ ...apiParameters, pageIndex: event })}
				TitleCard={
					<div className="extra-table">
						<div className="flex-1 max-w-[350px] mr-[16px]">
							<DatePicker onChange={handleFilterMonth} picker="month" placeholder="Chọn tháng" value={valueDate} />
						</div>
					</div>
				}
				data={dataTable}
				columns={columns}
				Extra={
					<>
						<div className="mr-2">
							<ModalSalaryCRUD time={time} mode="salary" onRefresh={() => getSalary(apiParameters)} />
						</div>
						{(isAdmin() || isAccountant()) && (
							<Popconfirm
								title={`Xác nhận tính lương từ ${moment().subtract(1, 'months').startOf('month').format('DD-MM-YYYY')} đến ${moment()
									.subtract(1, 'months')
									.endOf('month')
									.format('DD-MM-YYYY')}?`}
								okText="Ok"
								cancelText="No"
								onConfirm={handleSalaryClosing}
							>
								<button
									type="button"
									className={`font-medium none-selection rounded-lg h-[38px] px-3 inline-flex items-center justify-center text-white bg-[#0A89FF] hover:bg-[#157ddd] focus:bg-[#1576cf]`}
								>
									Tính lương tháng trước
								</button>
							</Popconfirm>
						)}
					</>
				}
			/>
		</div>
	)
}
