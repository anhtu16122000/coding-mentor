import { Card, Input, List, Modal, Popover } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { VideoCourseStudentApi } from '~/api/course/video-course-student/video-course-student'
import { VideoCourseApi } from '~/api/course/video-course/video-course'
import ModalAddVideoCourse from '~/common/components/Course/VideoCourse/ModalAddVideoCourse'
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

const VideoCourse = () => {
	const [showFirework, setShowFirework] = useState(false)
	const [showModalSuccess, setShowModalSuccess] = useState(false)
	const [visible, setVisible] = useState(false)
	const [userRoleId, setUserRoleId] = useState(null)
	const [isLoading, setIsLoading] = useState({ type: 'GET_ALL_COURSE', status: false })
	const [dataSource, setDataSource] = useState<IVideoCourse[]>()
	const [prerequisiteCourse, setPrerequisiteCourse] = useState<ISelectOptionList[]>()
	const [todoApi, setTodoApi] = useState({ pageSize: 8, pageIndex: 1, Name: '', sort: 1, sortType: false })
	const [totalPage, setTotalPage] = useState(0)

	const user = useSelector((state: RootState) => state.user.information)

	useEffect(() => {
		if (user) {
			setUserRoleId(user.RoleId)
		}
	}, [])

	const getDataSource = async () => {
		setIsLoading({ type: 'GET_ALL_COURSE', status: true })
		try {
			let res = await VideoCourseApi.getAll(todoApi)
			if (res.status == 200) {
				setDataSource(res.data.data)
				setTotalPage(res.data.totalRow)
				setPrerequisiteCourse(parseSelectArray(res.data.data, 'Name', 'Id'))
			}
			if (res.status == 204) {
				setDataSource([])
				setTotalPage(0)
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET_ALL_COURSE', status: false })
		}
	}

	const getDataPrerequisite = async () => {
		setIsLoading({ type: 'GET_ALL_COURSE', status: true })
		try {
			let res = await VideoCourseApi.getAll({ pageIndex: 1, pageSize: 9999999 })
			if (res.status == 200) {
				setPrerequisiteCourse(parseSelectArray(res.data.data, 'Name', 'Id'))
			}
			if (res.status == 204) {
				setPrerequisiteCourse([])
				setTotalPage(0)
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET_ALL_COURSE', status: false })
		}
	}

	useEffect(() => {
		getDataSource()
		getDataPrerequisite()
	}, [todoApi])

	// HANDLE CHANGE PAGE
	const getPagination = (pageNumber: number) => {
		setTodoApi({ ...todoApi, pageIndex: pageNumber })
	}

	const onCreateCourse = async (data) => {
		setIsLoading({ type: 'SUBMIT_COURSE', status: true })
		try {
			let res = await VideoCourseApi.add(data)
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				getDataSource()
				getDataPrerequisite()
				return true
			}
		} catch (error) {
			ShowNoti('success', error.message)
		} finally {
			setIsLoading({ type: 'SUBMIT_COURSE', status: false })
		}
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

	return (
		<>
			<Fireworks showFirework={showFirework} />
			<Modal width={600} centered visible={showModalSuccess} footer={null} onCancel={handleCancel}>
				<div className="text-center">
					<Lottie loop animationData={successAnimate} play className="inner w-[250px] mx-auto" />
					<div className="my-4 text-[26px]">
						<span className="font-bold text-tw-green">Chúc mừng</span> bạn đã nhận được chứng chỉ
					</div>
					<Link href="/course/video-course-student">
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
								<Input.Search className="w-48 mr-4" placeholder="Tìm khóa học" onSearch={(e) => setTodoApi({ ...todoApi, Name: e })} />
								<SortVideoCourse handleChange={(event) => setTodoApi({ ...todoApi, ...event })} text="Khóa học" />
							</div>

							<div className="smartphone:block tablet:hidden">
								<Popover
									content={
										<>
											<div>
												<Input.Search
													className="w-48 mb-3 primary-search"
													placeholder="Tìm khóa học"
													onSearch={(e) => setTodoApi({ ...todoApi, Name: e })}
												/>
											</div>
											<div>
												<SortVideoCourse handleChange={(event) => setTodoApi({ ...todoApi, ...event })} text="Khóa học" />
											</div>
										</>
									}
									title="Tìm kiếm"
									trigger="click"
									visible={visible}
									onVisibleChange={handleVisibleChange}
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
							{userRoleId == '1' && (
								<ModalAddVideoCourse mode="add" prerequisiteCourse={prerequisiteCourse} isLoading={isLoading} onSubmit={onCreateCourse} />
							)}
							{userRoleId == '3' && (
								<PrimaryButton onClick={handleCreateCertificate} background="green" icon="add" type="button">
									Tạo chứng chỉ
								</PrimaryButton>
							)}
						</>
					}
					loading={isLoading.type == 'GET_ALL_COURSE' && isLoading.status}
				>
					<List
						itemLayout="horizontal"
						dataSource={dataSource}
						grid={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
						renderItem={(item) => (
							<VideoCourseItem
								UserRoleID={userRoleId}
								onFetchData={() => setTodoApi({ ...todoApi })}
								Item={item}
								prerequisiteCourse={prerequisiteCourse}
							/>
						)}
						pagination={{
							onChange: getPagination,
							total: totalPage,
							pageSize: 8,
							size: 'small',
							defaultCurrent: todoApi.pageIndex,
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
