import React, { useEffect, useState } from 'react'
import DiscountForm from '~/common/components/Discount/DiscountForm'
import FilterColumn from '~/common/components/FilterTable/Filter/FilterColumn'
import { Tooltip } from 'antd'
import { discountApi } from '~/api/discount'
import moment from 'moment'
import Router from 'next/router'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import { FiCopy } from 'react-icons/fi'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import { useSelector } from 'react-redux'
import DeleteTableRow from '~/common/components/Elements/DeleteTableRow'
import { useDispatch } from 'react-redux'
import { setDiscount } from '~/store/discountReducer'

let pageIndex = 1

const Discount = () => {
	const { information: userInformation } = useSelector((state: RootState) => state.user)
	const state = useSelector((state: RootState) => state)
	const dispatch = useDispatch()
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [totalPage, setTotalPage] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)

	// PARAMS API GETALL
	const listTodoApi = {
		pageSize: PAGE_SIZE,
		pageIndex: pageIndex,
		Code: null
	}
	const [todoApi, setTodoApi] = useState(listTodoApi)

	// GET DATA STAFFSALARY
	const getAllDiscount = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await discountApi.getAll(todoApi)
			if (res.status == 200) {
				dispatch(setDiscount(res.data.data))
				setTotalPage(res.data.totalRow)
			}
			if (res.status == 204) {
				dispatch(setDiscount([]))
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	// PAGINATION
	const getPagination = (pageNumber: number, pageSize: number) => {
		if (!pageSize) pageSize = 10
		pageIndex = pageNumber
		setCurrentPage(pageNumber)
		setTodoApi({ ...todoApi, pageIndex: pageIndex, pageSize: pageSize })
	}

	const onSearch = (valueSearch, dataIndex) => {
		setTodoApi({ ...todoApi, [dataIndex]: valueSearch })
	}

	// DELETE
	const handleDelete = async (id) => {
		setIsLoading({ type: 'DELETE_DATA', status: true })
		try {
			let res = await discountApi.delete(id)
			if (res.status === 200) {
				setTodoApi(listTodoApi)
				ShowNoti('success', res.data?.message)
				return res
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading({ type: 'DELETE_DATA', status: false })
		}
	}

	// HANDLE RESET
	const handleReset = () => {
		setTodoApi({ ...listTodoApi })
	}

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

	const columns = [
		{
			title: 'Mã khuyến mãi',
			dataIndex: 'Code',
			...FilterColumn('Code', onSearch, handleReset, 'text'),
			render: (code) => (
				<Tooltip title="Sao chép" placement="right">
					<span
						className="tag blue is-button bold"
						onClick={() => {
							navigator.clipboard.writeText(code || '')
							ShowNoti('success', 'Đã sao chép')
						}}
					>
						{code}
						<FiCopy size={14} className="ml-2" />
					</span>
				</Tooltip>
			)
		},
		{
			width: 150,
			title: 'Khuyến mãi',
			dataIndex: 'Value',
			render: (text, record) => {
				if (record.Type == 2) {
					return <p className="font-weight-primary">{text}%</p>
				} else {
					return <p className="font-weight-primary">{Intl.NumberFormat('ja-JP').format(text)}</p>
				}
			}
		},
		{
			width: 140,
			title: 'Gói khuyến mãi',
			dataIndex: 'PackageType',
			render: (text, record) => {
				return <p className="font-weight-black">{record.PackageTypeName}</p>
			}
		},
		{
			width: 150,
			title: 'Khuyến mãi tối đa',
			dataIndex: 'MaxDiscount',
			align: 'center',
			render: (text, record) => Intl.NumberFormat('ja-JP').format(text)
		},
		{
			title: 'Trạng thái',
			align: 'center',
			dataIndex: 'StatusName',
			render: (text: any, record: any) => {
				switch (record.Status) {
					case 1:
						return <span className="tag blue">{text}</span>
					case 2:
						return <span className="tag yellow">{text}</span>
					case 3:
						return <span className="tag red">{text}</span>
				}
			}
		},
		{
			width: 100,
			title: 'Số lượng',
			align: 'center',
			dataIndex: 'Quantity'
		},
		{
			width: 100,
			title: 'Đã dùng',
			align: 'center',
			dataIndex: 'UsedQuantity'
		},
		{
			width: 120,
			title: 'Ngày hết hạn',
			dataIndex: 'Expired',
			render: (date) => moment(date).format('DD/MM/YYYY')
		},
		{
			title: '',
			fixed: 'right',
			render: (record, text, index) => (
				<>
					{(isAdmin() || isManager()) && (
						<>
							<DiscountForm rowData={record} setTodoApi={setTodoApi} listTodoApi={listTodoApi} />
							<DeleteTableRow text={text.Code} handleDelete={() => handleDelete(text.Id)} />
						</>
					)}
				</>
			)
		}
	]

	const expandedRowRender = (data, index) => {
		return (
			<div className="pt-2 pb-2">
				<span className="weight-600">Ghi chú:</span> {data?.Note}
			</div>
		)
	}

	useEffect(() => {
		getAllDiscount()
	}, [todoApi])

	useEffect(() => {
		if (!!userInformation) {
			switch (userInformation?.RoleId) {
				case '1':
					break
				case '6':
					break
				case '4':
					break
				default:
					Router.push('/')
			}
		}
	}, [userInformation])

	function show() {
		if (!!userInformation) {
			switch (userInformation?.RoleId) {
				case '1':
					return true
					break
				case '6':
					return true
					break
				case '4':
					return true
					break
				default:
					return false
					break
			}
		}
	}

	return (
		<>
			{show() && (
				<div className="row">
					<div className="col-12">
						<ExpandTable
							loading={isLoading}
							currentPage={currentPage}
							totalPage={totalPage && totalPage}
							getPagination={getPagination}
							TitleCard={(isAdmin() || isManager()) && <DiscountForm setTodoApi={setTodoApi} listTodoApi={listTodoApi} />}
							dataSource={state.discount.Discount}
							columns={columns}
							expandable={expandedRowRender}
						/>
					</div>
				</div>
			)}
		</>
	)
}

export default Discount
