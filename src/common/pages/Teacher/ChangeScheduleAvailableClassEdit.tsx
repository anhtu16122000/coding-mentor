import { Collapse, Form, Modal, Popover, Select, Tooltip } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AiOutlineCalendar, AiOutlineWarning } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { scheduleAvailableApi } from '~/api/schedule-available'
import ModalRemoveScheduleEdit from '~/common/components/Class/ModalRemoveScheduleEdit'
import DatePickerField from '~/common/components/FormControl/DatePickerField'
import TextBoxField from '~/common/components/FormControl/TextBoxField'
import PrimaryButton from '~/common/components/Primary/Button'
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
import ModalRemoveScheduleAvailableEdit from './ModalRemoveScheduleAvailableEdit'

const ChangeScheduleAvailableClassEdit = (props) => {
	const { dataRow, getListSchedule } = props
	const [isModalOpen, setIsModalOpen] = useState({ open: false, id: null })
	const [form] = Form.useForm()
	const dispatch = useDispatch()
	const router = useRouter()
	// const { BranchId, CurriculumId, Type } = router.query
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
					...data,
					StartTime: moment(data.StartTime).format(),
					EndTime: moment(data.EndTime).format(),
					Id: dataRow.event.extendedProps.IdSchedule
				}
				try {
					const res = await scheduleAvailableApi.update(DATA_SUBMIT)
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
			form.setFieldsValue({ StartTime: moment(dataRow.event.start) })
			form.setFieldsValue({ EndTime: moment(dataRow.event.end) })
			form.setFieldsValue({ Id: dataRow.event.extendedProps.Id })
			form.setFieldsValue({ Note: dataRow.event.extendedProps.Note })
		}
	}, [isModalOpen])

	const handleOpen = async () => {
		setIsModalOpen({ open: true, id: dataRow.event.extendedProps.IdSchedule })
	}

	return (
		<>
			<div className="wrapper-schedule wrapper-schedule-calender">
				<Collapse defaultActiveKey={'1'} bordered={false} className="!border-2 !border-solid !border-[#fb862d] rounded">
					<Collapse.Panel
						key={'1'}
						header={
							<button
								className={` !text-[#fff] font-semibold  w-full p-[6px] flex justify-start items-center gap-2`}
								onClick={() => {
									!!isEditSchedule ? handleOpen() : null
								}}
							>
								<span className="!rounded px-1 py-[2px]  !text-[12px] !bg-[#fb862d] !text-[#FFF]">
									{moment(dataRow.event.start).format('HH:mm')}
								</span>{' '}
								<span className="!rounded px-1 py-[2px]  !text-[12px] !bg-[#fb862d] !text-[#FFF]">
									{moment(dataRow.event.end).format('HH:mm')}
								</span>
							</button>
						}
					>
						<div className="wrapper-content-schedule !p-0">
							<p>
								<span className="title">GV:</span> {dataRow.event.extendedProps.TeacherName}
							</p>
							<p>
								<span className="title">Ghi chú:</span> <span className="whitespace-pre-line ml-1">{dataRow.event.extendedProps.Note}</span>
							</p>
						</div>
					</Collapse.Panel>
				</Collapse>

				{!!isEditSchedule ? (
					<div className="mt-2 flex justify-center ">
						<div className="flex flex-col gap-2">
							<PrimaryButton
								background="yellow"
								type="button"
								icon="edit"
								className="btn-edit"
								onClick={() => {
									!!isEditSchedule ? handleOpen() : null
									refPopover.current.close()
								}}
							>
								Chỉnh sửa
							</PrimaryButton>
							<ModalRemoveScheduleAvailableEdit
								IdSchedule={dataRow.event.extendedProps.IdSchedule}
								startTime={dataRow.event.extendedProps.StartTime}
								endTime={dataRow.event.extendedProps.EndTime}
								getListSchedule={getListSchedule}
							/>
						</div>
					</div>
				) : null}
			</div>
			<Popover
				ref={refPopover}
				content={
					<>
						<div className="wrapper-schedule text-[12px]">
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
								<p>
									<span className="title">Ghi chú:</span>
									<span className="whitespace-pre-line ml-1">{dataRow.event.extendedProps.Note}</span>
								</p>
							</div>
							{!!isEditSchedule ? (
								<div className="flex items-center justify-between gap-2 mt-2">
									<ModalRemoveScheduleAvailableEdit
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
					<button className="btn-edit-title border-2 border-solid !border-[#fb862d] !bg-[#FFF] !flex gap-2 ">
						<span className="!rounded px-1 py-[2px] !text-[12px] !bg-[#fb862d] !text-[#FFF]">
							{moment(dataRow.event.start).format('HH:mm')}
						</span>{' '}
						<span className="!rounded px-1 py-[2px] !text-[12px] !bg-[#fb862d] !text-[#FFF]">
							{moment(dataRow.event.end).format('HH:mm')}
						</span>
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
					dispatch(setListCalendarEdit(newListCalendar))
					// }
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
					<DatePickerField
						mode="single"
						showTime={'HH:mm'}
						picker="showTime"
						format="DD/MM/YYYY HH:mm"
						label="Giờ bắt đầu"
						name="StartTime"
					/>
					<DatePickerField
						mode="single"
						showTime={'HH:mm'}
						picker="showTime"
						format="DD/MM/YYYY HH:mm"
						label="Giờ kết thúc"
						name="EndTime"
					/>
					<TextBoxField name="Note" label="Ghi chú" />
				</Form>
			</Modal>
		</>
	)
}

export default ChangeScheduleAvailableClassEdit
