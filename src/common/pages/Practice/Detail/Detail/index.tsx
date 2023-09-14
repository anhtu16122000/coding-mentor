import { Card, Modal, Popconfirm } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FaUserClock } from 'react-icons/fa'
import { FiEye } from 'react-icons/fi'
import { IoClose } from 'react-icons/io5'
import { TbWritingSign } from 'react-icons/tb'
import { useSelector } from 'react-redux'
import { doingTestApi } from '~/api/IeltsExam/doing-test'
import { examResultApi } from '~/api/exam/result'
import { trainingRouteApi } from '~/api/practice'
import { PrimaryTooltip } from '~/common/components'
import PrimaryTable from '~/common/components/Primary/Table'
import PrimaryTag from '~/common/components/Primary/Tag'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { RootState } from '~/store'
import { useDispatch } from 'react-redux'
import { setGlobalBreadcrumbs } from '~/store/globalState'
import { trainingRouteFormApi } from '~/api/practice/TrainingRouteForm'
import { trainingRouteDetailApi } from '~/api/practice/TrainingRouteDetail'
import ModalCreateTrainingRouteDetail from './ModalCreate'

const listTodoApi = {
	pageSize: PAGE_SIZE,
	pageIndex: 1,
	Code: null,
	Name: null
}

const TrainingRouteDetail = (props) => {
	const { parent } = props

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
			const res = await trainingRouteDetailApi.getAll({ ...filters, trainingRouteId: trainingRouteId, trainingRouteFormId: parent?.Id })
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

	const is = {
		parent: userInfo?.RoleId == '8',
		admin: userInfo?.RoleId == '1',
		teacher: userInfo?.RoleId == '2'
	}

	const columns = [
		{
			title: 'Kỹ năng',
			dataIndex: 'Skill',
			render: (value, item, index) => <div className="font-[600] text-[#1b73e8] min-w-[100px] max-w-[250px]">{value}</div>
		},
		{
			title: 'Đề',
			dataIndex: 'ExamName',
			render: (value, item, index) => <div className="min-w-[80px]">{value || 0}</div>
		},
		{
			title: 'Thời gian làm',
			dataIndex: 'DoingTimes',
			render: (value, item, index) => <div className="min-w-[90px]">{value || 0}</div>
		},
		{
			title: 'Điểm cao nhất',
			dataIndex: 'HighestScore',
			render: (value, item, index) => <div className="min-w-[100px]">{value || 0}</div>
		},
		{
			title: 'Làm gần nhất',
			dataIndex: 'LastestDoing',
			render: (value, item, index) => <div className="min-w-[90px]">{value || 0}</div>
		},
		{
			title: 'Làm gần nhất',
			dataIndex: 'LastestDoing',
			render: (value, item, index) => <div className="min-w-[100px]">{value || 0}</div>
		},
		{
			title: 'Level',
			dataIndex: 'Level',
			aling: 'center',
			width: 100,
			render: (value, item) => {
				return (
					<>
						{item?.Level == 0 && <p className="tag blue">Basic</p>}
						{item?.Level == 1 && <p className="tag yellow">Advance</p>}
						{item?.Level == 2 && <p className="tag green">Master</p>}
					</>
				)
			}
		},
		,
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
						{(is.admin || is.teacher) && (
							<ModalCreateTrainingRouteDetail
								isEdit
								defaultData={item}
								onRefresh={getData}
								TrainingRouteId={parseInt(router?.query?.practice + '')}
								TrainingRouteFormId={parent?.Id}
							/>
						)}

						{(is.admin || is.teacher) && (
							<PrimaryTooltip place="left" id={`hw-del-${item?.Id}`} content="Làm bài">
								<Popconfirm placement="left" title={`Xoá bài tập: ${item?.Name}?`} onConfirm={() => delThis(item?.Id)}>
									<div className="w-[28px] text-[#C94A4F] h-[30px] all-center hover:opacity-70 cursor-pointer ml-[8px]">
										<IoClose size={26} className="mb-[-2px]" />
									</div>
								</Popconfirm>
							</PrimaryTooltip>
						)}

						<PrimaryTooltip place="left" id={`hw-res-${item?.Id}`} content="Xem chi tiết">
							<div
								onClick={() => window.open(`/exam-result/?test=${item?.Id}`, '_blank')}
								className="w-[28px] ml-[8px] text-[#1b73e8] h-[30px] all-center hover:opacity-70 cursor-pointer"
							>
								<FiEye size={20} />
							</div>
						</PrimaryTooltip>
					</div>
				)
			}
		}
	]

	// CreatedBy: 'Admin'
	// CreatedOn: '2023-08-30T18:05:58.113'
	// DoingTimes: 0
	// Enable: true
	// ExamId: 1
	// HighestScore: null
	// Id: 1
	// LastestDoing: null
	// Level: 1
	// ModifiedBy: 'Admin'
	// ModifiedOn: '2023-08-30T18:05:58.113'
	// Skill: 'Nghe'
	// TrainingRouteFormId: 1
	// TrainingRouteId: 1

	const [visible, setVisible] = useState<boolean>(false)

	return (
		<>
			<div
				onClick={() => setVisible(true)}
				className="w-[28px] ml-[8px] text-[#1b73e8] h-[30px] all-center hover:opacity-70 cursor-pointer"
			>
				<FiEye size={20} />
			</div>

			<Modal open={visible} onCancel={() => setVisible(false)} title={'Chi tiết danh mục: ' + parent?.Name} footer={null} width="90%">
				<Card
					className="shadow-sm"
					title={
						<div className="w-full flex items-center justify-between">
							<div>{detail?.Name || 'Luyện tập'}</div>
							{(is.admin || is.teacher) && (
								<ModalCreateTrainingRouteDetail
									onRefresh={getData}
									TrainingRouteId={parseInt(router?.query?.practice + '')}
									TrainingRouteFormId={parent?.Id}
								/>
							)}
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
			</Modal>
		</>
	)
}

export default TrainingRouteDetail
