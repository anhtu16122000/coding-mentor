import { Form, Modal, Popover, Select, Tooltip } from 'antd'
import moment from 'moment'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AiOutlineCalendar, AiOutlineWarning } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import { setListCalendar, setLoadingCalendar, setRoom, setShowModal, setTeacher } from '~/store/classReducer'
import DatePickerField from '../FormControl/DatePickerField'
import InputTextField from '../FormControl/InputTextField'
import TextBoxField from '../FormControl/TextBoxField'
import PrimaryButton from '../Primary/Button'
import ModalRemoveSchedule from './ModalRemoveSchedule'
import InputMoneyField from '~/common/components/FormControl/InputNumberField'
import PrimaryTooltip from '../PrimaryTooltip'

const ChangeScheduleClass = (props) => {
	const { dataRow, checkTeacherAvailable, handleChangeInfo, checkRoomAvailable } = props
	const [form] = Form.useForm()
	const dispatch = useDispatch()

	const refPopover = useRef(null)

	const [isModalOpen, setIsModalOpen] = useState({ open: false, id: null })
	const [isDisableButton, setIsDisableButton] = useState(false)

	const dataChangeSchedule = useSelector((state: RootState) => state.class.dataChangeSchedule)
	const listCalendar = useSelector((state: RootState) => state.class.listCalendar)
	const teacher = useSelector((state: RootState) => state.class.teacher)
	const showModal = useSelector((state: RootState) => state.class.showModal)
	const prevSchedule = useSelector((state: RootState) => state.class.prevSchedule)
	const loadingCalendar = useSelector((state: RootState) => state.class.loadingCalendar)
	const room = useSelector((state: RootState) => state.class.room)

	useMemo(() => {
		if (!!showModal.open && showModal.id === dataRow.event.extendedProps.Id) {
			setIsModalOpen({ open: true, id: dataRow.event.extendedProps.Id })
			setIsDisableButton(true)
		}
	}, [showModal])

	const onSubmit = async (data) => {
		if (moment(data.StartTime).format() >= moment(data.EndTime).format()) {
			ShowNoti('error', 'Lịch học không hợp lệ')
		} else {
			dispatch(setLoadingCalendar(true))
			const checkExistSchedule = listCalendar.find((item) => {
				return (
					(moment(item.StartTime).format() === moment(data.StartTime).format() ||
						moment(item.EndTime).format() === moment(data.EndTime).format() ||
						(moment(item.EndTime).format() > moment(data.StartTime).format() &&
							moment(item.EndTime).format() <= moment(data.EndTime).format()) ||
						(moment(item.StartTime).format() > moment(data.StartTime).format() &&
							moment(item.StartTime).format() < moment(data.EndTime).format())) &&
					item.Id !== data.Id
				)
			})
			if (!checkExistSchedule) {
				const getRoomName = room.find((item) => item.RoomId === data.RoomId)
				const hasTeacher = teacher.find((item) => item.TeacherId === data.TeacherId)
				const newListCalendar = [...listCalendar]
				newListCalendar[dataRow.event.extendedProps.Id] = {
					...newListCalendar[dataRow.event.extendedProps.Id],
					...data,
					RoomName: !!getRoomName ? getRoomName.RoomName : null,
					TeacherName: hasTeacher.TeacherName,
					StartTime: moment(data.StartTime).format(),
					EndTime: moment(data.EndTime).format(),
					end: moment(data.EndTime).format(),
					start: moment(data.StartTime).format(),

					// That shit should
					title: `${moment(data.StartTime).format('HH:mm')} - ${moment(data.EndTime).format('HH:mm')}`
				}
				dispatch(setListCalendar(newListCalendar))
				dispatch(setShowModal({ open: false, id: null }))
				setIsModalOpen({ open: false, id: null })
				ShowNoti('success', 'Đổi lịch thành công')
			} else {
				ShowNoti('error', 'Buổi học này đã bị trùng lịch')
			}
			dispatch(setLoadingCalendar(false))
		}
	}

	useEffect(() => {
		if (!!isModalOpen.open) {
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

	const handleCheckTeacher = async (startTime, endTime) => {
		const listTeacherAvailable = await checkTeacherAvailable({
			branchId: dataChangeSchedule.BranchId,
			curriculumId: dataChangeSchedule.CurriculumId,
			startTime: moment(startTime).format(),
			endTime: moment(endTime).format()
		})
		dispatch(setTeacher(listTeacherAvailable))
	}

	const handleOpen = async () => {
		await checkTeacherAvailable({
			branchId: dataChangeSchedule.BranchId,
			curriculumId: dataChangeSchedule.CurriculumId,
			startTime: moment(dataRow.event.start).format(),
			endTime: moment(dataRow.event.end).format()
		})

		if (!!dataRow.event.extendedProps.RoomId) {
			await checkRoomAvailable({
				branchId: dataChangeSchedule.BranchId,
				startTime: moment(dataRow.event.start).format(),
				endTime: moment(dataRow.event.end).format()
			})
		}

		setIsModalOpen({ open: true, id: dataRow.event.extendedProps.Id })
	}

	const getDataAvailable = async () => {
		if (!!form.getFieldValue('StartTime') && !!form.getFieldValue('EndTime')) {
			const listTeacher = await checkTeacherAvailable({
				branchId: dataChangeSchedule.BranchId,
				curriculumId: dataChangeSchedule.CurriculumId,
				startTime: moment(form.getFieldValue('StartTime')).format(),
				endTime: moment(form.getFieldValue('EndTime')).format()
			})
			const listRoom = await checkRoomAvailable({
				branchId: dataChangeSchedule.BranchId,
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

	function getTime() {
		const start = dataRow.event.extendedProps.StartTime
		const end = dataRow.event.extendedProps.EndTime

		return `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`
	}

	function getDate() {
		return moment(dataRow.event.extendedProps.StartTime).format('DD/MM')
	}

	function modalCancel() {
		const newListCalendar = [...listCalendar]
		newListCalendar[prevSchedule.Id] = {
			...prevSchedule,
			StartTime: moment(prevSchedule.start).format(),
			EndTime: moment(prevSchedule.end).format(),
			end: moment(prevSchedule.end).format(),
			start: moment(prevSchedule.start).format(),
			title: `${moment(prevSchedule.start).format('HH:mm')} - ${moment(prevSchedule.end).format('HH:mm')}`
		}
		dispatch(setListCalendar(newListCalendar))
		handleCheckTeacher(moment(prevSchedule.start).format(), moment(prevSchedule.end).format())
		setIsModalOpen({ open: false, id: null })
		dispatch(setShowModal({ open: false, id: null }))
	}

	function onClickEdit() {
		handleOpen()
		refPopover.current.close()
	}

	return (
		<>
			<div className="wrapper-schedule">
				<button className="btn-edit-title" onClick={() => handleOpen()}>
					<span>{moment(dataRow.event.start).format('HH:mm')}</span> <span className="mx-1">-</span>
					<span>{moment(dataRow.event.end).format('HH:mm')}</span>
				</button>
				<div className="wrapper-content-schedule">
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

				<div className="flex flex-col">
					<PrimaryTooltip
						className="w-full px-[8px] mb-[4px]"
						place="top"
						content="Chỉnh sửa"
						id={`edit-sc-${dataRow.event.extendedProps?.Id}`}
					>
						<PrimaryButton onClick={onClickEdit} type="button" background="yellow" icon="edit" className="w-full" />
					</PrimaryTooltip>

					<PrimaryTooltip className="w-full px-[8px]" place="top" content="Chỉnh sửa" id={`delete-sc-${dataRow.event.extendedProps?.Id}`}>
						<ModalRemoveSchedule dataRow={dataRow} />
					</PrimaryTooltip>
				</div>
			</div>

			<Popover
				ref={refPopover}
				content={
					<>
						<span className="title">Ca: </span>
						<span>{moment(dataRow.event.start).format('HH:mm')}</span> <span className="mx-1">-</span>
						<span>{moment(dataRow.event.end).format('HH:mm')}</span>
						<div className="wrapper-content-schedule">
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
						<div className="flex flex-col">
							<PrimaryTooltip
								className="w-full px-[8px] mb-[4px]"
								place="top"
								content="Chỉnh sửa"
								id={`edit-sc-${dataRow.event.extendedProps?.Id}`}
							>
								<PrimaryButton onClick={onClickEdit} type="button" background="yellow" icon="edit" className="w-full" />
							</PrimaryTooltip>
							<PrimaryTooltip
								className="w-full px-[8px]"
								place="top"
								content="Chỉnh sửa"
								id={`delete-sc-${dataRow.event.extendedProps?.Id}`}
							>
								<ModalRemoveSchedule dataRow={dataRow} />
							</PrimaryTooltip>
						</div>
					</>
				}
				title="Thông tin buổi học"
				trigger="click"
			>
				<div className="wrapper-schedule wrapper-schedule-tablet">
					<button className="btn-edit-title">
						<span>{moment(dataRow.event.start).format('HH:mm')}</span> <span className="mx-1">-</span>
						<span>{moment(dataRow.event.end).format('HH:mm')}</span>
					</button>
				</div>
				<div className="wrapper-schedule wrapper-schedule-mobile">
					<button className="btn-edit-title">
						<AiOutlineCalendar />
					</button>
				</div>
			</Popover>

			<Modal
				title={`Ca ${getTime()} - Ngày ${getDate()}`}
				open={!!isModalOpen.open && isModalOpen.id !== null}
				onCancel={modalCancel}
				footer={
					<PrimaryButton
						disable={loadingCalendar}
						loading={loadingCalendar}
						icon="save"
						background="blue"
						type="button"
						onClick={form.submit}
					>
						Lưu
					</PrimaryButton>
				}
			>
				<Form form={form} layout="vertical" className="grid grid-cols-2 gap-x-4" onFinish={onSubmit}>
					<div className="hidden">
						<InputTextField name="Id" label="" />
					</div>

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
						className="col-span-2 w500:col-span-1"
						mode="single"
						showTime={'HH:mm'}
						picker="showTime"
						format="DD/MM/YYYY HH:mm"
						label="Giờ kết thúc"
						name="EndTime"
						onChange={getDataAvailable}
					/>

					<Form.Item className="col-span-2" name="TeacherId" label="Giáo viên">
						<Select onChange={() => setIsDisableButton(false)} placeholder="Chọn giáo viên">
							{teacher.map((item) => {
								return (
									<Select.Option disabled={!item.Fit} key={item.TeacherId} value={item.TeacherId}>
										<div className="flex items-center justify-between w-full">
											{item.TeacherName} - {item.TeacherCode}
											{!item.Fit && (
												<Tooltip placement="right" title={!!item.Note ? item.Note : `Giáo viên ${item.TeacherName} bị trùng lịch`}>
													<AiOutlineWarning className="text-tw-red" />
												</Tooltip>
											)}
										</div>
									</Select.Option>
								)
							})}
						</Select>
					</Form.Item>

					{!!dataChangeSchedule?.RoomId && (
						<Form.Item className="col-span-2" name="RoomId" label="Phòng học">
							<Select onChange={() => setIsDisableButton(false)} placeholder="Chọn phòng học">
								{room.map((item) => {
									return (
										<Select.Option disabled={!item.Fit} key={item.RoomId} value={item.RoomId}>
											<div className="flex items-center justify-between w-full">
												{item.RoomName}
												{!item.Fit && (
													<Tooltip placement="right" title={!!item.Note ? item.Note : `Phòng học ${item.RoomName} bị trùng lịch`}>
														<AiOutlineWarning className="text-tw-red" />
													</Tooltip>
												)}
											</div>
										</Select.Option>
									)
								})}
							</Select>
						</Form.Item>
					)}
					<InputMoneyField className="col-span-2" label="Lương / buổi" name="TeachingFee" placeholder="Nhập mức lương" isRequired />
					<TextBoxField className="col-span-2" name="Note" label="Ghi chú" />
				</Form>
			</Modal>
		</>
	)
}

export default ChangeScheduleClass
