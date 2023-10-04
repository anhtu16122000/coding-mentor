import { Input } from 'antd'
import Head from 'next/head'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import RestApi from '~/api/RestApi'
import appConfigs from '~/appConfig'
import { PrimaryTooltip, StudentNote } from '~/common/components'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import Filters from '~/common/components/Student/Filters'
import { ButtonEye } from '~/common/components/TableButton'
import { userInfoColumn } from '~/common/libs/columns/user-info'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNostis } from '~/common/utils'
import { RootState } from '~/store'
import { DataType } from './type'

const initFilters = { PageSize: PAGE_SIZE, PageIndex: 1, Search: '' }

const StudentInNearingCompletion = () => {
	const [loading, setLoading] = useState<boolean>(true)
	const [totalPage, setTotalPage] = useState<number>(1)
	const [data, setData] = useState<DataType[]>([])
	const [filters, setFilter] = useState<any>(initFilters)

	useEffect(() => {
		getData()
	}, [filters])

	async function getData() {
		setLoading(true)
		try {
			const res = await RestApi.get<any>('/StudentInClass/student-inregis', filters)
			if (res?.status === 200) {
				setData(res?.data?.data)
				setTotalPage(res?.data?.totalRow)
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

	function viewStudentDetails(params) {
		Router.push({
			pathname: '/info-course/student/detail',
			query: { StudentID: params?.StudentId }
		})
	}

	const theInformation = useSelector((state: RootState) => state.user?.information)

	function handleColumn(value, item) {
		if (theInformation?.RoleId === 5) return ''

		return (
			<div className="flex item-center">
				<PrimaryTooltip content="Thông tin học viên" place="left" id={`view-st-${item?.Id}`}>
					<ButtonEye onClick={() => viewStudentDetails(item)} />
				</PrimaryTooltip>
			</div>
		)
	}

	const columns = [
		userInfoColumn,
		{
			width: 400,
			title: 'Liên hệ',
			dataIndex: 'Mobile',
			render: (a, item) => (
				<div>
					<p>
						<div className="font-[500] inline-block">Điện thoại:</div> {a}
					</p>
					<p>
						<div className="font-[500] inline-block">Email:</div> {item?.Email}
					</p>
				</div>
			)
		},
		{
			title: 'Giới tính',
			width: 100,
			dataIndex: 'Gender',
			render: (value, record) => (
				<>
					{value === 0 && <span className="tag yellow">Khác</span>}
					{value === 1 && <span className="tag blue">Nam</span>}
					{value === 2 && <span className="tag green">Nữ</span>}
					{value === 3 && <span className="tag yellow">Khác</span>}
				</>
			)
		},
		{
			title: 'Buổi còn lại',
			dataIndex: 'Type',
			align: 'center',
			width: 150,
			render: (value, item) => <span style={{ color: item?.TotalLesson < 10 ? 'red' : '#212121' }}>{item?.TotalLesson}</span>
		},
		{
			title: '',
			dataIndex: 'Type',
			width: 60,
			fixed: 'right',
			render: handleColumn
		}
	]

	const expandedRowRender = (data) => {
		return (
			<div className="w-[1000px]">
				<StudentNote studentId={data?.StudentId} />
			</div>
		)
	}

	return (
		<>
			<Head>
				<title>{appConfigs.appName} | Học viên sắp học xong</title>
			</Head>

			<ExpandTable
				currentPage={filters?.PageIndex}
				totalPage={totalPage && totalPage}
				getPagination={(page: number) => setFilter({ ...filters, PageIndex: page })}
				loading={{ type: 'GET_ALL', status: loading }}
				dataSource={data || []}
				columns={columns}
				TitleCard={
					<div className="w-full flex items-center">
						<Filters
							showBranch
							showSort
							showLessonRemaining
							filters={filters}
							onSubmit={(event) => setFilter(event)}
							onReset={() => setFilter(initFilters)}
						/>
						<Input.Search
							className="primary-search max-w-[250px] ml-[8px]"
							onChange={(event) => {
								if (event.target.value === '') {
									setFilter({ ...filters, PageIndex: 1, Search: '' })
								}
							}}
							onSearch={(event) => setFilter({ ...filters, PageIndex: 1, Search: event })}
							placeholder="Tìm kiếm"
						/>
					</div>
				}
				expandable={expandedRowRender}
			/>
		</>
	)
}

export default StudentInNearingCompletion
