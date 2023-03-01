import { DatePicker, Form, Input, Modal } from 'antd'
import React, { FC, useState } from 'react'
import RestApi from '~/api/RestApi'
import { ShowNostis } from '~/common/utils'
import PrimaryTooltip from '../../PrimaryTooltip'
import { FaMoneyBill } from 'react-icons/fa'
import ModalFooter from '../../ModalFooter'
import { formNoneRequired, formRequired } from '~/common/libs/others/form'
import InputNumberField from '../../FormControl/InputNumberField'
import moment from 'moment'

interface IPayForm {
	isEdit?: boolean
	onRefresh?: Function
	defaultData?: any
	onOpen?: Function
}

const url = 'bill'

function removeCommas(str) {
	return str.replace(/,/g, '')
}

const PayForm: FC<IPayForm> = ({ isEdit, onRefresh, defaultData }) => {
	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)

	function toggle() {
		setVisible(!visible)
	}

	function openEdit() {
		setVisible(!visible)
	}

	function getTitle() {
		return 'Thanh toán'
	}

	function onFinish(params) {
		setLoading(true)

		const DATA_SUBMIT = {
			...params,
			Paid: removeCommas(params.Paid)
		}

		console.log('-- DATA_SUBMIT', DATA_SUBMIT)

		!isEdit && post(DATA_SUBMIT)
		isEdit && edit(DATA_SUBMIT)
	}

	async function post(params) {
		try {
			const response = await RestApi.post(url, params)
			if (response.status == 200) {
				ShowNostis.success('Thành công')
				!!onRefresh && onRefresh()
				setVisible(false)
				form.resetFields()
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	async function edit(params) {
		try {
			const response = await RestApi.post(url + '/payment', { ...params, Id: defaultData?.Id })
			if (response.status == 200) {
				ShowNostis.success('Thành công')
				!!onRefresh && onRefresh()
				setVisible(false)
				form.resetFields()
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	function submitForm() {
		form.submit()
	}

	return (
		<>
			{isEdit && (
				<PrimaryTooltip id={`pay-${defaultData?.Code}`} place="left" content="Thanh toán">
					<div onClick={openEdit} className="px-[4px] cursor-pointer text-[#1E88E5] active:text-[#186fbc]">
						<FaMoneyBill size={22} />
					</div>
				</PrimaryTooltip>
			)}

			<Modal
				width={500}
				title={getTitle()}
				open={visible}
				onCancel={toggle}
				footer={<ModalFooter loading={loading} onCancel={toggle} onOK={submitForm} />}
			>
				<Form
					form={form}
					className="grid grid-cols-2 gap-x-4"
					layout="vertical"
					initialValues={{ remember: true }}
					onFinish={onFinish}
					autoComplete="on"
				>
					<InputNumberField
						disabled={loading}
						onChange={(event) => form.setFieldValue('Paid', event.target.value)}
						label="Số tiền thanh toán"
						name="Paid"
						placeholder="Số tiền thanh toán"
						className="col-span-2"
					/>

					<Form.Item className="col-span-2" name="PaymentAppointmentDate" label="Ngày thanh toán tiếp theo" rules={formNoneRequired}>
						<DatePicker
							disabled={loading}
							placeholder="Chọn ngày"
							className="style-input"
							onChange={(e) => form.setFieldValue('PaymentAppointmentDate', e)}
						/>
					</Form.Item>

					<Form.Item className="col-span-2" label="Ghi chú" name="Note" rules={formNoneRequired}>
						<Input.TextArea disabled={loading} rows={5} placeholder="" />
					</Form.Item>
				</Form>
			</Modal>
		</>
	)
}

export default PayForm
