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
import { parseStringToNumber, wait } from '~/common/utils/common'
import moment from 'moment'
import ModalAllDiscount from '~/common/components/Class/ModalAllDiscount'
import AvatarComponent from '~/common/components/AvatarComponent'
import { billApi } from '~/api/business/bill'
import ModalShowInfoPaymentMethod from '~/common/components/Class/ModalShowInfoPaymentMethod'
import { branchApi } from '~/api/manage/branch'
import { setBranch } from '~/store/branchReducer'
import { useRouter } from 'next/router'
import { PATH_FINANCE } from '~/Router/path'

const tabs = [
	{ Type: 1, label: 'Đăng ký học' },
	{ Type: 3, label: 'Đăng ký dạy kèm' }
]

const CardBody = (props) => {
	const { programsSelected, setProgramsSelected, form, setCurriculum, setLeftPrice, discountPrice, type, handleListTimeFrames } = props
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
					handleListTimeFrames={handleListTimeFrames}
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
	const [voucher, setVoucher] = useState(0)
	const [discountPrice, setDiscountPrice] = useState(0)
	const [leftPrice, setLeftPrice] = useState(0)
	const [activeTab] = useState(tabs[0])
	const [isLoading, setIsLoading] = useState(false)
	const [curriculum, setCurriculum] = useState(null)
	const [listTimeFrames, setListTimeFrames] = useState([{ Id: 1, ExectedDay: null, StudyTimeId: null, Note: '' }])
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

	const handleSetClass = async () => {
		const body = classesSelected.map((_item) => _item.Id)
		try {
			const res = await voucherApi.getVoucher(body)
			if (res.status === 200) {
				setVoucher(res.data.data)
			}
			if (res.status === 204) {
				setVoucher(0)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
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
		const discountValue = getDiscountValue()
		setDiscountPrice(discountValue)
		const newLeftPrice =
			totalPrice - discountValue - voucher - parseStringToNumber(!!form.getFieldValue('Paid') ? form.getFieldValue('Paid') : 0)
		setLeftPrice(newLeftPrice)
	}, [totalPrice, detailDiscount, voucher])

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

	const handleChangePay = (data) => {
		const calculateLeftPrice = totalPrice - discountPrice - parseStringToNumber(data.target.value)
		setLeftPrice(calculateLeftPrice)
	}

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

	const onSubmit = async (data) => {
		// const Expectations = listTimeFrames.map((_item) => {
		// 	return { ExectedDay: _item.ExectedDay, StudyTimeId: _item.StudyTimeId, Note: _item.Note }
		// })

		if (!data?.StudentId) {
			ShowNoti('error', 'Vui lòng chọn học viên')
			return false
		}

		if (!!activeMethod && !!activeMethod?.Id) {
			// setIsLoading(true)

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
				// Expectations
			}

			console.log('DATA_SUBMIT: ', DATA_SUBMIT)
			console.time('-- Gọi Api Bill hết')

			try {
				const res = await billApi.add(DATA_SUBMIT)
				if (res.status == 200) {
					ShowNoti('success', res.data.message)
					resetThis()
					push(PATH_FINANCE.payment)
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

	const handleSetDiscount = (_value) => {
		if (!!_value) {
			const checkDiscount = leftPrice - _value.Value

			if (checkDiscount > 0) {
				setDetailDiscount(_value)
				ShowNoti('success', 'Áp dụng thành công')
			} else {
				ShowNoti('error', 'Khuyến mãi không phù hợp! Vui lòng chọn lại!')
			}
		} else {
			setDetailDiscount(null)
		}
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
								<Card title={activeTab.label}>
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
										<span className="title">Giảm giá</span>
										<span className="title text-tw-orange">{Intl.NumberFormat('ja-JP').format(voucher)}</span>
									</div>

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
