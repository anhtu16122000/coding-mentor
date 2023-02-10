import React, { useEffect, useState } from 'react'
import { List, Modal, Tooltip } from 'antd'
import { ShowNoti } from '~/common/utils'
import { examApi } from '~/api/exam'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '~/store'
import { setCurrentDetails } from '~/store/testingState'
import { TbFileCertificate, TbFileText } from 'react-icons/tb'
import { HiOutlineBookOpen } from 'react-icons/hi'
import { examResultApi } from '~/api/exam-result'
import { decode, encode } from '~/common/utils/super-functions'
import PrimaryTag from '~/common/components/Primary/Tag'
import IconButton from '~/common/components/Primary/IconButton'
import LoadingPreviewExercise from '~/common/components/Loading/PreviewExercise'
import PrimaryTable from '~/common/components/Primary/Table'
import PrimaryButton from '~/common/components/Primary/Button'
import { PreviewInfo } from '~/common/components'

import moment from 'moment'

function PreviewExercise(props) {
	const { visible, setVisible, exam, name } = props

	const dispatch = useDispatch()

	const detail: any = useSelector((state: RootState) => state.testingState.details)
	const user = useSelector((state: RootState) => state.user.information)

	const [history, setHistory] = useState([])
	const [loading, setLoading] = useState(false)
	const [showHistory, setShowHistory] = useState(false)

	useEffect(() => {
		if (visible) {
			if (!!exam) {
				setLoading(true)
				getDetail()
				getHistory()
			} else {
				ShowNoti('error', 'Không tìm thấy bài tập')
			}
		}
	}, [visible])

	async function getDetail() {
		try {
			const response = await examApi.getByID(parseInt(decode(exam + '')))
			if (response.status == 200) {
				dispatch(setCurrentDetails(response.data.data))
			} else {
				dispatch(setCurrentDetails([]))
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setLoading(false)
		}
	}

	async function getHistory() {
		const apiParameters = {
			examId: parseInt(decode(exam + '')),
			studentId: parseInt(user.UserInformationId + ''),
			videoCourseId: null,
			pageSize: 999999,
			pageIndex: 1
		}
		try {
			const response = await examResultApi.get(apiParameters)
			if (response.status == 200) {
				setHistory(response.data.data)
			} else {
				setHistory([])
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		} finally {
			setLoading(false)
		}
	}

	function viewHistoryDetail(data) {
		const query = {
			video: props?.LessonVideoId,
			exam: data?.Id,
			point: data?.MyPoint,
			pass: data?.PassPoint,
			passed: data?.IsPass,
			ceated: data?.CreatedOn
		}

		!!window && window.open('/exercise/history-detail/?' + `exam=${encode(JSON.stringify(query))}`, '_blank')
	}

	const columns = [
		{
			title: 'Thời gian làm',
			dataIndex: 'CreatedOn',
			render: (text, item) => <p className="font-semibold">{moment(text).format('HH:mm - DD/MM/YYYY')}</p>
		},
		{
			width: 70,
			title: 'Điểm',
			dataIndex: 'MyPoint',
			render: (text, item) => <p className="font-semibold">{text}</p>
		},
		{
			width: 90,
			title: 'Điểm sàn',
			dataIndex: 'PassPoint',
			render: (text, item) => <p className="font-semibold">{text}</p>
		},
		{
			width: 100,
			title: 'Tổng điểm',
			dataIndex: 'TotalPoint',
			render: (text, item) => <p className="font-semibold">{text}</p>
		},
		{
			title: 'Trạng thái',
			dataIndex: 'IsPass',
			render: (text, item) => (
				<p className="font-semibold">
					{!!text && <PrimaryTag color="green">Đạt</PrimaryTag>}
					{!text && <PrimaryTag color="red">Không đạt</PrimaryTag>}
				</p>
			)
		},
		{
			align: 'center',
			width: 120,
			title: 'Chức năng',
			dataIndex: 'StatusId',
			render: (data, item) => {
				return (
					<Tooltip title="Xem chi tiết">
						<IconButton onClick={() => viewHistoryDetail(item)} type="button" color="blue" icon="eye" />
					</Tooltip>
				)
			}
		}
	]

	const TopHeader = () => {
		return (
			<div className="top-header-exam">
				<div className="top-header-exam-title">Đề: {detail?.Name}</div>
				<div className="top-header-exam-code">Mã đề: {detail?.Code}</div>
			</div>
		)
	}

	return (
		<Modal centered closable={false} title={null} width={700} open={visible} onCancel={() => setVisible(false)} footer={null}>
			{loading && !detail?.Name && <LoadingPreviewExercise />}

			{!!detail?.Name && (
				<>
					<div className="preview-exam-container">
						{!showHistory && (
							<>
								<TopHeader />
								<PreviewInfo data={detail} />
							</>
						)}

						{showHistory && (
							<div className="col-span-8">
								<TopHeader />

								<div className="hidden w690:!block mt-[16px]">
									<PrimaryTable columns={columns} data={history} loading={loading} />
								</div>

								<div className="pre-exam-history">
									<List
										grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
										pagination={false}
										dataSource={history}
										renderItem={(item, index) => {
											return (
												<List.Item className="none-selection">
													<div className="pr-ex-hi-item">
														<div className="text-16-600">Thời gian làm: {moment(item.CreatedOn).format('HH:mm - DD/MM/YYYY')}</div>

														<div className="text-14-400 text-black">Điểm đạt được: {item.MyPoint}</div>
														<div className="text-14-400 text-black">Điểm sàn: {item.PassPoint}</div>
														<div className="text-14-400 text-black">
															Trạng thái:
															<span className={!!item.IsPass ? 'text-[#46be36]' : 'text-[red]'}>
																{!!item.IsPass ? ' Đạt' : ' Chưa đạt'}
															</span>
														</div>

														<PrimaryButton
															onClick={() => viewHistoryDetail(item)}
															className="mt-2"
															background="blue"
															icon="eye"
															type="button"
														>
															Xem chi tiết
														</PrimaryButton>
													</div>
												</List.Item>
											)
										}}
									/>
								</div>
							</div>
						)}
					</div>

					<div className="w-full mt-5 inline-flex items-center justify-center">
						<PrimaryButton onClick={() => setShowHistory(!showHistory)} className="ml-2" background="yellow" type="button">
							{!showHistory ? <TbFileCertificate className="mr-2" size={20} /> : <TbFileText className="mr-2" size={20} />}
							{!showHistory ? ' Lịch sử làm bài' : ' Xem chi tiết đề'}
						</PrimaryButton>

						<PrimaryButton
							onClick={() => {
								const newUrl = `/exercise/testing/?video=${props?.LessonVideoId}&exam=${exam}&name=${encode(name)}`
								!!window && window.open(newUrl, '_blank')
								setVisible(false)
							}}
							className="ml-2"
							background="blue"
							type="button"
						>
							<HiOutlineBookOpen className="mr-2" size={20} /> Làm bài
						</PrimaryButton>
					</div>
				</>
			)}
		</Modal>
	)
}

export default PreviewExercise
