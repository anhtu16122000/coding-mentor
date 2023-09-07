import { Card, Modal, Popconfirm } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import ModalCreateHomeWork from './ModalCreate'
import { homeWorkApi } from '~/api/home-work'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import PrimaryTable from '../../Primary/Table'
import moment from 'moment'
import PrimaryTag from '../../Primary/Tag'
import PrimaryTooltip from '../../PrimaryTooltip'
import { FaUserClock } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { TbWritingSign } from 'react-icons/tb'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { doingTestApi } from '~/api/IeltsExam/doing-test'
import { log } from '~/common/utils'
import Lottie from 'react-lottie-player'
import warning from '~/common/components/json/100468-warning.json'
import { examResultApi } from '~/api/exam/result'
import { FiEye } from 'react-icons/fi'

const listTodoApi = {
	pageSize: PAGE_SIZE,
	pageIndex: 1,
	Code: null,
	Name: null
}

const HomeWork = () => {
	const router = useRouter()

	const [data, setData] = useState([])
	const [studentHomeWork, setStudentHomeWork] = useState([])
	const [filters, setFilters] = useState(listTodoApi)
	const [loading, setLoading] = useState<boolean>(true)
	const [totalPage, setTotalPage] = useState(null)

	useEffect(() => {
		if (!!router.query?.class) {
			getData()
		}
	}, [filters, router])

	async function getData() {
		const ClassId = router.query?.class || null

		setLoading(true)
		try {
			const res = await homeWorkApi.getAll({ ...filters, classId: ClassId })
			if (res.status == 200) {
				setData(res.data?.data)
				setTotalPage(res.data.totalRow)
			} else {
				setData([])
				setTotalPage(1)
			}
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}

	const [loadingResult, setLoadingResult] = useState<boolean>(true)
	async function getStudentHomeWork(HWId) {
		setLoadingResult(true)

		let SId = userInfo?.RoleId == '3' ? userInfo?.UserInformationId : null

		try {
			const res = await examResultApi.getAll({ valueId: HWId, studentId: SId || null, pageIndex: 1, pageSize: 9999 })
			if (res.status == 200) {
				setStudentHomeWork(res.data?.data)
			} else {
				setStudentHomeWork([])
			}
		} catch (error) {
		} finally {
			setLoadingResult(false)
		}
	}

	async function delThis(Id) {
		setLoading(true)
		try {
			const res = await homeWorkApi.delete(Id)
			if (res.status == 200) {
				getData()
			} else {
				setLoading(false)
			}
		} catch (error) {
			setLoading(false)
		}
	}

	const userInfo = useSelector((state: RootState) => state.user.information)

	const is = {
		parent: userInfo?.RoleId == '8',
		admin: userInfo?.RoleId == '1',
		teacher: userInfo?.RoleId == '2'
	}

	const columns = [
		{
			title: 'Tên bài',
			dataIndex: 'Name',
			render: (value, item, index) => <div className="font-[600] text-[#1b73e8] min-w-[100px] max-w-[250px]">{value}</div>
		},
		{
			title: 'Bắt đầu',
			width: 120,
			dataIndex: 'FromDate',
			render: (value, item, index) => <>{moment(new Date(value)).format('DD/MM/YYYY')}</>
		},
		{
			title: 'Kết thúc',
			width: 120,
			dataIndex: 'ToDate',
			render: (value, item, index) => <>{moment(new Date(value)).format('DD/MM/YYYY')}</>
		},
		{
			title: 'Đề',
			dataIndex: 'IeltsExamName',
			render: (value, item, index) => <div className="font-[600] in-1-line min-w-[80px] max-w-[220px]">{value}</div>
		},
		userInfo.RoleId == 3
			? {
					title: 'Trạng thái',
					dataIndex: 'MyStatusName',
					render: (value, item, index) => {
						if (item?.MyStatus == 1) {
							return <PrimaryTag children={value || ''} color="yellow" />
						}

						if (item?.MyStatus == 2) {
							return <PrimaryTag children={value || ''} color="blue" />
						}

						if (item?.MyStatus == 3) {
							return <PrimaryTag children={value || ''} color="green" />
						}

						return <PrimaryTag children={value || ''} color="red" />
					}
			  }
			: {
					title: 'Người tạo',
					dataIndex: 'CreatedBy'
			  },

		{
			title: 'Ghi chú',
			width: 150,
			dataIndex: 'Note',

			render: (value, item, index) => (
				<PrimaryTooltip place="left" id={item?.Id} content={value}>
					<div className="font-[600] in-1-line min-w-[80px] max-w-[200px]">{value}</div>
				</PrimaryTooltip>
			)
		},
		{
			fixed: 'right',
			render: (value, item, index) => {
				return (
					<div className="flex items-center">
						{(is.admin || is.teacher) && <ModalCreateHomeWork isEdit defaultData={item} onRefresh={getData} />}

						{(is.admin || is.teacher) && (
							<PrimaryTooltip place="left" id={`hw-del-${item?.Id}`} content="Làm bài">
								<Popconfirm placement="left" title={`Xoá bài tập: ${item?.Name}?`} onConfirm={() => delThis(item?.Id)}>
									<div className="mr-[8px] w-[28px] text-[#C94A4F] h-[30px] all-center hover:opacity-70 cursor-pointer ml-[8px]">
										<IoClose size={26} className="mb-[-2px]" />
									</div>
								</Popconfirm>
							</PrimaryTooltip>
						)}

						<PrimaryTooltip place="left" id={`hw-take-${item?.Id}`} content="Làm bài">
							<div
								onClick={() => getDraft(item?.IeltsExamId, item?.Id)}
								className="w-[28px] text-[#1b73e8] h-[30px] all-center hover:opacity-70 cursor-pointer"
							>
								<TbWritingSign size={22} />
							</div>
						</PrimaryTooltip>

						<PrimaryTooltip place="left" id={`hw-his-${item?.Id}`} content="Lịch sử làm bài">
							<div
								onClick={() => {
									setHistories({ HWId: item?.Id, Name: item?.Name })
									getStudentHomeWork(item?.Id)
								}}
								className="ml-[8px] w-[28px] text-[#279d37] h-[30px] all-center hover:opacity-70 cursor-pointer"
							>
								<FaUserClock size={20} />
							</div>
						</PrimaryTooltip>
					</div>
				)
			}
		}
	]

	// -------
	const resultColumns = [
		{
			title: 'Mã học viên',
			dataIndex: 'StudentCode',
			render: (value, item, index) => <div className="font-[600] text-[#000] min-w-[100px] max-w-[250px]">{value}</div>
		},
		{
			title: 'Tên học viên',
			dataIndex: 'StudentName',
			render: (value, item, index) => <div className="font-[600] text-[#1b73e8] min-w-[100px] max-w-[250px]">{value}</div>
		},
		{
			title: 'Thời gian làm',
			width: 120,
			dataIndex: 'TimeSpent',
			render: (value, item, index) => <>{value < 1 ? 1 : value} phút</>
		},
		{
			title: 'Tổng điểm',
			width: 120,
			dataIndex: 'MyPoint',
			render: (value, item, index) => (
				<div className="font-[600]">
					{value} / {item?.Point}
				</div>
			)
		},
		{
			title: 'Điểm trung bình',
			width: 140,
			dataIndex: 'AveragePoint'
		},
		{
			title: 'Ngày',
			dataIndex: 'CreatedOn',
			render: (value, item, index) => <>{moment(new Date(value)).format('HH:mm DD/MM/YYYY')}</>
		},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusName',
			render: (value, item, index) => {
				if (item?.Status == 1) {
					return <PrimaryTag children={value || ''} color="yellow" />
				}

				if (item?.Status == 2) {
					return <PrimaryTag children={value || ''} color="blue" />
				}

				if (item?.Status == 3) {
					return <PrimaryTag children={value || ''} color="green" />
				}

				return <PrimaryTag children={value || ''} color="red" />
			}
		},
		{
			fixed: 'right',
			render: (value, item, index) => {
				return (
					<div className="flex items-center">
						<PrimaryTooltip place="left" id={`hw-res-${item?.Id}`} content="Xem kết quả">
							<div
								onClick={() => window.open(`/exam-result/?test=${item?.Id}`, '_blank')}
								className="w-[28px] text-[#1b73e8] h-[30px] all-center hover:opacity-70 cursor-pointer"
							>
								<FiEye size={22} />
							</div>
						</PrimaryTooltip>
					</div>
				)
			}
		}
	]

	// -------- Take an exam
	async function getDraft(ExamId, HWId) {
		try {
			// 1 - Làm bài thử 2 - Làm bài hẹn test 3 - Bài tập về nhà 4 - Bộ đề
			const res = await doingTestApi.getDraft({ valueId: HWId, type: 3 })
			if (res.status == 200) {
				setCurrentData({ ExamId: ExamId, HWId: HWId, draft: res.data?.data })
				setExamWarning(true)
			} else {
				createDoingTest(ExamId, HWId)
			}
		} catch (error) {
		} finally {
		}
	}

	const [examWarning, setExamWarning] = useState<boolean>(false)
	const [currentData, setCurrentData] = useState<any>(null)

	function gotoTest(params) {
		if (params?.Id) {
			window.open(`/take-an-exam/?exam=${params?.Id}`, '_blank')
		}
	}
	async function createDoingTest(ExamId, HWId) {
		try {
			const res = await doingTestApi.post({ IeltsExamId: ExamId, ValueId: HWId, Type: 3 })

			if (res?.status == 200) {
				log.Green('Created test', res.data?.data)
				gotoTest(res.data?.data)
			}
		} catch (error) {
		} finally {
		}
	}

	const [histories, setHistories] = useState<any>(null)

	return (
		<>
			<Card
				className="shadow-sm"
				title={
					<div className="w-full flex items-center justify-between">
						<div>Bài tập</div>
						{(is.admin || is.teacher) && <ModalCreateHomeWork onRefresh={getData} />}
					</div>
				}
			>
				<PrimaryTable
					loading={loading}
					total={totalPage && totalPage}
					data={data}
					columns={columns}
					onChangePage={(event: number) => setFilters({ ...filters, pageIndex: event })}
				/>
			</Card>

			<Modal width={400} open={examWarning} onCancel={() => setExamWarning(false)} footer={null}>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<Lottie loop animationData={warning} play style={{ width: 160, height: 160, marginBottom: 8 }} />
					<div style={{ fontSize: 18 }}>Bạn có muốn tiếp tục làm bản trước đó?</div>

					<div className="none-selection" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
						<div onClick={() => createDoingTest(currentData?.ExamId, currentData?.HWId)} className="exercise-btn-cancel">
							<div>Làm bài mới</div>
						</div>

						<div
							onClick={() => {
								gotoTest(currentData?.draft)
								setExamWarning(false)
							}}
							className="exercise-btn-continue"
						>
							<div>Làm tiếp</div>
						</div>
					</div>
				</div>
			</Modal>

			<Modal
				title={
					<div>
						Học viên làm bài: <div className="inline text-[#1b73e8]">{histories?.Name}</div>
					</div>
				}
				width={1200}
				footer={null}
				open={!!histories}
				onCancel={() => setHistories(null)}
			>
				<PrimaryTable loading={loadingResult} data={studentHomeWork} columns={resultColumns} />
			</Modal>
		</>
	)
}

export default HomeWork
