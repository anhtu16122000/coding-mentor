import { Card, Spin, Timeline } from 'antd'
import React, { useEffect, useState } from 'react'
import { Clock } from 'react-feather'
import { FcClock } from 'react-icons/fc'
import { classApi } from '~/api/class'
import PrimaryTable from '~/common/components/Primary/Table'
import { ModalTutoringConfig } from './ModalTutoringConfig'

export const TutoringConfigPage = () => {
	const [dataTable, setDataTable] = useState([])
	const [loading, setLoading] = useState(false)

	const getTutoringConfig = async () => {
		try {
			setLoading(true)
			const res = await classApi.getClassTutoringConfig()
			if (res.status === 200) {
				setDataTable(res?.data?.data)
			}
			if (res.status === 204) {
				setDataTable([])
			}
		} catch (error) {
			setLoading(true)
		} finally {
			setLoading(false)
		}
	}
	useEffect(() => {
		getTutoringConfig()
	}, [])

	const columns = [
		{
			title: ''
		}
	]
	return (
		<div className="TutoringConfigPage">
			<Card title="Cấu hình thời gian đặt lịch">
				<Spin spinning={loading}>
					<Timeline mode="left">
						{dataTable &&
							dataTable?.length > 0 &&
							dataTable?.map((item, index) => (
								<Timeline.Item label={`${item?.Value}h`} key={index} dot={<FcClock />}>
									<div className="flex justify-between">
										<div>
											<p className="font-semibold">{item?.Name}</p>
											<p>{item?.Code}</p>
										</div>
										<ModalTutoringConfig dataRow={item} onRefresh={() => getTutoringConfig()} />
									</div>
								</Timeline.Item>
							))}
					</Timeline>
				</Spin>
			</Card>
		</div>
	)
}
