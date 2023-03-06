import { Col, Row, Card } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import StatisticOverviewAdmin from '~/common/components/Dashboard/StatisticOverviewAdmin'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import StatisticOverviewTeacher from '~/common/components/Dashboard/StatisticOverviewTeacher'
import ListWorkshop from '~/common/components/Dashboard/ListWorkshop'
import StatisticOverviewStudent from '~/common/components/Dashboard/StatisticOverviewStudent'
import moment from 'moment'
import { ShowNoti } from '~/common/utils'
import { notificationApi } from '~/api/notification'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { getAll } from '~/store/notificateReducer'
import { dashboardApi } from '~/api/dashboard'
import StatisticByMonthAdmin from '~/common/components/Dashboard/StatisticByMonthAdmin'
import { seminarApi } from '~/api/seminar'
import LearningProgress from '~/common/components/Dashboard/LearningProgress'
import PrimaryButton from '~/common/components/Primary/Button'

const StatisticsStudentByAge = dynamic(() => import('~/common/components/Dashboard/StatisticStudentByAge'), {
	ssr: false
})
const StatisticTop5Course = dynamic(() => import('~/common/components/Dashboard/StatisticTop5Course'), {
	ssr: false
})

const Dashboard = () => {
	const notification = useSelector((state: RootState) => state.notificate.dataNotificate)
	const dispatch = useDispatch()
	const user = useSelector((state: RootState) => state.user.information)
	const listTodoApi = {
		pageSize: 10,
		pageIndex: 1
	}
	const [todoApi, setTodoApi] = useState(listTodoApi)
	const [dataNotification, setDataNotification] = useState<INotification[]>([])
	const [statisticAll, setStatisticAll] = useState<IStatisticAll[]>([])
	const [overviewTeacher, setOverviewTeacher] = useState<IOverviewTeacher[]>([])
	const [overviewStudent, setOverviewStudent] = useState<IOverviewStudent[]>([])
	const [statisticGetInMonth, setStatisticGetInMonth] = useState<IStatisticGetInMonth[]>([])
	const [statisticAgeStudent, setStatisticAgeStudent] = useState<IStatisticGetTopCourse[]>([])
	const [statisticTopCourse, setStatisticTopCourse] = useState<IStatisticTopCourse[]>([])
	const [contentToShow, setContentToShow] = useState<INotification>()
	const [seminar, setSeminar] = useState<ISeminar[]>([])
	const [isModalVisible, setIsModalVisible] = useState(false)

	const getNotification = async () => {
		try {
			const res = await notificationApi.getAll(todoApi)
			if (res.status === 200) {
				dispatch(getAll(res.data.data))
			}
			if (res.status === 204) {
				setDataNotification([])
			}
		} catch (error) {}
	}

	const getOverview = async () => {
		try {
			const res = await dashboardApi.getOverview()
			if (res.status === 200) {
				setStatisticAll(res.data.data)
			}
			if (res.status === 204) {
				setStatisticAll([])
			}
		} catch (error) {}
	}

	const getOverviewTeacher = async () => {
		try {
			const res = await dashboardApi.getOverviewTeacher()
			if (res.status === 200) {
				setOverviewTeacher(res.data.data)
			}
			if (res.status === 204) {
				setOverviewTeacher([])
			}
		} catch (error) {}
	}

	const getOverviewStudent = async () => {
		try {
			const res = await dashboardApi.getOverviewStudent()
			if (res.status === 200) {
				setOverviewStudent(res.data.data)
			}
			if (res.status === 204) {
				setOverviewStudent([])
			}
		} catch (error) {}
	}

	const getSeminar = async () => {
		try {
			const PAGE_SIZE = 9999
			const res = await seminarApi.getAll(PAGE_SIZE)
			if (res.status === 200) {
				setSeminar(res.data.data)
			}
			if (res.status === 204) {
				setSeminar([])
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
	}

	const getStatisticGetInMonth = async () => {
		try {
			const res = await dashboardApi.getStatisticGetInMonth()
			if (res.status === 200) {
				setStatisticGetInMonth(res.data.data)
			}
			if (res.status === 204) {
				setStatisticGetInMonth([])
			}
		} catch (error) {
			//
		}
	}

	const getStatisticAgeStudent = async () => {
		try {
			const res = await dashboardApi.getStatisticAgeStudent()
			if (res.status === 200) {
				setStatisticAgeStudent(res.data.data)
			}
			if (res.status === 204) {
				setStatisticAgeStudent([])
			}
		} catch (error) {}
	}

	const getStatisticTopCourse = async () => {
		try {
			const res = await dashboardApi.getStatisticTopCourse()
			if (res.status === 200) {
				setStatisticTopCourse(res.data.data)
			}
			if (res.status === 204) {
				setStatisticTopCourse([])
			}
		} catch (error) {}
	}

	useEffect(() => {
		if (user?.RoleId === '1') {
			getOverview()
			getStatisticGetInMonth()
			getStatisticAgeStudent()
			getStatisticTopCourse()
			getNotification()
			getSeminar()
		}
		if (user?.RoleId === '2') {
			getOverviewTeacher()
			getNotification()
			getStatisticAgeStudent()
			getStatisticTopCourse()
			getSeminar()
		}
		if (user?.RoleId === '3') {
			getOverviewStudent()
			getSeminar()
		}
	}, [])

	useMemo(() => {
		const filterNotiNotSeen = notification.filter((item) => {
			return item.IsSeen === false
		})
		setDataNotification(filterNotiNotSeen)
	}, [notification])

	const columnsWorkshop = [
		{
			title: 'Tên',
			dataIndex: 'Name',
			key: 'Name',
			width: 350,
			render: (name) => <span className="font-medium">{name}</span>
		},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusName',
			key: 'StatusName',
			width: 150,
			render: (status, item) => {
				if (item.Status == 3) {
					return <span className="bg-[#d7d7d7] text-[#2a2a2a] px-2 py-1 text-center block rounded-lg font-medium">{status}</span>
				} else if (item.Status == 2) {
					return <span className="bg-[#ecfdec] text-[#1dab35] px-2 py-1 text-center block rounded-lg font-medium">{status}</span>
				} else {
					return <span className="bg-[#ececfd] text-[#3535fc] px-2 py-1 text-center block rounded-lg font-medium">{status}</span>
				}
			}
		},
		{
			width: 130,
			title: 'Ngày bắt đầu',
			dataIndex: 'StartTime',
			key: 'StartTime',
			render: (date) => {
				return <span>{moment(date).format('DD/MM/YYYY - HH:mm')}</span>
			}
		},
		{
			width: 130,
			title: 'Ngày kết thúc',
			dataIndex: 'EndTime',
			key: 'EndTime',
			render: (date) => {
				return <span>{moment(date).format('DD/MM/YYYY - HH:mm')}</span>
			}
		},
		{
			width: 120,
			dataIndex: 'Status',
			key: 'action',
			render: (value, item) => {
				return (
					<>
						{value == 2 && (
							<PrimaryButton
								onClick={() => window.open(`/zoom-view/?SeminarID=${item.Id}&name=${item.Name}`)}
								background="green"
								type="button"
							>
								Tham gia
							</PrimaryButton>
						)}
					</>
				)
			}
		}
	]

	return (
		<div className="w-[95%] desktop:w-[85%] mx-auto">
			{user?.RoleId === '1' && (
				<>
					<Card title={<h1 className="text-2xl font-medium">Thống kê</h1>}>
						<StatisticOverviewAdmin statisticAll={statisticAll} />
					</Card>
					<Card className="mt-4" title={<h1 className="text-2xl font-medium">Thống kê theo tháng</h1>}>
						<StatisticByMonthAdmin statisticGetInMonth={statisticGetInMonth} />
					</Card>
					<Row gutter={16}>
						<Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }}>
							<Card id="wrap-list" className="mt-4" title={<h1 className="text-2xl font-medium">Danh sách Webinar</h1>}>
								<ListWorkshop columns={columnsWorkshop} data={seminar} />
							</Card>
						</Col>
					</Row>
					<Card className="mt-4" title={<h1 className="text-2xl font-medium">Thống kê học viên theo độ tuổi</h1>}>
						<StatisticsStudentByAge data={statisticAgeStudent} />
					</Card>
					<Card className="mt-4" title={<h1 className="text-2xl font-medium">Top 5 khóa học có nhiều học viên nhất</h1>}>
						<StatisticTop5Course data={statisticTopCourse} />
					</Card>
				</>
			)}

			{user?.RoleId === '2' && (
				<>
					<Card title={<h1 className="text-2xl font-medium">Thống kê</h1>}>
						<StatisticOverviewTeacher overviewTeacher={overviewTeacher} />
					</Card>
					<Row gutter={16}>
						<Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }}>
							<Card id="wrap-list" className="mt-4" title={<h1 className="text-2xl font-medium">Danh sách Webinar</h1>}>
								<ListWorkshop columns={columnsWorkshop} data={seminar} />
							</Card>
						</Col>
					</Row>
					<Card className="mt-4" title={<h1 className="text-2xl font-medium">Thống kê học viên theo độ tuổi</h1>}>
						<StatisticsStudentByAge data={statisticAgeStudent} />
					</Card>
					<Card className="mt-4" title={<h1 className="text-2xl font-medium">Top 5 khóa học có nhiều học viên nhất</h1>}>
						<StatisticTop5Course data={statisticTopCourse} />
					</Card>
				</>
			)}

			{user?.RoleId === '3' && (
				<>
					<LearningProgress />
					<Row gutter={16}>
						<Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }}>
							<Card id="wrap-list" className="mt-4" title={<h1 className="text-2xl font-medium">Danh sách Webinar</h1>}>
								<ListWorkshop columns={columnsWorkshop} data={seminar} />
							</Card>
						</Col>
					</Row>
					<Card className="mt-4" title={<h1 className="text-2xl font-medium">Báo cáo</h1>}>
						<StatisticOverviewStudent overviewStudent={overviewStudent} />
					</Card>
				</>
			)}
		</div>
	)
}

export default Dashboard
