import { Input } from 'antd'
import React, { useEffect, useState } from 'react'
import RestApi from '~/api/RestApi'
import { MainLayout } from '~/common'
import { PrimaryTooltip, StudentNote } from '~/common/components'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNostis } from '~/common/utils'
import { parseToMoney } from '~/common/utils/common'
import moment from 'moment'
import Head from 'next/head'
import appConfigs from '~/appConfig'
import Router from 'next/router'
import { ButtonEye } from '~/common/components/TableButton'
import { AddToClass, RefundForm } from '~/common/components/Student/Registration'
import { userInfoColumn } from '~/common/libs/columns/user-info'
import Filters from '~/common/components/Student/Filters'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import NestedTable from '~/common/components/NestedTable'
import FirstTepModal from './FirstTepModal'

const url = 'ClassRegistration'

const initFilters = { PageSize: PAGE_SIZE, PageIndex: 1, Search: '' }

const Registration = () => {
	const [loading, setLoading] = React.useState(true)
	const [totalPage, setTotalPage] = React.useState(1)
	const [data, setData] = React.useState([])
	const [filters, setFilter] = React.useState(initFilters)

	useEffect(() => {
		getData()
	}, [filters])

	async function getData() {
		setLoading(true)
		try {
			const res = await RestApi.get<any>(url, filters)
			if (res.status == 200) {
				setData(res.data.data)
				setTotalPage(res.data.totalRow)
			} else {
				setData([])
				setTotalPage(1)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	const Nesadgavcolumns = [
		{
			title: 'Thứ',
			dataIndex: 'ExectedDayName',
			render: (text) => <p>{text}</p>
		},
		{
			title: 'Ca học',
			dataIndex: 'StudyTimeName'
		}
	]

	const expandedRowRender = (item) => {
		return (
			<>
				{!!item?.Expectations && (
					<>
						<div className="font-[600]">Danh sách ca học:</div>
						<div className="mb-[8px] max-w-[1000px]">
							<NestedTable addClass="basic-header" dataSource={item?.Expectations} columns={Nesadgavcolumns} haveBorder={true} />
						</div>
					</>
				)}

				<div>Ghi chú: {item?.Note}</div>

				<div className="w-[1000px] mt-[16px]">
					<StudentNote studentId={item?.StudentId} />
				</div>
			</>
		)
	}

	const theInformation = useSelector((state: RootState) => state.user.information)

	function isSaler() {
		return theInformation?.RoleId == 5
	}

	function viewStudentDetails(params) {
		Router.push({
			pathname: '/info-course/student/detail',
			query: { StudentID: params?.StudentId }
		})
	}

	function handleColumn(value, item) {
		if (isSaler()) return ''

		return (
			<div className="flex item-center">
				<PrimaryTooltip content="Thông tin học viên" place="left" id={`view-st-${item?.Id}`}>
					<ButtonEye onClick={() => viewStudentDetails(item)} />
				</PrimaryTooltip>

				{item?.Status == 1 && (
					<>
						<AddToClass item={item} onRefresh={getData} />
						<RefundForm item={item} onRefresh={getData} />
					</>
				)}
			</div>
		)
	}

	const columns = [
		userInfoColumn,
		{
			title: 'Trung tâm',
			dataIndex: 'BranchName',
			className: 'font-[600]',
			width: 200
		},
		{
			title: 'Chương trình',
			dataIndex: 'ProgramName',
			width: 160,
			render: (value, item) => <div className="font-[600] text-[#000]">{value}</div>
		},
		{
			title: 'Số tiền',
			dataIndex: 'Price',
			width: 130,
			render: (value, item) => <p className="font-[600] text-[#1976D2]">{parseToMoney(value)}</p>
		},
		{
			title: 'Trạng thái',
			dataIndex: 'Status',
			width: 120,
			render: (value, item) => (
				<p className="font-[600] text-[#E53935]">
					{value == 1 && <span className="tag yellow">{item?.StatusName}</span>}
					{value == 2 && <span className="tag green">{item?.StatusName}</span>}
					{value == 3 && <span className="tag blue">{item?.StatusName}</span>}
					{value == 4 && <span className="tag red">{item?.StatusName}</span>}
				</p>
			)
		},
		{
			title: 'Ngày đăng ký',
			dataIndex: 'CreatedOn',
			width: 160,
			render: (value, item) => <p className="font-[400]">{moment(value).format('DD/MM/YYYY HH:mm')}</p>
		},
		{
			title: 'Người tạo',
			dataIndex: 'CreatedBy',
			width: 150,
			render: (value, item) => <p className="font-[600] text-[#1976D2]">{value}</p>
		},
		{
			title: '',
			dataIndex: 'Type',
			width: 60,
			fixed: 'right',
			render: handleColumn
		}
	]

	const [selected, setSelected] = useState([])

	// rowSelection object indicates the need for row selection
	const rowSelection = {
		onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
			setSelected(selectedRows)
		},
		getCheckboxProps: (record: any) => ({
			disabled: record.name === 'Disabled User', // Column configuration not to be checked
			name: record.name
		})
	}

	console.log('selected: ', selected)

	const [curStep, setCurStep] = useState(1)

	return (
		<>
			<Head>
				<title>{appConfigs.appName} | Học viên bảo lưu</title>
			</Head>

			<ExpandTable
				rowSelection={curStep == 1 ? null : { type: 'checkbox', ...rowSelection }}
				// ---------
				currentPage={filters.PageIndex}
				totalPage={totalPage && totalPage}
				getPagination={(page: number) => setFilter({ ...filters, PageIndex: page })}
				loading={{ type: 'GET_ALL', status: loading }}
				dataSource={data}
				columns={columns}
				TitleCard={
					<div className="w-full flex items-center">
						{curStep > 1 && <div>Đã chọn: {selected?.length}</div>}

						{curStep == 1 && (
							<>
								<Filters
									showBranch
									showProgram
									statusList={[
										{ value: 1, title: 'Chờ xếp lớp' },
										{ value: 2, title: 'Đã xếp lớp' },
										{ value: 3, title: 'Đã hoàn tiền' }
									]}
									filters={filters}
									onSubmit={(event) => setFilter(event)}
									onReset={() => setFilter(initFilters)}
								/>
								<Input.Search
									className="primary-search max-w-[300px] ml-[8px]"
									onChange={(event) => {
										if (event.target.value == '') {
											setFilter({ ...filters, PageIndex: 1, Search: '' })
										}
									}}
									onSearch={(event) => setFilter({ ...filters, PageIndex: 1, Search: event })}
									placeholder="Tìm kiếm"
								/>
							</>
						)}
					</div>
				}
				Extra={
					<>
						{curStep == 2 && (
							<div className="mr-[8px]">
								<AddToClass
									isTop
									items={selected}
									onRefresh={getData}
									setStep={(e) => {
										setCurStep(e)
										setSelected([])
										setFilter(initFilters)
									}}
								/>
							</div>
						)}

						<FirstTepModal
							filters={filters}
							curStep={curStep}
							onReset={() => {
								setCurStep(1)
								setFilter(initFilters)
							}}
							onSubmit={(event) => {
								setFilter({ ...event, status: 1 })
								setCurStep(2)
							}}
						/>
					</>
				}
				expandable={expandedRowRender}
			/>
		</>
	)
}

export default Registration
