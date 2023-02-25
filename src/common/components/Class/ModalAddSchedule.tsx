import { Form, Modal, Select, Tooltip } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { AiOutlineWarning } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { scheduleApi } from '~/api/schedule'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import { setListCalendar, setRoomEdit, setTeacherEdit } from '~/store/classReducer'
import DatePickerField from '../FormControl/DatePickerField'
import InputTextField from '../FormControl/InputTextField'
import SelectField from '../FormControl/SelectField'
import TextBoxField from '../FormControl/TextBoxField'
import PrimaryButton from '../Primary/Button'
import ModalFooter from '../ModalFooter'
import InputNumberField from '../FormControl/InputNumberField'
import { formRequired } from '~/common/libs/others/form'

const ModalAddSchedule = (props) => {
	const { checkTeacherAvailable, checkRoomAvailable, refPopoverWrapperBtn, className } = props
	const [openModalAdd, setOpenModalAdd] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [form] = Form.useForm()
	const router = useRouter()
	const teacher = useSelector((state: RootState) => state.class.teacher)
	const room = useSelector((state: RootState) => state.class.room)
	const listCalendar = useSelector((state: RootState) => state.class.listCalendar)
	const dataChangeSchedule = useSelector((state: RootState) => state.class.dataChangeSchedule)
	const dispatch = useDispatch()

	const getDataAvailable = async () => {
		if (!!form.getFieldValue('StartTime') && !!form.getFieldValue('EndTime')) {
			await checkTeacherAvailable({
				branchId: dataChangeSchedule.BranchId,
				curriculumId: dataChangeSchedule.CurriculumId,
				startTime: moment(form.getFieldValue('StartTime')).format(),
				endTime: moment(form.getFieldValue('EndTime')).format()
			})
			await checkRoomAvailable({
				branchId: dataChangeSchedule.BranchId,
				startTime: moment(form.getFieldValue('StartTime')).format(),
				endTime: moment(form.getFieldValue('EndTime')).format()
			})
		}
	}

	const onSubmit = async (data) => {
		if (moment(data.StartTime).format() < moment(data.EndTime).format()) {
			const checkExistSchedule = listCalendar.find((item) => {
				return (
					moment(item.StartTime).format() === moment(data.StartTime).format() ||
					moment(item.EndTime).format() === moment(data.EndTime).format() ||
					(moment(item.EndTime).format() > moment(data.StartTime).format() &&
						moment(item.EndTime).format() <= moment(data.EndTime).format()) ||
					(moment(item.StartTime).format() > moment(data.StartTime).format() &&
						moment(item.StartTime).format() < moment(data.EndTime).format())
				)
			})
			if (!checkExistSchedule) {
				setIsLoading(true)
				const getTeacher = teacher.find((item) => item.TeacherId === data.TeacherId)
				const getRoom = room.find((item) => item.RoomId === data.RoomId)
				let DATA_SUBMIT = {
					RoomId: !!data.RoomId ? data.RoomId : 0,
					RoomName: !!getRoom ? getRoom.RoomName : '',
					RoomCode: !!getRoom ? getRoom.RoomCode : null,
					StartTime: moment(data.StartTime).format(),
					EndTime: moment(data.EndTime).format(),
					TeacherId: data.TeacherId,
					TeacherName: !!getTeacher ? getTeacher.TeacherName : '',
					TeacherCode: !!getTeacher ? getTeacher.TeacherCode : null,
					Note: data.Note,
					title: `${moment(data.StartTime).format()} - ${moment(data.EndTime).format()}`,
					end: moment(data.EndTime).format(),
					start: moment(data.StartTime).format(),
					Id: listCalendar.length
				}
				dispatch(setListCalendar([...listCalendar, DATA_SUBMIT]))
				console.log('listCalendar: ', listCalendar)
				ShowNoti('success', 'Thêm buổi học thành công')
				form.resetFields()
				setOpenModalAdd(false)
				setIsLoading(false)
			} else {
				ShowNoti('error', 'Buổi học này đã bị trùng lịch')
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

	return (
		<>
			<PrimaryButton
				className={`flex ${className}`}
				onClick={() => {
					setOpenModalAdd(true)
					!!refPopoverWrapperBtn && refPopoverWrapperBtn.current.close()
				}}
				background="orange"
				type="button"
				icon="add"
			>
				Thêm lịch
			</PrimaryButton>
			<Modal
				title="Thêm buổi học"
				open={openModalAdd}
				onCancel={_cancel}
				footer={<ModalFooter loading={isLoading} onOK={form.submit} onCancel={_cancel} />}
			>
				<Form className="grid grid-cols-2 gap-x-4" form={form} layout="vertical" onFinish={onSubmit}>
					<DatePickerField
						className="col-span-1"
						mode="single"
						showTime={'HH:mm'}
						picker="showTime"
						format="DD/MM/YYYY HH:mm"
						label="Giờ bắt đầu"
						name="StartTime"
						onChange={getDataAvailable}
					/>
					<DatePickerField
						className="col-span-1"
						mode="single"
						showTime={'HH:mm'}
						picker="showTime"
						format="DD/MM/YYYY HH:mm"
						label="Giờ kết thúc"
						name="EndTime"
						onChange={getDataAvailable}
					/>

					<Form.Item className="col-span-2" name="TeacherId" label="Giáo viên" rules={formRequired}>
						<Select placeholder="Chọn giáo viên">
							{teacher.map((item) => {
								return (
									<Select.Option disabled={!item.Fit} key={item.TeacherId} value={item.TeacherId}>
										<div className="flex items-center justify-between w-full">
											{item.TeacherName} - {item.TeacherCode}
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

					{!!dataChangeSchedule && parseInt(dataChangeSchedule.Type?.toString()) == 1 ? (
						<Form.Item className="col-span-2" name="RoomId" label="Phòng học" rules={formRequired}>
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

					<InputNumberField className="col-span-2" label="Lương / buổi" name="TeachingFee" placeholder="Nhập mức lương" isRequired />

					<TextBoxField className="col-span-2" name="Note" label="Ghi chú" />
				</Form>
			</Modal>
		</>
	)
}

export default ModalAddSchedule
