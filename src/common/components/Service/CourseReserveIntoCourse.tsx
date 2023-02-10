import { DatePicker, Form, Input, InputNumber, Modal, Select, Spin, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { Move } from 'react-feather'
import { useForm } from 'react-hook-form'
import { MdOutlineLogin, MdSave } from 'react-icons/md'
// import { courseApi } from '~/src/apiBase'
import { courseApi } from '~/api/course/course'
import { courseReserveApi } from '~/api/course-reserve'
import { courseStudentPriceApi } from '~/api/course-of-student-price'
// import { useWrap } from '~/src/context/wrap'
import { ShowNoti } from '~/common/utils'

const PaymentMethod = [
	{
		id: 1,
		Name: 'Tiền mặt'
	},
	{
		id: 2,
		Name: 'Chuyển khoản'
	},
	{
		id: 3,
		Name: 'Quẹt thẻ'
	}
]

const CourseReserveIntoCourse = React.memo((props: any) => {
	const { Option } = Select
	const { TextArea } = Input
	const [isModalVisible, setIsModalVisible] = useState(false)
	const { infoId, reloadData, infoDetail, currentPage } = props
	const [form] = Form.useForm()
	// const { showNoti } = useWrap()
	const [loading, setLoading] = useState(false)
	const { setValue } = useForm()
	const [isLoading, setIsLoading] = useState<any>({
		type: '',
		status: false
	})
	const [isLoadingCourseDetail, setIsLoadingCourseDetail] = useState(false)

	const [courseAfter, setCourseAfter] = useState<ICourse[]>()
	const [courseAfterId, setCourseAfterId] = useState()
	const [courseAfterDetail, setCourseAfterDetail] = useState<ICourseDetail>()

	const [requestMoney, setRequestMoney] = useState<any>('')
	const [courseStudentPrice, setCourseStudentPrice] = useState(null)

	const fetchDataPrice = () => {
		setIsLoading(true)
		;(async () => {
			try {
				const _courseStudentPrice = await courseStudentPriceApi.getDetail(infoDetail.CourseOfStudentPriceID)
				_courseStudentPrice.status == 200 && setCourseStudentPrice(_courseStudentPrice.data.data)
			} catch (err) {
				ShowNoti('error', err.message)
			} finally {
				setIsLoading(false)
			}
		})()
	}

	const fetchDataCourse = () => {
		setIsLoading(true)
		;(async () => {
			try {
				const _courseAfter = await courseApi.getAll({
					pageIndex: 1,
					pageSize: 99999
				})
				_courseAfter.status == 200 && setCourseAfter(_courseAfter.data.data)
			} catch (err) {
				ShowNoti('error', err.message)
			} finally {
				setIsLoading(false)
			}
		})()
	}

	function handleChangeCourseAfter(idCourseAfter: any) {
		setCourseAfterId(idCourseAfter)
	}

	const fetchDataCourseAfterDetail = () => {
		setIsLoadingCourseDetail(true)
		;(async () => {
			try {
				const _courseAfterDetail = await courseApi.getById(courseAfterId)
				_courseAfterDetail.status == 200 && setCourseAfterDetail(_courseAfterDetail.data.data)
			} catch (err) {
				ShowNoti('error', err.message)
			} finally {
				setIsLoadingCourseDetail(false)
			}
		})()
	}

	const onSubmit = async (data: any) => {
		setLoading(true)
		if (infoId) {
			try {
				let res = await courseReserveApi.reserveAddCourse({
					...data,
					UserInformationID: infoDetail.UserInformationID,
					CourseReserveID: infoDetail.ID,
					BranchID: infoDetail.BranchID
				})
				reloadData(currentPage)
				afterSubmit(res?.data.message)
			} catch (error) {
				ShowNoti('error', error.message)
				setLoading(false)
			}
		}
	}

	const afterSubmit = (mes) => {
		ShowNoti('success', mes)
		setLoading(false)
		setIsModalVisible(false)
	}

	useEffect(() => {
		if (isModalVisible) {
			fetchDataCourse()
			// fetchDataPrice()
		}
	}, [isModalVisible])

	useEffect(() => {
		if (isModalVisible == true) {
			fetchDataCourseAfterDetail()
		}
	}, [courseAfterId])

	useEffect(() => {
		if (isModalVisible == true) {
			const temp: any = courseAfterDetail?.Price - infoDetail?.ProgramPrice
			setRequestMoney(!!temp ? temp : 0)
		}
	}, [courseAfterDetail])

	return (
		<>
			<button
				className="btn btn-icon view"
				onClick={() => {
					setIsModalVisible(true)
				}}
			>
				<Tooltip title="Chuyển học viên vào lớp học">
					<MdOutlineLogin />
				</Tooltip>
			</button>

			{/* jsdhahsgdhahgsda dhádhjáhjd ádjagsduy duyaghsdgádg  */}
			<Modal title="Chuyển học viên vào lớp học" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<Spin spinning={isLoading}>
							<div className="row">
								<div className="col-12">
									<Form.Item label="Học viên">
										<Input disabled={true} className="style-input" readOnly={true} value={infoDetail.FullNameUnicode} />
									</Form.Item>
								</div>
							</div>

							<div className="row">
								<div className="col-12">
									<Form.Item label="Trung tâm">
										<Input disabled={true} className="style-input" readOnly={true} value={infoDetail.BranchName} />
									</Form.Item>
								</div>
							</div>

							<div className="row">
								<div className="col-12">
									<Form.Item label="Khóa học">
										<Input disabled={true} className="style-input" readOnly={true} value={infoDetail.ProgramName} />
									</Form.Item>
								</div>
							</div>

							{courseAfter != null && (
								<div className="row">
									<div className="col-12">
										<Form.Item name="CourseID" label="Lớp học chuyển đến">
											<Select style={{ width: '100%' }} className="style-input" onChange={handleChangeCourseAfter} placeholder="">
												{courseAfter?.map((item, index) => (
													<Option key={index} value={item.ID}>
														{item.CourseName}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>
								</div>
							)}

							<Spin spinning={isLoadingCourseDetail}>
								<div className="row">
									<div className="col-md-6 col-12">
										<Form.Item label="Giá lớp học">
											<Input
												disabled={true}
												className="style-input w-100"
												readOnly={true}
												value={courseAfterDetail != null ? Intl.NumberFormat('ja-JP').format(courseAfterDetail.Price) : ''}
											/>
										</Form.Item>
									</div>

									<div className="col-md-6 col-12">
										<Form.Item label="Số tiền trả thêm">
											<Input
												disabled={true}
												className="style-input w-100"
												readOnly={true}
												value={requestMoney != null ? Intl.NumberFormat('ja-JP').format(requestMoney) : ''}
											/>
										</Form.Item>
									</div>
								</div>
							</Spin>

							<Spin spinning={isLoadingCourseDetail}>
								<div className="row">
									<div className="col-md-12 col-12">
										<Form.Item label="Số tiền bảo lưu">
											<Input
												disabled={true}
												className="style-input w-100"
												readOnly={true}
												value={infoDetail.ProgramPrice != null ? Intl.NumberFormat('ja-JP').format(infoDetail.ProgramPrice) : ''}
											/>
										</Form.Item>
									</div>
								</div>
							</Spin>

							<div className="row">
								<div className="col-12 col-md-6">
									<Form.Item name="Paid" label="Thanh toán" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
										<InputNumber
											placeholder=""
											className="ant-input style-input w-100"
											formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
											parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
											onChange={(value) => setValue('Paid', value)}
										/>
									</Form.Item>
								</div>

								<div className="col-12 col-md-6">
									<Form.Item
										name="PaymentMethodsID"
										label="Hình thức thanh toán"
										rules={[
											{
												required: true,
												message: 'Vui lòng điền đủ thông tin!'
											}
										]}
									>
										<Select className="w-100 style-input" placeholder="">
											{PaymentMethod?.map((item, index) => (
												<Option key={index} value={item.id}>
													{item.Name}
												</Option>
											))}
										</Select>
									</Form.Item>
								</div>
							</div>

							<div className="row">
								<div className="col-12">
									<Form.Item name="PayDate" label="Ngày thu tiếp theo">
										<DatePicker placeholder="" className="style-input w-100" onChange={(e) => setValue('PayDate', e)} />
									</Form.Item>
								</div>
							</div>

							<div className="row">
								<div className="col-12">
									<Form.Item name="Note" label="Cam kết">
										<TextArea onChange={(e) => setValue('Commitment', e.target.value)} allowClear={true} />
									</Form.Item>
								</div>
							</div>
						</Spin>

						{/*  */}
						<div className="row mt-5">
							<div className="col-12 mt-3">
								<button type="submit" className="btn btn-primary w-100">
									<MdSave size={18} className="mr-2" />
									Lưu
									{loading == true && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
})

export default CourseReserveIntoCourse
