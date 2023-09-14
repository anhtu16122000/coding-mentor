import { Empty, Modal, Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'
import { trainingRouteDetailApi } from '~/api/practice/TrainingRouteDetail'

import Lottie from 'react-lottie-player'
import warning from '~/common/components/json/100468-warning.json'
import { doingTestApi } from '~/api/IeltsExam/doing-test'
import { log } from '~/common/utils'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { examResultApi } from '~/api/exam/result'
import PrimaryTable from '~/common/components/Primary/Table'
import PrimaryTag from '~/common/components/Primary/Tag'
import moment from 'moment'
import { PrimaryTooltip } from '~/common/components'
import { FiEye } from 'react-icons/fi'

const RenderItem = (props) => {
	const { item } = props

	const [data, setData] = useState([])
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		getTrainingRouteForm()
	}, [item])

	async function getTrainingRouteForm() {
		setLoading(true)
		try {
			const res = await trainingRouteDetailApi.getAll({
				pageIndex: 1,
				pageSize: 9999,
				trainingRouteId: item?.TrainingRouteId,
				trainingRouteFormId: item?.Id
			})
			if (res.status == 200) {
				setData(res.data?.data)
			} else {
				setData([])
			}
		} catch (error) {
		} finally {
			setLoading(false)
		}
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
		console.log('--- createDoingTest: ', { ExamId, HWId })

		try {
			const res = await doingTestApi.post({ IeltsExamId: ExamId, ValueId: HWId, Type: 5 })

			if (res?.status == 200) {
				log.Green('Created test', res.data?.data)
				gotoTest(res.data?.data)
			}
		} catch (error) {
		} finally {
		}
	}

	const userInfo = useSelector((state: RootState) => state.user.information)

	const [studentHomeWork, setStudentHomeWork] = useState([])

	const is = {
		parent: userInfo?.RoleId == '8',
		admin: userInfo?.RoleId == '1',
		teacher: userInfo?.RoleId == '2'
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

	return (
		<div className="col-span-1 p-[8px] rounded-[6px] border-[#00000028] border-[1px]">
			<div className="font-[600] text-[#000]">{item?.Name}</div>

			{loading && <Skeleton active className="mt-3" />}

			{!loading && (
				<div className="mt-[8px]">
					{data.length == 0 && <div className="text-[red]">Chưa có bài tập</div>}

					{data.length > 0 && (
						<>
							{data.map((detail, index) => {
								return (
									<div
										style={{ marginTop: index == 0 ? 0 : 8 }}
										className="col-span-1 p-[8px] rounded-[6px] border-[#00000028] border-[1px]"
									>
										<div className="font-[600] text-center">{detail?.Skill}</div>
										<div
											onClick={() => getDraft(detail?.ExamId, item?.Id)}
											className="bg-[#1b73e8] mt-[8px] hover:opacity-80 cursor-pointer text-[#fff] py-[4px] rounded-[4px] flex items-center justify-center"
										>
											Làm bài
										</div>

										<div
											// onClick={() => getDraft(detail?.ExamId, item?.Id)}
											onClick={() => {
												setHistories({ HWId: detail?.ExamId, Name: item?.Name })
												getStudentHomeWork(item?.Id)
											}}
											className="bg-[#279d37] mt-[8px] hover:opacity-80 cursor-pointer text-[#fff] py-[4px] rounded-[4px] flex items-center justify-center"
										>
											Lịch sử làm bài
										</div>
									</div>
								)
							})}
						</>
					)}
				</div>
			)}

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
		</div>
	)
}

export default RenderItem
