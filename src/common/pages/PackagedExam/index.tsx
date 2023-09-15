import { List, Popconfirm, Popover, Segmented, Skeleton } from 'antd'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import dynamic from 'next/dynamic'
import { FaCartPlus, FaEdit, FaGift, FaQuestionCircle } from 'react-icons/fa'
import { isDesktop } from 'react-device-detect'
import { PrimaryTooltip } from '~/common/components'
import CCSearch from '~/common/components/CCSearch'
import { getMorePacked, getPacked } from './util'
import { is, parseToMoney } from '~/common/utils/common'
import { IoMdCart } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { BiTrash } from 'react-icons/bi'
import { packedApi } from '~/api/packed'
import { ShowNostis } from '~/common/utils'
import CreatePackage from './CreatePackage'

const Tour = dynamic(() => import('reactour'), { ssr: false })

const initParameters = { search: '', pageIndex: 1, pageSize: 22 }

function PackageExam() {
	const [filters, setFilters] = useState(initParameters)

	const [data, setData] = useState([])
	const [totalItem, setTotalItem] = useState(0)

	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(true)

	const userInfo = useSelector((state: RootState) => state.user.information)

	console.log('---- Packages: ', data)

	useEffect(() => {
		if (filters.pageIndex == 1) {
			getPackages()
		} else {
			getMoreData()
		}
	}, [filters])

	async function getPackages() {
		console.log('----- getPackages')

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

	// -----------------------------------------------------------------

	const [isTourOpen, setIsTourOpen] = useState(false)

	const accentColor = '#0a89ff'

	const disableBody = (target) => disableBodyScroll(target)
	const enableBody = (target) => enableBodyScroll(target)

	const closeTour: any = () => {
		setIsTourOpen(false)
	}

	const openTour = () => {
		setIsTourOpen(true)
	}

	// You might need to adjust this part depending on your use case.
	useEffect(() => {
		if (isTourOpen) {
			disableBody(document.querySelector('.helper'))
		} else {
			enableBody(document.querySelector('.helper'))
		}
	}, [isTourOpen])

	const tourConfig = [
		{
			selector: '[data-tut="reactour-create"]',
			content: `Tạo một đề mới thật dễ dàng bằng cách nhấn vào đây`
		},
		{
			selector: '[data-tut="reactour-search"]',
			content: `Tìm kiếm đề bằng cập nhập tên đề hoặc mã đề vào đây`
		},
		{
			selector: '[data-tut="reactour-switch"]',
			content: `Thay đổi phong cách hiển thị`
		},
		{
			selector: '[data-tut="reactour-information"]',
			content: `Bấm vào đây để xem và cập nhật thông tin đề`
		}
	]

	function handleReset() {
		setFilters(initParameters)
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

	return (
		<>
			<div className="max-w-[2000px]">
				<div className="cc-exam-header">
					<div className="max-w-[350px] mr-[8px] flex items-center">
						{/* <PrimaryTooltip id="exam-x" content="Hướng dẫn sử dụng" place="right">
							<div onClick={openTour} className="cc-exam-btn-tour">
								<FaQuestionCircle size={20} color="#1b73e8" />
							</div>
						</PrimaryTooltip> */}

						<div data-tut="reactour-switch">
							{/* @ts-ignore */}
							<Segmented
								style={{ height: 36 }}
								onChange={(e) => setStyle(e == 'Kanban' ? 1 : 2)}
								options={[
									{ value: 'Kanban', icon: <AppstoreOutlined /> },
									{ value: 'List', icon: <BarsOutlined /> }
								]}
							/>
						</div>

						{/* <FilterExam className="ml-[8px]" onReset={handleReset} onSubmit={(event) => setFilters(event)} /> */}
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
						<div id="class-view" className="cc-exam-list-container" style={{ paddingRight: 8, marginRight: isDesktop ? -23 : -16 }}>
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

												{is(userInfo).admin && (
													<Popover
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

																<div className="pe-menu-item mt-[8px]">
																	<FaEdit size={16} color="#1b73e8" />
																	<div className="ml-[8px]">Chỉnh sửa</div>
																</div>
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

												<div className="p-[8px]">
													<div className="pe-i-d-name">{item?.Name}</div>

													<div className="pe-i-d-user">
														<IoMdCart size={14} />
														<div className="pe-i-d-u-label">{parseToMoney(item?.TotalStudent || 0)} lượt mua</div>
													</div>

													<div className="flex items-center my-[4px] text-[#4a4a4a]">
														<div className="text-[14px] font-[500]">{item?.Description}</div>
													</div>

													<div className="pe-i-d-price">{parseToMoney(item?.Price || 0)}VNĐ</div>

													<div className="pe-i-d-controller">
														<div className="pe-i-d-cart">
															<FaCartPlus size={14} />
															<div className="pe-i-d-c-title">Mua ngay</div>
														</div>

														{is(userInfo).admin && (
															<div className="pe-i-d-gift">
																<FaGift size={14} />
																<div className="pe-i-d-g-title">Tặng</div>
															</div>
														)}
													</div>
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
