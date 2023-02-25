import { Form, Modal, Select, Tooltip } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { AiOutlineWarning } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { scheduleApi } from '~/api/schedule'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import { setRoomEdit, setTeacherEdit } from '~/store/classReducer'
import DatePickerField from '../FormControl/DatePickerField'
import TextBoxField from '../FormControl/TextBoxField'
import PrimaryButton from '../Primary/Button'
import { classApi } from '~/api/class'
import ModalFooter from '../ModalFooter'
import { formRequired } from '~/common/libs/others/form'

const ModalAddScheduleEdit = (props) => {
	const { checkTeacherAvailable, checkRoomAvailable, getListSchedule, paramsSchedule } = props
	const [openModalAdd, setOpenModalAdd] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [form] = Form.useForm()
	const router = useRouter()
	const teacher = useSelector((state: RootState) => state.class.teacherEdit)
	const room = useSelector((state: RootState) => state.class.roomEdit)

	const { class: slug, BranchId, CurriculumId, Type } = router.query

	const infoClass = useSelector((state: RootState) => state.class.infoClass)

	console.log('--- infoClass: ', infoClass)

	const getDataAvailable = async () => {
		if (!!form.getFieldValue('StartTime') && !!form.getFieldValue('EndTime')) {
			await checkTeacherAvailable({
				branchId: BranchId || infoClass?.BranchId,
				curriculumId: CurriculumId || infoClass?.CurriculumId,
				startTime: moment(form.getFieldValue('StartTime')).format(),
				endTime: moment(form.getFieldValue('EndTime')).format()
			})

			await checkRoomAvailable({
				branchId: BranchId || infoClass?.BranchId,
				startTime: moment(form.getFieldValue('StartTime')).format(),
				endTime: moment(form.getFieldValue('EndTime')).format()
			})
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
				TeacherId: data.TeacherId,
				Note: data.Note
			}

			try {
				const res = await scheduleApi.add(DATA_SUBMIT)
				if (res.status === 200) {
					getListSchedule(paramsSchedule)
					setOpenModalAdd(false)
					form.resetFields()
					ShowNoti('success', res.data.message)
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

	return (
		<>
			<PrimaryButton onClick={() => setOpenModalAdd(true)} className="ml-3" background="green" type="button" icon="add">
				Thêm lịch
			</PrimaryButton>

			<Modal
				title="Thêm buổi học"
				open={openModalAdd}
				onCancel={_cancel}
				footer={<ModalFooter loading={isLoading} onOK={form.submit} onCancel={_cancel} />}
			>
				<Form form={form} layout="vertical" onFinish={onSubmit}>
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
									<Select.Option disabled={!item.Fit} key={item.TeacherId} value={item.TeacherId}>
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
				</Form>
			</Modal>
		</>
	)
}

export default ModalAddScheduleEdit
