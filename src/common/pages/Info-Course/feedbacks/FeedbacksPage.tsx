import { Popconfirm, Rate } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { HiStar } from 'react-icons/hi'
import { RiShieldStarFill } from 'react-icons/ri'
import { feedbackStudentApi } from '~/api/feedbacks-student'
import IconButton from '~/common/components/Primary/IconButton'
import PrimaryTable from '~/common/components/Primary/Table'
import PrimaryTag from '~/common/components/Primary/Tag'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'

export interface IFeedbacksStudentPageProps {}

export default function FeedbacksStudentPage(props: IFeedbacksStudentPageProps) {
	const initialParams = { pageIndex: 1, pageSize: PAGE_SIZE }
	const [dataSource, setDataSource] = useState<IFeedbackStudent[]>([])
	const [totalRow, setTotalRow] = useState(0)
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [todoApi, setTodoApi] = useState(initialParams)
	const router = useRouter()

	const getFeedbacks = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await feedbackStudentApi.getAll(todoApi)
			if (res.status == 200) {
				setDataSource(res.data.data)
				setTotalRow(res.data.totalRow)
			}
			if (res.status == 204) {
				setTotalRow(0)
				setDataSource([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
		}
	}

	useEffect(() => {
		getFeedbacks()
	}, [todoApi])

	const handleChangeStatus = async (ID) => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await feedbackStudentApi.update({ Id: ID, Status: 3 })
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				getFeedbacks()
			}
			if (res.status == 204) {
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
		}
	}

	const columns = [
		{
			title: 'Tiêu đề',
			width: 300,
			dataIndex: 'Title',
			render: (text, item) => {
				return (
					<div className="feedback-student-title">
						<div className="right">
							<img
								className="avatar"
								src={item.Avatar && item.Avatar.length > 0 ? item.Avatar : '/images/default-avatar.svg'}
								alt="feedback user avatar"
							/>
						</div>
						<div className="left">
							<div className="name">
								<p>{item.CreatedBy}</p>
								<p className="time">{moment(item.CreateOn).format('DD/MM/YYYY HH:mm')}</p>
							</div>
							<div className="title">{text}</div>
						</div>
					</div>
				)
			}
		},
		{
			title: 'Nội dụng',
			width: 300,
			dataIndex: 'Content',
			render: (text) => {
				return <p className="table-row-main-text">{text}</p>
			}
		},
		{
			title: 'Rating',
			width: 150,
			dataIndex: 'StarRating',
			render: (text) => {
				return (
					<div className="flex gap-2  justify-start">
						<p className="font-bold text-lg">{text}</p>
						<Rate defaultValue={text} disabled={true} />
					</div>
				)
			}
		},
		{
			title: 'Trạng thái',
			width: 100,
			dataIndex: 'StatusName',
			render: (text, item) => {
				return (
					<div>
						{item.Status == 1 && <PrimaryTag children={<span>{text}</span>} color="blue" />}
						{item.Status == 2 && <PrimaryTag children={<span>{text}</span>} color="yellow" />}
						{item.Status == 3 && <PrimaryTag children={<span>{text}</span>} color="green" />}
					</div>
				)
			}
		},
		{
			title: '',
			width: 100,
			dataIndex: 'Actions',
			render: (text, item) => {
				return (
					<div className="">
						<Popconfirm
							title="Bạn muốn hoàn thành phản hồi này?"
							onConfirm={() => {
								handleChangeStatus(item.Id)
							}}
							placement="topRight"
							disabled={item.Status == 3}
							onCancel={() => {}}
							okText="Xác nhận"
							cancelText="Hủy"
						>
							<IconButton
								type="button"
								icon="check"
								color={item.Status == 3 ? 'disabled' : 'green'}
								tooltip={item.Status == 3 ? 'Đã xong' : 'Hoàn tất phản hồi'}
							/>
						</Popconfirm>

						<IconButton
							type="button"
							icon="eye"
							color="blue"
							onClick={() => {
								router.push({ pathname: '/info-course/feedbacks/detail', query: { feedbackId: item.Id } })
							}}
							className=""
							tooltip="Chi tiết"
						/>
					</div>
				)
			}
		}
	]

	return (
		<>
			<PrimaryTable
				total={totalRow}
				loading={isLoading.type == 'GET_ALL' && isLoading.status}
				onChangePage={(event: number) => setTodoApi({ ...todoApi, pageIndex: event })}
				columns={columns}
				data={dataSource}
			/>
		</>
	)
}
