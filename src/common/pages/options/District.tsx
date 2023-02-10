import { EyeOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import moment from 'moment'
import Router from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { districtApi } from '~/api/area'
import PrimaryTable from '~/common/components/Primary/Table'
import FilterColumn from '~/common/components/FilterTable/Filter/FilterColumn'
import DistrictForm from '~/common/components/District/DistrictForm'
import DistrictRemoveForm from '~/common/components/District/DistrictRemoveForm'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'

const District = () => {
	const [districtList, setDistrictList] = useState<IDistrict[]>([])
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
	const fetchDistrictList = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await districtApi.getAll({ ...filters, areaID: Router.query?.area })
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
		fetchDistrictList()
	}, [filters])

	// COLUMN FOR TABLE
	const columns = [
		{
			title: 'Quận / Huyện',
			dataIndex: 'DistrictName',
			...FilterColumn('DistrictName', onSearch, onResetSearch, 'text'),
			className: activeColumnSearch === 'DistrictName' ? 'active-column-search' : '',
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
					<Tooltip title="Xem danh sách phường / xã">
						<button
							onClick={() => Router.push({ pathname: '/options/ward', query: { dis: data?.ID, name: data?.DistrictName } })}
							type="button"
							className="btn btn-icon exchange"
						>
							<EyeOutlined />
						</button>
					</Tooltip>
					<DistrictForm dataRow={data} fetchDistrictList={fetchDistrictList} />
					<DistrictRemoveForm dataRow={data} fetchDistrictList={fetchDistrictList} />
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
					TitleCard={`Danh sách quận / huyện thuộc: ${Router.query?.name}`}
					// currentPage={filters.pageIndex}
					// totalPage={totalPage}
					// getPagination={getPagination}
					// loading={isLoading}
					// addClass="basic-header"
					Extra={<DistrictForm fetchDistrictList={fetchDistrictList} />}
					data={districtList}
					columns={columns}
				/>
			)}
		</>
	)
}

export default District
