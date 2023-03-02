import { Tooltip } from 'antd'
import React, { useEffect } from 'react'
import RestApi from '~/api/RestApi'
import { MainLayout } from '~/common'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNostis } from '~/common/utils'
import moment from 'moment'
import Head from 'next/head'
import appConfigs from '~/appConfig'
import Avatar from '~/common/components/Avatar'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { FiCopy } from 'react-icons/fi'

const initFilters = { PageSize: PAGE_SIZE, PageIndex: 1, Search: '' }

const TITLE_STUDENT = 'Danh sách mã kích hoạt'
const TITLE_ADMIN = 'Khoá học đã bán'

const CodesPage = () => {
	const [loading, setLoading] = React.useState(true)
	const [totalPage, setTotalPage] = React.useState(1)
	const [data, setData] = React.useState([])
	const [filters, setFilter] = React.useState(initFilters)

	const user = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return user?.RoleId == 1
	}

	function isTeacher() {
		return user?.RoleId == 2
	}

	function isManager() {
		return user?.RoleId == 4
	}

	function isStdent() {
		return user?.RoleId == 3
	}

	function isAccountant() {
		return user?.RoleId == 6
	}

	function isAcademic() {
		return user?.RoleId == 7
	}

	function isParent() {
		return user?.RoleId == 8
	}

	useEffect(() => {
		getData()
	}, [filters])

	async function getData() {
		setLoading(true)
		try {
			const res = await RestApi.get<any>('VideoActiveCode', { ...filters, studentId: isStdent() ? user?.UserInformationId : null })
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

	const adminColumns = [
		{
			title: 'Thông học viên',
			dataIndex: 'Code',
			width: 300,
			render: (value, item) => (
				<div className="flex items-center">
					<div className="">
						<h2 className="text-[16px] font-[500]">{item?.StudentName}</h2>
						<h2 className="text-[14px] font-[400]">{item?.StudentCode}</h2>
					</div>
				</div>
			)
		}
	]

	const columns = [
		{
			title: 'Thông tin',
			dataIndex: 'Code',
			width: 300,
			render: (value, item) => (
				<div className="flex items-center">
					<Avatar className="h-[40px] w-[40px] rounded-[4px] shadow-sm object-cover" uri={item?.Thumbnail} />
					<div className="ml-[16px]">
						<h2 className="text-[16px] font-[600]">{item?.ProductName}</h2>
					</div>
				</div>
			)
		},
		{
			title: 'Mã kích hoạt',
			dataIndex: 'ActiveCode',
			width: 170,
			render: (value, item) => (
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
		},
		{
			title: 'Trạng thái',
			dataIndex: 'IsUsed',
			aling: 'center',
			render: (value, data) => {
				return (
					<>
						{!value && <p className="tag blue">Chưa sử dụng</p>}
						{!!value && <p className="tag gray">Đã sử dụng</p>}
					</>
				)
			}
		},
		{
			title: 'Ngày duyệt',
			dataIndex: 'CreatedOn',
			width: 160,
			render: (value, item) => <div>{moment(value).format('DD/MM/YYYY HH:mm')}</div>
		},
		{
			title: 'Người duyệt',
			dataIndex: 'CreatedBy',
			width: 200,
			render: (value, item) => <p className="font-[600] text-[#1976D2]">{value}</p>
		}
	]

	return (
		<>
			<Head>
				<title>
					{appConfigs.appName} | {isStdent() ? TITLE_STUDENT : TITLE_ADMIN}
				</title>
			</Head>

			<ExpandTable
				currentPage={filters.PageIndex}
				totalPage={totalPage && totalPage}
				getPagination={(page: number) => setFilter({ ...filters, PageIndex: page })}
				loading={{ type: 'GET_ALL', status: loading }}
				dataSource={data}
				columns={isStdent() ? columns : [...adminColumns, ...columns]}
				TitleCard={`${isStdent() ? TITLE_STUDENT : TITLE_ADMIN}`}
			/>
		</>
	)
}

CodesPage.Layout = MainLayout
export default CodesPage
