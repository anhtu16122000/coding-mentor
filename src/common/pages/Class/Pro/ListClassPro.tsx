import { Card, Empty, Form, Pagination, Select, Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { branchApi } from '~/api/branch'
import { classApi } from '~/api/class'
import { userInformationApi } from '~/api/user'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti, log } from '~/common/utils'
import { parseSelectArray } from '~/common/utils/common'
import { RootState } from '~/store'
import { setBranch } from '~/store/branchReducer'
import ClassFilter from './Filter'
import CardGrid from './Item/CardGrid'
import ClassProLoading from './Loading'
import InfiniteScroll from 'react-infinite-scroll-component'

const initFilter = {
	name: null,
	status: null,
	branchIds: null,
	pageSize: 10,
	pageIndex: 1,
	sort: 0,
	sortType: false,
	studentId: null
}

const ListClassPro = () => {
	const [form] = Form.useForm()

	const [dataFilter, setDataFilter] = useState([
		{
			name: 'name',
			title: 'Tên lớp học',
			col: 'col-md-6 col-12',
			type: 'text',
			placeholder: 'Nhập tên lớp học',
			value: null
		},
		{
			name: 'branchIds',
			title: 'Trung tâm',
			col: 'col-md-6 col-12',
			type: 'select',
			mode: 'multiple',
			placeholder: 'Chọn trung tâm',
			value: null,
			optionList: []
		}
	])

	const [filter, setFilter] = useState(initFilter)
	const [listClass, setListClass] = useState<IClass[]>([])
	const [totalRow, setTotalRow] = useState(null)
	const [loading, setLoading] = useState(false)
	const [current, setCurrent] = useState(1)
	const dispatch = useDispatch()

	const userInformation = useSelector((state: RootState) => state.user.information)
	const state = useSelector((state: RootState) => state)

	const is = {
		parent: userInformation?.RoleId === '8',
		admin: userInformation?.RoleId === '1'
	}

	useEffect(() => {
		getAllBranchs()
		getStudents()
		getAcademics()
	}, [])

	useEffect(() => {
		getAllClass()
	}, [filter])

	useEffect(() => {
		log.Yellow('listClass', listClass)
	}, [listClass])

	const getAllClass = async () => {
		setLoading(true)
		try {
			const res = await classApi.getAll(filter)
			if (res.status == 200) {
				if (is.parent) {
					if (filter.studentId && filter.studentId !== '') {
						setListClass([...listClass, ...res.data.data])
						setTotalRow(res.data.totalRow)
					} else {
						setListClass([])
						setTotalRow(0)
					}
				} else {
					if (filter?.pageIndex == 1) {
						setListClass([...res.data.data])
					} else {
						setListClass([...listClass, ...res.data.data])
					}
					setTotalRow(res.data.totalRow)
				}
			} else {
				setListClass([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setLoading(false)
		}
	}

	const getAllBranchs = async () => {
		if (is.admin && state.branch?.Branch.length == 0) {
			try {
				const res = await branchApi.getAll()
				if (res.status == 200) {
					dispatch(setBranch(res.data.data))
				} else {
					dispatch(setBranch([]))
				}
			} catch (err) {
				ShowNoti('error', err.message)
			}
		}
	}

	const handleFilter = (listFilter) => {
		let newListFilter = {
			pageIndex: 1,
			pageSize: PAGE_SIZE,
			name: null,
			status: null,
			branchIds: null
		}

		listFilter.forEach((item, index) => {
			let key = item.name
			Object.keys(newListFilter).forEach((keyFilter) => {
				if (keyFilter == key) {
					newListFilter[key] = item.value
				}
			})
		})

		setFilter({
			...filter,
			...newListFilter,
			branchIds: !!newListFilter.branchIds ? newListFilter.branchIds.join(',') : '',
			pageIndex: 1
		})
	}

	const [students, setStudents] = useState<{ label: string; value: string }[]>([])

	const getStudents = async () => {
		if (is.parent) {
			try {
				const response = await userInformationApi.getAll({
					PageSize: 9999,
					PageIndex: 1,
					RoleIds: '3',
					parentIds: userInformation?.UserInformationId
				})
				if (response.status == 200) {
					let temp = []
					response.data.data?.forEach((item) => {
						temp.push({ label: `${item?.FullName} - ${item.UserCode}`, value: item.UserInformationId })
					})
					setStudents(temp)
				} else {
					setStudents([])
				}
			} catch (error) {
				console.error(error)
			}
		}
	}

	const handleReset = () => {
		setFilter({ ...initFilter })
	}

	const handleChangeStudent = (val) => {
		if (val) {
			setFilter({ ...filter, studentId: val })
		} else {
			setFilter(initFilter)
		}
	}

	useEffect(() => {
		if (state.branch.Branch.length > 0) {
			const convertData = parseSelectArray(state.branch.Branch, 'Name', 'Id')
			dataFilter[1].optionList = convertData
			setDataFilter([...dataFilter])
		}
	}, [state])

	useEffect(() => {
		if (students && students?.length > 0) {
			setFilter({ ...filter, studentId: students[0].value })
			form.setFieldValue('student', students[0].value)
		}
	}, [students])

	const getPagination = (pageNumber: number) => {
		setCurrent(pageNumber)
		setFilter({ ...filter, pageIndex: pageNumber })
	}

	const showTotal = () => totalRow && <div className="font-weight-black">Tổng cộng: {totalRow}</div>

	const handleChangeTab = (val) => {
		setFilter({ ...filter, status: val, pageIndex: 1 })
	}

	const [academics, setAcademics] = useState([])

	const getAcademics = async () => {
		if (is.admin) {
			try {
				const res = await userInformationApi.getAll({ roleIds: '7' })
				if (res.status == 200) {
					const convertData = parseSelectArray(res.data.data, 'FullName', 'UserInformationId')
					setAcademics(convertData)
				} else {
					setAcademics([])
				}
			} catch (err) {
				ShowNoti('error', err.message)
			}
		}
	}

	function loadMoreData() {
		if (!loading) {
			setLoading(true)
			setFilter({ ...filter, pageIndex: filter.pageIndex + 1 })
		}
	}

	function handleUpdate(index, param) {
		console.log('---- param: ', param)

		let temp = [...listClass]
		temp[index] = { ...listClass[index], ...param }
		setListClass([...temp])
	}

	return (
		<>
			<Card
				className="classes-pro"
				title={
					<ClassFilter
						filter={filter}
						dataFilter={dataFilter}
						onFilter={handleFilter}
						onReset={handleReset}
						onChangeTab={handleChangeTab}
						total={totalRow}
					/>
				}
				extra={
					is.parent && (
						<Form form={form}>
							<Form.Item name="student">
								<Select allowClear className="w-[200px]" onChange={handleChangeStudent} options={students} placeholder="Chọn học viên" />
							</Form.Item>
						</Form>
					)
				}
			>
				{!loading && listClass.length == 0 && <Empty />}

				{loading && listClass.length == 0 && <ClassProLoading />}

				<InfiniteScroll
					dataLength={listClass.length}
					next={loadMoreData}
					hasMore={listClass.length < totalRow}
					loader={<ClassProLoading />}
					endMessage=""
					scrollableTarget="pro-scroll"
					className="none-ant-row"
				>
					{listClass.length > 0 && (
						<div className="card-class-container">
							{listClass.map((thisClass: any, index) => {
								return (
									<CardGrid
										key={`class-grid-${index}`}
										item={thisClass}
										onRefresh={getAllClass}
										academics={academics}
										onUpdate={(param) => handleUpdate(index, param)}
									/>
								)
							})}
						</div>
					)}
				</InfiniteScroll>
			</Card>
		</>
	)
}

export default ListClassPro
