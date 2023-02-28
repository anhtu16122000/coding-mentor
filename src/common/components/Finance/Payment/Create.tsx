import { Card, Form, Input, Modal, Select } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import RestApi from '~/api/RestApi'
import { ShowNostis, ShowNoti } from '~/common/utils'
import PrimaryTooltip from '../../PrimaryTooltip'
import ModalFooter from '../../ModalFooter'
import { formNoneRequired, formRequired } from '~/common/libs/others/form'
import { ButtonPending, ButtonRefund } from '../../TableButton'
import Avatar from '../../Avatar'
import { MdOpenInNew } from 'react-icons/md'
import moment from 'moment'
import { paymentMethodsApi } from '~/api/payment-method'
import { branchApi } from '~/api/branch'
import InputNumberField from '../../FormControl/InputNumberField'
import { removeCommas } from '~/common/utils/super-functions'
import { parseToMoney } from '~/common/utils/common'
import PrimaryButton from '../../Primary/Button'
import { userInformationApi } from '~/api/user'

interface IPaymentForm {
	isEdit?: boolean
	onRefresh?: Function
	item?: any
	onOpen?: Function
}

const url = 'Bill'

const PaymentForm: FC<IPaymentForm> = ({ isEdit, onRefresh, item }) => {
	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)
	const [methods, setMethods] = useState<any>([])
	const [branch, setBranch] = useState<IBranch[]>(null)

	const [students, setStudents] = useState<any>([])

	function toggle() {
		setVisible(!visible)
	}

	function openEdit() {
		setVisible(!visible)
	}

	useEffect(() => {
		if (visible) {
			getPaymentMethods()

			getBranchs()

			getAllStudent()
		}
	}, [visible])

	const getAllStudent = async () => {
		try {
			const ROLE_STUDENT = 3
			const res = await userInformationApi.getAll({ pageSize: 999999, pageIndex: 1, roleIds: ROLE_STUDENT })
			if (res.status == 200) {
				setStudents(res.data.data)
			}
			if (res.status == 204) {
				setStudents([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const [branchLoading, setBranchLoading] = useState(false)
	const getBranchs = async () => {
		if (!branch) {
			setBranchLoading(true)
			try {
				const response = await branchApi.getAll({
					pageIndex: 1,
					pageSize: 99999
				})
				response.status == 200 && setBranch(response.data.data)
			} catch (err) {
				ShowNostis.error(err?.message)
			} finally {
				form.setFieldValue('BranchId', item?.BranchId)
				setBranchLoading(false)
			}
		}
	}

	const [methodsLoading, setMethodsLoading] = useState(false)
	const getPaymentMethods = async () => {
		if (methods.length == 0) {
			setMethodsLoading(true)
			try {
				const res = await paymentMethodsApi.getAll()
				if (res.status == 200) {
					setMethods(res.data.data)
				}
				if (res.status == 204) {
					setMethods([])
				}
			} catch (err) {
				ShowNostis.error(err?.message)
			} finally {
				setMethodsLoading(false)
			}
		}
	}

	function onFinish(params) {
		setLoading(true)

		const DATA_SUBMIT = {
			...params,
			Price: removeCommas(params?.Price),
			Type: 4,
			details: []
		}

		console.log('-- DATA_SUBMIT', DATA_SUBMIT)

		!isEdit && post(DATA_SUBMIT)
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

	function submitForm() {
		form.submit()
	}

	return (
		<>
			<PrimaryButton onClick={toggle} background="green" icon="add" type="button">
				Thêm mới
			</PrimaryButton>

			<Modal
				width={500}
				title="Tạo phiên thanh toán"
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
					<Form.Item className="col-span-2" name="StudentId" label="Học viên" rules={formRequired}>
						<Select
							disabled={loading}
							className="style-input"
							showSearch
							optionFilterProp="children"
							allowClear={true}
							placeholder="Chọn học viên"
						>
							{students?.map((item, index) => (
								<Select.Option key={index} value={item.UserInformationId}>
									{item.FullName} - {item?.UserCode}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item className="col-span-2" name="BranchId" label="Trung tâm thanh toán" rules={formRequired}>
						<Select
							loading={branchLoading}
							disabled={loading}
							className="style-input"
							showSearch
							optionFilterProp="children"
							allowClear={true}
							placeholder="Chọn trung tâm"
						>
							{branch?.map((item, index) => (
								<Select.Option key={index} value={item.Id}>
									{item.Name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item className="col-span-1" name="PaymentMethodId" label="Phương thức thanh toán" rules={formRequired}>
						<Select loading={methodsLoading} disabled={loading} placeholder="Chọn phương thức" className="primary-input">
							{methods.map((thisMethod) => {
								return (
									<Select.Option key={thisMethod.Id} value={thisMethod.Id}>
										{thisMethod?.Name}
									</Select.Option>
								)
							})}
						</Select>
					</Form.Item>
					<InputNumberField
						disabled={loading}
						onChange={(event) => form.setFieldValue('Price', event.target.value)}
						label="Số tiền"
						name="Price"
						placeholder="Nhập số tiền"
						className="col-span-1"
					/>
					<Form.Item className="col-span-2" label="Ghi chú" name="Note" rules={formNoneRequired}>
						<Input.TextArea rows={5} placeholder="" disabled={loading} />
					</Form.Item>
				</Form>
			</Modal>
		</>
	)
}

export default PaymentForm
