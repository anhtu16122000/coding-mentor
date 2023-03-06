import { Card, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import moment from 'moment'
import { ShowNoti } from '~/common/utils'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { dashboardApi } from '~/api/dashboard'
import PrimaryTable from '../Primary/Table'
import FilterTable from '~/common/utils/table-filter'
import PrimaryButton from '../Primary/Button'
import { SiMicrosoftexcel } from 'react-icons/si'
import * as XLSX from 'xlsx'

const reportOptions = [
	{ id: 0, value: 'Người dùng' },
	{ id: 1, value: 'Khoá học' },
	{ id: 2, value: 'Bài kiểm tra' },
	{ id: 3, value: 'Thông tin học viên' }
]

const initLearning = {
	Data: [],
	TotalRow: 0,
	TotalStudent: 0,
	TotalExam: 0,
	TotalCourseCompleted: 0,
	TotalCourse: 0,
	TotalVideoCourse: 0,
	TotalCompleted: 0,
	TotalPass: 0,
	TotalMedium: 0
}

const Report = () => {
	const user = useSelector((state: RootState) => state.user.information)

	const [overviewLearning, setOverviewLearning] = useState(initLearning)
	const [type, setType] = useState(0)
	const [loading, setLoading] = useState(false)

	const [filter, setFilter] = useState({
		pageSize: PAGE_SIZE,
		pageIndex: 1,
		search: '',
		type: 0
	})

	const getOverviewLearning = async () => {
		setLoading(true)
		try {
			const res: any = await dashboardApi.getOverviewLearning(filter)
			if (res.status == 200) {
				setOverviewLearning(res.data.data)
			}
			if (res.status == 204) {
				setOverviewLearning(initLearning)
			}
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}

	const getOverviewVideoCourse = async () => {
		setLoading(true)
		try {
			const res: any = await dashboardApi.getOverviewVideoCourse(filter)
			if (res.status == 200) {
				setOverviewLearning(res.data.data)
			}
			if (res.status == 204) {
				setOverviewLearning(initLearning)
			}
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}

	const getOverviewExam = async () => {
		setLoading(true)
		try {
			const res: any = await dashboardApi.getOverviewExam(filter)
			if (res.status == 200) {
				setOverviewLearning(res.data.data)
			}
			if (res.status == 204) {
				setOverviewLearning(initLearning)
			}
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}

	const getOverviewUserInformation = async () => {
		setLoading(true)
		try {
			const res: any = await dashboardApi.getOverviewUserInformation(filter)
			if (res.status == 200) {
				setOverviewLearning({ ...overviewLearning, Data: res.data.data })
			}
			if (res.status == 204) {
				setOverviewLearning(initLearning)
			}
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (user?.RoleId === '1') {
			if (type == 0) {
				getOverviewLearning()
			}
			if (type == 1) {
				getOverviewVideoCourse()
			}
			if (type == 2) {
				getOverviewExam()
			}
			if (type == 3) {
				getOverviewUserInformation()
			}
		}
	}, [filter])

	const type0column = [
		{
			...FilterTable({
				type: 'search',
				dataIndex: 'FullName',
				handleSearch: (event) => setFilter({ ...filter, search: event }),
				handleReset: (event) => setFilter({ ...filter, search: '' })
			}),
			title: 'Họ tên',
			dataIndex: 'FullName',
			key: 'FullName',
			render: (name) => <span className="font-[700]">{name}</span>
		},
		{
			title: 'Email',
			dataIndex: 'Email',
			key: 'Email',
			render: (name) => <span>{name}</span>
		},
		{
			title: 'Vai trò',
			dataIndex: 'RoleName',
			key: 'RoleName',
			render: (name) => <span>{name}</span>
		},
		{
			title: 'Khóa học',
			dataIndex: 'Course',
			key: 'Course',
			width: 100,
			render: (name) => <span className="font-[700]">{name}</span>
		},
		{
			title: 'Đã hoàn thành',
			dataIndex: 'Completed',
			key: 'Completed',
			width: 130,
			render: (name) => <span className="font-[700]">{name}</span>
		},
		{
			title: 'Điểm',
			dataIndex: 'Point',
			key: 'Point',
			width: 130,
			render: (name) => <span className="font-[700]">{name}</span>
		},
		{
			title: 'Ngày đăng ký tài khoản',
			dataIndex: 'CreatedOn',
			key: 'CreatedOn',
			width: 190,
			render: (name, item) => <span className="font-[700]">{moment(item.CreatedOn).format('HH:mm - DD/MM/YYYY')}</span>
		},
		{
			width: 200,
			title: 'Học vấn',
			dataIndex: 'AcademicLevelName',
			key: 'AcademicLevelName',
			render: (name, item) => <span className="font-[500]">{name}</span>
		},
		{
			title: 'Tình trạng hôn nhân',
			dataIndex: 'MarriageName',
			key: 'MarriageName',
			render: (name, item) => <span className="font-[500]">{name}</span>
		},
		{
			width: 200,
			title: 'Công việc',
			dataIndex: 'JobName',
			key: 'JobName',
			render: (name, item) => <span className="font-[500]">{name}</span>
		},
		{
			width: 200,
			title: 'Thu nhập',
			dataIndex: 'MonthlyIncomeName',
			key: 'MonthlyIncomeName',
			render: (name, item) => <span className="font-[500]">{name}</span>
		},
		{
			title: 'Công việc của bố',
			dataIndex: 'JobOfFatherName',
			key: 'JobOfFatherName',
			render: (name, item) => <span className="font-[600]">{name}</span>
		},
		{
			title: 'Công việc của mẹ',
			dataIndex: 'JobOfMotherName',
			key: 'JobOfMotherName',
			render: (name, item) => <span className="font-[500]">{name}</span>
		},
		{
			width: 250,
			title: 'Công việc của vợ hoặc chồng',
			dataIndex: 'JobOfSpouseName',
			key: 'JobOfSpouseName',
			render: (name, item) => <span className="font-[500]">{name}</span>
		},
		{
			width: 200,
			title: 'Thu nhập của gia đình',
			dataIndex: 'IncomeOfFamilyName',
			key: 'IncomeOfFamilyName',
			render: (name, item) => <span className="font-[500]">{name}</span>
		}
	]

	const type1column = [
		{
			...FilterTable({
				type: 'search',
				dataIndex: 'Name',
				handleSearch: (event) => setFilter({ ...filter, search: event }),
				handleReset: (event) => setFilter({ ...filter, search: '' })
			}),
			title: 'Tên khóa học',
			dataIndex: 'Name',
			key: 'Name',
			render: (name) => <span className="font-[700]">{name}</span>
		},
		{
			title: 'Học viên đã tham gia',
			dataIndex: 'VideoCourse',
			key: 'VideoCourse',
			render: (name) => <span>{name}</span>
		},
		{
			title: 'Học viên đã hoàn thành',
			dataIndex: 'Completed',
			key: 'Completed',
			render: (name) => <span>{name}</span>
		}
	]

	const type2column = [
		{
			...FilterTable({
				type: 'search',
				dataIndex: 'Name',
				handleSearch: (event) => setFilter({ ...filter, search: event }),
				handleReset: (event) => setFilter({ ...filter, search: '' })
			}),
			title: 'Tên bài',
			dataIndex: 'Name',
			key: 'Name',
			render: (name) => <span className="font-[700]">{name}</span>
		},
		{
			title: 'Khóa học',
			dataIndex: 'VideoCourseName',
			key: 'VideoCourseName',
			render: (name) => <span>{name}</span>
		},
		{
			width: 200,
			title: 'Học viên đã hoàn thành',
			dataIndex: 'Completed',
			key: 'Completed',
			render: (name) => <span className="font-[700]">{name}</span>
		},
		{
			width: 60,
			title: 'Đạt',
			dataIndex: 'Pass',
			key: 'Pass',
			render: (name) => <span className="font-[700]">{name}</span>
		},
		{
			width: 130,
			title: 'Điểm trung bình',
			dataIndex: 'Medium',
			key: 'Medium',
			render: (name) => <span className="font-[700]">{name}</span>
		}
	]

	const type3column = [
		{
			title: 'Loại thông tin',
			dataIndex: 'Name',
			key: 'Name',
			render: (name) => <span className="font-[700]">{name}</span>
		},
		{
			align: 'center',
			width: 200,
			title: 'Số lượng học viên',
			dataIndex: 'Value',
			key: 'Value',
			render: (name) => <span>{name}</span>
		}
	]

	const [loadingExport, setLoadingExport] = useState(false)

	async function exportExcel() {
		setLoadingExport(true)

		try {
			let response: any = []

			if (type == 0) {
				response = await dashboardApi.getOverviewLearning({ pageSize: 999999999, pageIndex: 1, search: '' })
			}

			if (type == 1) {
				response = await dashboardApi.getOverviewVideoCourse({ pageSize: 999999999, pageIndex: 1, search: '' })
			}

			if (type == 2) {
				response = await dashboardApi.getOverviewExam({ pageSize: 999999999, pageIndex: 1, search: '' })
			}

			if (type == 3) {
				response = await dashboardApi.getOverviewUserInformation({ pageSize: 999999999, pageIndex: 1, search: '' })
			}

			let temp = []
			if (type != 3) {
				if (response.status == 200) {
					response.data.data.Data.forEach((item, index) => {
						if (type == 0) {
							temp.push({
								A: index + 1,
								B: item.FullName,
								C: item.Email,
								D: item.RoleName,
								E: item.Course,
								F: item.Completed,
								G: item.Point,
								H: moment(item.CreatedOn).format('HH:mm - DD/MM/YYYY'),
								I: item.AcademicLevelName,
								J: item.MarriageName,
								K: item.JobName,
								L: item.MonthlyIncomeName,
								M: item.JobOfFatherName,
								N: item.JobOfMotherName,
								O: item.JobOfSpouseName,
								p: item.IncomeOfFamilyName
							})
						}

						if (type == 1) {
							temp.push({
								A: index + 1,
								B: item.Name,
								C: item.VideoCourse,
								D: item.Completed
							})
						}

						if (type == 2) {
							temp.push({
								A: index + 1,
								B: item.Name,
								C: item.VideoCourseName,
								D: item.Completed,
								E: item.Pass,
								F: item.Medium
							})
						}
					})
					saveFile(temp)
				}
			} else {
				response.data.data.forEach((item, index) => {
					if (type == 3) {
						temp.push({
							A: index + 1,
							B: item.Name,
							C: item.Value
						})
					}
				})
				saveFile(temp)
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setLoadingExport(false)
		}
	}

	const saveFile = async (data) => {
		let wb = XLSX.utils.book_new()

		var ws = XLSX.utils.json_to_sheet([], {})

		function getHeader() {
			if (type === 0) {
				return 'Danh sách học viên'
			}
		}

		// Get content inner excel file
		function getItem() {
			if (type == 0) {
				return {
					A: 'STT',
					B: 'Họ và tên',
					C: 'Email',
					D: 'Vai trò',
					E: 'Khóa học',
					F: 'Đã hoàn thành',
					G: 'Điểm',
					H: 'Ngày đăng ký tài khoản',
					I: 'Học vấn',
					J: 'Tình trạng hôn nhân',
					K: 'Công việc',
					L: 'Thu nhập',
					M: 'Công việc của bố',
					N: 'Công việc của mẹ',
					O: 'Công việc của vợ hoặc chồng',
					P: 'Thu nhập của gia đình'
				}
			}

			if (type == 1) {
				return {
					A: 'STT',
					B: 'Tên khóa học',
					C: 'Học viên đã tham gia',
					D: 'Học viên đã hoàn thành'
				}
			}

			if (type == 2) {
				return {
					A: 'STT',
					B: 'Tên bài',
					C: 'Khóa học',
					D: 'Học viên đã hoàn thành',
					E: 'Đạt',
					F: 'Điểm trung bình'
				}
			}

			if (type == 3) {
				return {
					A: 'STT',
					B: 'Loại thông tin',
					C: 'Số lượng'
				}
			}

			return {}
		}

		XLSX.utils.sheet_add_json(ws, [getItem()], { skipHeader: true, origin: 'A2' })

		XLSX.utils.sheet_add_json(ws, data, { skipHeader: true, origin: 'A3' })

		let wsrows = [{ hpt: 22 }]

		// ws['!rows'] = wsrows

		if (type == 0) {
			ws['!cols'] = [
				{ wch: 4 },
				{ wch: 30 },
				{ wch: 30 },
				{ wch: 10 },
				{ wch: 10 },
				{ wch: 15 },
				{ wch: 10 },
				{ wch: 25 },
				{ wch: 25 },
				{ wch: 30 },
				{ wch: 50 },
				{ wch: 40 },
				{ wch: 40 },
				{ wch: 40 },
				{ wch: 40 },
				{ wch: 40 },
				{ wch: 40 }
			]
		}
		if (type == 1) {
			ws['!cols'] = [{ wch: 4 }, { wch: 25 }, { wch: 25 }, { wch: 25 }]
		}
		if (type == 2) {
			ws['!cols'] = [{ wch: 4 }, { wch: 35 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }]
		}
		if (type == 3) {
			ws['!cols'] = [{ wch: 4 }, { wch: 80 }, { wch: 10 }]
		}

		XLSX.utils.book_append_sheet(wb, ws, 'Trang 1')

		// Get file name with timestamp
		function getFileName() {
			if (type == 0) {
				return `bao-cao-nguoi-dung-${new Date().getTime()}.xlsx`
			}
			if (type == 1) {
				return `bao-cao-khoa-hoc-${new Date().getTime()}.xlsx`
			}
			if (type == 2) {
				return `bao-cao-${new Date().getTime()}.xlsx`
			}
			if (type == 3) {
				return `bao-cao-thong-tin-${new Date().getTime()}.xlsx`
			}
			return `bao-cao-${new Date().getTime()}.xlsx`
		}

		XLSX.writeFile(wb, getFileName(), { type: 'binary', bookType: 'xlsx' })
	}

	function onChangeType(event) {
		setType(event)
		setFilter({ ...filter, type: event })
	}

	// Get table columns
	function getType() {
		if (type == 0) {
			return type0column
		}
		if (type == 1) {
			return type1column
		}
		if (type == 2) {
			return type2column
		}
		if (type == 3) {
			return type3column
		}
		return type0column
	}

	// Get grid responsive
	const getGridCol = () => {
		if (type == 1) {
			return 'grid-cols-4 w600:grid-cols-8 w1250:grid-cols-12'
		}
		return 'grid-cols-6 w1250:grid-cols-12'
	}

	// Get row responsive
	const getRowSpan = () => {
		if (type == 1) {
			return 'col-span-4'
		}
		return 'col-span-3'
	}

	// Rên................................ đơ
	return (
		<div className="w-[95%] desktop:w-[85%] mx-auto">
			{user?.RoleId === '1' && (
				<>
					<Card
						title={
							<div className="w-full flex items-center">
								<div>
									<span className="font-[600]">Loại:</span>
									<Select defaultValue={0} onChange={onChangeType} className="primary-input w-[180px] ml-2">
										{reportOptions.map((item, index) => (
											<Select.Option key={item.id} value={item.id}>
												{item.value}
											</Select.Option>
										))}
									</Select>
								</div>
								<div className="flex-1 flex justify-end">
									<PrimaryButton
										loading={loadingExport}
										onClick={exportExcel}
										className="hidden w430:flex"
										icon="excel"
										type="button"
										background="blue"
									>
										Xuất báo cáo
									</PrimaryButton>
									<PrimaryButton
										loading={loadingExport}
										onClick={exportExcel}
										className="block w430:hidden !pr-[-30px]"
										type="button"
										background="blue"
									>
										<SiMicrosoftexcel size={18} />
									</PrimaryButton>
								</div>
							</div>
						}
					>
						{type !== 3 && (
							<div className={`grid ${getGridCol()} gap-x-4 gap-y-4 mb-4`}>
								{/* Item 1 */}
								<div className={`${getRowSpan()} py-[16px] rounded-[6px] border-[1px] border-[#f0f0f0] inline-flex flex-col items-center`}>
									{type == 0 && (
										<>
											<div className="text-[28px] font-[600]">{overviewLearning.TotalStudent}</div>
											<div>Học viên</div>
										</>
									)}
									{type == 1 && (
										<>
											<div className="text-[28px] font-[600]">{overviewLearning.TotalVideoCourse}</div>
											<div>Khoá học</div>
										</>
									)}
									{type == 2 && (
										<>
											<div className="text-[28px] font-[600]">{overviewLearning.TotalExam}</div>
											<div>Bài kiểm tra</div>
										</>
									)}
								</div>

								{/* Item 2 */}
								<div className={`${getRowSpan()} py-[16px] rounded-[6px] border-[1px] border-[#f0f0f0] inline-flex flex-col items-center`}>
									{type == 0 && (
										<>
											<div className="text-[28px] font-[600]">{overviewLearning.TotalCourse}</div>
											<div>Khóa học</div>
										</>
									)}
									{type == 1 && (
										<>
											<div className="text-[28px] font-[600]">{overviewLearning.TotalStudent}</div>
											<div>Học viên đã tham gia</div>
										</>
									)}
									{type == 2 && (
										<>
											<div className="text-[28px] font-[600]">{overviewLearning.TotalCompleted}</div>
											<div>Số lần làm</div>
										</>
									)}
								</div>

								{/* Item 3 */}
								<div className={`${getRowSpan()} py-[16px] rounded-[6px] border-[1px] border-[#f0f0f0] inline-flex flex-col items-center`}>
									{type == 0 && (
										<>
											<div className="text-[28px] font-[600]">{overviewLearning.TotalCourseCompleted}</div>
											<div>Đã hoàn thành</div>
										</>
									)}
									{type == 1 && (
										<>
											<div className="text-[28px] font-[600]">{overviewLearning.TotalCompleted}</div>
											<div>Học viên đã hoàn thành</div>
										</>
									)}
									{type == 2 && (
										<>
											<div className="text-[28px] font-[600]">{overviewLearning.TotalPass}</div>
											<div>Số học sinh đạt</div>
										</>
									)}
								</div>

								{/* Item 4 */}
								{type !== 1 && (
									<div
										className={`${getRowSpan()} py-[16px] rounded-[6px] border-[1px] border-[#f0f0f0] inline-flex flex-col items-center`}
									>
										{type == 0 && (
											<>
												<div className="text-[28px] font-[600]">{overviewLearning.TotalExam}</div>
												<div>Bài tập</div>
											</>
										)}
										{type == 2 && (
											<>
												<div className="text-[28px] font-[600]">{overviewLearning.TotalMedium}</div>
												<div>Điểm trung bình</div>
											</>
										)}
									</div>
								)}
							</div>
						)}

						<PrimaryTable
							className="mini-table"
							columns={getType()}
							data={overviewLearning.Data}
							total={overviewLearning.TotalRow}
							loading={loading}
							onChangePage={(event: number) => setFilter({ ...filter, pageIndex: event })}
						/>
					</Card>
				</>
			)}
		</div>
	)
}

export default Report
