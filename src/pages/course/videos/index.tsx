import { Card, Input, List, Modal, Popover, TreeSelect } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { VideoCourseStudentApi } from '~/api/course/video-course-student/video-course-student'
import { VideoCourseApi } from '~/api/course/video-course/video-course'
import CreateVideoCourse from '~/common/components/Course/VideoCourse/CreateVideoCourse'
import SortVideoCourse from '~/common/components/Course/VideoCourse/SortVideoCourse'
import VideoCourseItem from '~/common/components/Course/VideoCourse/VideoCourseItem'
import MainLayout from '~/common/components/MainLayout'
import PrimaryButton from '~/common/components/Primary/Button'
import { ShowNoti } from '~/common/utils'
import { parseSelectArray } from '~/common/utils/common'
import { RootState } from '~/store'
import Lottie from 'react-lottie-player'

import successAnimate from '~/common/components/json/congratulation-success.json'
import Link from 'next/link'
import { FiFilter } from 'react-icons/fi'
import Fireworks from '~/common/components/Fireworks'
import RestApi from '~/api/RestApi'

const url = 'product'

const VideoCourse = () => {
	const [showFirework, setShowFirework] = useState(false)
	const [showModalSuccess, setShowModalSuccess] = useState(false)
	const [visible, setVisible] = useState(false)
	const [userRoleId, setUserRoleId] = useState(null)
	const [isLoading, setIsLoading] = useState({ type: 'GET_ALL_COURSE', status: false })
	const [data, setdata] = useState<IVideoCourse[]>([])
	const [totalPage, setTotalPage] = useState(0)

	const [filters, setFilters] = useState({
		pageSize: 8,
		pageIndex: 1,
		type: 1,
		sort: 0,
		sortType: 0,
		search: null
	})

	const user = useSelector((state: RootState) => state.user.information)

	useEffect(() => {
		getData()
	}, [filters])

	useEffect(() => {
		if (user) {
			setUserRoleId(user.RoleId)
		}
	}, [])

	const getData = async () => {
		setIsLoading({ type: 'GET_ALL_COURSE', status: true })
		try {
			let res = await RestApi.get<any>(url, filters)
			if (res.status == 200) {
				setdata(res.data.data)
				setTotalPage(res.data.totalRow)
			}
			if (res.status == 204) {
				setdata([])
				setTotalPage(0)
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET_ALL_COURSE', status: false })
		}
	}

	// HANDLE CHANGE PAGE
	const getPagination = (pageNumber: number) => {
		setFilters({ ...filters, pageIndex: pageNumber })
	}

	const handleCreateCertificate = async () => {
		try {
			const response = await VideoCourseStudentApi.createCertificate()
			if (response.status === 200) {
				setShowFirework(true)
				setTimeout(() => {
					setShowFirework(false)
					setShowModalSuccess(true)
				}, 6000)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	const handleCancel = () => {
		setShowModalSuccess(false)
	}

	const handleVisibleChange = (newVisible: boolean) => {
		setVisible(newVisible)
	}

	function onRefresh() {
		if (filters?.pageIndex > 1) {
			setFilters({ ...filters, pageIndex: 1 })
		} else {
			getData()
		}
	}

	return (
		<>
			<Fireworks showFirework={showFirework} />

			<Modal width={600} centered visible={showModalSuccess} footer={null} onCancel={handleCancel}>
				<div className="text-center">
					<Lottie loop animationData={successAnimate} play className="inner w-[250px] mx-auto" />
					<div className="my-4 text-[26px]">
						<span className="font-bold text-tw-green">Chúc mừng</span> bạn đã nhận được chứng chỉ
					</div>
					<Link href="/course/videos-student">
						<a className="none-selection rounded-lg h-[38px] px-3 w-auto inline-flex items-center justify-center bg-tw-green hover:bg-[#5E875F] focus:bg-[#5E875F] text-white font-semibold text-lg">
							Xem chứng chỉ
						</a>
					</Link>
				</div>
			</Modal>

			<div className="container antd-custom-wrap">
				<Card
					style={{ width: '100%' }}
					title={
						<>
							<div className="smartphone:hidden tablet:block">
								<Input.Search className="w-48 mr-4" placeholder="Tìm khóa học" onSearch={(e) => setFilters({ ...filters, search: e })} />
								<SortVideoCourse handleChange={(event) => setFilters({ ...filters, ...event })} text="Khóa học" />
							</div>
							<div className="smartphone:block tablet:hidden">
								<Popover
									content={
										<>
											<div>
												<Input.Search
													className="w-48 mb-3 primary-search"
													placeholder="Tìm khóa học"
													onSearch={(e) => setFilters({ ...filters, search: e })}
												/>
											</div>
											<div>
												<SortVideoCourse handleChange={(event) => setFilters({ ...filters, ...event })} text="Khóa học" />
											</div>
										</>
									}
									title="Tìm kiếm"
									trigger="click"
									open={visible}
									onOpenChange={handleVisibleChange}
									placement="bottomLeft"
								>
									<div className="h-[36px] w-[36px] bg-tw-gray cursor-pointer rounded flex items-center justify-center">
										<FiFilter className="text-3xl" size={20} />
									</div>
								</Popover>
							</div>
						</>
					}
					extra={
						<>
							{userRoleId == '1' && <CreateVideoCourse onRefresh={onRefresh} />}
							{/* {userRoleId == '3' && (
								<PrimaryButton onClick={handleCreateCertificate} background="green" icon="add" type="button">
									Tạo chứng chỉ
								</PrimaryButton>
							)} */}
						</>
					}
					loading={isLoading.type == 'GET_ALL_COURSE' && isLoading.status}
				>
					<List
						className="mx-[-8px]"
						itemLayout="horizontal"
						dataSource={data}
						grid={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
						renderItem={(item) => (
							<VideoCourseItem UserRoleID={userRoleId} onFetchData={() => setFilters({ ...filters })} Item={item} onRefresh={onRefresh} />
						)}
						pagination={{
							onChange: getPagination,
							total: totalPage,
							pageSize: 8,
							size: 'small',
							defaultCurrent: filters.pageIndex,
							showTotal: () =>
								totalPage && (
									<p className="font-weight-black" style={{ marginTop: 2, color: '#000' }}>
										Tổng cộng: {totalPage}
									</p>
								)
						}}
					/>
				</Card>
			</div>
		</>
	)
}

VideoCourse.Layout = MainLayout
export default VideoCourse
