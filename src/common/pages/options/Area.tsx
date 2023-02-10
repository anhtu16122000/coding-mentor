import { EyeOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import moment from 'moment'
import Router from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { areaApi } from '~/api/area'
import PrimaryTable from '~/common/components/Primary/Table'
import FilterColumn from '~/common/components/FilterTable/Filter/FilterColumn'
import AreaForm from '~/common/components/Area/AreaForm'
import AreaRemoveForm from '~/common/components/Area/AreaRemoveForm'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import { useSelector } from 'react-redux'

const Area = () => {
	const [areaList, setAreaList] = useState<IArea[]>([])
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [totalPage, setTotalPage] = useState(null)
	const [activeColumnSearch, setActiveColumnSearch] = useState('')
	const { information: userInformation } = useSelector((state: RootState) => state.user)

	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: PAGE_SIZE,
		sort: 1,
		sortType: true,
		AreaName: ''
	}

	let refValue = useRef({
		pageIndex: 1,
		pageSize: 30,
		sort: -1,
		sortType: false
	})

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
	const fetchAreaList = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await areaApi.getAll(filters)
			if (res.status === 200) {
				setAreaList(res.data.data)
				setTotalPage(res.data.totalRow)
			} else if (res.status === 204) {
				setAreaList([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	useEffect(() => {
		fetchAreaList()
	}, [filters])

	// COLUMN FOR TABLE
	const columns = [
		{
			title: 'Tỉnh / Thành phố',
			dataIndex: 'AreaName',
			...FilterColumn('AreaName', onSearch, onResetSearch, 'text'),
			className: activeColumnSearch === 'AreaName' ? 'active-column-search' : '',
			render: (text) => <p className="text-primary weight-600">{text}</p>
		},
		{
			title: 'Ngày khởi tạo',
			dataIndex: 'ModifiedOn',
			render: (date) => moment(date).format('DD/MM/YYYY')
		},
		{
			title: 'Được tạo bởi',
			dataIndex: 'ModifiedBy',
			width: 100,
			align: 'center'
		},
		{
			align: 'center',
			render: (value, data, idx) => (
				<>
					<Tooltip title="Xem danh sách quận / huyện">
						<button
							onClick={() =>
								Router.push({
									pathname: '/options/district',
									query: { area: data.AreaID, name: data.AreaName }
								})
							}
							type="button"
							className="btn btn-icon exchange"
						>
							<EyeOutlined />
						</button>
					</Tooltip>
					<AreaForm dataRow={data} fetchAreaList={fetchAreaList} />
					<AreaRemoveForm dataRow={data} fetchAreaList={fetchAreaList} />
				</>
			)
		}
	]

	useEffect(() => {
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
					// TitlePage="DANH SÁCH TỈNH / THÀNH PHỐ"
					data={areaList}
					columns={columns}
					Extra={<AreaForm fetchAreaList={fetchAreaList} />}
				/>
			)}
		</>
	)
}

export default Area
