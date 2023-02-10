import { Divider, Modal, Spin } from 'antd'
import moment from 'moment'
import 'moment/locale/vi'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { AiOutlineFieldTime } from 'react-icons/ai'
import { HiOutlineArrowRight } from 'react-icons/hi'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import { setDataChangeSchedule, setListCalendar, setPrevSchedule, setRoom, setShowModal, setTeacher } from '~/store/classReducer'
import PrimaryButton from '../Primary/Button'

const ModalReviewScheduleClass = (props) => {
	const { handleCreateClass, isLoading } = props
	const dataChangeSchedule = useSelector((state: RootState) => state.class.dataChangeSchedule)
	const listCalendar = useSelector((state: RootState) => state.class.listCalendar)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const router = useRouter()
	const dispatch = useDispatch()
	moment.locale('vi')
	const handleSubmit = async () => {
		const res = await handleCreateClass()
		if (!!res && res.status === 200) {
			setIsModalOpen(false)
			dispatch(setListCalendar([]))
			dispatch(setDataChangeSchedule({}))
			dispatch(setTeacher([]))
			dispatch(setShowModal({ open: false, id: null }))
			dispatch(setPrevSchedule({}))
			dispatch(setRoom([]))
			router.push('/class/list-class')
		}
	}
	return (
		<>
			{listCalendar.length > 0 && (
				<PrimaryButton onClick={() => setIsModalOpen(true)} className="ml-3" background="yellow" icon="save" type="button">
					Lưu
				</PrimaryButton>
			)}
			<Modal
				width={900}
				title="Thông tin lớp học"
				open={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				centered
				footer={
					<PrimaryButton background="blue" icon="save" type="button" onClick={handleSubmit} loading={isLoading} disable={isLoading}>
						Lưu
					</PrimaryButton>
				}
			>
				<div className="row h-[550px] overflow-y-scroll chau-custom-scrollbar">
					<div className="col-12 mb-3">
						<p className="font-medium">Tên lớp học:</p>
						<span>{dataChangeSchedule.Name}</span>
					</div>
					<div className="col-md-6 col-12 mb-3">
						<p className="font-medium">Trung tâm:</p>
						<span>{dataChangeSchedule.BranchName}</span>
					</div>
					<div className="col-md-6 col-12 mb-3">
						<p className="font-medium">Khóa học:</p>
						<span>{dataChangeSchedule.ProgramName}</span>
					</div>
					<div className="col-md-6 col-12 mb-3">
						<p className="font-medium">Giáo trình:</p>
						<span>{dataChangeSchedule.CurriculumName}</span>
					</div>
					<div className="col-md-6 col-12 mb-3">
						<p className="font-medium">Học vụ:</p>
						<span>{dataChangeSchedule.AcademicName}</span>
					</div>
					<div className="col-md-6 col-12 mb-3">
						<p className="font-medium">Giá lớp học:</p>
						<span>{dataChangeSchedule.Price}</span>
					</div>
					<div className="col-md-6 col-12 mb-3">
						<p className="font-medium">Lương/buổi:</p>
						<span>{dataChangeSchedule.TeachingFee}</span>
					</div>
					<div className="col-md-6 col-12 mb-3">
						<p className="font-medium">Số học viên tối đa:</p>
						<span>{dataChangeSchedule.MaxQuantity} học viên</span>
					</div>
					<div className="col-md-6 col-12 mb-3">
						<p className="font-medium">Ngày bắt đầu:</p>
						<span>{moment(dataChangeSchedule.StartDay).format('DD/MM/YYYY')}</span>
					</div>
					<Divider>Lịch học tổng quát</Divider>
					{listCalendar.map((calendar) => {
						return (
							<div className="col-md-6 col-12 mb-3">
								<p className="capitalize font-medium">
									{moment(calendar.StartTime).format('DD/MM/YYYY') < moment(calendar.EndTime).format('DD/MM/YYYY') ? (
										<div className="flex items-center">
											<AiOutlineFieldTime className="mr-1 text-tw-primary" />
											<span className="mr-1">
												{moment(calendar.StartTime).format('dddd')} - {moment(calendar.StartTime).format('DD/MM/YYYY')}
											</span>
											<HiOutlineArrowRight />
											<span className="ml-1">{moment(calendar.EndTime).format('DD/MM/YYYY')}</span>
										</div>
									) : (
										<div className="flex items-center">
											<AiOutlineFieldTime className="mr-1 text-tw-primary" />
											{moment(calendar.StartTime).format('dddd')} - {moment(calendar.StartTime).format('DD/MM/YYYY')}
										</div>
									)}
								</p>
								<div className="ml-6">
									<p>
										<span className="font-medium">Ca:</span> {moment(calendar.StartTime).format('HH:mm')} -{' '}
										{moment(calendar.EndTime).format('HH:mm')}
									</p>
									{!!calendar.RoomId && (
										<p>
											<span className="font-medium">Phòng:</span> {calendar.RoomName}
										</p>
									)}
									<p>
										<span className="font-medium">Giáo viên:</span> {calendar.TeacherName}
									</p>
								</div>
							</div>
						)
					})}
				</div>
			</Modal>
		</>
	)
}

export default ModalReviewScheduleClass
