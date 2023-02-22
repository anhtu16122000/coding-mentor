import { Card, Form, Input, Modal, Select } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import RestApi from '~/api/RestApi'
import { ShowNostis } from '~/common/utils'
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

interface IRefund {
	isEdit?: boolean
	onRefresh?: Function
	item?: any
	onOpen?: Function
}

const url = 'Refund'

const RefundForm: FC<IRefund> = ({ isEdit, onRefresh, item }) => {
	const [form] = Form.useForm()

	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)
	const [methods, setMethods] = useState<any>([])
	const [branch, setBranch] = useState<IBranch[]>(null)

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
		}
	}, [visible])

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
			ClassRegistrationId: item?.Id,
			Price: removeCommas(params?.Price),
			Type: 3,
			StudentId: item?.StudentId
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
			const response = await RestApi.post(url, { ...params, Id: item?.Id })
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

	function viewStudentDetails(params) {
		const uri = '/info-course/student/detail'
		window.open(uri + `/?StudentID=${params?.StudentId}`, '_blank')
	}

	function viewClassDetails(params) {
		const uri = `/class/list-class/detail/?class=${params.ClassId}`
		window.open(uri, '_blank')
	}

	return (
		<>
			<PrimaryTooltip id={`class-refund-${item?.Id}`} place="left" content="Hoàn tiền">
				<ButtonRefund onClick={openEdit} className="ml-[16px]" />
			</PrimaryTooltip>

			<Modal
				width={500}
				title="Hoàn tiền"
				open={visible}
				onCancel={toggle}
				footer={<ModalFooter loading={loading} onCancel={toggle} onOK={submitForm} />}
			>
				<Card className="mb-[16px] card-min-padding">
					<div className="flex relative">
						<Avatar uri={item?.Avatar} className="w-[64px] h-[64px] rounded-full shadow-sm border-[1px] border-solid border-[#f4f4f4]" />
						<div className="flex-1 ml-[16px]">
							<div className="w-full in-1-line font-[600] text-[16px]">{item?.FullName}</div>
							<div className="w-full in-1-line font-[400] text-[14px]">
								<div className="font-[600] inline-flex">Mã:</div> {item?.UserCode}
							</div>
							<div className="w-full in-1-line font-[400] text-[14px]">
								<div className="font-[600] inline-flex">Số tiền đăng ký:</div> {parseToMoney(item?.Price)}
							</div>
						</div>

						<PrimaryTooltip
							className="top-[-4px] right-[-4px] absolute w-[28px] h-[18px]"
							id={`view-in-new-${item?.Id}`}
							place="right"
							content="Xem thông tin"
						>
							<div onClick={() => viewStudentDetails(item)} className="btn-open-in-new-tab text-[#1976D2]">
								<MdOpenInNew size={16} />
							</div>
						</PrimaryTooltip>
					</div>
				</Card>

				<Form
					form={form}
					className="grid grid-cols-2 gap-x-4"
					layout="vertical"
					initialValues={{ remember: true }}
					onFinish={onFinish}
					autoComplete="on"
				>
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

export default RefundForm
