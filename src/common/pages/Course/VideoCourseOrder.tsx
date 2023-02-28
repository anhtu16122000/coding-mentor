import { EyeOutlined } from '@ant-design/icons'
import { Card, Input, List, Modal, Popconfirm, Spin, Tooltip } from 'antd'
import 'antd/dist/antd.css'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { CheckCircle } from 'react-feather'
import { BiCopy } from 'react-icons/bi'
import { useSelector } from 'react-redux'
import { DonePayApi } from '~/api/order'
import { shoppingCartApi } from '~/api/shopping-cart'
import CourseVideoTable from '~/common/components/Course/VideoCourse/CourseVideoTable'
import { parseToMoney } from '~/common/utils/common'
import { RootState } from '~/store'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'

const { Search } = Input

let pageIndex = 1

const VideoCourseList = () => {
	// const { userInformation, pageSize, showNoti, getTitlePage } = useWrap()
	const { information: userInformation } = useSelector((state: RootState) => state.user)

	const [data, setData] = useState([])
	const [showModalDetails, setShowModalDetails] = useState(false)
	const [rerender, setRender] = useState('')
	const [loading, setLoading] = useState(false)
	const [totalPage, setTotalPage] = useState(null)

	const [detailLoading, setDetailLoading] = useState(false)
	const [dataDetails, setDataDetails] = useState([])

	const listTodoApi = {
		pageSize: PAGE_SIZE,
		pageIndex: pageIndex,
		search: '',
		PaymentStatus: 0
	}
	const [todoApi, setTodoApi] = useState(listTodoApi)

	// useEffect(() => {
	// 	if (userInformation) {
	// 		// getAllArea()
	// 		getTitlePage('Danh sách đơn hàng')
	// 	}
	// }, [userInformation])

	//GET DATA
	const getAllArea = async () => {
		setLoading(true)
		try {
			const res = await DonePayApi.getAll(todoApi)
			res.status == 200 && (setData(res.data.data), setTotalPage(res.data.totalRow))
			res.status == 204 && setData([])
			setRender(res + '')
		} catch (err) {
			ShowNoti('error', err?.message || 'Lỗi không xác định')
		} finally {
			setLoading(false)
		}
	}

	const handleDone = async (ID) => {
		setLoading(true)
		try {
			const res = await DonePayApi.update({ ID: ID })
			ShowNoti('success', 'Thành công')
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			getAllArea()
		}
	}

	const getDetails = async (ID) => {
		try {
			const res = await shoppingCartApi.getOrderDetail(ID)
			res.status == 200 && setDataDetails(res.data.data)
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setDetailLoading(false)
		}
	}

	const textConfirm = 'Lớp học này đã được thanh toán?'

	const checkStatus = (vl, ctn) => {
		const rs = ['yellow', 'yellow', 'green', 'gray']
		return <span className={`tag ${rs[vl - 1]}`}>{ctn}</span>
	}

	const dataFake = [
		{
			OrderCode: 'DH43122115',
			FullNameUnicode: 'Long',
			TotalPayment: '999999',
			PaidPayment: '90909',
			DiscountPrice: '0',
			CreatedOn: '2021-12-29T11:55:05.337',
			PaymentDate: '2022-02-24T17:32:52.92',
			StatusName: 'Đã thanh toán'
		},
		{
			OrderCode: 'DH43122115',
			FullNameUnicode: 'Long',
			TotalPayment: '999,999',
			PaidPayment: '90909',
			DiscountPrice: '0',
			CreatedOn: '2021-12-29T11:55:05.337',
			PaymentDate: '2022-02-24T17:32:52.92',
			StatusName: 'Đã thanh toán'
		},
		{
			OrderCode: 'DH43122115',
			FullNameUnicode: 'Long',
			TotalPayment: '999,999',
			PaidPayment: '90909',
			DiscountPrice: '0',
			CreatedOn: '2021-12-29T11:55:05.337',
			PaymentDate: '2022-02-24T17:32:52.92',
			StatusName: 'Đã thanh toán'
		},
		{
			OrderCode: 'DH43122115',
			FullNameUnicode: 'Long',
			TotalPayment: '999,999',
			PaidPayment: '90909',
			DiscountPrice: '0',
			CreatedOn: '2021-12-29T11:55:05.337',
			PaymentDate: '2022-02-24T17:32:52.92',
			StatusName: 'Đã thanh toán'
		},
		{
			OrderCode: 'DH43122115',
			FullNameUnicode: 'Long',
			TotalPayment: '999,999',
			PaidPayment: '90909',
			DiscountPrice: '0',
			CreatedOn: '2021-12-29T11:55:05.337',
			PaymentDate: '2022-02-24T17:32:52.92',
			StatusName: 'Đã thanh toán'
		},
		{
			OrderCode: 'DH43122115',
			FullNameUnicode: 'Long',
			TotalPayment: '999,999',
			PaidPayment: '90909',
			DiscountPrice: '0',
			CreatedOn: '2021-12-29T11:55:05.337',
			PaymentDate: '2022-02-24T17:32:52.92',
			StatusName: 'Đã thanh toán'
		},
		{
			OrderCode: 'DH43122115',
			FullNameUnicode: 'Long',
			TotalPayment: '999,999',
			PaidPayment: '90909',
			DiscountPrice: '0',
			CreatedOn: '2021-12-29T11:55:05.337',
			PaymentDate: '2022-02-24T17:32:52.92',
			StatusName: 'Đã thanh toán'
		},
		{
			OrderCode: 'DH43122115',
			FullNameUnicode: 'Long',
			TotalPayment: '999,999',
			PaidPayment: '90909',
			DiscountPrice: '0',
			CreatedOn: '2021-12-29T11:55:05.337',
			PaymentDate: '2022-02-24T17:32:52.92',
			StatusName: 'Đã thanh toán'
		},
		{
			OrderCode: 'DH43122115',
			FullNameUnicode: 'Long',
			TotalPayment: '999,999',
			PaidPayment: '90909',
			DiscountPrice: '0',
			CreatedOn: '2021-12-29T11:55:05.337',
			PaymentDate: '2022-02-24T17:32:52.92',
			StatusName: 'Đã thanh toán'
		},
		{
			OrderCode: 'DH43122115',
			FullNameUnicode: 'Long',
			TotalPayment: '999,999',
			PaidPayment: '90909',
			DiscountPrice: '0',
			CreatedOn: '2021-12-29T11:55:05.337',
			PaymentDate: '2022-02-24T17:32:52.92',
			StatusName: 'Đã thanh toán'
		},
		{
			OrderCode: 'DH43122115',
			FullNameUnicode: 'Long',
			TotalPayment: '999,999',
			PaidPayment: '90909',
			DiscountPrice: '0',
			CreatedOn: '2021-12-29T11:55:05.337',
			PaymentDate: '2022-02-24T17:32:52.92',
			StatusName: 'Đã thanh toán'
		}
	]

	const columnsVideoCourse = [
		{
			title: 'Mã đơn hàng',
			dataIndex: 'OrderCode',
			key: 'OrderCode',
			align: 'center'
		},
		{
			title: 'Tên người mua',
			width: 130,
			dataIndex: 'FullNameUnicode',
			key: 'FullNameUnicode'
		},
		{
			title: 'Tổng thanh toán',
			width: 150,
			dataIndex: 'TotalPayment',
			key: 'TotalPayment',
			align: 'right',
			render: (Action, data, index) => <div>{parseToMoney(data.TotalPayment)}đ</div>
		},
		{
			title: 'Đã thanh toán',
			width: 130,
			dataIndex: 'PaidPayment',
			key: 'PaidPayment',
			align: 'right',
			render: (Action, data, index) => <div>{parseToMoney(data.PaidPayment)}đ</div>
		},
		{
			title: 'Giảm giá',
			width: 120,
			dataIndex: 'DiscountPrice',
			key: 'DiscountPrice',
			align: 'right',
			render: (Action, data, index) => <div>{parseToMoney(data.DiscountPrice)}đ</div>
		},
		{
			title: 'Ngày mua',
			dataIndex: 'CreatedOn',
			key: 'CreatedOn',
			render: (Action, data, index) => (
				<>
					{data?.CreatedOn == null ? (
						''
					) : (
						<div>{moment(data?.CreatedOn).format('DD/MM/yyyy') + ' ' + moment(data?.CreatedOn).format('hh:mm')}</div>
					)}
				</>
			)
		},
		{
			title: 'Ngày xác nhận',
			dataIndex: 'PaymentDate',
			key: 'PaymentDate',
			render: (Action, data, index) => (
				<>
					{data?.PaymentDate == null ? (
						''
					) : (
						<div>{moment(data?.PaymentDate).format('DD/MM/yyyy') + ' ' + moment(data?.PaymentDate).format('hh:mm')}</div>
					)}
				</>
			)
		},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusName',
			key: 'StatusName',
			align: 'center',
			render: (Action, data, index) => checkStatus(data?.Status, data?.StatusName)
		},
		{
			title: 'Thao tác',
			dataIndex: 'Action',
			key: 'action',
			align: 'center',
			fixed: 'right',
			width: 100,
			render: (Action, data, index) => (
				<div className="row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					{userInformation && userInformation?.RoleId === 1 ? (
						<>
							{data?.Status == 2 || data?.Status == 4 ? (
								<Tooltip title="Xác thực thanh toán">
									<Popconfirm
										placement="right"
										title={textConfirm}
										onConfirm={() => handleDone(data.ID)}
										okText={<div>Xác nhận</div>}
										cancelText={<div>Hủy</div>}
										className="customPopconfirm"
									>
										<button className="btn btn-icon">
											<CheckCircle style={{ color: '#1cc474' }} />
										</button>
									</Popconfirm>
								</Tooltip>
							) : (
								<div className="btn btn-icon">
									<CheckCircle style={{ color: '#CFD8DC' }} />
								</div>
							)}
						</>
					) : (
						<></>
					)}

					<Tooltip title="Xem thông tin">
						<button
							onClick={() => {
								setDetailLoading(true)
								getDetails(data.ID)
								setShowModalDetails(true)
							}}
							className="btn btn-icon"
							style={{}}
						>
							<EyeOutlined />
						</button>
					</Tooltip>
				</div>
			)
		}
	]

	useEffect(() => {
		if (todoApi !== listTodoApi) {
			// getAllArea()
		}
	}, [todoApi])

	// HANDLE SEARCH
	const handleSearch = (e) => {
		let newTodoApi = {
			...listTodoApi,
			pageIndex: 1,
			search: e
		}
		;(pageIndex = 1), setTodoApi(newTodoApi)
	}

	// HANDLE CHANGE PAGE
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber
		setTodoApi({
			...todoApi,
			pageIndex: pageIndex
		})
	}

	const handleCopyActiveKey = (item) => {
		navigator.clipboard.writeText(item)
		ShowNoti('success', 'Sao chép thành công')
	}

	// CARD EXTRA
	const Extra = () => {
		return (
			<div className="m-0 vc-store_extra-table">
				{/* <div className="row m-0"> */}
				<div className="m-0 st-fb-100w ">
					<Search
						className="fb-btn-search vc-teach-modal_search"
						size="middle"
						placeholder="Nhập mã tên hàng, tên người mua"
						onSearch={(e) => {
							handleSearch(e)
						}}
					/>
				</div>
				{/* </div> */}
			</div>
		)
	}

	const dataDetailsNew = [
		{
			ImageThumbnails:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png',
			VideoCourseName: 'Khóa học cơ bản',
			VideoCoursePrice: '100000',
			ActiveCode: 'WSLUWCIY',
			Quantity: 1,
			ExpiryDays: 1
		}
	]

	return (
		<div>
			<Card title={Extra()} className="video-course-list" style={{ width: '100%' }}>
				<CourseVideoTable
					totalPage={totalPage && totalPage}
					getPagination={(pageNumber: number) => getPagination(pageNumber)}
					currentPage={pageIndex}
					columns={columnsVideoCourse}
					dataSource={dataFake}
					loading={{ type: 'GET_ALL', status: loading }}
					TitleCard={null}
				/>
			</Card>

			<Modal
				title="Thông tin đơn hàng"
				visible={showModalDetails}
				onCancel={() => setShowModalDetails(false)}
				className="modal-vc-details"
				width={700}
				okButtonProps={{ style: { display: 'none' } }}
				cancelText="Đóng"
			>
				{!detailLoading ? (
					<>
						<List
							dataSource={dataDetailsNew}
							renderItem={(item) => (
								<List.Item>
									<div className="row m-0 item">
										<div className="row m-0 main">
											<img
												className="logo-img"
												src={item.ImageThumbnails === undefined ? '/images/logo.png' : item.ImageThumbnails}
												alt="logo branch"
												style={{ width: 50, height: 50, borderRadius: 6, marginRight: 10 }}
											/>
											<div className="column">
												<Tooltip title={item?.VideoCourseName}>
													<span style={{ fontWeight: 'bold' }} className="limit-text">
														{item?.VideoCourseName}
													</span>
												</Tooltip>
												<span style={{ fontWeight: 'bold', color: '#0074e4' }}>{parseToMoney(item?.VideoCoursePrice)}đ</span>
											</div>
											<div className="column">
												<span style={{ fontWeight: 'bold' }}>Mã kích hoạt</span>
												<span className="active-key">
													{item?.ActiveCode}
													<button onClick={() => handleCopyActiveKey(item.ActiveCode)} className="btn btn-icon">
														<BiCopy size={18} />
													</button>
												</span>
											</div>
											<span className="col-3 font-weight-primary" style={{ display: 'flex', flexDirection: 'column' }}>
												<span className=" font-weight-primary">Số lượng: {parseToMoney(item?.Quantity)}</span>
												<span className=" font-weight-primary">Thời hạn: {item?.ExpiryDays} ngày</span>
											</span>
										</div>
									</div>
								</List.Item>
							)}
						/>
					</>
				) : (
					<Spin />
				)}
			</Modal>
		</div>
	)
}
export default VideoCourseList
