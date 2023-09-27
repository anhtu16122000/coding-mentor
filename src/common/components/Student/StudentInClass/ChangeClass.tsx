import { Card, Form, Input, Modal, Select, DatePicker } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import RestApi from '~/api/RestApi'
import { ShowNostis, ShowNoti } from '~/common/utils'
import PrimaryTooltip from '../../PrimaryTooltip'
import ModalFooter from '../../ModalFooter'
import { formNoneRequired, formRequired } from '~/common/libs/others/form'
import { ButtonChange } from '../../TableButton'
import Avatar from '../../Avatar'
import { MdOpenInNew } from 'react-icons/md'
import { parseToMoney } from '~/common/utils/common'
import { paymentMethodsApi } from '~/api/business/payment-method'
import ModalShowInfoPaymentMethod from '../../Class/ModalShowInfoPaymentMethod'
import {
	StyleContainerDropdown,
	StylePaymentMethods,
	StylePaymentMethodsAvatar,
	StylePaymentMethodsItems,
	StylePaymentMethodsLable
} from './index.styled'
import { branchApi } from '~/api/manage/branch'
import InputNumberField from '../../FormControl/InputNumberField'

interface IChangeClass {
	isEdit?: boolean
	onRefresh?: Function
	item?: any
	onOpen?: Function
}

const url = 'ClassChange'

const ChangeClass: FC<IChangeClass> = ({ isEdit, onRefresh, item }) => {
	const [form] = Form.useForm()
	const [methods, setMethods] = useState<any>([])
	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)
	const [classes, setClasses] = useState<any>([])
	const [branch, setBranch] = useState<any>([])
	const [currentClass, setCurrentClass] = useState<any>()
	const [activeMethod, setActiveMethod] = useState<IPaymentMethod>()

	useEffect(() => {
		if (visible) {
			getClass()
			getCurrentClass()
			getPaymentMethods()
			getBranchs()

			form.setFieldValue('BranchId', item?.BranchId)
		}
	}, [visible])

	const getBranchs = async () => {
		try {
			const res = await branchApi.getAll()
			if (res.status == 200) {
				setBranch(res.data.data)
			}
			if (res.status == 204) {
				setBranch([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getPaymentMethods = async () => {
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
		}
	}

	const getCurrentClass = async () => {
		try {
			const response = await RestApi.get('Class/old-class', {
				studentInClassId: item?.Id
			})
			if (response.status == 200) {
				setCurrentClass(response.data.data)
			} else {
				setCurrentClass(null)
			}
		} catch (err) {
			ShowNostis.error(err?.message)
		} finally {
			setLoading(false)
		}
	}

	async function getClass() {
		try {
			const response = await RestApi.get(`Bill/class-available`, {
				branchId: item?.BranchId,
				studentId: item?.StudentId
			})

			if (response.status == 200) {
				setClasses(response.data.data)
			} else {
				setClasses([])
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
	}

	function toggle() {
		setVisible(!visible)
	}

	function openEdit() {
		setVisible(!visible)
	}

	function onFinish(params) {
		setLoading(true)

		const DATA_SUBMIT = {
			...params,
			StudentInClassId: item?.Id
		}

		console.log('-- DATA_SUBMIT', DATA_SUBMIT)

		!isEdit && post(DATA_SUBMIT)
		isEdit && edit(DATA_SUBMIT)
	}

	async function post(params) {
		try {
			const response = await RestApi.post('ClassChange', params)
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
			const response = await RestApi.post(url + '/payment', { ...params, Id: item?.Id })
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

	const handleChangeMethod = (data) => {
		setActiveMethod(data)
		form.setFieldValue('PaymentMethodId', data.Id)
	}

	const [curPrice, setCurPrice] = useState(0)

	return (
		<>
			<PrimaryTooltip id={`change-${item?.Id}`} place="left" content="Chuyển lớp">
				<ButtonChange onClick={openEdit} className="ml-[16px]" />
			</PrimaryTooltip>

			<Modal
				width={500}
				title="Chuyển lớp"
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
								<div className="font-[600] inline-flex">Email:</div> {item?.Email}
							</div>
							<div className="w-full in-1-line font-[400] text-[14px]">
								<div className="font-[600] inline-flex">Phone:</div> {item?.Mobile}
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

				<div className="font-[500] mb-[4px]">Lớp hiện tại</div>
				<Card className="mb-[16px] card-min-padding">
					<div className="relative">
						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<div style={{ fontWeight: '600' }}>{item?.ClassName}</div>
							{currentClass && (
								<>
									<div className="text-[12px]">Giá: {parseToMoney(currentClass?.Price)}</div>
									<div className="text-[12px]">
										Đã học: {currentClass?.CompletedLesson}/{currentClass?.TotalLesson}
									</div>
								</>
							)}
						</div>
						<PrimaryTooltip
							className="top-[-4px] right-[-4px] absolute w-[28px] h-[18px]"
							id={`class-in-new-${item?.Id}`}
							place="right"
							content="Xem lớp"
						>
							<div onClick={() => viewClassDetails(item)} className="btn-open-in-new-tab text-[#43A047]">
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
					<Form.Item
						className="col-span-2 ant-select-class-selected ant-quis-custom"
						required={true}
						name="NewClassId"
						label="Lớp chuyển đến"
					>
						<Select
							disabled={loading}
							placeholder="Chọn lớp"
							className="ant-select-item-option-selected-blue"
							onChange={(value) => {
								const selectedClass = classes?.find((_item) => _item.Id === value)
								const monney = selectedClass?.Price - currentClass?.Price
								if (monney > 0) {
									setCurPrice(monney)
									form.setFieldValue('Price', monney)
								} else {
									setCurPrice(0)
									form.setFieldValue('Price', 0)
								}
							}}
						>
							{classes.map((thisClass) => {
								return (
									<Select.Option disabled={!thisClass?.Fit} key={thisClass.Id} value={thisClass.Id}>
										<div className="flex items-center justify-between w-full ant-select-class-option">
											<div className="ant-select-item-option-name">{thisClass?.Name}</div>
											{!thisClass?.Fit && <div className="text-[#e011116c]">{thisClass?.Note}</div>}
										</div>
										<div className="hiddens ant-select-dropdown-by-chau">
											<div className="text-[12px]">Giá: {parseToMoney(thisClass?.Price)}</div>
											<div className="text-[12px]">Học viên: {parseToMoney(thisClass?.StudentQuantity)}</div>
										</div>
									</Select.Option>
								)
							})}
						</Select>
					</Form.Item>

					<Form.Item className="col-span-2" required={true} rules={formRequired} label="Trung tâm" name="BranchId">
						<StyleContainerDropdown>
							<Select
								bordered={false}
								showSearch
								allowClear
								defaultValue={item?.BranchId || null}
								placeholder="Chọn trung tâm"
								onChange={(value) => form.setFieldValue('BranchId', value)}
							>
								{branch.map((item) => {
									return (
										<Select.Option key={item.Id} value={item.Id}>
											{item.Name}
										</Select.Option>
									)
								})}
							</Select>
						</StyleContainerDropdown>
					</Form.Item>

					<InputNumberField
						placeholder="Số tiền phải đóng thêm"
						className="col-span-2"
						label="Đóng thêm"
						name="Price"
						onChange={(e) => {
							setCurPrice(e)
							form.setFieldValue('Price', e)
						}}
						rules={formNoneRequired}
					/>

					{curPrice > 0 && (
						<>
							<InputNumberField
								placeholder="Số tiền phải thanh toán"
								className="col-span-2"
								label="Thanh toán"
								name="Paid"
								rules={formNoneRequired}
							/>

							<Form.Item
								required={true}
								className="col-span-2"
								label="Phương thức thanh toán"
								name="PaymentMethodId"
								rules={formNoneRequired}
							>
								<StylePaymentMethods>
									{methods?.map((method) => {
										return (
											<StylePaymentMethodsItems key={method.Id}>
												<StylePaymentMethodsAvatar
													src={method.Thumbnail || '/images/cash-payment.png'}
													alt="avatar"
													isChecked={activeMethod?.Id === method.Id}
													onClick={() => handleChangeMethod(method)}
												/>
												<StylePaymentMethodsLable isColumn={method?.Name?.length > 10}>
													<p>{method.Name}</p>
													<ModalShowInfoPaymentMethod method={method} />
												</StylePaymentMethodsLable>
											</StylePaymentMethodsItems>
										)
									})}
								</StylePaymentMethods>
							</Form.Item>

							<Form.Item className="col-span-2" label="Ngày hẹn trả" name="PaymentAppointmentDate" rules={formNoneRequired}>
								<DatePicker
									format="DD/MM/YYYY"
									style={{ borderRadius: 6, width: '100%', height: 36, alignItems: 'center', display: 'flex' }}
									placeholder="Ngày hẹn trả"
								/>
							</Form.Item>
						</>
					)}

					<Form.Item className="col-span-2" label="Ghi chú" name="Note" rules={formNoneRequired}>
						<Input.TextArea rows={5} placeholder="" disabled={loading} />
					</Form.Item>
				</Form>
			</Modal>
		</>
	)
}

export default ChangeClass
