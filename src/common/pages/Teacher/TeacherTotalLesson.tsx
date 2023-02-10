import React, { useEffect, useState } from 'react'
import { DatePicker, Radio, Spin } from 'antd'
import moment from 'moment'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import NestedTable from '~/common/components/Primary/Table/NestedTable'
import { statisticalTotalApi } from '~/api/statistic'
// import { useWrap } from '~/src/context/wrap'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import { useSelector } from 'react-redux'

const TeacherTotalLesson = () => {
	const [teacherLessons, setTeacherLessons] = useState<IStatisticTotalLessonOfTeacher[]>()
	// const {showNoti, userInformation } = useWrap()
	const { information: userInformation } = useSelector((state: RootState) => state.user)
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [totalPage, setTotalPage] = useState(null)
	const [typeView, setTypeView] = useState(1)
	const [filters, setFilters] = useState({
		pageSize: 999,
		pageIndex: 1,
		year: new Date().getFullYear(),
		month: new Date().getMonth() + 1
	})

	// PAGINATION
	const getPagination = (pageIndex: number) => {
		setFilters({ ...filters, pageIndex })
	}

	// Call Api Get Data
	const getTeacherLesson = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await statisticalTotalApi.getTotalLessonOfTeacher(filters)
			if (res.status === 200) {
				setTeacherLessons(res.data.data)
				setTotalPage(res.data.totalRow)
			}
			if (res.status === 204) {
				setTeacherLessons([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	useEffect(() => {
		if (!!userInformation && userInformation?.RoleId == 1) {
			getTeacherLesson()
		}
	}, [filters, userInformation])

	const columns = [
		{
			title: 'Ảnh đại diện',
			width: 120,
			dataIndex: 'Avatar',
			render: (text, data) => (
				<img
					style={{ width: 40, height: 40, borderRadius: '100%' }}
					src={data.Avatar.length > 0 ? data.Avatar : '/images/user.png'}
					alt="avatar img"
				/>
			)
		},
		{ title: 'Họ tên', width: 150, dataIndex: 'FullNameUnicode' },
		{ title: 'Tổng số buổi dạy', width: 180, dataIndex: 'TotalLesson' },
		{ title: 'Email', width: 150, dataIndex: 'Email' },
		{ title: 'Số điện thoại', width: 150, dataIndex: 'Mobile' }
	]

	const handleChangeDate = (value) => {
		if (typeView == 1) {
			setFilters({ ...filters, month: Number(moment(value).format('MM')), year: Number(moment(value).format('YYYY')) })
		} else if (typeView == 2) {
			setFilters({ ...filters, month: 0, year: Number(moment(value).format('YYYY')) })
		}
	}

	const renderExtra = () => {
		if (typeView == 1) {
			return (
				<DatePicker
					placeholder="Chọn tháng"
					onChange={handleChangeDate}
					picker="month"
					className="mr-2 style-input"
					style={{ width: 130 }}
					defaultValue={moment(new Date(), 'DD/MM/YYYY')}
				/>
			)
		} else if (typeView == 2) {
			return (
				<DatePicker placeholder="Chọn năm" onChange={handleChangeDate} picker="year" className="mr-2 style-input" style={{ width: 130 }} />
			)
		}
	}

	const onChange = (event) => {
		setTypeView(event.target.value)
	}

	const [details, setDetails] = useState<Array<ILessonDetailsOfTeacher>>([])

	// Get Details Of Lesson
	const getDetails = async (param) => {
		setDetails([])
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			const response = await statisticalTotalApi.getTeachingDetail({
				teacherId: param.UserInformationID,
				year: filters.year,
				month: filters.month
			})
			if (response.status == 200) {
				setDetails(response.data.data)
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	// Render Expand Row
	const expandedRowRender = () => {
		const subColumns = [
			{
				title: 'Ngày dạy',
				dataIndex: 'Date',
				render: (text, data) => {
					return <>{!!data.Date && <>{moment(data.Date).format('DD/MM/YYYY')}</>}</>
				}
			},
			{
				title: 'Bắt đầu',
				dataIndex: 'TimeStart',
				render: (text) => <span className="bold">{text}</span>
			},
			{
				title: 'Kết thúc',
				dataIndex: 'TimeEnd',
				render: (text) => <span className="bold">{text}</span>
			},
			{
				title: 'Thời gian dạy',
				dataIndex: 'Time',
				align: 'center',
				render: (text) => <>{text}</>
			},
			{
				title: 'Trung tâm',
				dataIndex: 'BranchName',
				render: (text) => <p>{text}</p>
			},
			{
				title: 'Lớp học',
				dataIndex: 'CourseName',
				render: (text) => <>{text}</>
			}
		]

		return (
			<>
				{isLoading.status && (
					<div>
						<Spin />
					</div>
				)}
				{!isLoading.status && (
					<NestedTable
						totalPage={1 && 1}
						loading={isLoading}
						addClass="basic-header"
						TitlePage=""
						dataSource={details}
						columns={subColumns}
					/>
				)}
			</>
		)
	}

	// Render Screen
	return (
		<>
			{!!userInformation && userInformation?.RoleId == 1 && (
				<ExpandTable
					loading={isLoading}
					totalPage={totalPage}
					dataSource={teacherLessons}
					getPagination={getPagination}
					columns={columns}
					Extra={<h4>Thông kê số buổi dạy của giáo viên</h4>}
					TitleCard={
						<div style={{ height: 36, display: 'flex', alignItems: 'center' }}>
							{renderExtra()}
							<Radio.Group onChange={onChange} optionType="button" buttonStyle="solid" value={typeView} style={{ height: 36 }}>
								<Radio.Button value={1} style={{ height: 36, paddingTop: 2, borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}>
									Tháng
								</Radio.Button>
								<Radio.Button value={2} style={{ height: 36, paddingTop: 2, borderTopRightRadius: 6, borderBottomRightRadius: 6 }}>
									Năm
								</Radio.Button>
							</Radio.Group>
						</div>
					}
					handleExpand={(data) => {
						console.log('handleExpand --- ')

						getDetails(data)
					}}
					expandable={expandedRowRender}
				/>
			)}
		</>
	)
}

export default TeacherTotalLesson
