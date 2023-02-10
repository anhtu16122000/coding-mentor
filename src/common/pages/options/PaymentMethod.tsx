import React, { useEffect, useState } from 'react'
import { paymentMethodsApi } from '~/api/payment-method'
import PaymentMethodForm from '~/common/components/PaymentMethod/PaymentMethodForm'
import PrimaryTable from '~/common/components/Primary/Table'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import ReactHtmlParser from 'react-html-parser'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { setPaymentMethod } from '~/store/paymentMethodReducer'

const PaymentMethodPage = () => {
	let initTodoApi = {
		pageSize: PAGE_SIZE,
		pageIndex: 1
	}
	const [todoApi, setTodoApi] = useState(initTodoApi)
	// const [listPaymentMethod, setListPaymentMethod] = useState([])
	const paymentMethod = useSelector((state: RootState) => state.paymentMethod.PaymentMethod)
	const dispatch = useDispatch()
	const columns = [
		{
			title: 'Hình ảnh',
			dataIndex: 'Thumbnail',
			key: 'Thumbnail',
			render: (image) => {
				return (
					<div className="image-table">
						<img src={image} alt="Thumbnail" />
					</div>
				)
			}
		},
		{
			title: 'Tên',
			dataIndex: 'Name',
			key: 'Name'
		},
		{
			title: 'Trạng thái',
			dataIndex: 'Active',
			align: 'center',
			key: 'Active',
			render: (active) => {
				return !!active ? <p className="tag blue">{'Hoạt động'}</p> : <p className="tag gray">{'Khóa'}</p>
			}
		},
		{
			title: 'Mô tả',
			dataIndex: 'Description',
			key: 'Description',
			render: (description) => {
				return ReactHtmlParser(description)
			}
		},
		{
			title: 'Chức năng',
			dataIndex: '',
			key: '',
			align: 'center',
			width: 100,
			render: (data) => {
				return (
					<>
						<PaymentMethodForm dataRow={data} setTodoApi={setTodoApi} initTodoApi={initTodoApi} />
					</>
				)
			}
		}
	]

	const getAllPaymentMethod = async (params) => {
		try {
			const res = await paymentMethodsApi.getAll(params)
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
		getAllPaymentMethod(todoApi)
	}, [todoApi])

	return (
		<div>
			<PrimaryTable columns={columns} data={paymentMethod} />
		</div>
	)
}

export default PaymentMethodPage
