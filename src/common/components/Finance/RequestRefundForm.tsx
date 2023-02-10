import { Checkbox, Form, Modal, Spin, Tooltip } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { DollarSign } from 'react-feather'
import { useForm } from 'react-hook-form'
import { MdSave } from 'react-icons/md'
import CheckboxField from '~/common/components/FormControl/CheckboxField'
import InputNumberField from '~/common/components/FormControl/InputNumberField'
import RadioField from '~/common/components/FormControl/RadioField'
import TextBoxField from '~/common/components/FormControl/TextBoxField'
import { parseToMoney } from '~/common/utils/common'
import { ShowNoti } from '~/common/utils'

function RequestRefundsForm(props) {
	const {
		isLoading,
		studentObj,
		getInfoCourse,
		dataRow,
		courseListOfStudent,
		paymentMethodOptionList,
		onSubmit,
		courseStudentID,
		reloadData,
		showCourse
	} = props

	const [isModalVisible, setIsModalVisible] = useState(false)
	const [courseIDList, setCourseIDList] = useState<number[]>([])
	const openModal = () => setIsModalVisible(true)
	const closeModal = () => setIsModalVisible(false)

	// const defaultValuesInit = {
	// 	ListCourseOfStudentID: [courseStudentID],
	// 	Price: '',
	// 	PaymentMethodsID: 1,
	// 	Reason: '',
	// 	isExpulsion: true
	// }

	// const form = useForm({
	// 	defaultValues: defaultValuesInit
	// })

	const [form] = Form.useForm()

	useEffect(() => {
		isModalVisible && studentObj?.ID && getInfoCourse && getInfoCourse(dataRow?.ID)
	}, [isModalVisible])

	const checkOnSubmit = (data) => {
		if (courseIDList.length > 0) {
			if (!onSubmit) return
			onSubmit({ ...data, ListCourseOfStudentID: courseIDList }).then((res) => {
				if (res?.status === 200) {
					form.resetFields()
					reloadData(1)
					closeModal()
				}
			})
		} else if (courseStudentID) {
			if (!onSubmit) return
			onSubmit({ ...data, ListCourseOfStudentID: [courseStudentID] }).then((res) => {
				if (res?.status === 200) {
					form.resetFields()
					reloadData(1)
					closeModal()
				}
			})
		} else {
			ShowNoti('error', 'Chọn tối thiểu ít nhất một khóa học')
		}
	}

	return (
		<>
			<Tooltip title="Yêu cầu hoàn tiền">
				<button className="btn btn-icon" onClick={openModal}>
					<DollarSign />
				</button>
			</Tooltip>
			<Modal title="Thông tin yêu cầu hoàn tiền" visible={isModalVisible} onCancel={closeModal} footer={null} width={600}>
				<div className="request-refund-form">
					<Form layout="vertical" onFinish={checkOnSubmit}>
						<div className="row">
							{showCourse == true && (
								<div className="ml-3 mb-3">
									{/* <Checkbox.Group
										{...form.register('ListCourseOfStudentID')}
										name="ListCourseOfStudentID"
										value={courseIDList}
										onChange={(arrID: number[]) => {
											form.setValue('ListCourseOfStudentID', arrID)
											setCourseIDList(arrID)
										}}
									>
										{courseListOfStudent.map((c: any) => {
											return (
												<>
													<div className="refund-branch-item" key={c.ID}>
														<Checkbox value={c.ID} />
														<div className="info">
															<p className="name">{c.CourseName}</p>
															<ul className="list">
																<li className="price">
																	Giá:
																	{c.Price && <span>{numberWithCommas(c.Price)} VNĐ</span>}
																</li>
																<li className="date-start">
																	Ngày bắt đầu:
																	{c.StartDay && <span>{moment(c.StartDay).format('DD/MM/YYYY')}</span>}
																</li>
																<li className="date-end">
																	Ngày kết thúc:
																	{c.EndDay && <span>{moment(c.EndDay).format('DD/MM/YYYY')}</span>}
																</li>
															</ul>
														</div>
													</div>
												</>
											)
										})}
									</Checkbox.Group> */}
									<CheckboxField name="ListCourseOfStudentID" />
								</div>
							)}
							<div className="col-12">
								{/* <InputTextField
									form={form}
									name="Price"
									label="Số tiền hoàn"
									placeholder="Nhập số tiền hoàn"
									handleFormatCurrency={numberWithCommas}
								/> */}
								{/* <PriceField form={form} name="Price" isRequired={false} label="Số tiền hoàn" placeholder="Nhập số tiền thanh toán" /> */}
								<InputNumberField name="Price" isRequired={false} label="Số tiền hoàn" placeholder="Nhập số tiền thanh toán" />
							</div>
							<div className="col-12">
								{/* <RadioField form={form} name="PaymentMethodsID" label="Phương thức hoàn tiền" radioList={paymentMethodOptionList} /> */}
								<RadioField name="PaymentMethodsID" label="Phương thức hoàn tiền" radioList={paymentMethodOptionList} />
							</div>
							<div className="col-12 mb-5">
								<TextBoxField name="Reason" label="Lý do" placeholder="Nhập lý do" rows={5} />
							</div>
							{showCourse == true && (
								<div className="col-12 mt-2">
									<CheckboxField name="isExpulsion" text="Xóa học viên ra khỏi lớp" />
								</div>
							)}
							<div className="col-12">
								<button type="submit" className="btn btn-primary w-100" disabled={isLoading.type == 'ADD_DATA' && isLoading.status}>
									<MdSave size={18} className="mr-2" />
									Xác nhận
									{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}

export default RequestRefundsForm
