import Router from 'next/router'
import React, { useEffect } from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import RestApi from '~/api/RestApi'
import { RootState } from '~/store'
import { setCartData } from '~/store/cartReducer'
import styles from './cart.module.scss'

const CART_ROUTER = '/cart'

const CartButton = () => {
	const dispatch = useDispatch()

	const userInformation = useSelector((state: RootState) => state.user.information)
	const cartData = useSelector((state: RootState) => state.cart.CartData)

	useEffect(() => {
		isStdent() && getData()
	}, [])

	function isStdent() {
		return userInformation?.RoleId == 3
	}

	async function getData() {
		try {
			const response = await RestApi.get<any>('Cart/my-cart', { pageSize: 99999, pageIndex: 1 })
			if (response.status == 200) {
				dispatch(setCartData(response.data.data))
			} else {
				dispatch(setCartData([]))
			}
		} catch (error) {}
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

	return (
		<div onClick={openCart} className={styles.CustomCartButton}>
			<FiShoppingCart size={20} className="ml-[-2px]" />

			{!!getCartNumber() && (
				<div className="cart-number">
					<div className="text-[#fff]">{getCartNumber()}</div>
				</div>
			)}
		</div>
	)
}

export default CartButton
