import { Rate } from 'antd'
import React, { useState, useEffect } from 'react'
import { GiRoundStar } from 'react-icons/gi'
import { useSelector } from 'react-redux'
import { StudentListInCourseApi } from '~/api/course/video-course/student-list-in-video-course'
import FilterBase from '~/common/components/Elements/FilterBase'
import IconButton from '~/common/components/Primary/IconButton'
import PrimaryTable from '~/common/components/Primary/Table'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import ModalLearningDetail from '../ModalLearningDetail'
import moment from 'moment'

type Props = {
	videoCourseID: number
}

export default function StudentListInCourse(props: Props) {
	const { videoCourseID } = props

	const user = useSelector((state: RootState) => state.user.information)

	const [dataSource, setDataSource] = useState<IStudentInVideoCourse[]>()
	const [detailSections, setDetailSections] = useState(null)
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const initialTodoApi = { videoCourseId: videoCourseID, pageSize: PAGE_SIZE, pageIndex: 1, fromDate: null, toDate: null }
	const [todoApi, setTodoApi] = useState(initialTodoApi)

	function isAdmin() {
		return user?.RoleId == 1
	}

	function isTeacher() {
		return user?.RoleId == 2
	}

	function isManager() {
		return user?.RoleId == 4
	}

	function isStdent() {
		return user?.RoleId == 3
	}

	function isAccountant() {
		return user?.RoleId == 6
	}

	function isAcademic() {
		return user?.RoleId == 7
	}

	const [dataFilter, setDataFilter] = useState([
		{
			name: 'date-range',
			title: 'Từ - đến',
			col: 'grid-cols-1',
			type: 'date-range',
			value: null
		}
	])

	const getDataSource = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await StudentListInCourseApi.getStudentInCourse(todoApi)
			if (res.status == 200) {
				setDataSource(res.data.data)
			}
			if (res.status == 204) {
				setDataSource([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	useEffect(() => {
		getDataSource()
	}, [todoApi])

	const handleViewDetail = async (item) => {
		try {
			const res = await StudentListInCourseApi.getLearningDetail(item.VideoCourseId, item.UserId)
			if (res.status == 200) {
				setDetailSections(res.data.data)
			}
			if (res.status == 204) {
				setDetailSections({})
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	const columnsAdmin = [
		{
			title: 'Học viên',
			dataIndex: 'FullName',
			align: 'left',
			render: (text, data) => <div className="font-[600] text-[#1b73e8]">{text}</div>
		},
		{
			title: 'Email',
			dataIndex: 'Email',
			align: 'left',
			render: (text, data) => <>{text}</>
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'Mobile',
			align: 'left',
			render: (text, data) => <>{text}</>
		},
		{
			title: 'Thời gian',
			dataIndex: 'Mobile',
			align: 'left',
			render: (text, item) => <p>{moment(item.CreatedOn).format('DD/MM/YYYY HH:mm')}</p>
		},

		{
			title: 'Đánh giá',
			dataIndex: 'MyRate',
			align: 'left',
			render: (text, data) => <Rate defaultValue={Number(text)} allowHalf character={<GiRoundStar />} disabled className="text-tw-yellow" />
		},
		{
			title: '',
			render: (data, item) => {
				return (
					<IconButton type="button" color="red" icon="eye" onClick={() => handleViewDetail(item)} className="mt-2" tooltip="Xem chi tiết" />
				)
			}
		}
	]

	const columnsTeacher = [
		{
			title: 'Học viên',
			dataIndex: 'FullName',
			align: 'left',
			render: (text, data) => <>{text}</>
		},
		{
			title: 'Email',
			dataIndex: 'Email',
			align: 'left',
			render: (text, data) => <>{text}</>
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'Mobile',
			align: 'left',
			render: (text, data) => <>{text}</>
		},
		{
			title: 'Đánh giá',
			dataIndex: 'MyRate',
			align: 'left',
			render: (text, data) => (
				<>
					<Rate defaultValue={Number(text)} allowHalf character={<GiRoundStar />} disabled className="text-tw-yellow" />
				</>
			)
		}
	]

	let listFieldFilter = {
		pageIndex: 1,
		pageSize: PAGE_SIZE,
		fromDate: null,
		toDate: null
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
		setTodoApi({ ...todoApi, ...newListFilter, pageIndex: 1 })
	}

	const handleReset = () => {
		setTodoApi({ ...initialTodoApi })
	}

	return (
		<>
			<PrimaryTable
				columns={isAdmin() || isAcademic() || isManager() ? columnsAdmin : columnsTeacher}
				data={dataSource}
				loading={isLoading.type == 'GET_ALL' && isLoading.status}
				TitleCard={<FilterBase dataFilter={dataFilter} handleFilter={handleFilter} handleReset={handleReset} />}
			/>

			<ModalLearningDetail detailSections={detailSections} />
		</>
	)
}
