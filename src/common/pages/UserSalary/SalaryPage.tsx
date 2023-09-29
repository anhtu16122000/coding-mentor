import { Button, Checkbox, DatePicker, Popconfirm, Popover, Select, Tooltip } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { staffSalaryApi } from '~/api/business/staff-salary'
import PrimaryTable from '~/common/components/Primary/Table'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { is, parseToMoney } from '~/common/utils/common'
import FilterTable from '~/common/utils/table-filter'
import { ModalSalaryCRUD } from './ModalSalaryCRUD'
import { ModalTeachingDetail } from './ModalTeachingDetail'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import TabComp from '~/common/custom/TabComp'
import { TabCompData } from '~/common/custom/TabComp/type'
import { EditOutlined } from '@ant-design/icons'
import ModalBankInformation from './ModalBankInformation'

export const SalaryPage = () => {
	// const [valueDate, setValueDate] = useState(moment().subtract(1, 'months'))

	const initParameters = { fullName: '', userCode: '', year: null, month: null, pageIndex: 1, pageSize: PAGE_SIZE, status: 0 }
	const [apiParameters, setApiParameters] = useState(initParameters)
	const [totalRow, setTotalRow] = useState(1)
	const [dataTable, setDataTable] = useState([])
	const [loading, setLoading] = useState(false)
	const [time, setTime] = useState(null)
	const [salaryStatus, setSalaryStatus] = useState<TabCompData[]>()
	const [statusSelected, setStatusSelected] = useState<number>(0)
	const [itemsChecked, setItemsChecked] = useState<any[]>([])
	const [statusUpdate, setStatusUpdate] = useState<number>(null)

	const theInformation = useSelector((state: RootState) => state.user.information)

	const [valueDate, setValueDate] = useState(
		is(theInformation).admin || is(theInformation).accountant ? moment().subtract(1, 'months') : null
	)

	useEffect(() => {
		if (valueDate) {
			const year = Number(moment(valueDate).format('YYYY'))
			const month = Number(moment(valueDate).format('MM'))
			setApiParameters({ ...apiParameters, month: month, year: year })
			setTime({ month: month, year: year })
		} else {
			setApiParameters({ ...apiParameters, month: null, year: null })
			setTime({ month: null, year: null })
		}
	}, [valueDate])

	useEffect(() => {
		if (apiParameters) {
			getSalary(apiParameters)
		}
	}, [apiParameters])

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
				setSalaryStatus([
					{
						id: 0,
						title: 'Tất cả',
						value: res?.data?.AllState
					},
					{
						id: 1,
						title: 'Chưa chốt',
						value: res?.data?.Unfinished
					},
					{
						id: 2,
						title: 'Đã chốt',
						value: res?.data?.Finished
					},
					{
						id: 3,
						title: 'Đã thanh toán',
						value: res?.data?.Paid
					}
				])
			} else {
				setDataTable([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	const handleUpdate = async () => {
		try {
			setLoading(true)
			if (statusUpdate !== null) {
				const data = {
					Ids: itemsChecked,
					Status: statusUpdate
				}
				const res = await staffSalaryApi.updateStatus(data)
				if (res.status === 200) {
					// onClose()
					getSalary(apiParameters)
					// onRefresh()
					setLoading(false)
					setStatusUpdate(null)
					setItemsChecked([])
					ShowNoti('success', res.data.message)
				}
			} else {
				ShowNoti('error', 'Vui lòng chọn trạng thái!')
			}
		} catch (error) {
			setLoading(true)
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
			title: 'Nhân viên',
			dataIndex: 'FullName',
			render: (text) => <p className="font-semibold text-[#1b73e8] min-w-[120px]">{text}</p>
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
						<ModalBankInformation item={item} />

						<ModalSalaryCRUD mode="edit" onRefresh={() => getSalary(apiParameters)} dataRow={item} />
					</div>
				)
			}
		}
	]

	const handleSelecStatus = (status: number) => {
		if (statusSelected !== status) {
			setApiParameters({ ...apiParameters, status })
			setStatusSelected(status)
		}
	}

	const text = `Cập nhật trạng thái của ${itemsChecked.length} nhân viên!`

	const content = (
		<div style={{ display: 'flex', flexDirection: 'column', width: 300 }}>
			<Select
				style={{ width: '100%' }}
				options={[
					{ label: 'Chưa chốt', value: 1 },
					{ label: 'Đã chốt', value: 2 },
					{ label: 'Đã thanh toán', value: 3 }
				]}
				placeholder="Chọn trạng thái"
				onChange={(v) => {
					setStatusUpdate(v)
				}}
			/>
			<div style={{ marginTop: 10, marginLeft: 'auto' }}>
				<Button onClick={handleUpdate} type="primary">
					Lưu
				</Button>
			</div>
		</div>
	)

	const checkColumn = {
		title: '',
		dataIndex: 'Id',
		render: (text, item) => {
			if (isSaler() || isAcademic() || isTeacher()) return ''
			return (
				<div className="flex items-center">
					<Checkbox
						defaultChecked={false}
						checked={itemsChecked.includes(text)}
						disabled={item.Status == 3}
						onChange={(e) => {
							if (itemsChecked.includes(text)) {
								setItemsChecked(itemsChecked.filter((e) => e !== text))
							} else {
								setItemsChecked((prev) => [...prev, text])
							}
						}}
					/>
				</div>
			)
		}
	}

	return (
		<div className="salary-page-list">
			<PrimaryTable
				loading={loading}
				total={totalRow}
				onChangePage={(event: number) => setApiParameters({ ...apiParameters, pageIndex: event })}
				TitleCard={
					<div className="flex items-center">
						{!!theInformation && (
							<DatePicker
								className="primary-input mr-[8px]"
								onChange={handleFilterMonth}
								picker="month"
								placeholder="Chọn tháng"
								// value={valueDate}
								defaultValue={is(theInformation).admin || is(theInformation).accountant ? moment().subtract(1, 'months') : null}
							/>
						)}
					</div>
				}
				data={dataTable}
				columns={is(theInformation).admin ? [checkColumn, ...columns] : [...columns]}
				Extra={
					<>
						{(isAdmin() || isAccountant()) && itemsChecked.length > 0 && (
							<div style={{ color: '#fff', backgroundColor: '#07BC0C', borderRadius: 8, marginRight: 6, padding: 12, fontWeight: '600' }}>
								<Popover placement="left" title={text} content={content} trigger="click">
									<Tooltip title="Cập nhật trạng thái" style={{ borderRadius: 4 }}>
										<EditOutlined />
									</Tooltip>
								</Popover>
							</div>
						)}

						{(isAdmin() || isAccountant()) && (
							<div className="mr-2">
								<ModalSalaryCRUD time={time} mode="salary" onRefresh={() => getSalary(apiParameters)} />
							</div>
						)}

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
			>
				{isAdmin() && (
					<div id="tabcomp-custom-container-scroll-horizontal" className="tabcomp-custom-container mb-[8px]">
						<TabComp data={salaryStatus} selected={statusSelected} handleSelected={handleSelecStatus} />
					</div>
				)}
			</PrimaryTable>
		</div>
	)
}
