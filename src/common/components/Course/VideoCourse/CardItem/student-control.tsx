import Router from 'next/router'
import React, { FC, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import RestApi from '~/api/RestApi'
import PrimaryButton from '~/common/components/Primary/Button'
import { ShowNostis } from '~/common/utils'
import { RootState } from '~/store'
import { setCartData } from '~/store/cartReducer'

type TStudentControl = {
	item?: any
}

const StudentControl: FC<TStudentControl> = (props) => {
	const { item } = props

	const dispatch = useDispatch()

	const user = useSelector((state: RootState) => state.user.information)

	const [loadingCart, setLoadingCart] = useState<boolean>(false)

	function isStdent() {
		return user?.RoleId == 3
	}

	/**
	 * It gets the cart data from the API and sets it in the redux store
	 */
	async function getCartData() {
		try {
			const response = await RestApi.get<any>('Cart/my-cart', { pageSize: 99999, pageIndex: 1 })
			if (response.status == 200) {
				dispatch(setCartData(response.data.data))
			} else {
				dispatch(setCartData([]))
			}
		} catch (error) {
		} finally {
			setLoadingCart(false)
		}
	}

	/**
	 * Add a product to the cart
	 */
	const _addToCart = async () => {
		setLoadingCart(true)
		try {
			let res = await RestApi.post('Cart', { ProductId: item.Id, Quantity: 1 })
			if (res.status == 200) {
				getCartData()
				ShowNostis.error('Thành công')
			}
		} catch (error) {
			ShowNostis.error(error?.message)
			setLoadingCart(false)
		}
	}

	function viewDetails() {
		Router.push({ pathname: '/course/videos/detail', query: { slug: item?.Id } })
	}

	if (!isStdent()) return <></>

	return (
		<>
			{item.Status == 1 && (
				<PrimaryButton background="yellow" type="button" loading={loadingCart} icon="cart" onClick={_addToCart}>
					Thêm vào giỏ hàng
				</PrimaryButton>
			)}

			{item.Status == 1 && (
				<PrimaryButton background="blue" type="button" disable={item.Disable} icon="eye" onClick={viewDetails}>
					Xem khóa học
				</PrimaryButton>
			)}
		</>
	)
}

export default StudentControl
