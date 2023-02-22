import { Card, List, Spin, Timeline } from 'antd'
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
					<List>
						{dataTable &&
							dataTable?.length > 0 &&
							dataTable?.map((item, index) => (
								<List.Item actions={[<ModalTutoringConfig dataRow={item} onRefresh={() => getTutoringConfig()} />]}>
									<List.Item.Meta title={item?.Name} description={`${item?.Value} giờ`} />
								</List.Item>
							))}
					</List>
				</Spin>
			</Card>
		</div>
	)
}
