import { Menu } from 'antd'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { ShoppingCart } from 'react-feather'

const Cart = () => {
	const [cartData, setCartData] = useState([])
	const [productCartData, setProductCartData] = useState([])
	const [countNoti, setCountNoti] = useState(0)
	const [countNotiProduct, setCountNotiProduct] = useState(0)

	useEffect(() => {
		setCountNoti(cartData.length)
		setCountNotiProduct(productCartData.length)
	}, [cartData, productCartData])

	const menu = (
		<Menu>
			<Menu.Item>
				<div className="shopping__cart-detail d-flex justify-content-center align-items-center">
					<a href="/cart/shopping-cart" style={{ textDecoration: 'none' }}>
						Giỏ hàng khóa học
					</a>
					<span className={countNoti > 0 ? 'count-notification' : 'hide'}>
						<span>{countNoti > 9 ? `9+` : countNoti}</span>
					</span>
				</div>
			</Menu.Item>

			<Menu.Item>
				<div className="shopping__cart-detail d-flex justify-content-center align-items-center">
					<a href="/cart/shopping-cart-product" style={{ textDecoration: 'none' }}>
						Giỏ hàng văn phòng phẩm
					</a>
					<span className={countNotiProduct > 0 ? 'count-notification' : 'hide'}>
						<span>{countNotiProduct > 9 ? `9+` : countNotiProduct}</span>
					</span>
				</div>
			</Menu.Item>
		</Menu>
	)

	return (
		<>
			<Link href={{ pathname: '/cart/shopping-cart' }}>
				<div className="shopping__cart-detail cart-icon d-flex justify-content-center align-items-center">
					<a style={{ textDecoration: 'none' }}>
						<ShoppingCart size={18} />
					</a>
					<span className={countNoti > 0 ? 'count-notification' : 'hide'}>
						<span>{countNoti > 9 ? `9+` : countNoti}</span>
					</span>
				</div>
			</Link>
		</>
	)
}
export default Cart
