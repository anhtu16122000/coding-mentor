import { Card, Form, Modal, Rate, Select, Spin, Timeline, Tooltip } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FcClock } from 'react-icons/fc'
import { useSelector } from 'react-redux'
import { scheduleApi } from '~/api/schedule'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import TextBoxField from '../FormControl/TextBoxField'
import PrimaryButton from '../Primary/Button'
import PrimaryTag from '../Primary/Tag'

export const RateTeacher = () => {
	const router = useRouter()
	const [form] = Form.useForm()
	const [isLoading, setIsLoading] = useState(false)
	const [loading, setLoading] = useState(false)
	const initParametersSchedule = { classId: router.query.class }
	const [apiParametersSchedule, setApiParametersSchedule] = useState(initParametersSchedule)
	const [dataTable, setDataTable] = useState([])
	const [visible, setVisible] = useState(false)
	const user = useSelector((state: RootState) => state.user.information)
	const [rate, setRate] = useState(null)
	const [scheduleId, setScheduleId] = useState(null)
	const getSchedule = async (params) => {
		try {
			setLoading(true)
			const res = await scheduleApi.getAll(params)
			if (res.status === 200) {
				setDataTable(res?.data?.data)
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

	const onClose = () => {
		setVisible(false)
	}
	const onOpen = () => {
		setVisible(true)
	}

	const handleUpdate = async (data) => {
		try {
			setIsLoading(true)
			const res = await scheduleApi.updateRateTeacher(data)
			if (res.status === 200) {
				onClose()
				setIsLoading(false)
				form.resetFields()
				ShowNoti('success', res.data.message)
				getSchedule(apiParametersSchedule)
			}
		} catch (error) {
			setIsLoading(true)
			ShowNoti('error', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	const _onSubmit = (data) => {
		const dataSubmit = {
			ScheduleId: scheduleId,
			RateTeacher: rate,
			RateTeacherComment: data?.RateTeacherComment
		}
		handleUpdate(dataSubmit)
	}

	const handleChangeRate = (info, data) => {
		onOpen()
		setRate(info)
		setScheduleId(data?.Id)
		form.setFieldValue('RateTeacherComment', data?.RateTeacherComment)
	}

	useEffect(() => {
		if (router?.query?.class) {
			getSchedule(apiParametersSchedule)
		}
	}, [router?.query?.class])
	return (
		<>
			<Card title="Đánh giá giáo viên">
				<Spin spinning={loading}>
					<Timeline mode="left">
						{dataTable &&
							dataTable?.length > 0 &&
							dataTable?.map((item, index) => (
								<Timeline.Item
									label={
										<>
											<div>
												[{moment(item?.StartTime).format('DD-MM')}] {moment(item?.StartTime).format('HH:mm')} -{' '}
												{moment(item?.EndTime).format('HH:mm')}
											</div>
											{item?.StatusTutoringName ? (
												<PrimaryTag
													color={
														item?.StatusTutoring == 1
															? 'blue'
															: item?.StatusTutoring == 2
															? 'red'
															: item?.StatusTutoring == 3
															? 'green'
															: item?.StatusTutoring == 4
															? 'yellow'
															: item?.StatusTutoring == 5
															? 'disabled'
															: item?.StatusTutoring == 6
															? 'orange'
															: 'black'
													}
													children={item?.StatusTutoringName}
												/>
											) : (
												''
											)}
										</>
									}
									key={index}
									dot={<FcClock />}
								>
									<div className="flex items-start justify-between">
										<div>
											<div className="mb-2">
												<span className="font-semibold text-[#1b73e8]">{item?.TeacherName}</span> <span> - {item?.TeacherCode}</span>
											</div>
											<div>
												<Rate
													defaultValue={item.RateTeacher}
													value={item.RateTeacher}
													disabled={moment() >= moment(item?.StartTime) && (user?.RoleId == 3 || user?.RoleId == 1) ? false : true}
													onChange={(val) => handleChangeRate(val, item)}
													className="text-tw-yellow group-hover:cursor-pointer"
												/>
											</div>
											{item?.RateTeacherComment ? <div className="p-2 border rounded">{item?.RateTeacherComment}</div> : ''}
										</div>
									</div>
								</Timeline.Item>
							))}
					</Timeline>
				</Spin>
			</Card>
			<Modal
				title="Nhận xét giáo viên"
				open={visible}
				onCancel={onClose}
				footer={
					<>
						<PrimaryButton onClick={() => onClose()} background="red" icon="cancel" type="button">
							Huỷ
						</PrimaryButton>
						<PrimaryButton
							loading={isLoading}
							onClick={() => form.submit()}
							className="ml-2"
							background="blue"
							icon="save"
							type="button"
							children="Lưu"
						/>
					</>
				}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={_onSubmit}>
						<TextBoxField name="RateTeacherComment" label="" />
					</Form>
				</div>
			</Modal>
		</>
	)
}
