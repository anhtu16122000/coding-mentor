import { Button, Form, Modal, Select, Spin, Tooltip } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { AiOutlineWarning } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { scheduleApi } from '~/api/learn/schedule'
import { ShowNoti, log } from '~/common/utils'
import { RootState } from '~/store'
import { setRoomEdit, setTeacherEdit } from '~/store/classReducer'
import DatePickerField from '../FormControl/DatePickerField'
import TextBoxField from '../FormControl/TextBoxField'
import PrimaryButton from '../Primary/Button'
import { classApi } from '~/api/learn/class'
import ModalFooter from '../ModalFooter'
import { formRequired } from '~/common/libs/others/form'
import { formatDateTime } from '../Calculate/TimeFormat'
import { DeleteOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons'

type DataAdd = {
	RoomId?: number
	StartTime: string
	EndTime: string
	TeacherId: string
	Note: string
}

const ModalAddScheduleEdit = (props) => {
	const { checkTeacherAvailable, checkRoomAvailable, getListSchedule, paramsSchedule } = props

	const [form] = Form.useForm()
	const router = useRouter()

	const { class: slug, BranchId, CurriculumId, Type } = router.query

	const teacher = useSelector((state: RootState) => state.class.teacherEdit)
	const room = useSelector((state: RootState) => state.class.roomEdit)

	const infoClass = useSelector((state: RootState) => state.class.infoClass)

	const [isLoading, setIsLoading] = useState(false)
	const [openModalAdd, setOpenModalAdd] = useState(false)
	const [scheduleList, setScheduleList] = useState<DataAdd[]>([])

	function addMinutesToMoment(inputMoment, minutes) {
		if (!moment.isMoment(inputMoment) || typeof minutes !== 'number') {
			console.error('Đối số đầu vào không hợp lệ.')
			return null
		}
		const resultMoment = moment(inputMoment)
		resultMoment.add(minutes, 'minutes')
		return resultMoment
	}

	const save = async () => {
		const DATA_SUBMIT = []
		scheduleList?.map((e) =>
			DATA_SUBMIT.push({
				ClassId: parseInt(slug.toString()),
				RoomId: e.RoomId || 0,
				StartTime: moment(e.StartTime).format(),
				EndTime: moment(e.EndTime).format(),
				TeacherId: e.TeacherId.split('&')[0],
				Note: e.Note
			})
		)
		try {
			const res = await scheduleApi.adds({ schedules: DATA_SUBMIT })
			if (res.status === 200) {
				getListSchedule(paramsSchedule)
				setOpenModalAdd(false)
				setScheduleList([])
				ShowNoti('success', res.data.message)
			}
			setIsLoading(false)
		} catch (err) {
			setIsLoading(false)
			ShowNoti('error', err.message)
		}
	}

	const checkSchedule = (start: any, end: any) => {
		const between = scheduleList?.findIndex(
			(e) => new Date(e.StartTime).getTime() <= new Date(start).getTime() && new Date(e.EndTime).getTime() >= new Date(end).getTime()
		)
		if (between > -1) {
			return false
		} else {
			const include = scheduleList?.findIndex(
				(e) => new Date(e.StartTime).getTime() > new Date(start).getTime() && new Date(e.EndTime).getTime() < new Date(end).getTime()
			)
			if (include > -1) {
				return false
			} else {
				const include_right = scheduleList?.findIndex(
					(e) => new Date(e.StartTime).getTime() >= new Date(start).getTime() && new Date(e.StartTime).getTime() <= new Date(end).getTime()
				)
				if (include_right > -1) {
					return false
				} else {
					const include_left = scheduleList?.findIndex(
						(e) => new Date(e.EndTime).getTime() >= new Date(start).getTime() && new Date(e.EndTime).getTime() <= new Date(end).getTime()
					)
					if (include_left > -1) {
						return false
					} else {
						console.log(5)
						return true
					}
				}
			}
		}
	}

	const getDataAvailable = async () => {
		const startTime = form.getFieldValue('StartTime')
		const endTime = form.getFieldValue('EndTime')

		if (!endTime && !!startTime) {
			form.setFieldValue('EndTime', addMinutesToMoment(startTime, infoClass?.Time)) // Tự tính giờ kết thúc dựa trên thời gian học của giáo trình (Time)
		}

		const endTimeSeted = form.getFieldValue('EndTime') // Lấy lại thời gian kết thúc sau khi đã set (nên get lại, tính ẩu ẩu sai bome đó)

		if (!!startTime && !!endTimeSeted) {
			// Nếu mà nó đã chọn bắt đầu và kết thúc thì check coi GV với phòng nào đang phù hợp

			const apiParams = {
				branchId: BranchId || infoClass?.BranchId,
				startTime: moment(startTime).format(),
				endTime: moment(endTimeSeted).format()
			}

			// Không hiểu sao Long nó bỏ 2 cái hàm ở ngoài. Nhưng, nên thuận theo tự nhiên 😁
			await checkTeacherAvailable({ ...apiParams, curriculumId: CurriculumId || infoClass?.CurriculumId }) // Gọi api lấy danh sách GV
			await checkRoomAvailable({ ...apiParams }) // Gọi api lấy danh sách phòng
		}
	}

	const onSubmit = async (data) => {
		if (moment(data.StartTime).format() < moment(data.EndTime).format()) {
			setIsLoading(true)

			let DATA_SUBMIT = {
				ClassId: parseInt(slug.toString()),
				RoomId: data.RoomId,
				StartTime: moment(data.StartTime).format(),
				EndTime: moment(data.EndTime).format(),
				TeacherId: data.TeacherId.split('&')[0],
				Note: data.Note
			}

			try {
				// const res = await scheduleApi.add(DATA_SUBMIT)
				// if (res.status === 200) {
				// 	getListSchedule(paramsSchedule)
				// 	setOpenModalAdd(false)
				// 	form.resetFields()
				// 	ShowNoti('success', res.data.message)
				// }

				const res = await scheduleApi.check(DATA_SUBMIT)
				if (res.status === 200) {
					if (checkSchedule(data.StartTime, data.EndTime)) {
						setScheduleList((prev: any) => [...prev, data])
						form.resetFields()
					} else {
						ShowNoti('error', 'Trùng lịch')
					}
				}
			} catch (err) {
				ShowNoti('error', err.message)
			} finally {
				setIsLoading(false)
			}
		} else {
			ShowNoti('error', 'Ngày bắt đầu không được lớn hơn ngày kết thúc')
		}
	}

	function _cancel() {
		form.resetFields()
		setTeacherEdit([])
		setRoomEdit([])
		setOpenModalAdd(false)
	}

	log.Yellow('infoClass', infoClass)

	return (
		<>
			<PrimaryButton onClick={() => setOpenModalAdd(true)} className="ml-3" background="green" type="button" icon="add">
				Thêm lịch
			</PrimaryButton>

			<Modal
				title="Thêm buổi học"
				open={openModalAdd}
				onCancel={_cancel}
				// footer={<ModalFooter loading={isLoading} onOK={form.submit} onCancel={_cancel} />}
				footer={false}
				width={scheduleList.length > 0 ? 800 : 400}
			>
				<div style={{ display: 'flex', width: '100%', flex: 1 }}>
					<Form
						style={{ display: 'flex', flex: 55, justifyContent: 'center', flexDirection: 'column' }}
						form={form}
						layout="vertical"
						onFinish={onSubmit}
					>
						<DatePickerField
							mode="single"
							showTime={'HH:mm'}
							picker="showTime"
							format="DD/MM/YYYY HH:mm"
							label="Giờ bắt đầu"
							name="StartTime"
							onChange={getDataAvailable}
						/>
						<DatePickerField
							mode="single"
							showTime={'HH:mm'}
							picker="showTime"
							format="DD/MM/YYYY HH:mm"
							label="Giờ kết thúc"
							name="EndTime"
							onChange={getDataAvailable}
						/>
						<Form.Item name="TeacherId" label="Giáo viên" rules={formRequired}>
							<Select placeholder="Chọn giáo viên">
								{teacher.map((item) => {
									return (
										<Select.Option disabled={!item.Fit} key={item.TeacherId} value={`${item.TeacherId}&${item.TeacherName}`}>
											<div className="flex items-center justify-between w-full">
												{item.TeacherName}
												{!item.Fit ? (
													<Tooltip placement="right" title={item.Note}>
														<AiOutlineWarning className="text-tw-red" />
													</Tooltip>
												) : null}
											</div>
										</Select.Option>
									)
								})}
							</Select>
						</Form.Item>

						{!!Type && parseInt(Type.toString()) == 1 ? (
							<Form.Item name="RoomId" label="Phòng học" rules={formRequired}>
								<Select placeholder="Chọn phòng học">
									{room.map((item) => {
										return (
											<Select.Option disabled={!item.Fit} key={item.RoomId} value={item.RoomId}>
												<div className="flex items-center justify-between w-full">
													{item.RoomName}
													{!item.Fit ? (
														<Tooltip placement="right" title={item.Note}>
															<AiOutlineWarning className="text-tw-red" />
														</Tooltip>
													) : null}
												</div>
											</Select.Option>
										)
									})}
								</Select>
							</Form.Item>
						) : null}

						<TextBoxField name="Note" label="Ghi chú" />

						<Button style={{ width: 100, alignSelf: 'center' }} type="primary" onClick={form.submit}>
							Thêm
						</Button>
					</Form>
					{scheduleList.length > 0 && (
						<div
							style={{
								flex: 45,
								display: 'flex',
								justifyContent: 'center',
								flexDirection: 'column',
								marginLeft: 10
							}}
						>
							<div
								className="schedule-list-container"
								style={{
									height: Number(Type) === 1 ? '65vh' : '53vh',
									maxHeight: Number(Type) === 1 ? '65vh' : '53vh'
								}}
							>
								{scheduleList?.map((_item: DataAdd) => {
									return (
										<div className="schedule-new-item">
											<div>
												<div style={{ fontSize: 14, fontWeight: '600' }}>{_item.TeacherId.split('&')[1]}</div>
												<div style={{ display: 'flex', marginTop: 3, marginBottom: 3 }}>
													<div style={{ height: 5, width: 35, borderRadius: 5, backgroundColor: '#FF0000', marginRight: 6 }} />
													<div style={{ height: 5, width: 30, borderRadius: 5, backgroundColor: '#0A8FDC' }} />
												</div>
												<div>
													<span>{formatDateTime(_item.StartTime)}</span> - <span>{formatDateTime(_item.EndTime)}</span>
												</div>
											</div>
											<DeleteOutlined onClick={() => setScheduleList(scheduleList.filter((e) => e !== _item))} />
										</div>
									)
								})}
							</div>
							<Button disabled={isLoading} onClick={save} style={{ marginTop: 'auto', width: 100, alignSelf: 'center'  }} type="primary">
							{isLoading && <Spin size='small' style={{marginRight: 5}}/>} Lưu
							</Button>
						</div>
					)}
				</div>
			</Modal>
		</>
	)
}

export default ModalAddScheduleEdit
