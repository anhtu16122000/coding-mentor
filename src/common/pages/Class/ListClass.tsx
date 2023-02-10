import { Card } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { branchApi } from '~/api/branch'
import { classApi } from '~/api/class'
import ClassList from '~/common/components/Class/ClassList'
import FilterBase from '~/common/components/Elements/FilterBase'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { parseSelectArray } from '~/common/utils/common'
import { RootState } from '~/store'
import { setBranch } from '~/store/branchReducer'

const ListClass = () => {
	const listTodoApi = {
		name: null,
		status: null,
		branchIds: null,
		pageSize: PAGE_SIZE,
		pageIndex: 1,
		sort: 0,
		sortType: false
	}
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
			name: 'status',
			title: 'Trạng thái',
			col: 'col-md-6 col-12',
			type: 'select',
			placeholder: 'Chọn trạng thái',
			value: null,
			optionList: [
				{ value: 1, title: 'Sắp diễn ra' },
				{ value: 2, title: 'Đang diễn ra' },
				{ value: 3, title: 'Kết thúc' }
			]
		},
		{
			name: 'branchIds',
			title: 'Trung tâm',
			col: 'col-12',
			type: 'select',
			mode: 'multiple',
			placeholder: 'Chọn trung tâm',
			value: null,
			optionList: []
		}
	])
	const [todoApi, setTodoApi] = useState(listTodoApi)
	const [listClass, setListClass] = useState<IClass[]>([])
	const [totalRow, setTotalRow] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const state = useSelector((state: RootState) => state)
	const dispatch = useDispatch()

	const getAllClass = async () => {
		setIsLoading(true)
		try {
			const res = await classApi.getAll(todoApi)
			if (res.status === 200) {
				setListClass(res.data.data)
				setTotalRow(res.data.totalRow)
			}
			if (res.status === 204) {
				setListClass([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}
	const getAllBranch = async () => {
		try {
			const res = await branchApi.getAll()
			if (res.status === 200) {
				dispatch(setBranch(res.data.data))
			}
			if (res.status === 204) {
				dispatch(setBranch([]))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}
	let listFieldFilter = {
		pageIndex: 1,
		pageSize: PAGE_SIZE,
		name: null,
		status: null,
		branchIds: null
	}
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
		setTodoApi({
			...todoApi,
			...newListFilter,
			branchIds: !!newListFilter.branchIds ? newListFilter.branchIds.join(',') : '',
			pageIndex: 1
		})
	}

	const handleReset = () => {
		setTodoApi({ ...listTodoApi })
	}
	useEffect(() => {
		if (state.branch.Branch.length === 0) {
			getAllBranch()
		}
	}, [])
	useEffect(() => {
		if (state.branch.Branch.length > 0) {
			const convertData = parseSelectArray(state.branch.Branch, 'Name', 'Id')
			dataFilter[2].optionList = convertData
			setDataFilter([...dataFilter])
		}
	}, [state])
	useEffect(() => {
		getAllClass()
	}, [todoApi])
	return (
		<div className="wrapper-class">
			<div className="row">
				<div className="col-12">
					<div className="wrap-table">
						<Card
							title={
								<div className="list-action-table">
									<FilterBase dataFilter={dataFilter} handleFilter={handleFilter} handleReset={handleReset} />
								</div>
							}
						>
							<div className="course-list-content">
								<ClassList
									totalRow={totalRow}
									isLoading={isLoading}
									dataSource={listClass}
									setTodoApi={setTodoApi}
									listTodoApi={listTodoApi}
									todoApi={todoApi}
								/>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ListClass
