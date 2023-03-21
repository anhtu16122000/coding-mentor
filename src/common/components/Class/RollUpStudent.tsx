import { Card, Empty, List, Select, Spin } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { scheduleApi } from '~/api/schedule'
import { studentRollUpQrCodeApi } from '~/api/studentRollUpQrCode'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'

export const RollUpStudent = () => {
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const user = useSelector((state: RootState) => state.user.information)
	const [dataSchedule, setDataSchedule] = useState<{ title: string; value: string }[]>([])
	const initParameters = { studentId: user?.UserInformationId, scheduleId: null }
	const [apiParameters, setApiParameters] = useState(initParameters)
	const initParametersSchedule = { classId: router.query.class, studentId: user?.UserInformationId }
	const [apiParametersSchedule, setApiParametersSchedule] = useState(initParametersSchedule)
	const [scheduleId, setScheduleId] = useState(null)
	const [dataTable, setDataTable] = useState(null)
	const getSchedule = async (params) => {
		try {
			const res = await scheduleApi.getAll(params)
			if (res.status === 200) {
				let temp = [{ title: 'Bỏ chọn', value: null }]
				res?.data?.data?.forEach((item, index) => {
					temp.push({
						title: `[Buổi ${index + 1}][${moment(item?.StartTime).format('MM/DD')}] ${moment(item?.StartTime).format('HH:mm')} - ${moment(
							item?.EndTime
						).format('HH:mm')}`,
						value: item?.Id
					})
				})
				setDataSchedule(temp)
			}
			if (res.status === 204) {
				setDataSchedule([])
			}
		} catch (error) {
		} finally {
		}
	}

	const getQR = async (params: any) => {
		try {
			setLoading(true)
			const res = await studentRollUpQrCodeApi.getAll(params)
			if (res.status === 200) {
				setDataTable(res.data.data)
			}
			if (res.status === 204) {
				setDataTable(null)
			}
		} catch (error) {
			setLoading(true)
			setDataTable(null)
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (router?.query?.class) {
			getSchedule(apiParametersSchedule)
		}
	}, [router?.query?.class])

	useEffect(() => {
		if (apiParameters.studentId && apiParameters.scheduleId) {
			getQR(apiParameters)
		}
	}, [apiParameters])

	return (
		<Card
			title={
				<div className="extra-table">
					<div className="flex items-center antd-custom-wrap">
						Buổi học:
						<Select
							className="w-[220px] ml-tw-4"
							onChange={(data) => {
								setScheduleId(data)
								setApiParameters({ ...apiParameters, scheduleId: data })
							}}
						>
							{dataSchedule &&
								dataSchedule?.length > 0 &&
								dataSchedule?.map((item, index) => (
									<>
										<Select.Option key={index} value={item.value}>
											{item.title}
										</Select.Option>
									</>
								))}
						</Select>
					</div>
				</div>
			}
		>
			<Spin spinning={loading}>
				<div className="flex items-center justify-center">
					{dataTable && dataTable?.QrCode ? <img src={dataTable?.QrCode} alt="" className=" w-[300px]" /> : <Empty />}
				</div>
			</Spin>
		</Card>
	)
}
