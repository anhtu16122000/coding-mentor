import { Card, Empty, Form, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { branchApi } from '~/api/manage/branch'
import { classApi } from '~/api/learn/class'
import { userInformationApi } from '~/api/user/user'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { parseSelectArray } from '~/common/utils/common'
import { RootState } from '~/store'
import { setBranch } from '~/store/branchReducer'
import ClassFilter from './Filter'
import CardGrid from './Item/CardGrid'
import InfiniteScroll from 'react-infinite-scroll-component'
import { IoGrid } from 'react-icons/io5'
import { ImList } from 'react-icons/im'
import CardList from './Item/CardList'
import ProGridLoading from './Loading/ProGridLoading'
import ProListLoading from './Loading/ProListLoading'
import { setListClass, setStatusData, setTotalClass } from '~/store/classReducer'

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
	const [loading, setLoading] = useState(false)
	const dispatch = useDispatch()

	const state = useSelector((state: RootState) => state)

	const listClassState = useSelector((state: RootState) => state.class.listClass)
	const totalClassState = useSelector((state: RootState) => state.class.totalClass)

	const userInfo = useSelector((state: RootState) => state.user.information)

	const is = {
		parent: userInfo?.RoleId == '8',
		admin: userInfo?.RoleId == '1',
		manager: userInfo?.RoleId == '4'
	}

	useEffect(() => {
		if (is.admin || is.manager) {
			getAllBranchs()
			getAcademics()
		}
	}, [])

	useEffect(() => {
		if (is.parent || is.manager) {
			getStudents()
		}

		if (is.admin || is.manager) {
			getAllBranchs()
			getAcademics()
		}
	}, [userInfo])

	useEffect(() => {
		if (userInfo?.UserInformationId) {
			if (!is.parent) {
				getAllClass()
			}
			if (is.parent && filter.studentId) {
				getAllClass()
			}
		}
	}, [filter])

	function handleRefresh() {
		if (filter?.pageIndex != initFilter?.pageIndex) {
			setFilter(initFilter)
		} else {
			getAllClass()
		}
	}

	const getAllClass = async () => {
		setLoading(true)
		try {
			const res: any = await classApi.getAll(filter)
			if (res.status == 200) {
				if (res.data?.data != null && res.data?.data.length > 0) {
					if (is.parent) {
						if (filter.studentId) {
							dispatch(setListClass([...listClassState, ...res.data.data]))
							dispatch(setTotalClass(res.data.totalRow))
							dispatch(
								setStatusData({
									closing: res.data?.closing,
									opening: res.data?.opening,
									totalRow: res.data?.totalRow,
									upcoming: res.data?.upcoming
								})
							)
						} else {
							dispatch(setListClass([]))
							dispatch(setTotalClass(0))
							dispatch(
								setStatusData({
									closing: res.data?.closing,
									opening: res.data?.opening,
									totalRow: res.data?.totalRow,
									upcoming: res.data?.upcoming
								})
							)
						}
					} else {
						if (filter?.pageIndex == 1) {
							const temp = [...res.data.data]
							dispatch(setListClass(temp))
						} else {
							const temp = [...listClassState, ...res.data.data]
							dispatch(setListClass(temp))
						}
						dispatch(setTotalClass(res.data.totalRow))
						dispatch(
							setStatusData({
								closing: res.data?.closing,
								opening: res.data?.opening,
								totalRow: res.data?.totalRow,
								upcoming: res.data?.upcoming
							})
						)
					}
				} else {
					dispatch(setListClass([]))
					dispatch(setTotalClass(0))
				}
			} else {
				dispatch(setListClass([]))
				dispatch(setTotalClass(0))
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
					parentIds: userInfo?.UserInformationId
				})
				if (response.status == 200) {
					let temp = []
					response.data.data?.forEach((item) => {
						temp.push({ label: `${item?.FullName}`, value: item.UserInformationId })
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

	const handleChangeTab = (val) => {
		setFilter({ ...filter, status: val, pageIndex: 1 })
	}

	const [academics, setAcademics] = useState([])

	const getAcademics = async () => {
		if (is.admin || is.manager) {
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
		let temp = [...listClassState]
		temp[index] = { ...listClassState[index], ...param }
		dispatch(setListClass([...temp]))
	}

	const [currentStyle, setCurrentStyle] = useState(0)

	useEffect(() => {
		getStyleSaved()
	}, [])

	async function handleChangeStyleSaved(e) {
		setCurrentStyle(e)
		await localStorage.setItem('proClassStyle', e + '')
	}

	async function getStyleSaved() {
		const res = await localStorage.getItem('proClassStyle')
		if (!!res) {
			setCurrentStyle(parseInt(res))
		}
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
						total={totalClassState}
					/>
				}
				extra={
					<div className="flex items-center">
						{is.parent && (
							<Form form={form} className="w-[190px] h-[34px] mr-[8px]">
								<Form.Item name="student">
									<Select allowClear className="h-[34px]" onChange={handleChangeStudent} options={students} placeholder="Chọn học viên" />
								</Form.Item>
							</Form>
						)}

						<div className="flex items-center w3-animate-right">
							<div
								className="border-[1px] h-[32px] w-[32px] flex items-center justify-center cursor-pointer rounded-l-[4px]"
								onClick={() => handleChangeStyleSaved(0)}
								style={{
									backgroundColor: currentStyle == 0 ? '#1b73e8' : '#fff',
									borderColor: currentStyle == 0 ? '#1b73e8' : '#bdbdbd'
								}}
							>
								<IoGrid className="cursor-pointer" size={20} color={currentStyle == 0 ? '#fff' : '#000'} />
							</div>
							<div
								className="border-[1px] border-l-[0px] border-[#bdbdbd] h-[32px] w-[32px] flex items-center justify-center cursor-pointer rounded-r-[4px]"
								onClick={() => handleChangeStyleSaved(1)}
								style={{
									backgroundColor: currentStyle == 1 ? '#1b73e8' : '#fff',
									borderColor: currentStyle == 1 ? '#1b73e8' : '#bdbdbd'
								}}
							>
								<ImList className="cursor-pointer" size={16} color={currentStyle == 1 ? '#fff' : '#000'} />
							</div>
						</div>
					</div>
				}
			>
				{!loading && listClassState.length == 0 && <Empty />}

				{loading && listClassState.length == 0 && currentStyle == 0 && <ProGridLoading />}
				{loading && listClassState.length == 0 && currentStyle == 1 && <ProListLoading />}

				<div id="pro-scroll" className="scrollable pro-cl-body">
					<InfiniteScroll
						dataLength={listClassState.length}
						next={loadMoreData}
						hasMore={listClassState.length < totalClassState}
						loader={null}
						endMessage=""
						scrollableTarget="pro-scroll"
						className="none-ant-row"
					>
						{listClassState.length > 0 && (
							<div className={`gap-[16px] ${currentStyle == 0 ? 'card-class-container' : 'grid grid-cols-1'}`}>
								{listClassState.map((thisClass: any, index) => {
									if (currentStyle == 0) {
										return (
											<CardGrid
												key={`class-grid-${index}`}
												item={thisClass}
												onRefresh={handleRefresh}
												academics={academics}
												onUpdate={(param) => handleUpdate(index, param)}
											/>
										)
									}

									if (currentStyle == 1) {
										return (
											<CardList
												key={`class-grid-${index}`}
												item={thisClass}
												onRefresh={handleRefresh}
												academics={academics}
												onUpdate={(param) => handleUpdate(index, param)}
											/>
										)
									}

									return <></>
								})}
							</div>
						)}
					</InfiniteScroll>
				</div>
			</Card>
		</>
	)
}

export default ListClassPro
