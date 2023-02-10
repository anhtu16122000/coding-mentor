import { Tooltip } from 'antd'
import moment from 'moment'
import Router from 'next/router'
import router from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { wardApi } from '~/api/area'
import PrimaryTable from '~/common/components/Primary/Table'
import FilterColumn from '~/common/components/FilterTable/Filter/FilterColumn'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import WardForm from '~/common/components/Ward/WardForm'
import WardRemoveForm from '~/common/components/Ward/WardRemoveForm'
import { RootState } from '~/store'
import { useSelector } from 'react-redux'

const Ward = () => {
	const [districtList, setDistrictList] = useState<IWard[]>([])
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [totalPage, setTotalPage] = useState(null)
	const { information: userInformation } = useSelector((state: RootState) => state.user)
	const [activeColumnSearch, setActiveColumnSearch] = useState('')

	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: PAGE_SIZE,
		sort: -1,
		sortType: false,
		AreaName: '',
		AreaID: null,
		DistrictName: ''
	}

	let refValue = useRef({ pageIndex: 1, pageSize: 30, sort: -1, sortType: false })

	const [filters, setFilters] = useState(listFieldInit)

	// PAGINATION
	const getPagination = (pageIndex: number, pageSize: number) => {
		if (!pageSize) pageSize = 10
		refValue.current = { ...refValue.current, pageSize, pageIndex }
		setFilters({ ...filters, ...refValue.current })
	}

	// RESET SEARCH
	const onResetSearch = () => {
		setActiveColumnSearch('')
		setFilters({ ...listFieldInit, pageSize: refValue.current.pageSize })
	}

	// ACTION SEARCH
	const onSearch = (valueSearch, dataIndex) => {
		setActiveColumnSearch(dataIndex)
		setFilters({ ...listFieldInit, ...refValue.current, pageIndex: 1, [dataIndex]: valueSearch })
	}

	// GET DATA IN FIRST TIME
	const fetchWardList = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await wardApi.getAll({ ...filters, districtID: router.query.dis })
			if (res.status === 200) {
				setDistrictList(res.data.data)
				setTotalPage(res.data.totalRow)
			} else if (res.status === 204) {
				// showNoti('danger', 'Không tìm thấy')
				setDistrictList([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	useEffect(() => {
		fetchWardList()
	}, [filters])

	// COLUMN FOR TABLE
	const columns = [
		{
			title: 'Tên phường / xã',
			dataIndex: 'WardName',
			...FilterColumn('WardName', onSearch, onResetSearch, 'text'),
			className: activeColumnSearch === 'WardName' ? 'active-column-search' : '',
			render: (text) => <p className="text-primary weight-600">{text}</p>
		},
		{
			title: 'Ngày khởi tạo',
			dataIndex: 'ModifiedOn',
			render: (date) => moment(date).format('DD/MM/YYYY')
		},
		{
			title: 'Được tạo bởi',
			dataIndex: 'ModifiedBy'
		},
		{
			align: 'center',
			render: (value, data, idx) => (
				<>
					<WardForm dataRow={data} fetchWardList={fetchWardList} />
					<WardRemoveForm dataRow={data} fetchWardList={fetchWardList} />
				</>
			)
		}
	]

	useEffect(() => {
		// getTitlePage('')
		if (!!userInformation && userInformation?.RoleId != 1 && userInformation?.RoleId != 2 && userInformation?.RoleId != 5) {
			Router.push('/')
		}
	}, [userInformation])

	function show() {
		if (userInformation && (userInformation?.RoleId == 1 || userInformation?.RoleId == 2 || userInformation?.RoleId == 5)) {
			return true
		} else {
			return false
		}
	}

	// RETURN
	return (
		<>
			{show() && (
				<PrimaryTable
					// currentPage={filters.pageIndex}
					// totalPage={totalPage}
					// getPagination={getPagination}
					// loading={isLoading}
					// addClass="basic-header"
					data={districtList}
					columns={columns}
					TitleCard={`Danh sách phường / xã thuộc: ${Router.query?.name}`}
					Extra={<WardForm fetchWardList={fetchWardList} />}
				/>
			)}
		</>
	)
}

export default Ward
