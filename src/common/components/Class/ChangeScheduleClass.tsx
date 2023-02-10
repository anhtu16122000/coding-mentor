import { Form, Modal, Popover, Select, Spin, Tooltip } from 'antd'
import moment from 'moment'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AiOutlineCalendar, AiOutlineWarning } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { roomApi } from '~/api/room'
import { ShowNoti } from '~/common/utils'
import { parseSelectArray } from '~/common/utils/common'
import { RootState } from '~/store'
import { setListCalendar, setLoadingCalendar, setRoom, setShowModal, setTeacher } from '~/store/classReducer'
import DatePickerField from '../FormControl/DatePickerField'
import InputTextField from '../FormControl/InputTextField'
import SelectField from '../FormControl/SelectField'
import TextBoxField from '../FormControl/TextBoxField'
import PrimaryButton from '../Primary/Button'
import ModalRemoveSchedule from './ModalRemoveSchedule'

const ChangeScheduleClass = (props) => {
	const { dataRow, checkTeacherAvailable, handleChangeInfo, checkRoomAvailable } = props
	// const [isLoading, setIsLoading] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState({ open: false, id: null })
	const [isDisableButton, setIsDisableButton] = useState(false)
	const [form] = Form.useForm()
	const dispatch = useDispatch()
	const dataChangeSchedule = useSelector((state: RootState) => state.class.dataChangeSchedule)
	const listCalendar = useSelector((state: RootState) => state.class.listCalendar)
	const teacher = useSelector((state: RootState) => state.class.teacher)
	const showModal = useSelector((state: RootState) => state.class.showModal)
	const prevSchedule = useSelector((state: RootState) => state.class.prevSchedule)
	const loadingCalendar = useSelector((state: RootState) => state.class.loadingCalendar)
	const room = useSelector((state: RootState) => state.class.room)
	const refPopover = useRef(null)

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
				<div className="mt-2 flex flex-col gap-2">
					<PrimaryButton
						onClick={() => {
							handleOpen(), refPopover.current.close()
						}}
						type="button"
						background="yellow"
						icon="edit"
						className="btn-edit"
					>
						Chỉnh sửa
					</PrimaryButton>
					<ModalRemoveSchedule dataRow={dataRow} />
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
						<div className="flex items-center justify-between gap-2 mt-2">
							<PrimaryButton
								onClick={() => {
									handleOpen(), refPopover.current.close()
								}}
								type="button"
								background="yellow"
								icon="edit"
							>
								Chỉnh sửa
							</PrimaryButton>
							<ModalRemoveSchedule dataRow={dataRow} />
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
				title={`Ca ${moment(dataRow.event.extendedProps.StartTime).format('HH:mm')} - ${moment(dataRow.event.extendedProps.EndTime).format(
					'HH:mm'
				)} - Ngày ${moment(dataRow.event.extendedProps.StartTime).format('DD/MM')}`}
				open={!!isModalOpen.open && isModalOpen.id !== null}
				onCancel={() => {
					// if (!!isDisableButton) {
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
					// }
					setIsModalOpen({ open: false, id: null })
					dispatch(setShowModal({ open: false, id: null }))
				}}
				footer={
					<PrimaryButton
						disable={isDisableButton || loadingCalendar}
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
				<Form form={form} layout="vertical" onFinish={onSubmit}>
					<div className="hidden">
						<InputTextField name="Id" label="" />
					</div>
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
					<Form.Item name="TeacherId" label="Giáo viên">
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
					{!!dataChangeSchedule.RoomId ? (
						<Form.Item name="RoomId" label="Phòng học">
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
					) : null}
					<TextBoxField name="Note" label="Ghi chú" />
				</Form>
			</Modal>
		</>
	)
}

export default ChangeScheduleClass
