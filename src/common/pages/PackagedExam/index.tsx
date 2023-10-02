import { List, Popconfirm, Popover, Skeleton } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FaCartPlus } from 'react-icons/fa'
import { isDesktop } from 'react-device-detect'
import CCSearch from '~/common/components/CCSearch'
import { getMorePacked, getPacked } from './util'
import { is, parseToMoney } from '~/common/utils/common'
import { IoMdCart } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { BiSolidDetail, BiTrash } from 'react-icons/bi'
import { packedApi } from '~/api/packed'
import { ShowNostis } from '~/common/utils'
import CreatePackage from './CreatePackage'
import ReadMoreText from './ReadMoreText'
import DonatePackage from './donate'
import RestApi from '~/api/RestApi'
import { useDispatch } from 'react-redux'
import { setCartData } from '~/store/cartReducer'
import Router from 'next/router'

const initParameters = { search: '', pageIndex: 1, pageSize: 22 }

function PackageExam() {
	const [filters, setFilters] = useState(initParameters)

	const [data, setData] = useState([])
	const [totalItem, setTotalItem] = useState(0)

	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(true)

	const userInfo = useSelector((state: RootState) => state.user.information)

	useEffect(() => {
		if (filters.pageIndex == 1) {
			getPackages()
		} else {
			getMoreData()
		}
	}, [filters])

	async function getPackages() {
		await getPacked(filters, (response) => {
			setData(response.data)
			setTotalItem(response.totalRow)
		}).finally(() => {
			setLoading(false)
			setLoadingMore(false)
		})
	}

	async function getMoreData() {
		await getMorePacked(filters, (response) => {
			setData([...data, ...response.data])
			setTotalItem(response.totalRow)
		}).finally(() => {
			setLoading(false)
			setLoadingMore(false)
		})
	}

	function loadMoreData() {
		if (!loading && !loadingMore && data.length !== 0) {
			setLoadingMore(true)
			setFilters({ ...filters, pageIndex: filters.pageIndex + 1 })
		}
	}

	function onRefresh() {
		setFilters({ ...filters, pageIndex: 1 })
	}

	const [style, setStyle] = useState(1)

	const [deleting, setDeleting] = useState<boolean>(false)

	// Remove item đã xoá ra khõi mảng mà không cần gọi api
	function removeItem(params) {
		const idx = data.findIndex((item) => item?.Id == params)
		let temp = []
		if (idx != -1) {
			for (let i = 0; i < data.length; i++) {
				if (i != idx) {
					temp.push({ ...data[i] })
				}
			}
		}
		setData([...temp])
	}

	// Gọi api xoá item
	async function delThis(params) {
		setDeleting(true)
		try {
			const response = await packedApi.delete(params)
			if (response.status == 200) {
				ShowNostis.success('Thành công')
				removeItem(params)
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		} finally {
			setDeleting(false)
		}
	}

	const popRef = useRef(null)

	const dispatch = useDispatch()

	const [adding, setAdding] = useState<boolean>(true)

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
			setAdding(false)
		}
	}

	const _addToCart = async (item) => {
		setAdding(true)
		try {
			let res = await RestApi.post('Cart', { ProductId: item.Id, Quantity: 1 })
			if (res.status == 200) {
				getCartData()
				ShowNostis.success('Thành công')
			}
		} catch (error) {
			ShowNostis.error(error?.message)
			setAdding(false)
		}
	}

	return (
		<>
			<div className="max-w-[2000px]">
				<div className="cc-exam-header">
					<div className="max-w-[350px] mr-[8px] flex items-center">
						<div data-tut="reactour-switch">
							<div className="font-[600] ml-[4px]">Danh sách bộ đề</div>

							{/* @ts-ignore */}
							{/* <Segmented
								style={{ height: 36 }}
								onChange={(e) => setStyle(e == 'Kanban' ? 1 : 2)}
								options={[
									{ value: 'Kanban', icon: <AppstoreOutlined /> },
									{ value: 'List', icon: <BarsOutlined /> }
								]}
							/> */}
						</div>
					</div>

					<div className="flex items-center">
						<div data-tut="reactour-search" className="mr-[8px]">
							<CCSearch data-tut="reactour-search" onSubmit={(value) => setFilters({ ...filters, pageIndex: 1, search: value })} />
						</div>

						<CreatePackage onRefresh={onRefresh} />
					</div>
				</div>

				{(!loading || data.length > 0) && (
					<div>
						<div
							id="class-view"
							className="cc-exam-list-container ant-row-gap-y-8"
							style={{ paddingRight: 8, marginRight: isDesktop ? -23 : -16 }}
						>
							<InfiniteScroll
								dataLength={data.length}
								next={loadMoreData}
								hasMore={data.length < totalItem}
								loader={<Skeleton />}
								endMessage=""
								scrollableTarget="class-view"
							>
								<List
									grid={
										style == 1
											? {
													gutter: 16, // Khoảng cách giữa các item
													xs: 1, // Mặc định 1 cột cho màn hình nhỏ hơn 576px
													sm: 2, // 2 cột cho màn hình từ 576px trở lên
													md: 3, // 2 cột cho màn hình từ 768px trở lên
													lg: 3, // 2 cột cho màn hình từ 992px trở lên
													xl: 4, // 2 cột cho màn hình từ 1200px trở lên
													xxl: 5 // 2 cột cho màn hình từ 1600px trở lên
											  }
											: null
									}
									dataSource={data}
									className="pr-[8px]"
									renderItem={(item, index) => {
										const thisId = `pac-${index}-${item.Id}`

										return (
											<div key={thisId} id={thisId} className="pe-i-default">
												<img src={item?.Thumbnail || '/images/package-thumbnail.png'} className="pe-i-d-thumb" />

												{(is(userInfo).admin || is(userInfo).manager) && (
													<Popover
														ref={popRef}
														overlayClassName="show-arrow"
														content={
															<div>
																<Popconfirm
																	disabled={deleting}
																	onConfirm={() => delThis(item?.Id)}
																	title={`Xoá: ${item?.Name}`}
																	placement="left"
																>
																	<div className="pe-menu-item">
																		<BiTrash size={18} color="#E53935" className="ml-[-3px]" />
																		<div className="ml-[8px]">Xoá</div>
																	</div>
																</Popconfirm>

																<CreatePackage onOpen={() => popRef?.current?.close()} onRefresh={onRefresh} defaultData={item} isEdit />
															</div>
														}
														placement="leftTop"
														trigger="click"
													>
														<div className="pe-i-d-menu">
															<BsThreeDotsVertical size={16} color="#000" />
														</div>
													</Popover>
												)}

												<div className="p-[8px] pb-0 flex-1">
													<div className="pe-i-d-name">{item?.Name}</div>

													<div className="pe-i-d-user">
														<IoMdCart size={14} />
														<div className="pe-i-d-u-label">{parseToMoney(item?.TotalStudent || 0)} lượt mua</div>
													</div>

													<div className="flex items-center my-[4px] text-[#4a4a4a]">
														<div className="text-[14px] font-[500]">
															<ReadMoreText title="Mô tả đầy đủ" text={item?.Description} />
														</div>
													</div>

													<div className="pe-i-d-price mb-[-8px]">{parseToMoney(item?.Price || 0)}VNĐ</div>
												</div>

												<div className="pe-i-d-controller">
													{is(userInfo).student && item?.Status != 2 && (
														<div onClick={() => _addToCart(item)} className="pe-i-d-cart">
															<FaCartPlus size={14} />
															<div className="pe-i-d-c-title">Mua ngay</div>
														</div>
													)}

													{(is(userInfo).admin || is(userInfo).manager) && (
														<div
															className="pe-i-d-detail"
															onClick={() => Router.push({ pathname: '/package-exam/detail', query: { package: item?.Id } })}
														>
															<BiSolidDetail size={16} />
															<div className="pe-i-d-c-title">Chi tiết</div>
														</div>
													)}

													{is(userInfo).student && item?.Status == 2 && (
														<div
															className="pe-i-d-detail"
															onClick={() => Router.push({ pathname: '/package-exam/detail', query: { package: item?.Id } })}
														>
															<BiSolidDetail size={16} />
															<div className="pe-i-d-c-title">Chi tiết</div>
														</div>
													)}

													{is(userInfo).admin || (is(userInfo).manager && <DonatePackage onRefresh={onRefresh} item={item} />)}
												</div>
											</div>
										)
									}}
								/>
							</InfiniteScroll>
						</div>
					</div>
				)}
			</div>
		</>
	)
}

export default PackageExam
