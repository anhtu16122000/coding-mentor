import { Tooltip } from 'antd'
import moment from 'moment'
import Link from 'next/link'
import Router from 'next/router'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { Eye } from 'react-feather'
import { gradeApi } from '~/api/grade'
import { programApi } from '~/api/program'
import SortBox from '~/common/components/Elements/SortBox'
import ProgramForm from '~/common/components/Program/ProgramForm'
import PrimaryTable from '~/common/components/Primary/Table'
import FilterColumn from '~/common/components/FilterTable/Filter/FilterColumn'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { useDispatch } from 'react-redux'
import { setSpecialize } from '~/store/specializeReducer'
import { parseSelectArray } from '~/common/utils/common'
import DeleteTableRow from '~/common/components/Elements/DeleteTableRow'
import ProgramAddTeacherForm from '~/common/components/Program/ProgramAddTeacherForm'
import FilterBase from '~/common/components/Elements/FilterBase'
import IconButton from '~/common/components/Primary/IconButton'
import Head from 'next/head'
import appConfigs from '~/appConfig'

let pageIndex = 1

let listFieldFilter = {
	pageIndex: 1,
	gradeId: null,
	type: null
}

const dataOption = [
	{
		dataSort: {
			sort: 1,
			sortType: false
		},
		text: 'Tên Z - A'
	},
	{
		dataSort: {
			sort: 1,
			sortType: true
		},
		text: 'Tên A - Z'
	},
	{
		dataSort: {
			sort: 0,
			sortType: false
		},
		text: 'Mới - cũ'
	},
	{
		dataSort: {
			sort: 0,
			sortType: true
		},
		text: 'Cũ - mới'
	}
]

const Programs = () => {
	const [dataSource, setDataSource] = useState<IProgram[]>([])
	const { information: userInformation } = useSelector((state: RootState) => state.user)
	const state = useSelector((state: RootState) => state)
	const dispatch = useDispatch()
	const [dataFilter, setDataFilter] = useState([
		{
			name: 'gradeId',
			title: 'Chuyên môn',
			col: 'col-md-12 col-12',
			type: 'select',
			optionList: [],
			value: null,
			placeholder: 'Chọn chuyên môn'
		}
	])
	const [isLoading, setIsLoading] = useState(false)
	const [totalPage, setTotalPage] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)

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

	function isAcademic() {
		return theInformation?.RoleId == 7
	}

	const listTodoApi = {
		pageSize: PAGE_SIZE,
		pageIndex: pageIndex,
		sort: 0,
		sortType: false,
		Code: null,
		Name: null,
		Type: null
	}

	const [todoApi, setTodoApi] = useState(listTodoApi)

	const specialize = useMemo(() => {
		const convertData = parseSelectArray(state.specialize.Specialize, 'Name', 'Id')
		dataFilter[0].optionList = convertData
		setDataFilter(dataFilter)
		return convertData
	}, [state.specialize])

	// GET DATA SOURCE
	const getDataSource = async () => {
		setIsLoading(true)
		try {
			let res = await programApi.getAll(todoApi)
			if (res.status === 200) {
				setDataSource(res.data.data)
				setTotalPage(res.data.totalRow)
			}
			if (res.status === 204) {
				setDataSource([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	// GET DATA CENTER
	const getDataGrade = async () => {
		try {
			let res = await gradeApi.getAll({ pageIndex: 1, pageSize: 99999 })
			if (res.status === 200) {
				dispatch(setSpecialize(res.data.data))
			}
			if (res.status === 204) {
				dispatch(setSpecialize([]))
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	// HANDLE FILTER
	const handleFilter = (listFilter) => {
		let newListFilter = { ...listFieldFilter }
		listFilter.forEach((item, index) => {
			let key = item.name
			Object.keys(newListFilter).forEach((keyFilter) => {
				if (keyFilter == key) {
					newListFilter[key] = item.value
				}
			})
		})
		setTodoApi({ ...listTodoApi, ...newListFilter, pageIndex: 1 })
	}

	// HANDLE SORT
	const handleSort = async (option) => {
		let newTodoApi = {
			...listTodoApi,
			pageIndex: 1,
			sort: option.title.sort,
			sortType: option.title.sortType
		}
		setCurrentPage(1), setTodoApi(newTodoApi)
	}

	// ON SEARCH
	const onSearch = (valueSearch, dataIndex) => {
		setTodoApi({ ...listTodoApi, [dataIndex]: valueSearch })
	}

	// HANDLE RESET
	const resetListFieldSearch = () => {
		Object.keys(listFieldFilter).forEach(function (key) {
			if (key != 'pageIndex') {
				listFieldFilter[key] = null
			}
		})
	}

	const handleReset = () => {
		setTodoApi({ ...listTodoApi, pageIndex: 1 })
		setCurrentPage(1), resetListFieldSearch()
	}

	const handleDelete = async (id) => {
		try {
			const res = await programApi.delete(id)
			if (res.status === 200) {
				setTodoApi(listTodoApi)
				ShowNoti('success', res.data.message)
				return res
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	// USE EFFECT - FETCH DATA
	useEffect(() => {
		getDataSource()
	}, [todoApi])

	useEffect(() => {
		if (state.specialize.Specialize.length === 0) {
			getDataGrade()
		}
	}, [])

	// COLUMN
	const columns = [
		{
			title: 'Chuyên môn',
			width: 200,
			dataIndex: 'GradeName',
			render: (text) => {
				return <p className="font-weight-black">{text}</p>
			}
		},
		{
			title: 'Mã chương trình',
			width: 170,
			dataIndex: 'Code',
			...FilterColumn('Code', onSearch, handleReset, 'text'),
			render: (value) => <span className="weight-600">{value}</span>
		},
		{
			title: 'Tên chương trình',
			dataIndex: 'Name',
			width: 170,
			...FilterColumn('Name', onSearch, handleReset, 'text'),
			render: (text) => {
				return <p className="font-weight-primary">{text}</p>
			}
		},
		{
			title: 'Học phí',
			width: 120,
			dataIndex: 'Price',
			render: (Price) => {
				return (
					<p className="font-weight-black weight-600" style={{ color: 'black' }}>
						{new Intl.NumberFormat().format(Price)}
					</p>
				)
			}
		},
		{
			title: 'Người tạo',
			width: 110,
			dataIndex: 'ModifiedBy'
		},
		{
			title: 'Ngày tạo',
			width: 150,
			dataIndex: 'ModifiedOn',
			render: (date: any) => moment(date).format('DD/MM/YYYY')
		},
		{
			title: 'Chức năng',
			fixed: 'right',
			align: 'right',
			responsive: ['md'],
			render: (value, data, index) => (
				<>
					<Link
						href={{
							pathname: '/options/program/program-detail',
							query: { slug: data.Id, name: data.Name }
						}}
					>
						<IconButton icon="eye" color="blue" type="button" tooltip="Chi tiết chương trình" />
					</Link>

					<ProgramAddTeacherForm rowData={data} />

					{userInformation && userInformation?.RoleId !== 2 && (
						<>
							<ProgramForm rowData={data} specialize={specialize} setTodoApi={setTodoApi} listTodoApi={listTodoApi} />
							<DeleteTableRow text={`chương trình ${data.Name}`} handleDelete={() => handleDelete(data.Id)} />
						</>
					)}
				</>
			)
		},
		{
			title: 'Chức năng',
			align: 'right',
			responsive: ['xs'],
			render: (value, data, index) => (
				<>
					<Link
						href={{
							pathname: '/options/program/program-detail',
							query: { slug: data.Id, name: data.Name }
						}}
					>
						<IconButton icon="eye" color="blue" type="button" tooltip="Chi tiết chương trình" />
					</Link>

					<ProgramAddTeacherForm rowData={data} />

					{userInformation && userInformation?.RoleId !== 2 && (
						<>
							<ProgramForm rowData={data} specialize={specialize} setTodoApi={setTodoApi} listTodoApi={listTodoApi} />
							<DeleteTableRow text={`chương trình ${data.Name}`} handleDelete={() => handleDelete(data.Id)} />
						</>
					)}
				</>
			)
		}
	]

	useEffect(() => {
		if (!!userInformation && !isAdmin() && !isManager() && !isAcademic()) {
			Router.push('/')
		}
	}, [userInformation])

	return (
		<Fragment>
			<Head>
				<title>{appConfigs.appName} | Cấu hình chương trình</title>
			</Head>
			<PrimaryTable
				current={currentPage}
				total={totalPage && totalPage}
				loading={isLoading}
				onChangePage={(event: number) => setTodoApi({ ...listTodoApi, pageIndex: event })}
				Extra={<ProgramForm specialize={specialize} setTodoApi={setTodoApi} listTodoApi={listTodoApi} />}
				data={dataSource}
				columns={columns}
				TitleCard={
					<div className="extra-table">
						<FilterBase dataFilter={dataFilter} handleFilter={handleFilter} handleReset={handleReset} />
						<SortBox handleSort={(value) => handleSort(value)} dataOption={dataOption} />
					</div>
				}
			/>
		</Fragment>
	)
}

export default Programs
