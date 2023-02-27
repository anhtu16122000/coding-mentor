import { Carousel, DatePicker, Form, Modal, Pagination, Popconfirm, Rate, Select, Spin, TimePicker, Tooltip } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { curriculumApi } from '~/api/curriculum'
import { scheduleApi } from '~/api/schedule'
import { ShowNoti, _check } from '~/common/utils'
import { RootState } from '~/store'
import { setRoomEdit, setTeacherEdit } from '~/store/classReducer'
import TextBoxField from '../FormControl/TextBoxField'
import PrimaryButton from '../Primary/Button'
import type { RangePickerProps } from 'antd/es/date-picker'
import { GrFormNext, GrFormPrevious } from 'react-icons/gr'
import { AiOutlineWarning } from 'react-icons/ai'
import { setTeacher } from '~/store/classReducer'
import 'moment/locale/vi'
moment.locale('vi')

const initParameters = { branchId: null, curriculumId: null, startTime: null, endTime: null, pageIndex: 1, pageSize: 8 }
const ModalAddScheduleToturingEdit = (props) => {
	const { checkTeacherAvailable, getListSchedule, paramsSchedule, loadingCheckTeacher, teacherData, setTeacherData, totalPage } = props
	const [openModalAdd, setOpenModalAdd] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [form] = Form.useForm()
	const [time, setTime] = useState(null)
	const [addClass, setAddClass] = useState(null)
	const router = useRouter()
	const [dateChoose, setDateChoose] = useState(null)
	const [dates, setDates] = useState([])
	const teacher = useSelector((state: RootState) => state.class.teacherEdit)
	const { class: slug, BranchId, CurriculumId, Type } = router.query
	const carouselRef = useRef(null)
	const [startTime, setStartTime] = useState(null)
	const [monthChange, setMonthChange] = useState(null)
	const [teacherId, setTeacherId] = useState(null)
	const dispatch = useDispatch()
	const [current, setCurrent] = useState(1)
	const [apiParameters, setApiParameters] = useState(initParameters)
	const disabledDate: RangePickerProps['disabledDate'] = (current) => {
		// Can not select days before today and today
		return current && current < moment().endOf('day')
	}

	const onSubmit = async (data) => {
		if (moment(startTime).format() < moment(data.EndTime).format()) {
			setIsLoading(true)
			let DATA_SUBMIT = {
				ClassId: parseInt(slug.toString()),
				RoomId: data.RoomId,
				StartTime: moment(startTime).format(),
				EndTime: moment(data.EndTime).format(),
				TeacherId: teacherId,
				Note: data.Note
			}
			try {
				const res = await scheduleApi.add(DATA_SUBMIT)
				if (res.status === 200) {
					getListSchedule(paramsSchedule)
					setOpenModalAdd(false)
					form.resetFields()
					ShowNoti('success', res.data.message)
					setTeacherId(null)
					setAddClass(null)
					setDateChoose(null)
					setStartTime(null)
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

	const getCurriculumTime = async () => {
		try {
			const res = await curriculumApi.getDetails(CurriculumId)
			if (res.status === 200) {
				setTime(res?.data?.data?.Time)
			}
		} catch (error) {}
	}

	useEffect(() => {
		if (CurriculumId) {
			getCurriculumTime()
		}
	}, [CurriculumId])

	const getAllDaysInMonth = (month, year) =>
		Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => new Date(year, month - 1, i + 1))

	const handleChangeMonth = (val) => {
		setMonthChange(val)
		const month = Number(moment(val).format('MM'))
		const year = Number(moment(val).format('YYYY'))
		const data = getAllDaysInMonth(month, year).filter((item) => moment(item) > moment().subtract(1, 'day'))

		setDates(data)
	}

	const handleChooseDate = async (item, index) => {
		setDateChoose(item)
		// carouselRef.current?.goTo(index)
		setAddClass(null)
		if (teacherId) {
			setTeacherId(null)
		}
		if (!!form.getFieldValue('StartTime') && time) {
			let datetime = moment(moment(item).format('YYYY-MM-DD') + ' ' + moment(form.getFieldValue('StartTime')).format('HH:mm:ss'))
			setStartTime(moment(datetime))
		}
	}

	const onChangeStartTime = (val) => {
		let datetime = moment(moment(dateChoose).format('YYYY-MM-DD') + ' ' + moment(val).format('HH:mm:ss'))
		setStartTime(moment(datetime))
		setTeacherId(null)
	}

	const config = {
		slidesToScroll: 1,
		slidesToShow: dates.length >= 5 ? 5 : dates.length,
		arrows: true,
		dots: false,
		infinite: true,
		cssEase: 'linear',
		speed: 500,
		waitForAnimate: false,
		accessibility: false,
		nextArrow: <GrFormNext />,
		prevArrow: <GrFormPrevious />
	}

	const handleChooseTeacher = (item) => {
		if (item?.Fit) {
			setTeacherId(item?.TeacherId)
		} else {
			setTeacherId(null)
			ShowNoti('warning', item?.Note)
		}
	}

	useEffect(() => {
		const month = Number(moment().format('MM'))
		const year = Number(moment().format('YYYY'))
		const data = getAllDaysInMonth(month, year).filter((item) => moment(item) > moment().subtract(1, 'day'))
		setMonthChange(moment())
		setDates(data)
	}, [])

	useEffect(() => {
		if (startTime) {
			form.setFieldValue('EndTime', moment(startTime).add(time, 'minutes'))
			setApiParameters({
				...apiParameters,
				branchId: BranchId,
				curriculumId: CurriculumId,
				startTime: moment(startTime).format(),
				endTime: moment(form.getFieldValue('EndTime')).format()
			})
		}
	}, [startTime])

	useEffect(() => {
		if (apiParameters && apiParameters.curriculumId) {
			checkTeacherAvailable(apiParameters)
		}
	}, [apiParameters])

	const onClose = () => {
		setTeacherEdit([])
		setRoomEdit([])
		setOpenModalAdd(false)
		setIsLoading(false)
	}
	const getPagination = (pageNumber: number) => {
		setCurrent(pageNumber)
		setApiParameters({
			...apiParameters,
			// ...listFieldSearch,
			pageIndex: pageNumber
		})
	}
	return (
		<>
			<PrimaryButton onClick={() => setOpenModalAdd(true)} className="ml-3" background="green" type="button" icon="add">
				Đặt lịch
			</PrimaryButton>
			<Modal
				title="Thêm buổi học"
				open={openModalAdd}
				onCancel={() => {
					onClose()
				}}
				footer={
					<>
						<PrimaryButton disable={isLoading} loading={isLoading} background="blue" icon="save" type="button" onClick={form.submit}>
							Lưu
						</PrimaryButton>
					</>
				}
				width={1200}
			>
				<Form form={form} layout="vertical" onFinish={onSubmit}>
					<div className="antd-custom-wrap">
						<div className="flex justify-between mb-tw-4">
							<div className="text ">
								<div className="ant-form-item-label">
									<label>Chọn ngày:</label>
								</div>
							</div>
							<div className="select-times">
								<PrimaryButton
									type="button"
									background="blue"
									children="Hôm nay"
									className="mr-2"
									onClick={() => {
										handleChangeMonth(moment())
										setMonthChange(moment())
										handleChooseDate(moment(), 0)
										setAddClass(moment())
									}}
								/>
								<DatePicker
									format={'MM/YYYY'}
									picker="month"
									onChange={handleChangeMonth}
									disabledDate={disabledDate}
									value={moment(monthChange)}
								/>
							</div>
						</div>
						<div className="custom-carousel">
							<Carousel {...config} ref={dates.length > 4 ? carouselRef : null}>
								{dates?.length > 0 &&
									dates?.map((item, index) => (
										<div
											className={`box ${
												dateChoose === item || moment(item).format('DD/MM/YYYY') === moment(addClass).format('DD/MM/YYYY')
													? 'active'
													: moment(item).format('DD/MM/YYYY') === moment().format('DD/MM/YYYY')
													? 'today'
													: ''
											}`}
											onClick={() => {
												handleChooseDate(item, index)
											}}
										>
											<div className="inner">
												<div className="month">{moment(item).format('MMMM')}</div>
												<div className="day">{moment(item).format('DD')}</div>
												<div className="value">{moment(item).format('dddd')}</div>
											</div>
										</div>
									))}
							</Carousel>
						</div>
						<div className="grid grid-cols-2 gap-x-4 antd-custom-wrap mt-tw-4">
							<div className="col span-1">
								<Form.Item name={'StartTime'} label="Giờ bắt đầu">
									<TimePicker value={startTime} onChange={onChangeStartTime} format="HH:mm" disabled={dateChoose ? false : true} />
								</Form.Item>
							</div>
							<div className="col span-1">
								<Form.Item name={'EndTime'} label="Giờ kết thúc">
									<TimePicker disabled placeholder="" format="HH:mm" />
								</Form.Item>
							</div>
						</div>

						<div className="mb-tw-4">
							<div className="ant-form-item-label flex items-center justify-between">
								<label>Giáo viên: </label>
								<div className="custom-pagination">
									<Pagination
										simple
										current={current}
										onChange={(pageNumber) => getPagination(pageNumber)}
										total={totalPage}
										pageSize={8}
									/>
								</div>
							</div>

							<Spin spinning={loadingCheckTeacher}>
								<div className="custom-listTeacher mt-tw-4">
									{startTime &&
										teacherData?.length > 0 &&
										teacherData?.map((item, index) => (
											<div className={`item ${teacherId === item?.TeacherId ? 'active' : !item?.Fit ? 'disabled' : ''}`}>
												<Popconfirm
													title={`Bạn có chắc chọn giáo viên ${item?.TeacherName}?`}
													okText="Ok"
													cancelText="No"
													onConfirm={() => handleChooseTeacher(item)}
												>
													<div className="inner-item">
														<div className="avatar">
															<img src={_check.checkURL(item?.Avatar) ? item?.Avatar : '/images/default-avatar.svg'} alt="" />
														</div>
														<div className="rating">
															<Rate disabled defaultValue={item?.Rate} value={item?.Rate} />
															<div className="value">{item?.Rate}</div>
														</div>
														<div className="name">
															{item?.TeacherName}
															{!item.Fit ? (
																<Tooltip placement="right" title={item.Note}>
																	<AiOutlineWarning className="text-tw-red ml-2" />
																</Tooltip>
															) : null}
														</div>
														<div className="create">{item?.TeacherCode}</div>
														<div className="note">{item?.Extension}</div>
													</div>
												</Popconfirm>
											</div>
										))}
								</div>
							</Spin>
						</div>

						<TextBoxField name="Note" label="Ghi chú" />
					</div>
				</Form>
			</Modal>
		</>
	)
}

export default ModalAddScheduleToturingEdit
