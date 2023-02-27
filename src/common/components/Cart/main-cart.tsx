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
import { Card, Divider, Input } from 'antd'
import Avatar from '../Avatar'
import { parseToMoney } from '~/common/utils/common'
import { HiPlus } from 'react-icons/hi'
import { MdOutlinePayments, MdPayment, MdRemove } from 'react-icons/md'
import { ShowNostis } from '~/common/utils'
import BaseLoading from '../BaseLoading'
import { paymentMethodsApi } from '~/api/payment-method'
import { RiCheckboxCircleFill } from 'react-icons/ri'

const CART_ROUTER = '/cart'

const MainCart = () => {
	const dispatch = useDispatch()

	const userInformation = useSelector((state: RootState) => state.user.information)
	const cartData = useSelector((state: RootState) => state.cart.CartData)

	const [methods, setMethods] = useState<any>([])
	const [textDiscount, setTextDiscount] = useState('')

	const [selectedMethod, setSelectedMethod] = useState(null)
	const [appliedDiscount, setAppliedDiscount] = useState(null)

	console.log('---- Cart Data: ', cartData)

	useEffect(() => {
		getData()
		getPaymentMethods()
	}, [])

	async function getData() {
		try {
			const response = await RestApi.get<any>('Cart/my-cart', { pageSize: 99999, pageIndex: 1 })
			if (response.status == 200) {
				dispatch(setCartData(response.data.data))
			} else {
				dispatch(setCartData([]))
			}
		} catch (error) {
		} finally {
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

	function getCartNumber() {
		if (cartData.length > 0 && cartData.length < 10) {
			return cartData.length
		}

		if (cartData.length > 10) {
			return '9+'
		}

		return ''
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

	const [loadingDiscount, setLoadingDiscount] = useState(false)
	async function applyDiscount(params) {
		setLoadingDiscount(true)
		try {
			const response = await RestApi.get<any>(`Discount/by-code/${params}`, {})
			if (response.status == 200) {
				setAppliedDiscount(response?.data?.data)
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

	function getTotalPrice() {
		let temp = 0
		cartData.forEach((element) => {
			if (element.TotalPrice > 0) {
				temp += element.TotalPrice
			}
		})
		return temp > 0 ? temp : 0
	}

	console.log('--- appliedDiscount: ', appliedDiscount)

	return (
		<div onClick={openCart} className={styles.CustomCartContainer}>
			<Head>
				<title>{appConfigs.appName} | Giỏ hàng</title>
			</Head>

			<div className="cart-body h-[calc(100vh-120px)]">
				<div className="col-span-7 flex flex-col">
					<Card className="flex-1 shadow-sm">
						<div className="font-[600] text-[18px] mb-[16px]">
							<FiShoppingCart size={20} className="mr-[16px] mt-[-3px]" />
							Giỏ hàng
						</div>

						<div className="max-h-[calc(100vh-220px)] scrollable mr-[-24px] pr-[14px]">
							{cartData.map((item, index) => {
								return (
									<div className="cart-item">
										<Avatar uri={item?.Thumbnail} className="cart-item-thumbnail" />
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
						</div>
					</Card>
				</div>

				<div className="col-span-5">
					<Card className="shadow-sm">
						<div className="font-[600] text-[18px] mb-[16px]">
							<MdPayment size={22} className="mr-[16px] mt-[-3px]" />
							Phương thức thanh toán
						</div>

						<div>
							{methods.map((item, index) => {
								return (
									<div
										onClick={() => setSelectedMethod(item)}
										className={`cart-payment-method none-selection ${selectedMethod?.Id == item?.Id ? 'activated-method' : ''}`}
									>
										<Avatar uri={item?.Thumbnail} className="cart-payment-thumbnail" />
										<h4 className="cart-payment-name flex-1">{item?.Name}</h4>
										{selectedMethod?.Id == item?.Id && <RiCheckboxCircleFill size={20} className="text-[#43A047] duration-300" />}
									</div>
								)
							})}
						</div>

						{!!selectedMethod?.Description && (
							<div>
								<Divider />
								<div className="mt-[-8px]">{ReactHTMLParser(selectedMethod?.Description)}</div>
							</div>
						)}
					</Card>

					<Card className="mt-[16px] shadow-sm">
						<div className="font-[600] text-[18px] mb-[16px]">
							<MdOutlinePayments size={22} className="mr-[16px] mt-[-3px]" />
							Thanh toán
						</div>

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

							<div
								onClick={() => applyDiscount(textDiscount)}
								className="bg-[#1E88E5] cursor-pointer ml-[8px] h-[36px] px-[16px] rounded-[6px] flex items-center justify-center"
							>
								<div className="text-[#fff] font-[600]">Áp dụng</div>
								{loadingDiscount && (
									<div className="ml-[8px] mt-[-4px]">
										<BaseLoading.White />
									</div>
								)}
							</div>
						</div>

						<h4 className="text-[16px] font-[600]">Tổng tiền: {parseToMoney(getTotalPrice())}</h4>
					</Card>
				</div>
			</div>
		</div>
	)
}

export default MainCart
