import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Input, Modal, Spin, Tooltip } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { CreditCard } from 'react-feather'
import * as yup from 'yup'
import DatePickerField from '~/common/components/FormControl/DatePickerField'
import InputTextField from '~/common/components/FormControl/InputTextField'
import RadioField from '~/common/components/FormControl/RadioField'
import SelectField from '~/common/components/FormControl/SelectField'
import { parseToMoney } from '~/common/utils/common'
import TextBoxField from '~/common/components/FormControl/TextBoxField'
import NumberFormat from 'react-number-format'
import InputNumberField from '~/common/components/FormControl/InputNumberField'
import { MdAddCircleOutline, MdSave } from 'react-icons/md'

function CourseOfStudentPriceForm(props) {
	const [isModalVisible, setIsModalVisible] = useState(false)
	const { isPayTuition, isUpdate, isLoading, updateObj, paymentMethodOptionList, handleSubmit, optionBranchList } = props

	const [form] = Form.useForm()

	useEffect(() => {
		if (isUpdate && updateObj) {
			form.resetFields({
				...updateObj,
				PriceLeft: !updateObj.PriceLeft ? '' : parseToMoney(updateObj.PriceLeft),
				Paid: ''
			})
		}
	}, [updateObj])

	const checkHandleSubmit = (data) => {
		if (!handleSubmit) return

		const SUBMIT_DATA = {
			...data,
			Paid: parseInt(data.Paid.split(',').join('')),
			PriceLeft: parseInt(data.PriceLeft.split(',').join(''))
		}

		handleSubmit(SUBMIT_DATA).then((res) => {
			if (res) {
				setIsModalVisible(false)
				if (!isUpdate) {
					form.resetFields()
				}
			}
		})
	}

	return (
		<>
			{isPayTuition ? (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsModalVisible(true)
					}}
				>
					<Tooltip title="Thanh toán học phí">
						<CreditCard />
					</Tooltip>
				</button>
			) : (
				<button
					className="btn btn-warning add-new"
					onClick={() => {
						setIsModalVisible(true)
					}}
				>
					<MdAddCircleOutline size={18} className="mr-2" />
					Thêm mới
				</button>
			)}

			<Modal
				title={isPayTuition ? 'Thanh toán học phí' : 'Học viên nợ học phí'}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div>
					<Form layout="vertical" onFinish={checkHandleSubmit}>
						<div className="row">
							<div className="col-12 col-md-6">
								<InputTextField name="StudentName" label="Tên học viên" placeholder="Nhập tên học viên" disabled={true} />
							</div>
							<div className="col-12 col-md-6">
								<InputTextField name="PriceLeft" label="Số tiền còn lại" placeholder="Số tiền còn lại" disabled={true} />
							</div>
							<div className="col-12 col-md-6">
								<InputNumberField name="Paid" isRequired={false} label="Thanh toán" placeholder="Nhập số tiền thanh toán" />
							</div>
							<div className="col-12 col-md-6">
								<RadioField name="PaymentMethodsID" label="Phương thức thanh toán" radioList={paymentMethodOptionList} />
							</div>
							<div className="col-12 col-md-6">
								<SelectField
									name="PayBranchID"
									label="Trung tâm thanh toán"
									optionList={optionBranchList}
									placeholder="Chọn trung tâm thanh toán"
								/>
							</div>
							<div className="col-12 col-md-6">
								<DatePickerField mode="single" name="PayDate" label="Ngày thu tiếp theo" placeholder="Chọn ngày thu tiếp theo" />
							</div>
							<div className="col-12 mb-2">
								<TextBoxField name="Note" label="Ghi chú" placeholder="Thêm ghi chú" rows={4} />
							</div>
							<div className="col-12 mt-5">
								<button type="submit" className="btn btn-primary w-100" disabled={isLoading.type === 'ADD_DATA' && isLoading.status}>
									<MdSave size={18} className="mr-2" />
									Lưu
									{isLoading.type === 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	)
}

export default CourseOfStudentPriceForm
