import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import RestApi from '~/api/RestApi'
import { RootState } from '~/store'
import { setCartData } from '~/store/cartReducer'
import styles from './cart.module.scss'
import Head from 'next/head'
import ReactHTMLParser from 'react-html-parser'
import appConfigs from '~/appConfig'
import { Card, Divider, Empty, Input, Modal, Skeleton } from 'antd'
import Avatar from '../Avatar'
import { parseToMoney } from '~/common/utils/common'
import { HiPlus } from 'react-icons/hi'
import { MdOutlinePayments, MdPayment, MdRemove } from 'react-icons/md'
import { ShowNostis } from '~/common/utils'
import BaseLoading from '../BaseLoading'
import { paymentMethodsApi } from '~/api/payment-method'
import { RiCheckboxCircleFill } from 'react-icons/ri'
import { IoMdClose } from 'react-icons/io'
import PrimaryTooltip from '../PrimaryTooltip'
import PrimaryButton from '../Primary/Button'
import PaymentSucess from './success'

const CART_ROUTER = '/cart'

const CartLoading = () => {
	return (
		<>
			<div className="cart-item">
				<Skeleton.Button active className="cart-item-thumbnail" />
				<div className="w-full">
					<Skeleton paragraph={false} active className="ml-[8px] w-[40%]" />
					<Skeleton paragraph={false} active className="ml-[8px] w-[50px] mt-[16px]" />
					<Skeleton paragraph={false} active className="ml-[8px] w-[80px] mt-[16px]" />
				</div>
			</div>
			<div className="cart-item">
				<Skeleton.Button active className="cart-item-thumbnail" />
				<div className="w-full">
					<Skeleton paragraph={false} active className="ml-[8px] w-[40%]" />
					<Skeleton paragraph={false} active className="ml-[8px] w-[50px] mt-[16px]" />
					<Skeleton paragraph={false} active className="ml-[8px] w-[80px] mt-[16px]" />
				</div>
			</div>
		</>
	)
}

const MainCart = () => {
	const dispatch = useDispatch()

	const userInformation = useSelector((state: RootState) => state.user.information)
	const cartData = useSelector((state: RootState) => state.cart.CartData)

	const [methods, setMethods] = useState<any>([])
	const [textDiscount, setTextDiscount] = useState('')

	const [selectedMethod, setSelectedMethod] = useState(null)
	const [appliedDiscount, setAppliedDiscount] = useState(null)

	const [loading, setLoading] = useState<boolean>(true)

	const [successVisible, setSuccessVisible] = useState<boolean>(false)

	useEffect(() => {
		getData()
		getPaymentMethods()
	}, [])

	async function getData() {
		setLoading(true)
		try {
			const response = await RestApi.get<any>('Cart/my-cart', { pageSize: 99999, pageIndex: 1 })
			if (response.status == 200) {
				dispatch(setCartData(response.data.data))
			} else {
				dispatch(setCartData([]))
			}
		} catch (error) {
		} finally {
			setLoading(false)
			setLoadingUpdate({ Id: null, Status: false, Type: '' })
		}
	}

	const [methodsLoading, setMethodsLoading] = useState(true)
	const getPaymentMethods = async () => {
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

	function isStdent() {
		return userInformation?.RoleId == 3
	}

	if (!isStdent()) return <></>

	function openCart() {
		Router.push(CART_ROUTER)
	}

	const [loadingUpdate, setLoadingUpdate] = useState({ Id: null, Status: false, Type: '' })
	async function updateCart(params, type) {
		setLoadingUpdate({ Id: params?.Id, Status: true, Type: type })
		try {
			const response = await RestApi.put('Cart', params)
			if (response.status == 200) {
				getData()
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

	const [textError, setTextError] = useState('')
	const [loadingDiscount, setLoadingDiscount] = useState(false)

	async function applyDiscount(params) {
		setLoadingDiscount(true)
		setTextError('')
		try {
			const response = await RestApi.get<any>(`Discount/by-code/${params}`, {})
			if (response.status == 200) {
				const itemDis = response?.data?.data
				if (itemDis?.PackageType == 2 && getTotalPrice().quantity < 2) {
					setTextError('Khuyến mãi chỉ dành cho mua combo')
				} else if (itemDis?.PackageType == 1 && getTotalPrice().quantity > 1) {
					setTextError('Khuyến mãi chỉ dành cho mua lẻ')
				} else if (itemDis?.Status !== 1) {
					setTextError('Khuyến mãi đã hết hiệu lực')
				} else setAppliedDiscount(itemDis)
			} else {
				setAppliedDiscount(null)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
			setAppliedDiscount(null)
		} finally {
			setLoadingDiscount(false)
		}
	}

	async function submitData(params) {
		setLoading(true)
		setTextError('')
		try {
			const response = await RestApi.post('Bill', params)
			if (response.status == 200) {
				getData()
				setAppliedDiscount(null)
				setTextDiscount('')
				setSuccessVisible(true)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoading(false)
		}
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
		if (!appliedDiscount) return 0

		const totalPrice = getTotalPrice().totalPrice

		if (appliedDiscount?.Type == 2) {
			return getPercentDiscountValue(totalPrice, appliedDiscount?.Value, appliedDiscount?.MaxDiscount)
		}

		if (appliedDiscount?.Type == 1) {
			return getNormalDiscountValue(totalPrice, appliedDiscount?.MaxDiscount)
		}
	}

	function getTotalPrice() {
		let quantity = 0
		let temp = 0
		cartData.forEach((element) => {
			if (element.TotalPrice > 0) {
				temp += element.TotalPrice
			}
			if (element.Quantity > 0) {
				quantity += element.Quantity
			}
		})
		return { totalPrice: temp > 0 ? temp : 0, quantity: quantity > 0 ? quantity : 0 }
	}

	console.log('--- userInformation: ', userInformation)

	function getCartDetails() {
		let cartDetails = []
		cartData.forEach((element) => {
			cartDetails.push({ CartId: element?.Id })
		})
		return cartDetails
	}

	function onSubmit() {
		const DATA_SUBMIT = {
			StudentId: userInformation?.UserInformationId,
			DiscountId: appliedDiscount?.Id,
			PaymentMethodId: selectedMethod?.Id,
			BranchId: userInformation?.BranchIds, /// Fica
			Type: 2,
			Paid: getTotalPrice().totalPrice - getDiscountValue(),
			Details: getCartDetails()
		}

		console.log('---- DATA_SUBMIT: ', DATA_SUBMIT)

		submitData(DATA_SUBMIT)
	}

	console.log('--- appliedDiscount: ', appliedDiscount)

	function isEmptyCart() {
		return cartData.length == 0 && !loading
	}

	return (
		<div onClick={openCart} className={styles.CustomCartContainer}>
			<Head>
				<title>{appConfigs.appName} | Giỏ hàng</title>
			</Head>

			<div className="cart-body w750:h-[calc(100vh-120px)]">
				<div className="col-span-12 w750:col-span-7 flex flex-col">
					<Card className={`flex-1 shadow-sm w750:h-[calc(100vh-120px)] ${cartData.length == 0 && !loading ? 'max-h-[250px]' : ''}`}>
						<div className="font-[600] text-[18px] mb-[16px]">
							<FiShoppingCart size={20} className="mr-[16px] mt-[-3px]" />
							Giỏ hàng
						</div>

						<div className="w750:max-h-[calc(100vh-220px)] scrollable mr-[-24px] pr-[14px]">
							{cartData.length == 0 && !loading && <Empty />}

							{cartData.length == 0 && loading && <CartLoading />}

							{(cartData.length > 0 || !loading) && (
								<>
									{cartData.map((item, index) => {
										return (
											<div className="cart-item">
												<Avatar isThumbnail uri={item?.Thumbnail} className="cart-item-thumbnail" />
												<div className="ml-[16px] flex-1">
													<h1 className="cart-item-name in-2-line">{item?.ProductName}</h1>
													{!!item?.TotalPrice && <h1 className="cart-item-price text-[#ed3737]">{parseToMoney(item?.TotalPrice)}</h1>}
													{!item?.TotalPrice && <h2 className="cart-item-price text-[#1E88E5]">Miễn phí</h2>}

													<div className="mt-[8px]">
														{item?.Type == 1 && <div className="tag blue">{item?.TypeName}</div>}
														{item?.Type == 2 && <div className="tag green">{item?.TypeName}</div>}
														{item?.Type == 3 && <div className="tag yellow">{item?.TypeName}</div>}
														{item?.Type == 4 && <div className="tag gray">{item?.TypeName}</div>}
													</div>
												</div>

												<div className="ml-[16px] none-selection">
													<div
														onClick={() => updateCart({ Quantity: item.Quantity + 1, Id: item?.Id }, 'plus')}
														className="cart-control-button cart-control-button-top"
													>
														{loadingUpdate.Status == true && loadingUpdate.Id == item?.Id && loadingUpdate.Type == 'plus' && (
															<BaseLoading.Black />
														)}

														{(loadingUpdate.Status == false || loadingUpdate.Id !== item?.Id || loadingUpdate.Type !== 'plus') && (
															<HiPlus size={16} />
														)}
													</div>

													<div className="cart-control-button font-[600]">{item?.Quantity}</div>

													<div
														onClick={() => updateCart({ Quantity: item.Quantity - 1, Id: item?.Id }, 'remove')}
														className="cart-control-button cart-control-button-bottom"
													>
														{loadingUpdate.Status == true && loadingUpdate.Id == item?.Id && loadingUpdate.Type == 'remove' && (
															<BaseLoading.Black />
														)}

														{(loadingUpdate.Status == false || loadingUpdate.Id !== item?.Id || loadingUpdate.Type != 'remove') && (
															<MdRemove size={16} />
														)}
													</div>
												</div>
											</div>
										)
									})}
								</>
							)}
						</div>
					</Card>
				</div>

				<div className="col-span-12 w750:col-span-5 pb-[32px]">
					<Card className="shadow-sm">
						<div className="font-[600] text-[18px] mb-[16px]">
							<MdPayment size={22} className="mr-[16px] mt-[-3px]" />
							Phương thức thanh toán
						</div>

						<div>
							{methodsLoading && (
								<div className={`cart-payment-method none-selection`}>
									<Skeleton.Avatar active className="cart-payment-thumbnail" />
									<Skeleton paragraph={false} active className="ml-[8px] w-[40%]" />
								</div>
							)}

							{!methodsLoading &&
								methods.map((item, index) => {
									return (
										<div
											onClick={() => setSelectedMethod(item)}
											className={`cart-payment-method none-selection ${selectedMethod?.Id == item?.Id ? 'activated-method' : ''}`}
										>
											<Avatar isThumbnail uri={item?.Thumbnail} className="cart-payment-thumbnail" />
											<h4 className="cart-payment-name flex-1">{item?.Name}</h4>
											{selectedMethod?.Id == item?.Id && <RiCheckboxCircleFill size={20} className="text-[#43A047] duration-300" />}
										</div>
									)
								})}
						</div>

						{!!selectedMethod?.Description && (
							<div className="mt-[-8px]">
								<Divider />
								<div className="mt-[-16px]">{ReactHTMLParser(selectedMethod?.Description)}</div>
							</div>
						)}

						<Divider />

						<div className="font-[600] text-[18px] mb-[8px] mt-[-16px]">
							<MdOutlinePayments size={22} className="mr-[16px] mt-[-3px]" />
							Thanh toán
						</div>

						{!appliedDiscount && !isEmptyCart() && (
							<div className="w-full flex mb-[16px]">
								<Input
									disabled={loadingDiscount}
									onKeyUp={(e) => {
										if (e.keyCode === 13) applyDiscount(textDiscount)
									}}
									value={textDiscount}
									onChange={(event) => setTextDiscount(event.target?.value)}
									className="primary-input text-[18px] flex-1"
								/>
								<div onClick={() => applyDiscount(textDiscount)} className="cart-btn-apply-discount">
									<div className="text-[#fff] font-[600]">Áp dụng</div>
									{loadingDiscount && (
										<div className="discount-loading">
											<BaseLoading.White />
										</div>
									)}
								</div>
							</div>
						)}

						{!!textError && <div className="text-[red] mb-[16px]">{textError}</div>}

						{!!appliedDiscount && (
							<div className="cart-discount-container">
								<div className="flex items-center text-[18px]">
									<div className="font-[600] mr-[4px]">Mã: </div>
									<div>{appliedDiscount?.Code}</div>
								</div>
								<div className="flex items-center">
									<div className="font-[600] mr-[4px]">Loại: </div>
									<div>{appliedDiscount?.TypeName}</div>
								</div>
								{appliedDiscount?.Type == 2 && (
									<div className="flex items-center">
										<div className="font-[600] mr-[4px]">Giá trị: </div>
										<div>{appliedDiscount?.Value}%</div>
									</div>
								)}
								{appliedDiscount?.Type == 1 && (
									<div className="flex items-center">
										<div className="font-[600] mr-[4px]">Giá trị: </div>
										<div>{parseToMoney(appliedDiscount?.Value)}</div>
									</div>
								)}

								<div className="flex items-center">
									<div className="font-[600] mr-[4px]">Tối đa: </div>
									<div>{parseToMoney(appliedDiscount?.MaxDiscount)}</div>
								</div>
								<div onClick={() => setAppliedDiscount(null)} className="cart-btn-remove-discount">
									<PrimaryTooltip id="tip-2023" content="Bỏ áp dụng" place="top">
										<IoMdClose size={20} color="red" />
									</PrimaryTooltip>
								</div>
							</div>
						)}

						{!!getDiscountValue() && (
							<>
								<h4 className="cart-text-total">Tổng tiền: {parseToMoney(getTotalPrice().totalPrice)}</h4>
								<h4 className="cart-text-total text-[#1c73e8]">Khuyến mãi: {parseToMoney(getDiscountValue())}</h4>
							</>
						)}

						<h4 className="cart-text-total">Số tiền thanh toán: {parseToMoney(getTotalPrice().totalPrice - getDiscountValue())}</h4>

						<PrimaryButton
							disable={loadingUpdate?.Status || loading || isEmptyCart()}
							onClick={onSubmit}
							className="w-full mt-[16px]"
							background="blue"
							type="button"
						>
							Thanh toán
						</PrimaryButton>
					</Card>
				</div>
			</div>

			<Modal footer={null} width={600} open={successVisible}>
				<PaymentSucess
					onClose={() => {
						setSuccessVisible(true)
						Router.back()
					}}
				/>
			</Modal>
		</div>
	)
}

export default MainCart
