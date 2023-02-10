import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { feedbackApi } from '~/api/feedback'
import FeedbackDelete from '~/common/components/Feedback/FeedbackDelete'
import FeedBackForm from '~/common/components/Feedback/FeedbackForm'
import FilterFeedbackTable from '~/common/components/FilterTable/FilterFeedbackTable'
import PrimaryTable from '~/common/components/Primary/Table'
import FilterColumn from '~/common/components/FilterTable/Filter/FilterColumn'
import { ShowNoti } from '~/common/utils'
// import { Roles } from '~/src/lib/roles/listRoles'
// import { useWrap } from '~/src/context/wrap'

const Roles = [
	{
		id: 1,
		RoleName: 'Admin' //
	},
	{
		id: 2,
		RoleName: 'Giáo viên' //
	},
	{
		id: 3,
		RoleName: 'Học viên' //
	}
]

const FeedBack = () => {
	const onSearch = (data) => {
		setCurrentPage(1)
		setParams({
			...listParamsDefault,
			search: data
		})
	}

	const handleReset = () => {
		setCurrentPage(1)
		setParams(listParamsDefault)
	}
	const columns = [
		{
			title: 'Role',
			dataIndex: 'Role',
			render: (Role) => <div style={{ width: '150px' }}>{Roles.find((r) => r.id == Role)?.RoleName}</div>
		},
		{
			title: 'Loại phản hồi',
			dataIndex: 'Name',
			...FilterColumn('Name', onSearch, handleReset, 'text'),
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{ title: 'Modified By', dataIndex: 'ModifiedBy' },
		{
			title: 'Modified Date',
			dataIndex: 'ModifiedOn',
			render: (date) => moment(date).format('DD/MM/YYYY')
		},

		{
			render: (data) => (
				<>
					<FeedBackForm
						feedbackDetail={data}
						feedbackId={data.ID}
						reloadData={(firstPage) => {
							getDataFeedback(firstPage)
						}}
						currentPage={currentPage}
					/>

					<FeedbackDelete
						feedbackId={data.ID}
						reloadData={(firstPage) => {
							getDataFeedback(firstPage)
						}}
						currentPage={currentPage}
					/>
				</>
			)
		}
	]
	const [currentPage, setCurrentPage] = useState(1)

	const listParamsDefault = {
		pageSize: 10,
		pageIndex: currentPage,
		search: null,
		Role: null
	}

	const [params, setParams] = useState(listParamsDefault)
	// const { showNoti } = useWrap()
	const [totalPage, setTotalPage] = useState(null)
	const [feedback, setFeedback] = useState<IFeedback[]>([])
	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false
	})

	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber)
		setParams({
			...params,
			pageIndex: currentPage
		})
	}

	const getDataFeedback = (page: any) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		})
		;(async () => {
			try {
				let res = await feedbackApi.getAll({ ...params, pageIndex: page })
				res.status == 200 && setFeedback(res.data.data)
				if (res.status == 204) {
					// showNoti('danger', 'Không tìm thấy dữ liệu!')
					setCurrentPage(1)
					setParams(listParamsDefault)
				} else setTotalPage(res.data.totalRow)
			} catch (error) {
				ShowNoti('error', error.message)
			} finally {
				setIsLoading({
					type: 'GET_ALL',
					status: false
				})
			}
		})()
	}

	useEffect(() => {
		getDataFeedback(currentPage)
	}, [params])

	const _onFilterTable = (data) => {
		setParams({ ...listParamsDefault, Role: data.RoleID })
	}

	return (
		<PrimaryTable
			// currentPage={currentPage}
			// loading={isLoading}
			// totalPage={totalPage && totalPage}
			// getPagination={(pageNumber: number) => getPagination(pageNumber)}
			// addClass="basic-header"
			// TitlePage="Danh sách loại phản hồi"
			Extra={
				<FeedBackForm
					reloadData={(firstPage) => {
						setCurrentPage(1)
						getDataFeedback(firstPage)
					}}
				/>
			}
			data={feedback}
			columns={columns}
			TitleCard={
				<div className="extra-table">
					<FilterFeedbackTable _onFilter={(value: any) => _onFilterTable(value)} />
				</div>
			}
		/>
	)
}
export default FeedBack
