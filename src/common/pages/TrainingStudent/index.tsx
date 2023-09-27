import { Card, Popconfirm } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FiEye } from 'react-icons/fi'
import { IoClose } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import { PrimaryTooltip } from '~/common/components'
import PrimaryTable from '~/common/components/Primary/Table'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { RootState } from '~/store'
import ModalCreatePractice from './ModalCreate'
import { studentInTrainingApi } from '~/api/practice/StudentInTraining'
import { useDispatch } from 'react-redux'
import { setGlobalBreadcrumbs } from '~/store/globalState'
import ModalCreateTrainingStudent from './ModalCreate'
import { is } from '~/common/utils/common'

const listTodoApi = {
	pageSize: PAGE_SIZE,
	pageIndex: 1,
	Code: null,
	Name: null
}

const TrainingStudent = () => {
	const router = useRouter()

	const userInfo = useSelector((state: RootState) => state.user.information)

	const [data, setData] = useState([])
	const [filters, setFilters] = useState(listTodoApi)
	const [loading, setLoading] = useState<boolean>(true)
	const [totalPage, setTotalPage] = useState(null)

	useEffect(() => {
		if (!!router.query?.StudentID || userInfo?.RoleId == 3) {
			getData()
		}
	}, [router, userInfo])

	const dispatch = useDispatch()

	async function getData() {
		const studentId = userInfo?.RoleId == 3 ? userInfo?.UserInformationId : router.query?.StudentID || null

		setLoading(true)
		try {
			const res = await studentInTrainingApi.getAll({ ...filters, studentId: parseInt(studentId + '') })
			if (res.status == 200) {
				dispatch(
					setGlobalBreadcrumbs([
						{ title: 'Luyện tập', link: '/practice' },
						{ title: res.data?.data[0]?.StudentFullName, link: '' }
					])
				)

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
			const res = await studentInTrainingApi.delete(Id)
			if (res.status == 200) {
				getData()
			} else {
				setLoading(false)
			}
		} catch (error) {
			setLoading(false)
		}
	}

	const columns = [
		{
			title: 'Học viên',
			dataIndex: 'StudentFullName',
			render: (value, item, index) => <div className="font-[600] text-[#000000] min-w-[100px] max-w-[250px]">{value}</div>
		},
		{
			title: 'Tên bài',
			dataIndex: 'TrainingRouteName',
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
						{/* {(is(userInfo).admin || is(userInfo).teacher || is(userInfo).academic || is(userInfo).manager) && (
							<ModalCreatePractice isEdit defaultData={item} onRefresh={getData} />
						)} */}

						{(is(userInfo).admin || is(userInfo).teacher || is(userInfo).academic || is(userInfo).manager) && (
							<PrimaryTooltip place="left" id={`hw-del-${item?.Id}`} content="Xoá">
								<Popconfirm placement="left" title={`Xoá?`} onConfirm={() => delThis(item?.Id)}>
									<div className="w-[28px] text-[#C94A4F] h-[30px] all-center hover:opacity-70 cursor-pointer ml-[8px]">
										<IoClose size={26} className="mb-[-2px]" />
									</div>
								</Popconfirm>
							</PrimaryTooltip>
						)}

						<PrimaryTooltip place="left" id={`hw-res-${item?.Id}`} content="Xem chi tiết">
							<div
								onClick={() => router.push(`/practice/detail/?practice=${userInfo?.RoleId == 3 ? item?.TrainingRouteId : item?.Id}`)}
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

	return (
		<>
			<Card
				className="shadow-sm"
				title={
					<div className="w-full flex items-center justify-between">
						<div>Luyện tập</div>
						{(is(userInfo).admin || is(userInfo).teacher || is(userInfo).manager || is(userInfo).academic) && (
							<ModalCreateTrainingStudent onRefresh={getData} />
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
		</>
	)
}

export default TrainingStudent
