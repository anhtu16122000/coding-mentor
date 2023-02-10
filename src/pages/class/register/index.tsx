import { Card, Divider, Form, Tooltip } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { discountApi } from '~/api/discount'
import { paymentMethodsApi } from '~/api/payment-method'
import FormRegisterClass from '~/common/components/Class/FormRegisterClass'
import FormRegisterOneVsOne from '~/common/components/Class/FormRegisterOneVsOne'
import FormUserRegister from '~/common/components/Class/FormUserRegister'
import DatePickerField from '~/common/components/FormControl/DatePickerField'
import InputNumberField from '~/common/components/FormControl/InputNumberField'
import TextBoxField from '~/common/components/FormControl/TextBoxField'
import MainLayout from '~/common/components/MainLayout'
import PrimaryButton from '~/common/components/Primary/Button'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import { setDiscount } from '~/store/discountReducer'
import { setPaymentMethod } from '~/store/paymentMethodReducer'
import { parseStringToNumber } from '~/common/utils/common'
import moment from 'moment'
import ModalAllDiscount from '~/common/components/Class/ModalAllDiscount'
import AvatarComponent from '~/common/components/AvatarComponent'
import { billApi } from '~/api/bill'
import ModalShowInfoPaymentMethod from '~/common/components/Class/ModalShowInfoPaymentMethod'

const RegisterClass = () => {
	const [classes, setClasses] = useState([])
	const [classesSelected, setClassesSelected] = useState([])
	const [programsSelected, setProgramsSelected] = useState([])
	const [detailDiscount, setDetailDiscount] = useState<IDiscount>()
	const discount = useSelector((state: RootState) => state.discount.Discount)
	const paymentMethod = useSelector((state: RootState) => state.paymentMethod.PaymentMethod)
	const [totalPrice, setTotalPrice] = useState(0)
	const [discountPrice, setDiscountPrice] = useState(0)
	const [leftPrice, setLeftPrice] = useState(0)
	const [activeTab, setActiveTab] = useState({ Type: 1, label: 'Đăng ký học' })
	const [activeMethod, setActiveMethod] = useState<IPaymentMethod>()
	const [isLoading, setIsLoading] = useState(false)
	const tabs = [
		{ Type: 1, label: 'Đăng ký học' }
		// { Type: 3, label: 'Khóa 1 kèm 1' }
	]
	const [form] = Form.useForm()
	const dispatch = useDispatch()

	useMemo(() => {
		const totalSelected = classesSelected.length + programsSelected.length
		let newDiscountPrice = 0
		if (totalSelected <= 1 && !!detailDiscount) {
			if (detailDiscount.PackageType === 2) {
				setDetailDiscount(null)
				setDiscountPrice(newDiscountPrice)
			} else {
				newDiscountPrice = detailDiscount.Value
				setDiscountPrice(newDiscountPrice)
			}
		} else if (totalSelected > 1 && !!detailDiscount) {
			if (detailDiscount.PackageType === 1) {
				setDetailDiscount(null)
				setDiscountPrice(newDiscountPrice)
			} else {
				const calculateDiscountPrice = (totalPrice * detailDiscount.Value) / 100
				if (calculateDiscountPrice > detailDiscount.MaxDiscount) {
					newDiscountPrice = detailDiscount.MaxDiscount
				} else {
					newDiscountPrice = (totalPrice * detailDiscount.Value) / 100
				}
				setDiscountPrice(newDiscountPrice)
			}
		} else if (totalSelected === 0) {
			setDetailDiscount(null)
			setDiscountPrice(newDiscountPrice)
		} else {
			setDiscountPrice(newDiscountPrice)
		}
		const newLeftPrice = totalPrice - newDiscountPrice - parseStringToNumber(!!form.getFieldValue('Paid') ? form.getFieldValue('Paid') : 0)
		setLeftPrice(newLeftPrice)
	}, [totalPrice, detailDiscount])

	const handleChangeTab = (tab) => {
		setActiveTab(tab)
	}

	const contentCard = () => {
		switch (activeTab.Type) {
			case 1:
				return (
					<FormRegisterClass
						setClasses={setClasses}
						classes={classes}
						classesSelected={classesSelected}
						setClassesSelected={setClassesSelected}
						programsSelected={programsSelected}
						setProgramsSelected={setProgramsSelected}
						form={form}
						setTotalPrice={setTotalPrice}
						setLeftPrice={setLeftPrice}
						discountPrice={discountPrice}
					/>
				)
			case 2:
				return <FormRegisterOneVsOne />
		}
	}
	const getAllDiscounts = async () => {
		try {
			const res = await discountApi.getAll()
			if (res.status === 200) {
				dispatch(setDiscount(res.data.data))
			}
			if (res.status === 204) {
				dispatch(setDiscount([]))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getAllPaymentsMethod = async () => {
		try {
			const res = await paymentMethodsApi.getAll()
			if (res.status === 200) {
				dispatch(setPaymentMethod(res.data.data))
			}
			if (res.status === 204) {
				dispatch(setPaymentMethod([]))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	useEffect(() => {
		if (!!discount && discount.length === 0) {
			getAllDiscounts()
		}
		if (!!paymentMethod && paymentMethod.length === 0) {
			getAllPaymentsMethod()
		}
	}, [])

	const handleChangePay = (data) => {
		const calculateLeftPrice = totalPrice - discountPrice - parseStringToNumber(data.target.value)
		setLeftPrice(calculateLeftPrice)
	}

	const onSubmit = async (data) => {
		if (!!activeMethod && !!activeMethod?.Id) {
			setIsLoading(true)
			let details = []
			classesSelected.forEach((item) => {
				details.push({ ClassId: item.Id, ProgramId: 0, CurriculumId: 0, CartId: 0 })
			})
			programsSelected.forEach((item) => {
				details.push({ ClassId: 0, ProgramId: item.Id, CurriculumId: 0, CartId: 0 })
			})
			let DATA_SUBMIT = {
				StudentId: data.StudentId,
				DiscountId: !!detailDiscount ? detailDiscount.Id : null,
				PaymentMethodId: activeMethod.Id,
				PaymentAppointmentDate: !!data.PaymentAppointmentDate ? moment(data.PaymentAppointmentDate).format() : null,
				BranchId: data.BranchId,
				Note: data.Note,
				Type: activeTab.Type,
				Paid: !!data.Paid ? parseStringToNumber(data.Paid) : 0,
				Details: details
			}
			try {
				const res = await billApi.add(DATA_SUBMIT)
				if (res.status === 200) {
					ShowNoti('success', res.data.message)
					window.location.reload()
				}
			} catch (err) {
				ShowNoti('error', err.message)
			} finally {
				setIsLoading(false)
			}
		} else {
			ShowNoti('error', 'Vui lòng chọn phương thức thanh toán')
		}
	}

	const handleChangeMethod = (data) => {
		setActiveMethod(data)
	}

	return (
		<div className="wrapper-register-class">
			<Form onFinish={onSubmit} layout="vertical" form={form}>
				<div className="grid grid-cols-2 gap-4">
					<div className="col-span-2">
						<Card title="Thông tin cá nhân">
							<FormUserRegister setClasses={setClasses} form={form} />
						</Card>
					</div>
					<div className="col-span-2">
						<div className="grid grid-cols-2 gap-x-4 responsive-mobile">
							<div className="col-span-1">
								<Card
									title={activeTab.label}
									extra={
										<div className="flex items-center justify-center gap-3">
											{tabs.map((tab, index) => {
												return (
													<button
														type="button"
														onClick={() => handleChangeTab(tab)}
														className={`tab-item ${activeTab.Type === tab.Type ? 'active' : ''}`}
													>
														{tab.label}
													</button>
												)
											})}
										</div>
									}
								>
									<div className="form-register-class">
										<div className="col-span-2">{contentCard()}</div>
									</div>
								</Card>
							</div>
							<div className="col-span-1">
								<div className="info-payment-register-class">
									<p className="title mb-2">Phương thức thanh toán</p>
									<div className="wrapper-payment-method-register-class">
										{!!paymentMethod &&
											paymentMethod.map((method) => {
												return (
													<div className="flex flex-col">
														<div
															key={method.Id}
															className={`item-payment-method-register-class ${method.Id === activeMethod?.Id ? 'active-method' : null}`}
															onClick={() => handleChangeMethod(method)}
														>
															<AvatarComponent url={method.Thumbnail} type="cash" />
														</div>
														<div className="flex items-center justify-center gap-1 mt-1">
															<p className="title text-sm">{method.Name}</p>
															<ModalShowInfoPaymentMethod method={method} />
														</div>
													</div>
												)
											})}
									</div>
									<Divider />
									<div className="flex items-center justify-between mb-3">
										<span className="title">Sản phẩm</span>
										<span className="title">{classesSelected?.length + programsSelected?.length}</span>
									</div>
									<div className="flex items-center justify-between mb-3">
										<span className="title">Tổng tiền</span>
										<span className="title text-tw-orange">{Intl.NumberFormat('ja-JP').format(totalPrice)}</span>
									</div>
									<div className="flex items-center justify-between mb-3">
										<div className="flex items-center gap-1">
											<span className="title">Mã giảm giá</span>
											<ModalAllDiscount
												classesSelected={classesSelected}
												programsSelected={programsSelected}
												form={form}
												setDetailDiscount={setDetailDiscount}
												detailDiscount={detailDiscount}
											/>
										</div>
										<span className="title">{!!detailDiscount && detailDiscount?.Code}</span>
										<span className="title text-tw-primary">{Intl.NumberFormat('ja-JP').format(discountPrice)}</span>
									</div>
									<div className="flex items-center justify-between mb-3">
										<span className="title">Thanh toán</span>
										<InputNumberField
											onChange={handleChangePay}
											label=""
											name="Paid"
											placeholder="Nhập số tiền thanh toán"
											className="mb-0"
										/>
									</div>
									<div className="flex items-center justify-between mb-3">
										<span className="title">Ngày hẹn trả</span>
										<DatePickerField className="mb-0 w-auto" mode="single" name="PaymentAppointmentDate" label="" />
									</div>
									<div className="flex items-center">
										<TextBoxField className="w-full" label="Ghi chú" name="Note" />
									</div>
									<Divider />
									<div className="flex items-center justify-between mb-3">
										<span className="text-xl font-medium">Thành tiền</span>
										<span className="text-xl font-medium text-tw-secondary">{Intl.NumberFormat('ja-JP').format(leftPrice)}</span>
									</div>
									<div className="flex-all-center">
										<PrimaryButton
											loading={isLoading}
											disable={isLoading}
											className="w-full"
											background="blue"
											icon="payment"
											type="submit"
										>
											Thanh toán
										</PrimaryButton>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Form>
		</div>
	)
}

RegisterClass.Layout = MainLayout
export default RegisterClass
