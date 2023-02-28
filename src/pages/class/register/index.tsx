import { Card, Divider, Form } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { discountApi } from '~/api/discount'
import { paymentMethodsApi } from '~/api/payment-method'
import FormRegisterClass from '~/common/components/Class/FormRegisterClass'
import RegisterOneVsOne from '~/common/components/Class/RegisterOneVsOne'
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
import { parseStringToNumber, wait } from '~/common/utils/common'
import moment from 'moment'
import ModalAllDiscount from '~/common/components/Class/ModalAllDiscount'
import AvatarComponent from '~/common/components/AvatarComponent'
import { billApi } from '~/api/bill'
import ModalShowInfoPaymentMethod from '~/common/components/Class/ModalShowInfoPaymentMethod'
import { branchApi } from '~/api/branch'
import { setBranch } from '~/store/branchReducer'

const tabs = [
	{ Type: 1, label: 'Đăng ký học' },
	{ Type: 3, label: 'Đăng ký dạy kèm' }
]

const CardBody = (props) => {
	const { programsSelected, setProgramsSelected, form, setCurriculum, setLeftPrice, discountPrice, type } = props
	const { setClasses, classes, classesSelected, setClassesSelected, curriculum } = props

	return (
		<>
			{type == 1 && (
				<FormRegisterClass
					setClasses={setClasses}
					classes={classes}
					classesSelected={classesSelected}
					setClassesSelected={setClassesSelected}
					programsSelected={programsSelected}
					setProgramsSelected={setProgramsSelected}
					form={form}
					setTotalPrice={() => {}}
					setLeftPrice={setLeftPrice}
					discountPrice={discountPrice}
				/>
			)}

			{type == 3 && (
				<RegisterOneVsOne
					form={form}
					programsSelected={programsSelected}
					setCurriculum={setCurriculum}
					setProgramsSelected={setProgramsSelected}
					curriculum={curriculum}
				/>
			)}
		</>
	)
}

const RegisterClass = () => {
	const discount = useSelector((state: RootState) => state.discount.Discount)
	const paymentMethod = useSelector((state: any) => state.paymentMethod.PaymentMethod)

	const [classes, setClasses] = useState([])
	const [classesSelected, setClassesSelected] = useState([])
	const [programsSelected, setProgramsSelected] = useState([])
	const [detailDiscount, setDetailDiscount] = useState<IDiscount>()
	const [totalPrice, setTotalPrice] = useState(0)
	const [discountPrice, setDiscountPrice] = useState(0)
	const [leftPrice, setLeftPrice] = useState(0)
	const [activeTab, setActiveTab] = useState({ Type: 1, label: 'Đăng ký học' })
	const [isLoading, setIsLoading] = useState(false)
	const [curriculum, setCurriculum] = useState(null)

	const [activeMethod, setActiveMethod] = useState<IPaymentMethod>()

	const [form] = Form.useForm()
	const dispatch = useDispatch()

	const [isReset, setIsReset] = useState(false)

	function resetThis() {
		getBranchs()
		setProgramsSelected([])
		setClassesSelected([])
		setCurriculum(null)
		form.resetFields()
		setLeftPrice(0)
		setTotalPrice(0)
		setDiscountPrice(0)
		setActiveMethod(null)
		setDetailDiscount(null)
		resetUser()
	}

	async function resetUser() {
		setIsReset(true)
		await wait(500)
		setIsReset(false)
	}

	function getPercentDiscountValue(total, percent, max) {
		// Tính số tiền khuyến mãi dựa trên phần trăm khuyến mãi
		let price = (total * percent) / 100
		// Nếu số tiền khuyến mãi vượt quá khuyến mãi tối đa thì chỉ lấy khuyến mãi tối đa
		if (price > max) {
			price = max
		}
		return price
	}

	function getNormalDiscountValue(total, max) {
		// Nếu tổng tiền vượt quá khuyến mãi tối đa thì chỉ lấy khuyến mãi tối đa
		if (total > max) {
			return max
		}
		// Nếu tổng tiền không vượt quá khuyến mãi tối đa thì trả về tổng tiền
		return total
	}

	function getDiscountValue() {
		if (!detailDiscount) return 0

		if (detailDiscount?.Type == 2) {
			return getPercentDiscountValue(totalPrice, detailDiscount?.Value, detailDiscount?.MaxDiscount)
		}

		if (detailDiscount?.Type == 1) {
			return getNormalDiscountValue(totalPrice, detailDiscount?.MaxDiscount)
		}
	}

	useEffect(() => {
		const discountValue = getDiscountValue()
		setDiscountPrice(discountValue)
		const newLeftPrice = totalPrice - discountValue - parseStringToNumber(!!form.getFieldValue('Paid') ? form.getFieldValue('Paid') : 0)
		setLeftPrice(newLeftPrice)
	}, [totalPrice, detailDiscount])

	useEffect(() => {
		setDetailDiscount(null)
	}, [classesSelected, programsSelected])

	const handleChangeTab = (tab) => {
		setActiveTab(tab)
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

	function getDetailSubmit(type) {
		let details = []

		if (type == 1) {
			classesSelected.forEach((item) => {
				details.push({ ClassId: item.Id, ProgramId: 0, CartId: 0 })
			})
			programsSelected.forEach((item) => {
				details.push({ ClassId: 0, ProgramId: item.Id, CartId: 0 })
			})
		}

		if (type == 3) {
			details.push({ ProgramId: programsSelected[0]?.Id, CurriculumId: curriculum, CartId: 0 })
		}

		return details
	}

	const onSubmit = async (data) => {
		if (!data?.StudentId) {
			ShowNoti('error', 'Vui lòng chọn học viên')
			return false
		}

		if (!!activeMethod && !!activeMethod?.Id) {
			setIsLoading(true)

			let DATA_SUBMIT = {
				StudentId: data.StudentId,
				DiscountId: !!detailDiscount ? detailDiscount.Id : null,
				PaymentMethodId: activeMethod.Id,
				PaymentAppointmentDate: !!data.PaymentAppointmentDate ? moment(data.PaymentAppointmentDate).format() : null,
				BranchId: data.BranchId,
				Note: data.Note,
				Type: activeTab.Type,
				Paid: !!data.Paid ? parseStringToNumber(data.Paid) : 0,
				Details: getDetailSubmit(activeTab.Type)
			}

			console.log('-- DATA_SUBMIT: ', DATA_SUBMIT)
			console.time('-- Gọi Api Bill hết')
			try {
				const res = await billApi.add(DATA_SUBMIT)
				if (res.status == 200) {
					ShowNoti('success', res.data.message)
					resetThis()
				}
			} catch (err) {
				ShowNoti('error', err.message)
			} finally {
				setIsLoading(false)
				console.timeEnd('-- Gọi Api Bill hết')
			}
		} else {
			ShowNoti('error', 'Vui lòng chọn phương thức thanh toán')
		}
	}

	const handleChangeMethod = (data) => {
		setActiveMethod(data)
	}

	const getBranchs = async () => {
		try {
			const res = await branchApi.getAll()
			if (res.status == 200) {
				dispatch(setBranch(res.data.data))
			}
			if (res.status == 204) {
				dispatch(setBranch([]))
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	useEffect(() => {
		getBranchs()
		setProgramsSelected([])
		setClassesSelected([])
		setCurriculum(null)
	}, [activeTab])

	useEffect(() => {
		if (classesSelected.length > 0 || programsSelected.length > 0) {
			getTotalPrice()
		}
	}, [classesSelected, programsSelected])

	function getTotalPrice() {
		const totalPrice = classesSelected.concat(programsSelected).reduce((prev, next) => prev + next.Price, 0)
		setTotalPrice(totalPrice)
	}

	return (
		<div className="wrapper-register-class">
			<Form onFinish={onSubmit} layout="vertical" form={form}>
				<div className="grid grid-cols-2 gap-4">
					<div className="col-span-2">
						<Card title="Thông tin cá nhân">
							<FormUserRegister setClasses={setClasses} form={form} isReset={isReset} />
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
														className={`mx-[8px] tab-item ${activeTab.Type == tab.Type ? 'active' : ''}`}
													>
														{tab.label}
													</button>
												)
											})}
										</div>
									}
								>
									<div className="form-register-class">
										<div className="col-span-2">
											<CardBody
												type={activeTab.Type}
												setClasses={setClasses}
												classes={classes}
												classesSelected={classesSelected}
												setClassesSelected={setClassesSelected}
												programsSelected={programsSelected}
												setProgramsSelected={setProgramsSelected}
												form={form}
												setLeftPrice={setLeftPrice}
												discountPrice={discountPrice}
												setCurriculum={setCurriculum}
												curriculum={curriculum}
											/>
										</div>
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
															className={`item-payment-method-register-class ${method.Id == activeMethod?.Id ? 'active-method' : null}`}
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
											disable={isLoading || leftPrice < 0}
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
