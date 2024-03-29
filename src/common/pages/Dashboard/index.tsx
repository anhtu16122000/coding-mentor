import { Card, Select, Form } from 'antd'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import moment from 'moment'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { branchApi } from '~/api/manage/branch'
import { IoAnalytics } from 'react-icons/io5'
import StatisticTop5Course from '~/common/components/Dashboard/StatisticTop5Course'
import { staticsticalApi } from '~/api/manage/statistic'
import StatisticStudentByAge from '~/common/components/Dashboard/StatisticStudentByAge'
import StatisticPie from '~/common/components/Dashboard/StatisticPie'
import { RiMoneyDollarCircleLine } from 'react-icons/ri'
import { HiArrowNarrowDown, HiOutlineUser } from 'react-icons/hi'
import { GiEvilBook } from 'react-icons/gi'
import { TbArrowNarrowUp, TbPencil } from 'react-icons/tb'
import { StatisticClassNew } from '~/common/components/Dashboard/StatisticClassNew'
import IconButton from '~/common/components/Primary/IconButton'
import StatisticPieRateTeacher from '~/common/components/Dashboard/StatisticPieRateTeacher'
import { StatisticRateTeacher } from '~/common/components/Dashboard/StatisticRateTeacher'
import { StatisticPointStudent } from '~/common/components/Dashboard/StatisticPointStudent'
import { ListFeedback } from '~/common/components/Dashboard/ListFeedback'
import { feedbackStudentApi } from '~/api/manage/feedbacks-student'
import { userInformationApi } from '~/api/user/user'
import Top5DemandChart from './Top5Demand'
import Top5CourseChart from './Top5Course'

const RevenueChart = dynamic(() => import('./Revenue'))

const dataYear = [
	{
		value: 2023,
		label: '2023'
	},
	{
		value: 2022,
		label: '2022'
	},
	{
		value: 2021,
		label: '2021'
	},
	{
		value: 2020,
		label: '2020'
	},
	{
		value: 2019,
		label: '2019'
	},
	{
		value: 2018,
		label: '2018'
	},
	{
		value: 2017,
		label: '2017'
	},
	{
		value: 2016,
		label: '2016'
	},
	{
		value: 2015,
		label: '2015'
	}
]

const Dashboard = () => {
	const dispatch = useDispatch()
	const [form] = Form.useForm()
	const [type, setType] = useState('offline')
	const user = useSelector((state: RootState) => state.user.information)
	const listTodoApi = {
		branchIds: '',
		year: moment().year()
	}

	const listTodoApiOverView = {
		branchIds: '',
		userId: ''
	}

	const [idStudent, setIdStudent] = useState(null)
	const [todoApi, setTodoApi] = useState(listTodoApi)
	const [todoApiOverView, setTodoApiOverView] = useState(listTodoApiOverView)
	const [allBranch, setAllBranch] = useState([])
	const [student, setStudent] = useState<{ label: string; value: string }[]>([])
	const [statisticOverview, setStatisticOverview] = useState([])
	const [statisticStudentAge, setStatisticStudentAge] = useState([])
	const [statisticSource, setStatisticSource] = useState([])
	const [statisticTopJob, setStatisticTopJob] = useState([])
	const [statisticNewClass, setStatisticNewClass] = useState([])
	const [statisticNewCustomer, setStatisticNewCustomer] = useState([])
	const [statisticFeedRating, setStatisticFeedRating] = useState([])
	const [statisticTeacherRate, setStatisticTeacherRate] = useState([])
	const [statisticCustomerofSales, setStatisticCustomerofSales] = useState([])
	const [statisticialTestAppointment, setStatisticialTestAppointment] = useState([])
	const [statisticTotalScheduleTeacher, setStatisticTotalScheduleTeacher] = useState([])
	const [statisticTotalScheduleStudent, setStatisticTotalScheduleStudent] = useState([])
	const initialFeedback = { pageSize: PAGE_SIZE, pageIndex: 1 }
	const [todoFeedback, setTodoFeedback] = useState(initialFeedback)
	const [feedback, setFeedback] = useState([])
	const [totalFeedback, setTotalFeedback] = useState(0)

	// ----------------------------------------------------------------
	const [showRevenueChart, setShowRevenueChart] = useState<boolean>(false)
	const [showTop5Chart, setShowTop5Chart] = useState<boolean>(false)

	useEffect(() => {
		// the-super-scroll
		const superScroll = document.getElementById('the-super-scroll')

		const handleScroll = () => {
			const revenueTag = document.getElementById('revenue-chart')
			const top5Chart = document.getElementById('top-5-chart')

			var scrollPosition = superScroll.scrollTop

			if (!!revenueTag) {
				const revenueChartPositon = revenueTag.offsetTop - window.innerHeight
				if (scrollPosition > revenueChartPositon) {
					setShowRevenueChart(true)
				}
			}

			if (!!top5Chart) {
				const top5ChartPositon = top5Chart.offsetTop - (window.innerHeight - 150)
				if (scrollPosition > top5ChartPositon && !showTop5Chart) {
					setShowTop5Chart(true)
				}
			}
		}

		if (!!superScroll) {
			superScroll.addEventListener('scroll', handleScroll)
		}

		return () => {
			if (!!superScroll) {
				superScroll.removeEventListener('scroll', handleScroll) // Gỡ bỏ event listener khi component bị unmount
			}
		}
	}, [])

	const getAllBranch = async () => {
		try {
			const { data } = await branchApi.getAll()
			setAllBranch(data.data)
		} catch (error) {}
	}

	const handleChangeBranch = (val) => {
		if (val && val.length > 0) {
			const branchs = val.toString()
			setTodoApi({ ...todoApi, branchIds: branchs })
			setTodoApiOverView({ ...todoApiOverView, branchIds: branchs })
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

	const getOverView = async () => {
		try {
			const res = await staticsticalApi.getOverview(todoApiOverView)
			if (res.status === 200) {
				setStatisticOverview(res.data.data)
			}
			if (res.status === 204) {
				setStatisticOverview([])
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

	const getTeacherRate = async () => {
		try {
			const res = await staticsticalApi.getRateTeacher(todoApi)
			if (res.status === 200) {
				setStatisticTeacherRate(res.data.data)
			}
			if (res.status === 204) {
				setStatisticTeacherRate([])
			}
		} catch (error) {}
	}

	const getTotalScheduleTeacher = async () => {
		try {
			const res = await staticsticalApi.getTotalScheduleTeacher(todoApi)
			if (res.status === 200) {
				setStatisticTotalScheduleTeacher(res.data.data)
			}
			if (res.status === 204) {
				setStatisticTotalScheduleTeacher([])
			}
		} catch (error) {}
	}

	const getTotalScheduleStudent = async () => {
		try {
			const res = await staticsticalApi.getTotalScheduleStudent(todoApi)
			if (res.status === 200) {
				setStatisticTotalScheduleStudent(res.data.data)
			}
			if (res.status === 204) {
				setStatisticTotalScheduleStudent([])
			}
		} catch (error) {}
	}

	const getFeedback = async () => {
		try {
			const res = await feedbackStudentApi.getAll(todoFeedback)
			if (res.status === 200) {
				setFeedback(res.data.data)
				setTotalFeedback(res.data.totalRow)
			}
			if (res.status === 204) {
				setFeedback([])
			}
		} catch (error) {}
	}

	const getStatisticialTestAppointment = async () => {
		try {
			const res = await staticsticalApi.getStatisticialTestAppointment(todoFeedback)
			if (res.status === 200) {
				setStatisticialTestAppointment(res.data.data)
			}
			if (res.status === 204) {
				setStatisticialTestAppointment([])
			}
		} catch (error) {}
	}

	const getNewCustomerofsales = async () => {
		try {
			const res = await staticsticalApi.getStatisticalNewCustomerofsales(todoFeedback)
			if (res.status === 200) {
				setStatisticCustomerofSales(res.data.data)
			}
			if (res.status === 204) {
				setStatisticCustomerofSales([])
			}
		} catch (error) {}
	}

	const getUser = async () => {
		try {
			const res = await userInformationApi.getAll({ pageIndex: 1, pageSize: 9999, parentIds: user.UserInformationId.toString() })
			if (res.status == 200) {
				let temp = []
				res?.data?.data?.forEach((item) => {
					temp.push({ label: `${item?.FullName} - ${item.UserCode}`, value: item?.UserInformationId })
				})
				setStudent(temp)
			}
			if (res.status == 204) {
				setStudent([])
			}
		} catch (err) {}
	}

	const handleChangeStudent = (val) => {
		setTodoApiOverView({ ...todoApiOverView, userId: val })
		setIdStudent(val)
	}

	useEffect(() => {
		getStaticStudentAge()

		getTopSource()
		getTopJob()

		getNewClassInMonth()
		getNewCustomer()
		getFeedbackRating()
		getTeacherRate()
		getTotalScheduleTeacher()

		getTotalScheduleStudent()
		getStatisticialTestAppointment()
		getNewCustomerofsales()
	}, [todoApi])

	useEffect(() => {
		getOverView()
	}, [todoApiOverView])

	useEffect(() => {
		if (user.UserInformationId) {
			getUser()
		}
	}, [user])

	useEffect(() => {
		getFeedback()
		getAllBranch()
	}, [])

	return (
		<div className="w-[100%] mx-auto dashboard">
			<div className="flex justify-between mb-4">
				<p className="title">Xin chào, {user.FullName}</p>
				<Form form={form}>
					<div className="flex items-center pr-4">
						<Form.Item name="student" className="w-[200px] mr-2">
							{user?.RoleId == 8 && <Select onChange={handleChangeStudent} options={student} className="w-[200px] h-[36px] mr-2"></Select>}
						</Form.Item>

						<Form.Item name="branchIds" className="w-[200px]">
							<Select className="w-[200px] h-[36px] mr-2" mode="multiple" onChange={handleChangeBranch} allowClear placeholder="Trung tâm">
								{allBranch?.length > 0 &&
									allBranch?.map((branch, index) => (
										<Select.Option value={branch.Id} key={index}>
											{branch.Name}
										</Select.Option>
									))}
							</Select>
						</Form.Item>
						<IconButton
							color="red"
							icon="reset"
							type="button"
							onClick={() => {
								setTodoApi(listTodoApi)
								setTodoApiOverView(listTodoApiOverView)
								form.resetFields()
							}}
							tooltip="Reset bộ lọc"
						/>
					</div>
				</Form>
			</div>

			<div className="dashboard-content">
				{statisticOverview?.length > 0 &&
					statisticOverview?.map((item, index) => (
						<>
							<div className="items">
								<div className="inner-item">
									<div
										className={`name ${item?.Id === 1 ? 'kh' : item?.Id === 3 ? 'dt' : item?.Id === 4 ? 'gd' : item?.Id === 2 ? 'ht' : ''}`}
									>
										<div className="ttl">{item?.Title}</div>
										<div className="icon">
											{item?.Id === 1 ? (
												<HiOutlineUser />
											) : item?.Id === 3 ? (
												<RiMoneyDollarCircleLine />
											) : item?.Id === 4 ? (
												<GiEvilBook />
											) : item?.Id === 2 ? (
												<TbPencil />
											) : (
												''
											)}
										</div>
									</div>
									<div className="value">
										{item?.OverviewModel?.map((i) => (
											<div className="item">
												<div className="left">
													<div className="n">{i?.Name}</div>
													<div className="sub">
														<p>{i?.SubValue}</p>
														<div className={`ic ${i?.Type === 1 ? 'up' : i?.Type === 2 ? 'down' : ''}`}>
															{i?.Type === 1 ? <TbArrowNarrowUp /> : i?.Type === 2 ? <HiArrowNarrowDown /> : ''}
														</div>
													</div>
												</div>
												<div className="right">{item?.Id !== 3 ? i?.Value : Intl.NumberFormat('ja-JP').format(i?.Value)}</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</>
					))}
			</div>

			{(user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7) && (
				<div id="revenue-chart">{showRevenueChart && <RevenueChart />}</div>
			)}

			{(user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7) && (
				<div id="top-5-chart" className="grid grid-cols-3 w800:grid-cols-6 gap-4 mt-4">
					{showTop5Chart && (
						<div className="col-span-3">
							<Top5DemandChart />
						</div>
					)}

					{showTop5Chart && (
						<div className="col-span-3">
							<Top5CourseChart />
						</div>
					)}
				</div>
			)}

			<div className="flex justify-end mt-4">
				<Select
					onChange={(e) => {
						setTodoApi((pre) => ({ ...pre, year: e }))
						setTodoApiOverView((pre) => ({ ...pre, year: e }))
					}}
					options={dataYear}
					className="w-[100px] h-[36px] mr-2"
				/>
			</div>

			{user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7 ? (
				<>
					<div className="grid grid-cols-6 gap-4">
						<Card className="col-span-3 mt-tw-4 " title={<h1 className="text-2xl font-medium">Lớp mới mỗi tháng</h1>}>
							<StatisticClassNew data={statisticNewClass} titleBar="Lớp mới mỗi tháng" type={1} />
						</Card>

						<Card className="col-span-3 mt-tw-4" title={<h1 className="text-2xl font-medium">Khách mới mỗi tháng</h1>}>
							<StatisticClassNew data={statisticNewCustomer} titleBar="Khách mới mỗi tháng" type={2} />
						</Card>
					</div>

					<Card className="mt-tw-4" title={<h1 className="text-2xl font-medium">Top 5 nguồn khách hàng</h1>}>
						<StatisticTop5Course data={statisticSource} titleBar="Khách hàng" type={2} />
					</Card>

					<Card className="mt-tw-4" title={<h1 className="text-2xl font-medium">Top 5 công việc của học viên </h1>}>
						<StatisticTop5Course data={statisticTopJob} titleBar="Học viên " type={2} />
					</Card>
					<Card className="mt-tw-4" title={<h1 className="text-2xl font-medium">Thống kê học viên theo độ tuổi</h1>}>
						<StatisticStudentByAge data={statisticStudentAge} titleBar="Độ tuổi học viên " />
					</Card>

					{user.RoleId != 7 ? (
						<Card className="mt-tw-4" title={<h1 className="text-2xl font-medium">Tỉ lệ đánh giá phản hồi</h1>}>
							<StatisticPie data={statisticFeedRating} />
						</Card>
					) : (
						''
					)}
				</>
			) : user?.RoleId == 2 ? ( // giáo viên
				<>
					<div className="grid grid-cols-6 gap-tw-4">
						<Card className="col-span-3 mt-tw-4" title={<h1 className="text-2xl font-medium">Tỉ lệ đánh giá</h1>}>
							<StatisticPieRateTeacher data={statisticTeacherRate} />
						</Card>
						<Card className="col-span-3 mt-tw-4" title={<h1 className="text-2xl font-medium">Tổng số buổi dạy trong từng tháng</h1>}>
							<StatisticRateTeacher data={statisticTotalScheduleTeacher} titleBar="Buổi dạy trong từng tháng" type={1} />
						</Card>
					</div>
				</>
			) : user?.RoleId == 3 || user?.RoleId == 8 ? ( //học viên phụ huynh
				<>
					<div className="mt-tw-4">
						<StatisticPointStudent idStudent={idStudent} />
					</div>
					<div className="mt-tw-4">
						<ListFeedback
							totalFeedback={totalFeedback}
							initialFeedback={initialFeedback}
							dataTable={feedback}
							setTodo={setTodoFeedback}
							todo={todoFeedback}
						/>
					</div>
					<Card className="mt-tw-4" title={<h1 className="text-2xl font-medium">Tổng số buổi học trong từng tháng</h1>}>
						<StatisticRateTeacher data={statisticTotalScheduleStudent} titleBar="Buổi học trong từng tháng" type={1} />
					</Card>
				</>
			) : user?.RoleId == 5 ? (
				<>
					<div className="grid grid-cols-6 gap-tw-4">
						<Card className="col-span-3 mt-tw-4" title={<h1 className="text-2xl font-medium">Khách mới mỗi tháng</h1>}>
							<StatisticClassNew data={statisticCustomerofSales} titleBar="Khách mới mỗi tháng" type={1} />
						</Card>
						<Card className="col-span-3 mt-tw-4" title={<h1 className="text-2xl font-medium">Kiểm tra đầu vào trong tháng</h1>}>
							<StatisticClassNew data={statisticialTestAppointment} titleBar="Kiểm tra đầu vào trong tháng" type={2} />
						</Card>
					</div>
				</>
			) : user?.RoleId == 6 ? (
				<>
					<div className="grid grid-cols-6 gap-tw-4">
						<Card className="col-span-3 mt-tw-4 " title={<h1 className="text-2xl font-medium">Lớp mới mỗi tháng</h1>}>
							<StatisticClassNew data={statisticNewClass} titleBar="Lớp mới mỗi tháng" type={1} />
						</Card>

						<Card className="col-span-3 mt-tw-4" title={<h1 className="text-2xl font-medium">Khách mới mỗi tháng</h1>}>
							<StatisticClassNew data={statisticNewCustomer} titleBar="Khách mới mỗi tháng" type={2} />
						</Card>
					</div>
				</>
			) : (
				''
			)}
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
