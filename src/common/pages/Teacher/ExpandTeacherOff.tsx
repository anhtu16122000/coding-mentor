import moment from 'moment'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import RestApi from '~/api/RestApi'
import { teacherOffApi } from '~/api/teacher-off'
import DeleteTableRow from '~/common/components/Elements/DeleteTableRow'
import FilterColumn from '~/common/components/FilterTable/Filter/FilterColumn'
import PrimaryTable from '~/common/components/Primary/Table'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import TeacherOffForm from '~/common/components/Teacher/TeacherOffForm'
import TeacherOffUpdateForm from '~/common/components/Teacher/TeacherOffUpdateForm'
import TeacherOffViewNote from '~/common/components/Teacher/TeacherOffViewNote'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { parseToMoney } from '~/common/utils/common'
import { RootState } from '~/store'

let pageIndex = 1

const ExpandTeacherOff = ({ item }) => {
	const { information: userInformation } = useSelector((state: RootState) => state.user)

	const listTodoApi = {
		fullName: null,
		userCode: null,
		status: null,
		pageSize: PAGE_SIZE,
		pageIndex: pageIndex
	}

	const [todoApi, setTodoApi] = useState(listTodoApi)
	const [isLoading, setIsLoading] = useState(false)
	const [teacherOff, setTeacherOff] = useState<ITeacherOff[]>([])
	const [totalRow, setTotalRow] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)

	// RESET SEARCH
	const onResetSearch = () => {
		setTodoApi({
			...listTodoApi
		})
	}

	// ACTION SEARCH
	const onSearch = (valueSearch, dataIndex) => {
		setTodoApi({
			...listTodoApi,
			[dataIndex]: valueSearch
		})
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

	const returnPathName = (item) => {
		if (!userInformation) return ''
		let role = userInformation?.RoleId
		let path = null
		if (role == 1 || role == 5) {
			path = {
				pathname: '/class/list-class/detail',
				query: { class: item?.Id, CurriculumId: item?.CurriculumId, BranchId: item?.BranchId }
			}
		} else {
			path = {
				pathname: '/class/list-class/detail',
				query: { class: item?.Id, CurriculumId: item?.CurriculumId, BranchId: item?.BranchId }
			}
		}

		return path
	}

	const columns = [
		{
			title: 'Lớp',
			dataIndex: 'ClassName',
			key: 'ClassName',
			className: 'font-[600] text-[#1E88E5]',
			width: 300,
			render: (text, item) => (
				<Link href={returnPathName(item)}>
					<a>{text}</a>
				</Link>
			)
		},
		{
			title: 'Bắt đầu',
			dataIndex: 'StartTime',
			key: 'StartTime',
			render: (text, data) => <span>{!!text ? moment(text).format('DD/MM/YYYY HH:mm') : ''}</span>
		},
		{
			title: 'Kết thúc',
			dataIndex: 'EndTime',
			key: 'EndTime',
			render: (text, data) => <span>{!!text ? moment(text).format('DD/MM/YYYY HH:mm') : ''}</span>
		},
		{
			title: 'Lương / buổi',
			dataIndex: 'TeachingFee',
			key: 'TeachingFee',
			width: 130,
			render: (text, data) => <span className="font-[600] text-[#43A047]">{parseToMoney(text)}</span>
		},
		{
			title: 'Trạng thái',
			dataIndex: 'Status',
			key: 'Status',
			render: (status, data) => {
				switch (status) {
					case 1:
						return <p className="tag gray">{data.StatusName}</p>
					case 2:
						return <p className="tag green">{data.StatusName}</p>
					case 3:
						return <p className="tag red">{data.StatusName}</p>
				}
			}
		}
	]

	const getData = async () => {
		setIsLoading(true)
		try {
			const res = await RestApi.get<any>('TeacherOff/schedule-teacher-off', { ...todoApi, teacherOffId: item?.Id })
			if (res.status === 200) {
				setTeacherOff(res.data.data)
				setTotalRow(res.data.totalRow)
			}
			if (res.status === 204) {
				setTeacherOff([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber
		setCurrentPage(pageNumber)
		setTodoApi({ ...todoApi, pageIndex: pageIndex })
	}

	useEffect(() => {
		if (teacherOff.length > 0) {
			getData()
		}
	}, [todoApi])

	useEffect(() => {
		getData()
	}, [])

	console.log('---- totalRow: ', totalRow)

	return (
		<div className="w-[1300px]">
			<PrimaryTable
				current={currentPage}
				loading={isLoading}
				data={teacherOff}
				onChangePage={(pageNumber: number) => getPagination(pageNumber)}
				total={totalRow}
				columns={columns}
				Extra={isTeacher() && <TeacherOffForm setTodoApi={setTodoApi} listTodoApi={listTodoApi} />}
				TitleCard="Lịch dạy trong thời gian nghỉ"
			/>
		</div>
	)
}

export default ExpandTeacherOff
