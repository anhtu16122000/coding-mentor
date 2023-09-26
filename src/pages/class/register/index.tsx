import { Card, Divider, Form } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { discountApi, voucherApi } from '~/api/business/discount'
import { paymentMethodsApi } from '~/api/business/payment-method'
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
import { parseStringToNumber, parseToMoney, wait } from '~/common/utils/common'
import moment from 'moment'
import ModalAllDiscount from '~/common/components/Class/ModalAllDiscount'
import AvatarComponent from '~/common/components/AvatarComponent'
import { billApi } from '~/api/business/bill'
import ModalShowInfoPaymentMethod from '~/common/components/Class/ModalShowInfoPaymentMethod'
import { branchApi } from '~/api/manage/branch'
import { setBranch } from '~/store/branchReducer'
import { useRouter } from 'next/router'
import { PATH_FINANCE } from '~/Router/path'
import ModalReserve from '~/common/components/Class/ModalReserve'
import ModalTuitionOption from '~/common/components/Class/ModalTuitionOption'

const tabs = [
	{ Type: 1, label: 'Đăng ký học' },
	{ Type: 2, label: 'Đóng trước' }
]

const CardBody = (props) => {
	const { programsSelected, setProgramsSelected, form, setCurriculum, setLeftPrice, discountPrice, type, handleListTimeFrames } = props
	const { setClasses, classes, classesSelected, setClassesSelected, curriculum } = props

	return (
		<>
			{(type == 1 || type == 2) && (
				<FormRegisterClass
					setClasses={setClasses}
					classes={classes}
					classesSelected={classesSelected}
					setClassesSelected={setClassesSelected}
					programsSelected={programsSelected}
					setProgramsSelected={setProgramsSelected}
					form={form}
					type={type}
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
	const { push } = useRouter()

	const [classes, setClasses] = useState([])

	const [classesSelected, setClassesSelected] = useState([])
	const [programsSelected, setProgramsSelected] = useState([])
	const [detailDiscount, setDetailDiscount] = useState<IDiscount>()
	const [totalPrice, setTotalPrice] = useState(0)
	const [discountPrice, setDiscountPrice] = useState(0)
	const [leftPrice, setLeftPrice] = useState(0)
	// const [activeTab] = useState(tabs[0])
	const [isLoading, setIsLoading] = useState(false)
	const [curriculum, setCurriculum] = useState(null)
	const [listTimeFrames, setListTimeFrames] = useState([{ Id: 1, ExectedDay: null, StudyTimeId: null, Note: '' }])
	const [activeMethod, setActiveMethod] = useState<IPaymentMethod>()

	const [curReserve, setCurReserve] = useState(null)
	const [curTuition, setCurTuition] = useState(null)

	const [totalWithTuition, setTotalWithTuition] = useState(null)

	function getRealPrice() {
		if (!curReserve?.MoneyRemaining) {
			return 0
		}

		let thatPrice = curReserve?.MoneyRemaining

		const curPrice = activeTab?.Type == 1 ? totalPrice : totalWithTuition

		if (curPrice < thatPrice) {
			thatPrice = curPrice
		}

		if (discountPrice > 0 && curPrice > 0) {
			thatPrice = curPrice - discountPrice
		}

		return thatPrice > curReserve?.MoneyRemaining ? curReserve?.MoneyRemaining : thatPrice
	}

	useEffect(() => {
		if (paymentMethod && paymentMethod.length > 0) {
			setActiveMethod(paymentMethod[0])
		}
	}, [])

	useEffect(() => {
		const reservePrice = getRealPrice()

		let tempLeftPrice = 0

		let tempPaid = parseStringToNumber(!!form.getFieldValue('Paid') ? form.getFieldValue('Paid') : 0)

		// const newLeftPrice = totalPrice - discountPrice - reservePrice - tempPaid

		if (activeTab?.Type == 1) {
			tempLeftPrice = totalPrice - discountPrice - reservePrice - tempPaid
		}

		if (activeTab?.Type == 2) {
			tempLeftPrice = totalWithTuition - discountPrice - reservePrice - tempPaid
		}

		// activeTab?.Type == 2

		setLeftPrice(tempLeftPrice)
	}, [classesSelected, totalPrice, discountPrice, totalWithTuition])

	const handleChangePay = (data) => {
		const reservePrice = getRealPrice()

		let tempLeftPrice = 0

		// const calculateLeftPrice = totalPrice - discountPrice - reservePrice - parseStringToNumber(data.target.value)

		if (activeTab?.Type == 1) {
			tempLeftPrice = totalPrice - discountPrice - reservePrice - parseStringToNumber(data.target.value)
		}

		if (activeTab?.Type == 2) {
			tempLeftPrice = totalWithTuition - discountPrice - reservePrice - parseStringToNumber(data.target.value)
		}

		setLeftPrice(tempLeftPrice)
	}

	useEffect(() => {
		const reservePrice = getRealPrice()

		let tempLeftPrice = 0

		let tempPaid = parseStringToNumber(!!form.getFieldValue('Paid') ? form.getFieldValue('Paid') : 0)

		const discountValue = getDiscountValue()
		setDiscountPrice(discountValue)

		if (activeTab?.Type == 1) {
			tempLeftPrice = totalPrice - discountValue - reservePrice - tempPaid
		}

		if (activeTab?.Type == 2) {
			tempLeftPrice = totalWithTuition - discountValue - reservePrice - tempPaid
		}

		setLeftPrice(tempLeftPrice)
	}, [totalPrice, detailDiscount, curReserve])

	useEffect(() => {
		if (paymentMethod && paymentMethod.length > 0) {
			setActiveMethod(paymentMethod[0])
		}
	}, [paymentMethod])

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

	const handleSetClass = async () => {
		const body = classesSelected.map((_item) => _item.Id)

		// try {
		// 	const res = await voucherApi.getVoucher(body)
		// 	if (res.status === 200) {
		// 		setVoucher(res.data.data)
		// 	}
		// 	if (res.status === 204) {
		// 		setVoucher(0)
		// 	}
		// } catch (err) {
		// 	ShowNoti('error', err.message)
		// }
	}

	useEffect(() => {
		if (classesSelected.length > 0) {
			handleSetClass()
		}
	}, [classesSelected])

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
		setDetailDiscount(null)
	}, [classesSelected, programsSelected])

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

	function getDetailSubmit(type) {
		let details = []

		if (type == 1) {
			classesSelected.forEach((item) => {
				details.push({
					ClassId: item.Id,
					ProgramId: 0,
					CartId: 0,
					...item
				})
			})
			programsSelected.forEach((item) => {
				details.push({
					ClassId: 0,
					ProgramId: item.Id,
					CartId: 0,
					...item
				})
			})
		}

		if (type == 3) {
			details.push({ ProgramId: programsSelected[0]?.Id, CurriculumId: curriculum, CartId: 0 })
		}

		return details
	}

	console.log('------- classesSelected: ', classesSelected)

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
				Details: getDetailSubmit(activeTab.Type),
				ClassReserveId: curReserve?.Id || null
			}

			console.log('DATA_SUBMIT: ', DATA_SUBMIT)

			if (activeTab.Type == 1) {
				postBillv2(DATA_SUBMIT)
			}

			if (activeTab.Type == 2) {
				postTuition({ ...DATA_SUBMIT, TuitionPackageId: curTuition?.Id, ClassId: classesSelected[0]?.Id })
			}
		} else {
			ShowNoti('error', 'Vui lòng chọn phương thức thanh toán')
		}
	}

	async function postBillv2(params) {
		try {
			const res = await billApi.v2(params)
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				resetThis()
				push(PATH_FINANCE.payment)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	async function postTuition(params) {
		console.log('------ postTuition DATA_SUBMIT: ', params)

		try {
			const res = await billApi.tuition(params)
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				resetThis()
				push(PATH_FINANCE.payment)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
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
		if (classesSelected || programsSelected) {
			getTotalPrice()
		}
	}, [classesSelected, programsSelected])

	function getTotalPrice() {
		const totalPrice = classesSelected.concat(programsSelected).reduce((prev, next) => prev + next.Price, 0)
		setTotalPrice(totalPrice)
	}

	const handleSetDiscount = (discountItem) => {
		if (!!discountItem) {
			const checkDiscount = totalPrice - discountItem?.Value
			if (checkDiscount > 0) {
				setDetailDiscount(discountItem)
				ShowNoti('success', 'Áp dụng thành công')
			} else {
				ShowNoti('error', 'Khuyến mãi không phù hợp! Vui lòng chọn lại!')
			}
		} else {
			setDetailDiscount(null)
		}
	}

	// Không set thì form nó không rerender nên không làm được gì hết
	const [curStudent, setCurStudent] = useState(null)

	useEffect(() => {
		setCurReserve(null)
		setDetailDiscount(null)
	}, [curStudent])

	const [activeTab, setActiveTab] = useState({ Type: 1, label: 'Đăng ký học' })

	useEffect(() => {
		getBranchs()
		setProgramsSelected([])
		setClassesSelected([])
		setCurriculum(null)
	}, [activeTab])

	const handleChangeTab = (tab) => {
		setActiveTab(tab)
	}

	function calculateDiscountAmount(totalAmount, discountPercentage) {
		// Calculate the discount amount
		var discountAmount = (totalAmount * discountPercentage) / 100

		console.log('--- discountAmount: ', discountAmount)

		return discountAmount
	}

	const [disPrice, setDisPrice] = useState(0)

	function getDiscountPrice() {
		const totalWithMonths = totalPrice * curTuition?.Months

		if (!curTuition?.DiscountType) {
			return 0
		}

		if (curTuition?.DiscountType == 1) {
			const result = curTuition?.Discount
			setDisPrice(result > 0 ? result : 0)
		}

		if (curTuition?.DiscountType == 2) {
			const result = calculateDiscountAmount(totalWithMonths, curTuition?.Discount)
			setDisPrice(result > 0 ? result : 0)
		}
	}

	function getFuckingDiscount() {
		const totalWithMonths = totalPrice * curTuition?.Months

		if (!curTuition?.DiscountType) {
			return 0
		}

		if (curTuition?.DiscountType == 1) {
			const result = totalWithMonths - curTuition?.Discount
			setTotalWithTuition(result > 0 ? result : 0)
		}

		if (curTuition?.DiscountType == 2) {
			const result = totalWithMonths - calculateDiscountAmount(totalWithMonths, curTuition?.Discount)
			setTotalWithTuition(result > 0 ? result : 0)
		}
	}

	useEffect(() => {
		if (classesSelected.length > 0) {
			if (!curTuition?.Discount) {
				setTotalWithTuition(0)
				setDisPrice(0)
			} else {
				getDiscountPrice()
				getFuckingDiscount()
			}
		} else {
			setTotalWithTuition(0)
			setDisPrice(0)
			setCurTuition(null)
			setDiscountPrice(0)
		}
	}, [curTuition, classesSelected])

	useEffect(() => {
		if (activeTab.Type == 2) {
			setTotalWithTuition(0)
			setDisPrice(0)
			setCurTuition(null)
			setDiscountPrice(0)
		}
	}, [activeTab])

	return (
		<div className="wrapper-register-class">
			<Form onFinish={onSubmit} layout="vertical" form={form}>
				<div className="grid grid-cols-2 gap-4">
					<div className="col-span-2">
						<Card title="Thông tin cá nhân">
							<FormUserRegister type={activeTab.Type} setClasses={setClasses} form={form} isReset={isReset} setCurStudent={setCurStudent} />
						</Card>
					</div>

					<div className="col-span-2">
						<div className="grid grid-cols-2 gap-x-4 responsive-mobile">
							<div className="col-span-1">
								<Card
									title={
										<div className="flex items-center justify-center gap-3">
											{tabs.map((tab, index) => {
												return (
													<button
														type="button"
														onClick={() => handleChangeTab(tab)}
														className={`mx-[8px] cursor-pointer no-select tab-item ${activeTab.Type == tab.Type ? 'active' : ''}`}
													>
														<div className="mb-[-2px]">{tab.label}</div>
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
												handleListTimeFrames={setListTimeFrames}
											/>
										</div>
									</div>
								</Card>
							</div>

							<div className="col-span-1">
								<div className="info-payment-register-class">
									<p className="title pb-[8px]">
										Phương thức thanh toán <div className="inline text-[red]">*</div>
									</p>

									<div className="flex flex-wrap gap-[8px]">
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
															<p className="title text-[14px] mb-[-2px]">{method.Name}</p>
															<ModalShowInfoPaymentMethod method={method} />
														</div>
													</div>
												)
											})}
									</div>

									<Divider />

									{activeTab?.Type == 1 && (
										<div className="flex items-center justify-between mb-3">
											<span className="title">Sản phẩm</span>
											<span className="title">{classesSelected?.length + programsSelected?.length}</span>
										</div>
									)}

									{activeTab?.Type == 2 && (
										<div className="flex items-center justify-between mb-3">
											<span className="title">Học phí</span>
											<span className="title text-tw-orange">{parseToMoney(totalPrice)} / tháng</span>
										</div>
									)}

									{activeTab?.Type == 1 && (
										<div className="flex items-center justify-between mb-3">
											<span className="title">Tổng</span>
											<span className="title text-tw-orange">{Intl.NumberFormat('ja-JP').format(totalPrice)}</span>
										</div>
									)}

									{/* 	// Code: '3THANGGIAM500'
		// Description: 'Đóng 3 tháng giảm ngay 500k học phí'
		// Discount: 50000
		// DiscountType: 1
		// DiscountTypeName: 'Giảm theo số tiền'
		// Id: 1
		// Months: 3 */}

									<ModalTuitionOption
										studentId={curStudent}
										curTuition={curTuition}
										onSubmit={setCurTuition}
										totalPrice={totalPrice}
										discount={discountPrice}
									/>

									{activeTab?.Type == 2 && (
										<div className="flex items-center justify-between mb-3">
											<span className="title">Tổng</span>
											<span className="title text-tw-orange">
												{parseToMoney(!(totalPrice * curTuition?.Months) ? 0 : totalPrice * curTuition?.Months)}
											</span>
										</div>
									)}

									{activeTab?.Type == 2 && (
										<div className="flex items-center justify-between mb-3">
											<span className="title">Giảm giá</span>
											<span className="title text-tw-orange">{parseToMoney(disPrice)}</span>
										</div>
									)}

									{activeTab?.Type == 1 && (
										<div className="flex items-center justify-between mb-3">
											<div className="flex items-center gap-1">
												<span className="title">Mã giảm giá</span>
												<ModalAllDiscount
													classesSelected={classesSelected}
													programsSelected={programsSelected}
													form={form}
													setDetailDiscount={handleSetDiscount}
													detailDiscount={detailDiscount}
												/>
											</div>
											<span className="title">{!!detailDiscount && detailDiscount?.Code}</span>
											<span className="title text-tw-primary">{Intl.NumberFormat('ja-JP').format(discountPrice)}</span>
										</div>
									)}

									<ModalReserve
										studentId={curStudent}
										curReserve={curReserve}
										onSubmit={setCurReserve}
										totalPrice={activeTab?.Type == 1 ? totalPrice : totalWithTuition}
										discount={discountPrice}
									/>

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
										<DatePickerField
											placeholder="Chọn thời gian"
											className="mb-0 !w-[180px]"
											mode="single"
											name="PaymentAppointmentDate"
											label=""
										/>
									</div>

									<div className="flex items-center">
										<TextBoxField className="w-full" label="Ghi chú" name="Note" />
									</div>

									<Divider />

									<div className="flex items-center justify-between mb-3">
										<span className="text-xl font-medium">Thành tiền</span>
										<span className="text-xl font-medium text-tw-secondary">{!leftPrice ? 0 : parseToMoney(leftPrice)}</span>
									</div>

									<div className="flex-all-center">
										<PrimaryButton
											loading={isLoading}
											disable={isLoading || leftPrice < 0 || (activeTab?.Type == 2 && totalWithTuition == 0)}
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
