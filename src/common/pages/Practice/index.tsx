import { Card, Popconfirm } from 'antd'
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
import ModalCreatePractice from './ModalCreate'
import { ShowNoti } from '~/common/utils'

const listTodoApi = {
	pageSize: PAGE_SIZE,
	pageIndex: 1,
	Code: null,
	Name: null
}

const Practice = () => {
	const router = useRouter()

	const userInfo = useSelector((state: RootState) => state.user.information)

	const [data, setData] = useState([])
	const [studentHomeWork, setStudentHomeWork] = useState([])
	const [filters, setFilters] = useState(listTodoApi)
	const [loading, setLoading] = useState<boolean>(true)
	const [totalPage, setTotalPage] = useState(null)

	useEffect(() => {
		if (!!userInfo?.UserInformationId) {
			getData()
		}
	}, [userInfo])

	async function getData() {
		setLoading(true)
		try {
			const res = await trainingRouteApi.getAll({ ...filters })
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
			const res = await trainingRouteApi.delete(Id)
			if (res.status == 200) {
				getData()
			} else {
				setLoading(false)
			}
		} catch (error) {
			ShowNoti('error', error?.message)
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
			title: 'Tên bài',
			dataIndex: 'Name',
			render: (value, item, index) => <div className="font-[600] text-[#1b73e8] min-w-[100px] max-w-[250px]">{value}</div>
		},
		{
			title: 'Tuổi',
			width: 100,
			dataIndex: 'Age',
			render: (value, item, index) => <>{value}</>
		},
		{
			title: 'Level',
			width: 100,
			dataIndex: 'CurrentLevel',
			render: (value, item, index) => <>{value}</>
		},
		{
			title: 'Mục tiêu',
			dataIndex: 'TargetLevel',
			render: (value, item, index) => <div className="font-[600] in-1-line text-[#279d37] min-w-[80px] max-w-[220px]">{value}</div>
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
						{(is.admin || is.teacher) && <ModalCreatePractice isEdit defaultData={item} onRefresh={getData} />}

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
								onClick={() => router.push(`/practice/detail/?practice=${item?.Id}`)}
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

	const [examWarning, setExamWarning] = useState<boolean>(false)
	const [currentData, setCurrentData] = useState<any>(null)

	return (
		<>
			<Card
				className="shadow-sm"
				title={
					<div className="w-full flex items-center justify-between">
						<div>Luyện tập</div>
						{(is.admin || is.teacher) && <ModalCreatePractice onRefresh={getData} />}
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
		</>
	)
}

export default Practice
