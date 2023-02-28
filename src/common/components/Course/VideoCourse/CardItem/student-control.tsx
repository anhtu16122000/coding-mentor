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
	onRefresh?: Function
}

const FREE_CODE = 'CodeFree'

const StudentControl: FC<TStudentControl> = (props) => {
	const { item, onRefresh } = props

	const dispatch = useDispatch()

	const user = useSelector((state: RootState) => state.user.information)

	const [loadingCart, setLoadingCart] = useState<boolean>(false)
	const [loadingActive, setLoadingActive] = useState<boolean>(false)

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

	const _active = async (code) => {
		setLoadingActive(true)
		try {
			let res = await RestApi.post('VideoCourseStudent/active', { videoCourseId: item.Id, ActiveCode: code })
			if (res.status == 200) {
				!!onRefresh && onRefresh()
				ShowNostis.error('Thành công')
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setLoadingActive(false)
		}
	}

	function freeActive() {
		_active(FREE_CODE)
	}

	function viewDetails() {
		Router.push({ pathname: '/course/videos/detail', query: { slug: item?.Id } })
	}

	if (!isStdent()) return <></>

	return (
		<div className="flex flex-col">
			{item.Status == 1 && !item?.Price && (
				<PrimaryButton background="green" type="button" loading={loadingActive} icon="none" onClick={freeActive}>
					Kích hoạt miễn phí
				</PrimaryButton>
			)}

			{item.Status == 1 && !!item?.Price && (
				<PrimaryButton background="yellow" type="button" loading={loadingCart} icon="cart" onClick={_addToCart}>
					Thêm vào giỏ hàng
				</PrimaryButton>
			)}

			{item.Status == 2 && (
				<PrimaryButton background="blue" type="button" disable={item.Disable} icon="eye" onClick={viewDetails}>
					Xem khóa học
				</PrimaryButton>
			)}
		</div>
	)
}

export default StudentControl
