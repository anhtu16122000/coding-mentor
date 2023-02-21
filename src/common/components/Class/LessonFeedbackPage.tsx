import { Card, Skeleton, Spin, Timeline } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FcClock } from 'react-icons/fc'
import { timeLineApi } from '~/api/timeline'
import EmptyData from '../EmptyData'
import IconButton from '../Primary/IconButton'
import { ModalLessonFeedback } from './ModalLessonFeedback'

export const LessonFeedbackPage = () => {
	const router = useRouter()
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
				setLoading(false)
			}
			if (res.status === 204) {
				setLoading(true)
				setDataTable([])
			}
		} catch (error) {
			setLoading(true)
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
				title="Phản hồi buổi học"
				extra={
					<>
						<ModalLessonFeedback mode="add" onRefresh={() => getTimeLine(apiParameters)} />
					</>
				}
			>
				<Spin spinning={loading}>
					<Timeline mode="left">
						{dataTable &&
							dataTable?.length > 0 &&
							dataTable?.map((item, index) => (
								<Timeline.Item label={moment(item?.CreatedOn).format('DD-MM-YYYY HH:mm A')} key={index} dot={<FcClock />}>
									<div className="flex justify-between">
										<p>
											{item?.Note} - {item?.CreatedBy}
										</p>
										<ModalLessonFeedback mode="delete" dataRow={item} onRefresh={() => getTimeLine(apiParameters)} />
									</div>
								</Timeline.Item>
							))}
					</Timeline>
				</Spin>
			</Card>
		</>
	)
}
