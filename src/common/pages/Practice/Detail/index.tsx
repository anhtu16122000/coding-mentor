import { Card, Popconfirm } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
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
import { ShowNoti } from '~/common/utils'
import { is } from '~/common/utils/common'

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
			const res = await trainingRouteFormApi.getAll({ ...filters, trainingRouteId: trainingRouteId })
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

	return (
		<>
			<Card
				className="shadow-sm"
				title={
					<div className="w-full flex items-center justify-between">
						<div>{detail?.Name || 'Luyện tập'}</div>
						{(is(userInfo).admin || is(userInfo).teacher || is(userInfo).academic || is(userInfo).manager) && (
							<ModalCreateTrainingRouteForm onRefresh={getData} TrainingRouteId={parseInt(router?.query?.practice + '')} />
						)}
					</div>
				}
			>
				{userInfo?.RoleId == 3 && (
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
				)}
			</Card>
		</>
	)
}

export default TrainingRouteForm
