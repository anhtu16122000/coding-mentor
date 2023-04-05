import { Avatar, Collapse, Form, Modal, Popover, Select, Tooltip } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AiOutlineCalendar, AiOutlineWarning } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { scheduleApi } from '~/api/schedule'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import {
	setIsEditSchedule,
	setListCalendarEdit,
	setLoadingCalendar,
	setPrevScheduleEdit,
	setShowModalEdit,
	setTeacherEdit
} from '~/store/classReducer'
import DatePickerField from '../FormControl/DatePickerField'
import TextBoxField from '../FormControl/TextBoxField'
import PrimaryButton from '../Primary/Button'
import ModalRemoveScheduleEdit from './ModalRemoveScheduleEdit'
import PrimaryTooltip from '../PrimaryTooltip'
import InputMoneyField from '~/common/components/FormControl/InputNumberField'

const ChangeScheduleClassEdit = (props) => {
	const { dataRow, checkTeacherAvailable, getListSchedule, checkRoomAvailable } = props
	const [isModalOpen, setIsModalOpen] = useState({ open: false, id: null })
	const [isDisableButton, setIsDisableButton] = useState(false)
	const [form] = Form.useForm()
	const dispatch = useDispatch()
	const router = useRouter()
	const listCalendar = useSelector((state: RootState) => state.class.listCalendarEdit)
	const teacher = useSelector((state: RootState) => state.class.teacherEdit)
	const showModal = useSelector((state: RootState) => state.class.showModalEdit)
	const prevSchedule = useSelector((state: RootState) => state.class.prevScheduleEdit)
	const room = useSelector((state: RootState) => state.class.roomEdit)
	const isEditSchedule = useSelector((state: RootState) => state.class.isEditSchedule)
	const paramsSchedule = useSelector((state: RootState) => state.class.paramsSchedule)
	const loadingCalendar = useSelector((state: RootState) => state.class.loadingCalendar)
	const infoClass = useSelector((state: RootState) => state.class.infoClass)
	const refPopover = useRef(null)

	useMemo(() => {
		if (!!showModal.open && showModal.id === dataRow.event.extendedProps.IdSchedule) {
			setIsModalOpen({ open: true, id: dataRow.event.extendedProps.IdSchedule })
			setIsDisableButton(true)
		}
	}, [showModal])

	function removeCommas(str) {
		return typeof str == 'string' ? str.replace(/,/g, '') : str
	}

	const onSubmit = async (data) => {
		if (moment(data.StartTime).format() >= moment(data.EndTime).format()) {
			ShowNoti('error', 'Lịch học không hợp lệ')
		} else {
			const checkExistSchedule = listCalendar.find((item) => {
				return (
					(moment(item.StartTime).format() === moment(data.StartTime).format() ||
						moment(item.EndTime).format() === moment(data.EndTime).format() ||
						(moment(item.EndTime).format() > moment(data.StartTime).format() &&
							moment(item.EndTime).format() <= moment(data.EndTime).format()) ||
						(moment(item.StartTime).format() > moment(data.StartTime).format() &&
							moment(item.StartTime).format() < moment(data.EndTime).format())) &&
					item.IdSchedule !== dataRow.event.extendedProps.IdSchedule
				)
			})

			if (!checkExistSchedule) {
				dispatch(setLoadingCalendar(true))
				let DATA_SUBMIT = {
					...data,
					StartTime: moment(data.StartTime).format(),
					EndTime: moment(data.EndTime).format(),
					Id: dataRow.event.extendedProps.IdSchedule,
					TeachingFee: removeCommas(data?.TeachingFee)
				}
				try {
					const res = await scheduleApi.update(DATA_SUBMIT)
					if (res.status === 200) {
						setIsModalOpen({ open: false, id: null })
						dispatch(setShowModalEdit({ open: false, id: null }))
						getListSchedule(paramsSchedule)
						ShowNoti('success', res.data.message)
					}
				} catch (err) {
					ShowNoti('error', err.message)
				} finally {
					dispatch(setLoadingCalendar(false))
				}
			} else {
				ShowNoti('error', 'Buổi học này đã bị trùng lịch')
			}
		}
	}

	useEffect(() => {
		if (!!isModalOpen.open) {
			console.log('DATA: ', room, teacher)
			const checkExistTeacher = teacher.find((item) => item.TeacherId === dataRow.event.extendedProps.TeacherId)
			if (!!checkExistTeacher) {
				form.setFieldsValue({ TeacherId: dataRow.event.extendedProps.TeacherId })
			} else {
				setIsDisableButton(true)
			}
			const checkExistRoom = room.find((item) => item.RoomId === dataRow.event.extendedProps.RoomId)
			if (!!checkExistRoom) {
				form.setFieldsValue({ RoomId: dataRow.event.extendedProps.RoomId })
			} else {
				setIsDisableButton(true)
			}
			form.setFieldsValue({ StartTime: moment(dataRow.event.start) })
			form.setFieldsValue({ EndTime: moment(dataRow.event.end) })
			form.setFieldsValue({ Id: dataRow.event.extendedProps.Id })
			form.setFieldsValue({ Note: dataRow.event.extendedProps.Note })
			form.setFieldsValue({ TeachingFee: dataRow.event.extendedProps.TeachingFee })
		}
	}, [isModalOpen])

	const handleOpen = async () => {
		await checkTeacherAvailable({
			scheduleId: dataRow.event.extendedProps.IdSchedule,
			branchId: infoClass.BranchId,
			curriculumId: infoClass.CurriculumId,
			startTime: moment(dataRow.event.start).format(),
			endTime: moment(dataRow.event.end).format()
		})

		if (!!dataRow.event.extendedProps.RoomId) {
			await checkRoomAvailable({
				scheduleId: dataRow.event.extendedProps.IdSchedule,
				branchId: infoClass.BranchId,
				startTime: moment(dataRow.event.start).format(),
				endTime: moment(dataRow.event.end).format()
			})
		}

		setIsModalOpen({ open: true, id: dataRow.event.extendedProps.IdSchedule })
	}

	const getDataAvailable = async () => {
		if (!!form.getFieldValue('StartTime') && !!form.getFieldValue('EndTime')) {
			const listTeacher = await checkTeacherAvailable({
				scheduleId: dataRow.event.extendedProps.IdSchedule,
				branchId: infoClass.BranchId,
				curriculumId: infoClass.CurriculumId,
				startTime: moment(form.getFieldValue('StartTime')).format(),
				endTime: moment(form.getFieldValue('EndTime')).format()
			})
			const listRoom = await checkRoomAvailable({
				scheduleId: dataRow.event.extendedProps.IdSchedule,
				branchId: infoClass.BranchId,
				startTime: moment(form.getFieldValue('StartTime')).format(),
				endTime: moment(form.getFieldValue('EndTime')).format()
			})
			const checkTeacher = listTeacher.find((item) => item.TeacherId === dataRow.event.extendedProps.TeacherId)
			const checkRoom = listRoom.find((item) => item.RoomId === dataRow.event.extendedProps.RoomId)
			if (!!checkTeacher && !checkTeacher?.Fit) {
				setIsDisableButton(true)
			} else if (!!checkRoom && !checkRoom?.Fit) {
				setIsDisableButton(true)
			} else {
				setIsDisableButton(false)
			}
		}
	}

	const handleCheckTeacher = async (startTime, endTime) => {
		const listTeacherAvailable = await checkTeacherAvailable({
			scheduleId: dataRow.event.extendedProps.IdSchedule,
			branchId: infoClass.BranchId,
			curriculumId: infoClass.CurriculumId,
			startTime: moment(startTime).format(),
			endTime: moment(endTime).format()
		})
		dispatch(setTeacherEdit(listTeacherAvailable))
	}

	function getStatusColor() {
		switch (dataRow.event.extendedProps.Status) {
			case 1:
				return '!rounded-md !bg-[#FFF]'
			case 2:
				return '!rounded-md !bg-[#FFF]'
		}
	}

	const getStatusScheduleTag = () => {
		switch (dataRow.event.extendedProps.Status) {
			case 1:
				return '!border-2 !border-solid !border-[#fb862d] !text-[#fb862d] !bg-[#FFF] !rounded-md'
			case 2:
				return '!border-2 !border-solid !border-[#43b413] !text-[#43b413] !bg-[#FFF] !rounded-md'
		}
	}

	const getStatusScheduleTime = () => {
		switch (dataRow.event.extendedProps.Status) {
			case 1:
				return '!rounded px-[6px] py-[2px]  !text-[12px] !bg-[#fb862d] !text-[#FFF] '
			case 2:
				return '!rounded px-[6px] py-[2px]  !text-[12px] !bg-[#43b413] !text-[#FFF] '
		}
	}

	function getStatusColorPoppover() {
		switch (dataRow.event.extendedProps.Status) {
			case 1:
				return '!rounded-md !bg-[#FFF] border-2 border-solid border-[#fb862d]'
			case 2:
				return '!rounded-md !bg-[#FFF] border-2 border-solid border-[#43b413]'
		}
	}

	return (
		<>
			<div className="wrapper-schedule wrapper-schedule-calender">
				<div className={`${getStatusScheduleTag()}`}>
					<Popover
						trigger="click"
						content={
							<div className="wrapper-content-schedule !p-0">
								<p>
									<span className="title">GV:</span> {dataRow.event.extendedProps.TeacherName}
								</p>
								{!!dataRow.event.extendedProps?.RoomId && (
									<p>
										<span className="title">Phòng:</span> {dataRow.event.extendedProps.RoomName}
									</p>
								)}
								<p>
									<span className="title">Ghi chú:</span>{' '}
									<span className="whitespace-pre-line ml-1">{dataRow.event.extendedProps.Note}</span>
								</p>
							</div>
						}
					>
						<button
							className={`${getStatusColor()} !bg-white !text-[#fff] font-semibold  w-full p-[4px] flex justify-start items-center gap-[4px]`}
							onClick={() => !!isEditSchedule && handleOpen()}
						>
							<span className={`${getStatusScheduleTime()}`}>{moment(dataRow.event.start).format('HH:mm')}</span>{' '}
							<span className={`${getStatusScheduleTime()}`}>{moment(dataRow.event.end).format('HH:mm')}</span>
						</button>
					</Popover>
				</div>
				{/* <Collapse bordered={false} className={`${getStatusScheduleTag()}`}>
					<Collapse.Panel
						key={dataRow.event.extendedProps.Id}
						header={
							<button
								className={`${getStatusColor()} !bg-white !text-[#fff] font-semibold  w-full p-[4px] flex justify-start items-center gap-[4px]`}
								onClick={() => !!isEditSchedule && handleOpen()}
							>
								<span className={`${getStatusScheduleTime()}`}>{moment(dataRow.event.start).format('HH:mm')}</span>{' '}
								<span className={`${getStatusScheduleTime()}`}>{moment(dataRow.event.end).format('HH:mm')}</span>
							</button>
						}
					>
						<div className="wrapper-content-schedule !p-0">
							<p>
								<span className="title">GV:</span> {dataRow.event.extendedProps.TeacherName}
							</p>
							{!!dataRow.event.extendedProps?.RoomId && (
								<p>
									<span className="title">Phòng:</span> {dataRow.event.extendedProps.RoomName}
								</p>
							)}
							<p>
								<span className="title">Ghi chú:</span> <span className="whitespace-pre-line ml-1">{dataRow.event.extendedProps.Note}</span>
							</p>
						</div>
					</Collapse.Panel>
				</Collapse> */}

				{!!isEditSchedule ? (
					<div className="mt-2 flex flex-col gap-2">
						<PrimaryTooltip className="w-full px-[8px]" place="top" content="Chỉnh sửa" id={`edit-sc-${dataRow.event.extendedProps?.Id}`}>
							<PrimaryButton
								background="yellow"
								type="button"
								icon="edit"
								className="w-full"
								onClick={() => {
									!!isEditSchedule ? handleOpen() : null
									refPopover.current.close()
								}}
							/>
						</PrimaryTooltip>

						<ModalRemoveScheduleEdit
							IdSchedule={dataRow.event.extendedProps.IdSchedule}
							startTime={dataRow.event.extendedProps.StartTime}
							endTime={dataRow.event.extendedProps.EndTime}
							getListSchedule={getListSchedule}
							dataRow={dataRow}
						/>
					</div>
				) : null}
			</div>

			<Popover
				ref={refPopover}
				content={
					<>
						<div className="wrapper-schedule !text-[12px]">
							<span className="title">Ca: </span> <span>{moment(dataRow.event.start).format('HH:mm')}</span> -{' '}
							<span>{moment(dataRow.event.end).format('HH:mm')}</span>
							<div className="wrapper-content-schedule !text-[12px]">
								<p>
									<span className="title">Ngày bắt đầu:</span> {moment(dataRow.event.start).format('DD/MM/YYYY')}
								</p>
								<p>
									<span className="title">Ngày kết thúc:</span> {moment(dataRow.event.end).format('DD/MM/YYYY')}
								</p>
								<p>
									<span className="title">GV:</span> {dataRow.event.extendedProps.TeacherName}
								</p>
								{!!dataRow.event.extendedProps.RoomId ? (
									<p>
										<span className="title">Phòng:</span> {dataRow.event.extendedProps.RoomName}
									</p>
								) : null}
								<p>
									<span className="title">Ghi chú:</span>
									<span className="whitespace-pre-line ml-1">{dataRow.event.extendedProps.Note}</span>
								</p>
							</div>
							{!!isEditSchedule ? (
								<div className="flex items-center justify-between gap-2 mt-2">
									<ModalRemoveScheduleEdit
										IdSchedule={dataRow.event.extendedProps.IdSchedule}
										startTime={dataRow.event.extendedProps.StartTime}
										endTime={dataRow.event.extendedProps.EndTime}
										getListSchedule={getListSchedule}
										refPopover={refPopover}
									/>
									<PrimaryButton
										background="yellow"
										type="button"
										icon="edit"
										onClick={() => {
											!!isEditSchedule ? handleOpen() : null
											refPopover.current.close()
										}}
									>
										Chỉnh sửa
									</PrimaryButton>
								</div>
							) : null}
						</div>
					</>
				}
				title="Thông tin buổi học"
				trigger="click"
			>
				<div className="wrapper-schedule wrapper-schedule-tablet">
					<button
						// className="btn-edit-title"
						className={`${getStatusColorPoppover()}  !bg-white !text-[#fff] font-semibold  w-full p-[2px] flex justify-start items-center gap-[2px]`}
					>
						<span className={`${getStatusScheduleTime()} !text-[10px] !p-[1px]`}>{moment(dataRow.event.start).format('HH:mm')}</span>{' '}
						<span className={`${getStatusScheduleTime()} !text-[10px] !p-[1px]`}>{moment(dataRow.event.end).format('HH:mm')}</span>
					</button>
				</div>
				<div className="wrapper-schedule wrapper-schedule-mobile">
					<button className="btn-edit-title">
						<AiOutlineCalendar />
					</button>
				</div>
			</Popover>

			<Modal
				title={`Ca ${moment(dataRow.event.extendedProps.StartTime).format('HH:mm')} - ${moment(dataRow.event.extendedProps.EndTime).format(
					'HH:mm'
				)} - Ngày ${moment(dataRow.event.extendedProps.StartTime).format('DD/MM')}`}
				open={!!isModalOpen.open && isModalOpen.id !== null}
				onCancel={() => {
					const newListCalendar = [...listCalendar]
					newListCalendar[prevSchedule.Id] = {
						...prevSchedule,
						StartTime: moment(prevSchedule.start).format(),
						EndTime: moment(prevSchedule.end).format(),
						end: moment(prevSchedule.end).format(),
						start: moment(prevSchedule.start).format(),
						title: `${moment(prevSchedule.start).format('HH:mm')} - ${moment(prevSchedule.end).format('HH:mm')}`
					}
					dispatch(setListCalendarEdit(newListCalendar))
					handleCheckTeacher(moment(prevSchedule.start).format(), moment(prevSchedule.end).format())
					setIsModalOpen({ open: false, id: null })
					dispatch(setShowModalEdit({ open: false, id: null }))
				}}
				footer={
					<PrimaryButton
						disable={loadingCalendar}
						icon="save"
						background="blue"
						type="button"
						onClick={form.submit}
						loading={loadingCalendar}
					>
						Lưu
					</PrimaryButton>
				}
			>
				<Form form={form} layout="vertical" className="grid grid-cols-2 gap-x-4" onFinish={onSubmit}>
					<DatePickerField
						className="col-span-2 w500:col-span-1"
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
						className="col-span-2 w500:col-span-1"
						showTime={'HH:mm'}
						picker="showTime"
						format="DD/MM/YYYY HH:mm"
						label="Giờ kết thúc"
						name="EndTime"
						onChange={getDataAvailable}
					/>

					<Form.Item name="TeacherId" className="col-span-2" label="Giáo viên">
						<Select onChange={() => setIsDisableButton(false)} placeholder="Chọn giáo viên">
							{teacher.map((item) => {
								return (
									<Select.Option disabled={!item.Fit} key={item.TeacherId} value={item.TeacherId}>
										<div className="flex items-center justify-between w-full">
											{item.TeacherName}
											{!item.Fit ? (
												<Tooltip placement="right" title={!!item.Note ? item.Note : `Giáo viên ${item.TeacherName} bị trùng lịch`}>
													<AiOutlineWarning className="text-tw-red" />
												</Tooltip>
											) : null}
										</div>
									</Select.Option>
								)
							})}
						</Select>
					</Form.Item>

					{!!infoClass?.Type && parseInt(infoClass?.Type.toString()) == 1 && (
						<Form.Item className="col-span-2" name="RoomId" label="Phòng học">
							<Select onChange={() => setIsDisableButton(false)} placeholder="Chọn phòng học">
								{room.map((item) => {
									return (
										<Select.Option disabled={!item.Fit} key={item.RoomId} value={item.RoomId}>
											<div className="flex items-center justify-between w-full">
												{item.RoomName}
												{!item.Fit ? (
													<Tooltip placement="right" title={!!item.Note ? item.Note : `Phòng học ${item.RoomName} bị trùng lịch`}>
														<AiOutlineWarning className="text-tw-red" />
													</Tooltip>
												) : null}
											</div>
										</Select.Option>
									)
								})}
							</Select>
						</Form.Item>
					)}

					<InputMoneyField className="col-span-2" label="Lương / Buổi" name="TeachingFee" placeholder="Nhập mức lương" isRequired />

					<TextBoxField className="col-span-2" name="Note" label="Ghi chú" />
				</Form>
			</Modal>
		</>
	)
}

export default ChangeScheduleClassEdit
