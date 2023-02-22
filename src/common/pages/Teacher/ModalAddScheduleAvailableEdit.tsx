import { Form, Modal, Select, Tooltip } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { AiOutlineWarning } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { scheduleAvailableApi } from '~/api/schedule-available'
import { userInformationApi } from '~/api/user'
import DatePickerField from '~/common/components/FormControl/DatePickerField'
import SelectField from '~/common/components/FormControl/SelectField'
import TextBoxField from '~/common/components/FormControl/TextBoxField'
import PrimaryButton from '~/common/components/Primary/Button'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import { setRoomEdit, setTeacherEdit } from '~/store/classReducer'

const ModalAddScheduleAvailableEdit = (props) => {
	const { getListSchedule, paramsSchedule } = props
	const [openModalAdd, setOpenModalAdd] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [form] = Form.useForm()
	const user = useSelector((state: RootState) => state.user.information)
	const [teachers, setTeacher] = useState<{ title: string; value: string }[]>([])
	const getTeacher = async () => {
		try {
			const res = await userInformationApi.getByRole(2)
			if (res.status === 200) {
				let temp = []
				res?.data?.data?.forEach((item) => {
					temp.push({ title: `${item?.FullName} - ${item?.UserCode}`, value: item?.UserInformationId })
				})
				setTeacher(temp)
			}
			if (res.status === 204) {
				setTeacher([])
			}
		} catch (error) {
			console.error(error)
		}
	}
	const onSubmit = async (data) => {
		if (moment(data.StartTime).format() < moment(data.EndTime).format()) {
			setIsLoading(true)
			data.TeacherId = user?.RoleId == 2 ? Number(user?.UserInformationId) : data.TeacherId
			try {
				const dataSubmit = {
					...data,
					StartTime: moment(data.StartTime).format(),
					EndTime: moment(data.EndTime).format()
				}
				const res = await scheduleAvailableApi.add(dataSubmit)
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

	useEffect(() => {
		if (user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7) {
			getTeacher()
		}
	}, [])

	return (
		<>
			<PrimaryButton onClick={() => setOpenModalAdd(true)} className="ml-3" background="green" type="button" icon="add">
				Thêm lịch
			</PrimaryButton>
			<Modal
				title="Thêm lịch trống"
				open={openModalAdd}
				onCancel={() => {
					form.resetFields()
					setTeacherEdit([])
					setRoomEdit([])
					setOpenModalAdd(false)
				}}
				footer={
					<>
						<PrimaryButton disable={isLoading} loading={isLoading} background="blue" icon="save" type="button" onClick={form.submit}>
							Lưu
						</PrimaryButton>
					</>
				}
			>
				<Form form={form} layout="vertical" onFinish={onSubmit}>
					{user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 7 ? (
						<SelectField
							isRequired
							rules={[{ required: true, message: 'Bạn không được để trống' }]}
							name="TeacherId"
							label="Giáo viên"
							placeholder="Chọn giáo viên"
							optionList={teachers}
						/>
					) : (
						''
					)}
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

export default ModalAddScheduleAvailableEdit
