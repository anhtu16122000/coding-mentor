import { Card, Modal, Popconfirm, Popover } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { IoBook, IoCheckmarkDoneSharp, IoClose, IoCloseSharp } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import { examResultApi } from '~/api/exam/result'
import { trainingRouteApi } from '~/api/practice'
import { PrimaryTooltip } from '~/common/components'
import PrimaryTable from '~/common/components/Primary/Table'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { RootState } from '~/store'
import { useDispatch } from 'react-redux'
import { setGlobalBreadcrumbs } from '~/store/globalState'
import { trainingRouteFormApi } from '~/api/practice/TrainingRouteForm'
import ModalCreateTrainingRouteForm from './ModalCreate'
import TrainingRouteDetail from './Detail'
import RenderItem from './RenderItem'
import { ShowNoti, log } from '~/common/utils'
import Lottie from 'react-lottie-player'
import warning from '~/common/components/json/100468-warning.json'
import { is } from '~/common/utils/common'

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import ModalCreateTrainingRouteDetail from './Detail/ModalCreate'
import { FaEdit } from 'react-icons/fa'
import { BiTrash } from 'react-icons/bi'
import { trainingRouteDetailApi } from '~/api/practice/TrainingRouteDetail'
import { doingTestApi } from '~/api/IeltsExam/doing-test'
import PrimaryTag from '~/common/components/Primary/Tag'
import { FiEye } from 'react-icons/fi'

const listTodoApi = {
	pageSize: PAGE_SIZE,
	pageIndex: 1,
	Code: null,
	Name: null
}

const TrainingRouteForm = () => {
	const router = useRouter()

	const dispatch = useDispatch()

	const userInfo = useSelector((state: RootState) => state.user.information)

	const [data, setData] = useState([])
	const [studentHomeWork, setStudentHomeWork] = useState([])
	const [filters, setFilters] = useState(listTodoApi)
	const [loading, setLoading] = useState<boolean>(true)
	const [totalPage, setTotalPage] = useState(null)

	const [detail, setDetail] = useState(null)

	useEffect(() => {
		if (!!router?.query?.practice) {
			getData()
		}
	}, [router])

	async function getData() {
		setLoading(true)
		try {
			const res = await trainingRouteApi.getByID(parseInt(router?.query?.practice + ''))
			if (res.status == 200) {
				dispatch(
					setGlobalBreadcrumbs([
						{ title: 'Luyện tập', link: '/practice' },
						{ title: res.data?.data?.Name, link: '' }
					])
				)
				getTrainingRouteForm(res.data?.data?.Id)
				setDetail(res.data?.data)
			} else {
				setData([])
				setTotalPage(1)
			}
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}

	async function getTrainingRouteForm(trainingRouteId: any) {
		setLoading(true)
		try {
			const res = await trainingRouteApi.getForm({ ...filters, trainingRouteId: trainingRouteId })
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

	async function delThis(Id) {
		setLoading(true)
		try {
			const res = await trainingRouteFormApi.delete(Id)
			if (res.status == 200) {
				getData()
			} else {
				setLoading(false)
			}
		} catch (error) {
			setLoading(false)
			ShowNoti('error', error?.message)
		}
	}

	const columns = [
		{
			title: 'Tên bài',
			dataIndex: 'Name',
			render: (value, item, index) => <div className="font-[600] text-[#1b73e8] min-w-[100px] max-w-[250px]">{value}</div>
		},
		{
			title: 'Người tạo',
			dataIndex: 'CreatedBy',
			render: (value, item, index) => <div className="min-w-[80px]">{value}</div>
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'CreatedOn',
			render: (value, item, index) => <>{moment(value)?.format('HH:mm DD/MM/YYYY')}</>
		},
		{
			fixed: 'right',
			render: (value, item, index) => {
				return (
					<div className="flex items-center">
						{(is(userInfo).admin || is(userInfo).teacher || is(userInfo).academic || is(userInfo).manager) && (
							<ModalCreateTrainingRouteForm
								isEdit
								defaultData={item}
								onRefresh={getData}
								TrainingRouteId={parseInt(router?.query?.practice + '')}
							/>
						)}

						{(is(userInfo).admin || is(userInfo).teacher || is(userInfo).academic || is(userInfo).manager) && (
							<PrimaryTooltip place="left" id={`hw-del-${item?.Id}`} content="Làm bài">
								<Popconfirm placement="left" title={`Xoá bài tập: ${item?.Name}?`} onConfirm={() => delThis(item?.Id)}>
									<div className="w-[28px] text-[#C94A4F] h-[30px] all-center hover:opacity-70 cursor-pointer ml-[8px]">
										<IoClose size={26} className="mb-[-2px]" />
									</div>
								</Popconfirm>
							</PrimaryTooltip>
						)}

						<PrimaryTooltip place="left" id={`hw-res-${item?.Id}`} content="Xem chi tiết">
							<TrainingRouteDetail parent={item} />
						</PrimaryTooltip>
					</div>
				)
			}
		}
	]

	const thisRef = useRef(null)

	async function delForm(Id) {
		setLoading(true)
		try {
			const res = await trainingRouteDetailApi.delete(Id)
			if (res.status == 200) {
				getData()
			} else {
				setLoading(false)
			}
		} catch (error) {
			setLoading(false)
		}
	}

	function getLevelName(params) {
		const theStatus = [
			{ id: 0, name: 'Basic' },
			{ id: 1, name: 'Advance' },
			{ id: 2, name: 'Master' }
		]

		const theIndex = theStatus.findIndex((item) => item?.id == params)

		if (theIndex > -1) {
			return theStatus[theIndex]?.name || ''
		}

		return ''
	}

	// -------- Take an exam
	async function getDraft(ExamId, HWId) {
		try {
			// 1 - Làm bài thử 2 - Làm bài hẹn test 3 - Bài tập về nhà 4 - Bộ đề
			const res = await doingTestApi.getDraft({ valueId: HWId, type: 5 })
			if (res.status == 200) {
				setCurrentData({ ExamId: ExamId, HWId: HWId, draft: res.data?.data })
				setExamWarning(true)
			} else {
				createDoingTest(ExamId, HWId)
			}
		} catch (error) {
			ShowNoti('error', error?.message)
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
		console.log('--- createDoingTest: ', { ExamId, HWId })

		try {
			const res = await doingTestApi.post({ IeltsExamId: ExamId, ValueId: HWId, Type: 5 })

			if (res?.status == 200) {
				log.Green('Created test', res.data?.data)
				gotoTest(res.data?.data)
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
	}

	const [histories, setHistories] = useState<any>(null)

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

	return (
		<>
			<Card
				className="shadow-sm time-line-hidden-time"
				title={
					<div className="w-full flex items-center justify-between">
						<div>{detail?.Name || 'Luyện tập'}</div>
						{(is(userInfo).admin || is(userInfo).teacher || is(userInfo).academic || is(userInfo).manager) && (
							<ModalCreateTrainingRouteForm onRefresh={getData} TrainingRouteId={parseInt(router?.query?.practice + '')} />
						)}
					</div>
				}
			>
				<VerticalTimeline animate={true} layout="1-column-left" lineColor="#b9b9b9">
					{data.map((item, dataIndex) => {
						return (
							<VerticalTimelineElement
								key={dataIndex + 'ficax'}
								className="vertical-timeline-element--work"
								contentStyle={{
									background: '#1b73e8e0',
									color: '#fff',
									borderRadius: 6,
									width: 'fit-content'
								}}
								contentArrowStyle={{ borderRight: `7px solid #1b73e8` }}
								iconStyle={{ background: item?.Completed ? '#4CAF50' : '#1b73e8', color: '#fff' }}
								icon={
									!item?.Completed ? (
										<div className="all-center w-full h-full">
											<div className="font-[700] text-[18px]">{dataIndex + 1}</div>
										</div>
									) : (
										<IoCheckmarkDoneSharp />
									)
								}
							>
								<div className="relative">
									<div className="font-[600] text-[16px]" style={{ color: '#fff' }}>
										{item?.Name}
									</div>

									<div className="w-full bg-[#fff] h-[1px] mt-[8px] mb-[14px]" />

									{typeof item?.Details == 'object' && (
										<div className="flex flex-wrap flex-col items-start gap-[8px] mt-[8px]">
											{(is(userInfo).admin || is(userInfo).manager || is(userInfo).teacher || is(userInfo).academic) && (
												<div className="mb-[8px] flex items-start gap-[8px]">
													<ModalCreateTrainingRouteDetail
														onRefresh={getData}
														TrainingRouteId={parseInt(router?.query?.practice + '')}
														TrainingRouteFormId={item?.Id}
													/>

													<Popconfirm title="Xoá danh mục này?" placement="right" onConfirm={() => delThis(item?.Id)}>
														<div className="h-[30px] px-[16px] all-center cursor-pointer shadow-sm duration-150 hover:opacity-80 rounded-full bg-[#fff] text-[#f33136] font-[600]">
															<BiTrash size={18} className="w550:ml-[-2px]" />
															<div className="hidden w550:block ml-[4px]">Xoá</div>
														</div>
													</Popconfirm>

													<ModalCreateTrainingRouteForm
														isEdit
														defaultData={item}
														onRefresh={getData}
														TrainingRouteId={parseInt(router?.query?.practice + '')}
													/>
												</div>
											)}

											{item?.Details.length > 0 &&
												item?.Details.map((detail, detailIndex) => {
													return (
														<div
															key={`itx-${dataIndex}-${detailIndex}`}
															className="flex flex-col p-[8px] cursor-pointer shadow-sm duration-150 rounded-[6px] bg-[#fff] text-[#000] font-[600]"
														>
															<div className="text-[14px] text-[#1b73e8]">{detail?.Skill}</div>

															<div className="font-[600] text-[14px] flex items-center" style={{ color: '#000' }}>
																<div className="font-[600] mr-[4px]">Đề: </div>
																<div>{detail?.IeltsExamName}</div>
															</div>

															<div className="font-[600] text-[14px] flex items-center" style={{ color: '#000' }}>
																<div className="font-[600] mr-[4px]">Level: </div>
																<div>{getLevelName(detail?.Level)}</div>
															</div>

															{is(userInfo).student && (
																<div className="flex items-center gap-[8px]">
																	<div
																		onClick={() => getDraft(detail?.IeltsExamId, item?.Id)}
																		className="bg-[#338ad5] mt-[8px] hover:opacity-80 cursor-pointer px-[8px] text-[#fff] py-[4px] rounded-full flex items-center justify-center"
																	>
																		Làm bài
																	</div>

																	<div
																		onClick={() => {
																			setHistories({ HWId: detail?.ExamId, Name: item?.Name })
																			getStudentHomeWork(item?.Id)
																		}}
																		className="bg-[#49c76d] mt-[8px] hover:opacity-80 cursor-pointer px-[8px] text-[#fff] py-[4px] rounded-full flex items-center justify-center"
																	>
																		Lịch sử làm bài
																	</div>
																</div>
															)}

															{(is(userInfo).admin || is(userInfo).teacher || is(userInfo).manager || is(userInfo).academic) && (
																<div className="mt-[8px] flex flex-grow gap-[8px]">
																	<Popconfirm title="Xoá kỹ năng này?" placement="right" onConfirm={() => delForm(detail?.Id)}>
																		<div className="h-[28px] px-[8px] cursor-pointer all-center bg-[#e3565a] hover:bg-[#f33136] text-[#fff] rounded-full">
																			<BiTrash size={18} className="mr-[4px]" />
																			<div>Xoá</div>
																		</div>
																	</Popconfirm>

																	<ModalCreateTrainingRouteDetail
																		isEdit
																		defaultData={detail}
																		onRefresh={getData}
																		TrainingRouteId={parseInt(router?.query?.practice + '')}
																		TrainingRouteFormId={item?.Id}
																	/>
																</div>
															)}
														</div>
													)
												})}
										</div>
									)}
								</div>
							</VerticalTimelineElement>
						)
					})}
				</VerticalTimeline>

				{/* {userInfo?.RoleId == 3 && (
					<div className="grid grid-cols-1 w600:grid-cols-2 w1000:grid-cols-3 w1200:grid-cols-4 gap-4">
						{data.map((item, index) => {
							return <RenderItem key={`iko-${index}-${item?.Id}`} item={item} />
						})}
					</div>
				)}

				{userInfo?.RoleId != 3 && (
					<PrimaryTable
						loading={loading}
						total={totalPage && totalPage}
						data={data}
						columns={columns}
						onChangePage={(event: number) => setFilters({ ...filters, pageIndex: event })}
					/>
				)} */}
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
						Lịch sử làm bài: <div className="inline text-[#1b73e8]">{histories?.Name}</div>
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

export default TrainingRouteForm
