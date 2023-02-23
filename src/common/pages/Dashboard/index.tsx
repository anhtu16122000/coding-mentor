import { Col, Row, Card, Select } from 'antd'
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
import { branchApi } from '~/api/branch'
const listTodoApi = {
	branchIds: [],
	year: ''
}

import { IoAnalytics } from 'react-icons/io5'
import RestApi from '~/api/RestApi'
import StatisticTop5Course from '~/common/components/Dashboard/StatisticTop5Course'
import { staticsticalApi } from '~/api/statistic'
import StatisticStudentByAge from '~/common/components/Dashboard/StatisticStudentByAge'
import StatisticPositiveAndNegativeChart from '~/common/components/Dashboard/StatisticPositiveAndNegativeChart'
import StatisticPie from '~/common/components/Dashboard/StatisticPie'

const Dashboard = () => {
	const dispatch = useDispatch()
	const user = useSelector((state: RootState) => state.user.information)
	const [todoApi, setTodoApi] = useState(listTodoApi)
	const [allBranch, setAllBranch] = useState([])
	const [dataStaticsOverview, setDataStaticsOverview] = useState([])

	const [statisticRevenue, setStatisticRevenue] = useState<IStatisticTopCourse[]>([])
	const [statisticTopLearning, setStatisticTopLearning] = useState<IStatisticTopCourse[]>([])
	const [statisticStudentAge, setStatisticStudentAge] = useState([])
	const [statisticSource, setStatisticSource] = useState([])
	const [statisticTopJob, setStatisticTopJob] = useState([])
	const [statisticTopPurpose, setStatisticTopPurpose] = useState([])
	const [statisticNewClass, setStatisticNewClass] = useState([])
	const [statisticNewCustomer, setStatisticNewCustomer] = useState([])
	const [statisticFeedRating, setStatisticFeedRating] = useState([])

	const getAllBranch = async () => {
		try {
			const { data } = await branchApi.getAll()
			setAllBranch(data.data)
		} catch (error) {
			console.log('error', error)
		}
	}

	const getStaticStudentAge = async () => {
		try {
			const res = await staticsticalApi.getStudentAge(todoApi)
			if (res.status === 200) {
				setStatisticStudentAge(res.data.data)
			}
			if (res.status === 204) {
				setStatisticStudentAge([])
			}
		} catch (error) {}
	}

	const getTopLearningNeed = async () => {
		try {
			const res = await staticsticalApi.getTopLearningNeed(todoApi)
			if (res.status === 200) {
				setStatisticTopLearning(res.data.data)
			}
			if (res.status === 204) {
				setStatisticTopLearning([])
			}
		} catch (error) {}
	}

	const getTopPurpose = async () => {
		try {
			const res = await staticsticalApi.getTopPurpose(todoApi)
			if (res.status === 200) {
				setStatisticTopPurpose(res.data.data)
			}
			if (res.status === 204) {
				setStatisticTopPurpose([])
			}
		} catch (error) {}
	}

	const getTopSource = async () => {
		try {
			const res = await staticsticalApi.getTopSource(todoApi)
			if (res.status === 200) {
				setStatisticSource(res.data.data)
			}
			if (res.status === 204) {
				setStatisticSource([])
			}
		} catch (error) {}
	}

	const getTopJob = async () => {
		try {
			const res = await staticsticalApi.getTopJob(todoApi)
			if (res.status === 200) {
				setStatisticTopJob(res.data.data)
			}
			if (res.status === 204) {
				setStatisticTopJob([])
			}
		} catch (error) {}
	}

	const getRevenue = async () => {
		try {
			const res = await staticsticalApi.getRevenue(todoApi)
			if (res.status === 200) {
				setStatisticRevenue(res.data.data)
			}
			if (res.status === 204) {
				setStatisticRevenue([])
			}
		} catch (error) {}
	}

	const getNewClassInMonth = async () => {
		try {
			const res = await staticsticalApi.getNewClass(todoApi)
			if (res.status === 200) {
				setStatisticNewClass(res.data.data)
			}
			if (res.status === 204) {
				setStatisticNewClass([])
			}
		} catch (error) {}
	}

	const getNewCustomer = async () => {
		try {
			const res = await staticsticalApi.getNewCustomer(todoApi)
			if (res.status === 200) {
				setStatisticNewCustomer(res.data.data)
			}
			if (res.status === 204) {
				setStatisticNewCustomer([])
			}
		} catch (error) {}
	}

	const getFeedbackRating = async () => {
		try {
			const res = await staticsticalApi.getFeedBackRating(todoApi)
			if (res.status === 200) {
				setStatisticFeedRating(res.data.data)
			}
			if (res.status === 204) {
				setStatisticFeedRating([])
			}
		} catch (error) {}
	}

	useEffect(() => {
		getAllBranch()
		getStaticStudentAge()

		getTopLearningNeed()
		getTopPurpose()
		getTopSource()
		getTopJob()

		getRevenue()
		getNewClassInMonth()
		getNewCustomer()
		getFeedbackRating()
	}, [todoApi])

	return (
		<div className="w-[100%] desktop:w-[85%] mx-auto">
			<div className="flex justify-between mb-4">
				<p>what's up, Bro</p>
				<div className="flex gap-2">
					<Select onChange={(e) => setTodoApi((pre) => ({ ...pre, year: e }))}>
						<Select.Option value={2022}>2022</Select.Option>x<Select.Option value={2023}>2023</Select.Option>
					</Select>
					<Select className="w-[200px] col-12">
						{allBranch.map((branch) => (
							<Select.Option value={branch.Id} key={Math.random() * 1000 + Date.now()}>
								{branch.Name}
							</Select.Option>
						))}
					</Select>
				</div>
			</div>

			{/* <div className="grid grid-cols-12 gap-4">
				{dataStaticsOverview &&
					dataStaticsOverview.map((item) => <Dashboard.CardItem item={item} key={Date.now() + Math.random() * 1000} />)}
			</div>*/}

			<Card className="mt-4" title={<h1 className="text-2xl font-medium">Doanh Thu</h1>}>
				<StatisticPositiveAndNegativeChart data={statisticRevenue} titleBar="Doanh thu" />
			</Card>

			<Card className="mt-4" title={<h1 className="text-2xl font-medium">Top 5 nhu cầu học</h1>}>
				<StatisticTop5Course data={statisticTopLearning} titleBar="Nhu cầu học " />
			</Card>

			<div className="grid grid-cols-6 gap-4">
				<Card className="col-span-3 mt-4 " title={<h1 className="text-2xl font-medium">Lớp mới mỗi tháng</h1>}>
					<StatisticTop5Course data={statisticNewClass} titleBar="Lớp mới mỗi tháng" />
				</Card>

				<Card className="col-span-3 mt-4" title={<h1 className="text-2xl font-medium">Khách mới mỗi tháng</h1>}>
					<StatisticStudentByAge data={statisticNewCustomer} titleBar="Khách mới mỗi tháng" />
				</Card>
			</div>

			<Card className="mt-4" title={<h1 className="text-2xl font-medium">Top 5 mục đích học</h1>}>
				<StatisticTop5Course data={statisticTopPurpose} titleBar="Mục đích học " />
			</Card>

			<Card className="mt-4" title={<h1 className="text-2xl font-medium">Top 5 nguồn khách hàng</h1>}>
				<StatisticTop5Course data={statisticSource} titleBar="Khách hàng " />
			</Card>

			<div className="grid items-stretch grid-cols-6 gap-4">
				<Card className="col-span-3 mt-4" title={<h1 className="text-2xl font-medium">Tỉ lệ đánh giá phản hồi</h1>}>
					<StatisticPie data={statisticFeedRating} />
				</Card>

				<Card className="col-span-3 mt-4" title={<h1 className="text-2xl font-medium">Khách mới mỗi tháng</h1>}>
					<StatisticStudentByAge data={statisticNewCustomer} titleBar="Khách mới mỗi tháng" />
				</Card>
			</div>

			<Card className="mt-4" title={<h1 className="text-2xl font-medium">Top 5 công việc của học viên </h1>}>
				<StatisticTop5Course data={statisticTopJob} titleBar="Học viên " />
			</Card>

			<Card className="mt-4" title={<h1 className="text-2xl font-medium">Thống kê học viên theo độ tuổi</h1>}>
				<StatisticStudentByAge data={statisticStudentAge} titleBar="Độ tuổi học viên " />
			</Card>
		</div>
	)
}

export default Dashboard

Dashboard.CardItem = ({ item }) => {
	return (
		<div className="col-span-3 p-3 rounded-md shadow-md bg-tw-white">
			<p className="text-[24px] ">{item.Name}</p>

			<div className="flex justify-between mt-3">
				<span className="text-lg font-bold">{item.Value}</span>

				<div className="icon ">
					<IoAnalytics size={30} />
				</div>
			</div>
		</div>
	)
}
