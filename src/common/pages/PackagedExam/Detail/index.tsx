import { List, Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { isDesktop } from 'react-device-detect'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { packedApi } from '~/api/packed'
import { ShowNostis, ShowNoti } from '~/common/utils'
import { getMoregetPackageSection, getPackageSection } from './util'
import { useRouter } from 'next/router'
import FormPackageSection from './FormModal'
import PackageDetailItem from './RenderItem'
import { packageSectionApi } from '~/api/packed/packages-section'

const initParameters = { search: '', pageIndex: 1, pageSize: 22 }

function PackageExamDetail() {
	const [filters, setFilters] = useState(initParameters)

	const router = useRouter()

	const [currentPackage, setCurrentPackage] = useState(null)

	const [data, setData] = useState([])
	const [totalItem, setTotalItem] = useState(0)

	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(true)

	const [packageDetail, setPackageDetail] = useState<any>(null)

	const userInfo = useSelector((state: RootState) => state.user.information)

	useEffect(() => {
		if (!!router?.query?.package) {
			setCurrentPackage(parseInt(router?.query?.package + ''))
		}
	}, [router])

	useEffect(() => {
		if (!!currentPackage) {
			getPackageDetail()

			if (filters.pageIndex == 1) {
				getPackages()
			} else {
				getMoreData()
			}
		}
	}, [filters, currentPackage])

	async function getPackageDetail() {
		try {
			const response = await packedApi.getByID(currentPackage)
			if (response.status == 200) {
				setPackageDetail(response.data?.data)
			} else {
				setPackageDetail(null)
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
	}

	async function getPackages() {
		await getPackageSection({ ...filters, packageId: currentPackage }, (response) => {
			setData(response.data)
			setTotalItem(response.totalRow)
		}).finally(() => {
			setLoading(false)
			setLoadingMore(false)
		})
	}

	async function getMoreData() {
		await getMoregetPackageSection({ ...filters, packageId: currentPackage }, (response) => {
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

	function handleReset() {
		setFilters(initParameters)
	}

	const [style, setStyle] = useState(2) // Mốt update thêm loại hiển thị

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
			const response = await packageSectionApi.delete(params)
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
						<div data-tut="reactour-switch">
							<div className="font-[600]">{packageDetail?.Name || 'Chi tiết bộ đề'}</div>
						</div>
					</div>

					<div className="flex items-center">
						<FormPackageSection packageId={currentPackage} onRefresh={onRefresh} />
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
									className="pr-[16px]"
									renderItem={(item, index) => {
										const thisId = `pac-${index}-${item.Id}`

										return (
											<PackageDetailItem
												thisId={thisId}
												item={item}
												currentPackage={currentPackage}
												onRefresh={onRefresh}
												onDelete={() => delThis(item?.Id)}
												deleting={deleting}
											/>
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

export default PackageExamDetail
