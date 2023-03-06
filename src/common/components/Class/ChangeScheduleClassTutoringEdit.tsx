import { Carousel, DatePicker, Form, Modal, Popconfirm, Popover, Rate, Select, Spin, TimePicker, Tooltip } from 'antd'
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
import PrimaryTooltip from '../PrimaryTooltip'
import InputMoneyField from '~/common/components/FormControl/InputNumberField'
import ModalRemoveScheduleTutoringEdit from './ModalRemoveScheduleTutoringEdit'
import { GrFormNext, GrFormPrevious } from 'react-icons/gr'
import type { RangePickerProps } from 'antd/es/date-picker'
import { curriculumApi } from '~/api/curriculum'
import SelectField from '../FormControl/SelectField'

const ChangeScheduleClassTutoringEdit = (props) => {
	const { dataRow, checkTeacherAvailable, getListSchedule, checkRoomAvailable, loadingCheckTeacher } = props
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
	const user = useSelector((state: RootState) => state.user.information)
	const refPopover = useRef(null)

	useMemo(() => {
		if (!!showModal.open && showModal.id === dataRow.event.extendedProps.IdSchedule) {
			setIsModalOpen({ open: true, id: dataRow.event.extendedProps.IdSchedule })
			setIsDisableButton(true)
		}
	}, [showModal])

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
					StartTime: moment(data.StartTime).format(),
					EndTime: moment(data.EndTime).format(),
					Id: dataRow.event.extendedProps.IdSchedule,
					TeacherId: dataRow.event.extendedProps.TeacherId,
					TeachingFee: !data?.TeachingFee ? null : data.TeachingFee,
					Note: data?.Note,
					StatusTutoring: data?.StatusTutoring
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
			const checkExistTeacher = teacher.find((item) => item.TeacherId === dataRow.event.extendedProps.TeacherId)
			if (!!checkExistTeacher) {
				form.setFieldsValue({ TeacherId: dataRow.event.extendedProps.TeacherId })
			} else {
				setIsDisableButton(true)
			}
			form.setFieldsValue({ StartTime: moment(dataRow.event.start) })
			form.setFieldsValue({ EndTime: moment(dataRow.event.end) })
			form.setFieldsValue({ Id: dataRow.event.extendedProps.Id })
			form.setFieldsValue({ Note: dataRow.event.extendedProps.Note })
			form.setFieldsValue({ StatusTutoring: dataRow.event.extendedProps.StatusTutoring })
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
		switch (dataRow.event.extendedProps.StatusTutoring) {
			case 1:
				return '!bg-[#0a89ff]'
			case 2:
				return '!bg-[#C94A4F]'
			case 3:
				return '!bg-[#59b96c]'
			case 4:
				return '!bg-[#FFBA0A]'
			case 5:
				return '!bg-[#a2a2a2]'
			case 6:
				return '!bg-[#ff7c38]'
			case 7:
				return '!bg-[#000]'
		}
	}

	return (
		<>
			<div className="wrapper-schedule">
				<button className={`btn-edit-title ${getStatusColor()}`} onClick={() => !!isEditSchedule && handleOpen()}>
					<span>{moment(dataRow.event.start).format('HH:mm')}</span> <span className="mx-1">-</span>{' '}
					<span>{moment(dataRow.event.end).format('HH:mm')}</span>
				</button>

				<div className="wrapper-content-schedule">
					<p>
						<span className="title">GV:</span> {dataRow.event.extendedProps.TeacherName}
					</p>
					<p>
						<span className="title">Ghi chú:</span> <span className="whitespace-pre-line ml-1">{dataRow.event.extendedProps.Note}</span>
					</p>
				</div>
				{!!isEditSchedule ? (
					<div className="mt-2 flex flex-col gap-2">
						{dataRow?.event?.extendedProps?.StatusTutoring == 1 ||
						dataRow?.event?.extendedProps?.StatusTutoring == 3 ||
						dataRow?.event?.extendedProps?.StatusTutoring == 6 ||
						dataRow?.event?.extendedProps?.StatusTutoring == 7 ? (
							<>
								{user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7 ? (
									<>
										<PrimaryTooltip
											className="w-full px-[8px]"
											place="top"
											content="Chỉnh sửa"
											id={`edit-sc-${dataRow.event.extendedProps?.Id}`}
										>
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
									</>
								) : (
									''
								)}
							</>
						) : (
							''
						)}

						{user?.RoleId == 3 && (
							<ModalRemoveScheduleTutoringEdit
								IdSchedule={dataRow.event.extendedProps.IdSchedule}
								startTime={dataRow.event.extendedProps.StartTime}
								endTime={dataRow.event.extendedProps.EndTime}
								getListSchedule={getListSchedule}
								dataRow={dataRow}
							/>
						)}
					</div>
				) : null}
			</div>

			<Popover
				ref={refPopover}
				content={
					<>
						<div className="wrapper-schedule">
							<span className="title">Ca: </span> <span>{moment(dataRow.event.start).format('HH:mm')}</span> -{' '}
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
							{!!isEditSchedule ? (
								<div className="flex items-center justify-between gap-2 mt-2">
									{user?.RoleId == 3 && (
										<ModalRemoveScheduleTutoringEdit
											IdSchedule={dataRow.event.extendedProps.IdSchedule}
											startTime={dataRow.event.extendedProps.StartTime}
											endTime={dataRow.event.extendedProps.EndTime}
											getListSchedule={getListSchedule}
											refPopover={refPopover}
										/>
									)}

									{dataRow?.event?.extendedProps?.StatusTutoring == 1 ||
									dataRow?.event?.extendedProps?.StatusTutoring == 3 ||
									dataRow?.event?.extendedProps?.StatusTutoring == 6 ||
									dataRow?.event?.extendedProps?.StatusTutoring == 7 ? (
										<>
											{user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7 ? ( //admin,quanly,hocvu
												<>
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
												</>
											) : (
												''
											)}
										</>
									) : (
										''
									)}
								</div>
							) : null}
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
				<Form form={form} layout="vertical" onFinish={onSubmit}>
					<div className="antd-custom-wrap">
						<DatePickerField
							className="col-span-2 w500:col-span-1"
							mode="single"
							showTime={'HH:mm'}
							picker="showTime"
							format="DD/MM/YYYY HH:mm"
							label="Giờ bắt đầu"
							name="StartTime"
							disabled
						/>

						<DatePickerField
							mode="single"
							className="col-span-2 w500:col-span-1"
							showTime={'HH:mm'}
							picker="showTime"
							format="DD/MM/YYYY HH:mm"
							label="Giờ kết thúc"
							name="EndTime"
							disabled
						/>
						<Form.Item name="TeacherId" className="col-span-2" label="Giáo viên">
							<Select onChange={() => setIsDisableButton(false)} placeholder="Chọn giáo viên" disabled>
								{teacher.map((item) => {
									return (
										<Select.Option disabled={!item.Fit} key={item.TeacherId} value={item.TeacherId}>
											<div className="flex items-center justify-between w-full">{item.TeacherName}</div>
										</Select.Option>
									)
								})}
							</Select>
						</Form.Item>
						<InputMoneyField className="col-span-2" label="Lương / Buổi" name="TeachingFee" placeholder="Nhập mức lương" isRequired />
						<SelectField
							name="StatusTutoring"
							label="Trạng thái"
							optionList={[
								{ title: 'Mới đặt', value: 1 },
								{ title: 'Hủy', value: 2 },
								{ title: 'Đã học', value: 3 },
								{ title: 'Giáo viên vắng mặt', value: 4 },
								{ title: 'Sự cố kỹ thuật', value: 5 },
								{ title: 'Giáo viên vào trễ', value: 6 },
								{ title: 'Học viên vắng mặt', value: 7 }
							]}
						/>
						<TextBoxField className="col-span-2" name="Note" label="Ghi chú" />
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default ChangeScheduleClassTutoringEdit
