import { Card, Empty, Skeleton, Spin, Timeline } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FcClock } from 'react-icons/fc'
import { useSelector } from 'react-redux'
import { timeLineApi } from '~/api/timeline'
import { RootState } from '~/store'
import EmptyData from '../EmptyData'
import IconButton from '../Primary/IconButton'
import { ModalLessonFeedback } from './ModalLessonFeedback'

export const LessonFeedbackPage = () => {
	const router = useRouter()
	const user = useSelector((state: RootState) => state.user.information)
	const [loading, setLoading] = useState(false)
	const initParameters = { classId: router.query.class }
	const [apiParameters, setApiParameters] = useState(initParameters)
	const [dataTable, setDataTable] = useState([])

	const getTimeLine = async (params) => {
		try {
			setLoading(true)
			const res = await timeLineApi.getAll(params)
			if (res.status === 200) {
				setDataTable(res.data.data)
			}
			if (res.status === 204) {
				setDataTable([])
			}
		} catch (error) {
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (router?.query?.class) {
			getTimeLine(apiParameters)
		}
	}, [router?.query?.class])

	return (
		<>
			<Card
				className="shadow-sm"
				title="Phản hồi buổi học"
				extra={
					(user?.RoleId == 2 || user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7) && (
						<ModalLessonFeedback mode="add" onRefresh={() => getTimeLine(apiParameters)} />
					)
				}
			>
				{!loading && dataTable?.length == 0 && (
					<div className="py-[50px]">
						<Empty />
					</div>
				)}

				{loading && dataTable?.length == 0 && (
					<div className="py-[50px]">
						<Skeleton active />
					</div>
				)}

				<Timeline mode="left">
					{dataTable?.map((item, index) => (
						<Timeline.Item label={moment(item?.CreatedOn).format('DD-MM-YYYY HH:mm A')} key={index} dot={<FcClock />}>
							<div className="flex justify-between">
								<p>
									{item?.Note} - {item?.CreatedBy}
								</p>

								{(user?.RoleId == 2 || user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7) && (
									<ModalLessonFeedback mode="delete" dataRow={item} onRefresh={() => getTimeLine(apiParameters)} />
								)}
							</div>
						</Timeline.Item>
					))}
				</Timeline>
			</Card>
		</>
	)
}
