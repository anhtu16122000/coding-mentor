import { Card, Input, List, Popover } from 'antd'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import { FiFilter } from 'react-icons/fi'
import { SeminarApi } from '~/api/course/seminar/seminar'
import { VideoCourseApi } from '~/api/course/video-course/video-course'
import { userInformationApi } from '~/api/user'
import ModalSeminar from '~/common/components/Course/Seminar/ModalSeminar'
import SeminarItem from '~/common/components/Course/Seminar/SeminarItem'
import MainLayout from '~/common/components/MainLayout'
import SortBase from '~/common/components/Primary/SortBase'
import { ShowNoti } from '~/common/utils'
import { parseSelectArray, parseStringToNumber } from '~/common/utils/common'

moment.locale('vi')
export default function Seminar(props) {
	const [dataSource, setDataSource] = useState<ISeminar[]>()
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [visible, setVisible] = useState(false)
	const [todoApi, setTodoApi] = useState({ pageIndex: 1, pageSize: 8, name: '', status: '' })
	const [totalPage, setTotalPage] = useState(0)
	const [userRoleId, setUserRoleId] = useState(null)
	const [selectOptions, setSelectOptions] = useState({ videoCourseList: [], teacherList: [] })

	useEffect(() => {
		setUserRoleId(JSON.parse(localStorage.getItem('userData')).user.RoleId)
	}, [])

	const getPagination = (pageNumber: number) => {
		setTodoApi({ ...todoApi, pageIndex: pageNumber })
	}

	const getDataSource = async () => {
		setIsLoading({ type: '', status: true })
		try {
			let res = await SeminarApi.getAll(todoApi)
			if (res.status == 200) {
				setDataSource(res.data.data)
				setTotalPage(res.data.totalRow)
			}
			if (res.status == 204) {
				setDataSource([])
				setTotalPage(0)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
		}
	}

	const listApi = [
		{
			api: VideoCourseApi,
			name: 'videoCourseList',
			params: { pageIndex: 1, pageSize: 99999999 },
			parseKey: { title: 'Name', value: 'Id' }
		},

		{
			api: userInformationApi,
			name: 'teacherList',
			params: { pageIndex: 1, pageSize: 99999999, roleIds: '1,2' },
			parseKey: { title: 'FullName', value: 'UserInformationId' }
		}
	]

	const getDataSelectOptions = async () => {
		setIsLoading({ type: '', status: true })
		try {
			let res = await Promise.all([listApi.map((item) => item.api.getAll(item.params))])
				.then((resList) => {
					const newOptionList = {
						videoCourseList: [],
						teacherList: []
					}
					listApi.forEach((item, index) => {
						resList[0][index].then((res) => {
							if (res.status == 200) {
								newOptionList[item.name] = parseSelectArray(res.data.data, item.parseKey.title, item.parseKey.value)
								setSelectOptions({ ...newOptionList, [item.name]: newOptionList[item.name] })
							}
							if (res.status == 204) {
								newOptionList[item.name] = []
								setSelectOptions({ ...newOptionList, [item.name]: newOptionList[item.name] })
							}
						})
					})
				})
				.catch((error) => {
					ShowNoti('error', error.message)
				})
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
		}
	}

	useEffect(() => {
		if (userRoleId && userRoleId != '3') {
			getDataSelectOptions()
		}
	}, [userRoleId])

	useEffect(() => {
		getDataSource()
	}, [todoApi])

	const _onSubmit = async (data) => {
		let submitData = {
			Description: data.Description,
			EndTime: moment(data.EndTime).format('YYYY-MM-DD HH:mm:ss'),
			StartTime: moment(data.StartTime).format('YYYY-MM-DD HH:mm:ss'),
			LeaderId: data.LeaderId,
			Member: data.mode == 'add' || data.mode == 'edit' ? parseStringToNumber(data.Member) : null,
			Name: data.Name,
			VideoCourseId: data.VideoCourseId,
			Thumbnail: data.Thumbnail
		}

		setIsLoading({ type: 'SUBMIT', status: true })
		let res = null
		try {
			if (data.mode == 'add') {
				res = await SeminarApi.add(submitData)
			} else if (data.mode == 'edit') {
				res = await SeminarApi.update({ ...submitData, Id: data.Id })
			} else {
				res = await SeminarApi.delete(data.Id)
			}
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				return res
			}
		} catch (error) {
			ShowNoti('error', error.message)
			return error
		} finally {
			setIsLoading({ type: 'SUBMIT', status: false })
		}
	}

	const handleVisibleChange = (newVisible: boolean) => {
		setVisible(newVisible)
	}

	return (
		<div className="w-full container antd-custom-wrap">
			<Card
				style={{ width: '100%' }}
				title={
					<>
						<div className="smartphone:hidden tablet:block">
							<Input.Search
								className="w-48 mr-4 primary-search"
								placeholder="Tìm kiếm"
								onSearch={(e) => setTodoApi({ ...todoApi, name: e })}
							/>
							<SortBase
								optionList={[
									{ paramsKey: 'status', title: 'Tất cả', value: '' },
									{ paramsKey: 'status', title: 'Chưa diễn ra', value: 'ChuaDienRa' },
									{ paramsKey: 'status', title: 'Đang diễn ra', value: 'DangDienRa' },
									{ paramsKey: 'status', title: 'Kết thúc', value: 'KetThuc' }
								]}
								handleChange={(event) => setTodoApi({ ...todoApi, ...event })}
								text="Chọn trạng thái"
							/>
						</div>

						<div className="smartphone:block tablet:hidden">
							<Popover
								content={
									<>
										<div>
											<Input.Search className="w-48 mb-3" placeholder="Tìm kiếm" onSearch={(e) => setTodoApi({ ...todoApi, name: e })} />
										</div>
										<div>
											<SortBase
												optionList={[
													{ paramsKey: 'status', title: 'Tất cả', value: '' },
													{ paramsKey: 'status', title: 'Chưa diễn ra', value: 'ChuaDienRa' },
													{ paramsKey: 'status', title: 'Đang diễn ra', value: 'DangDienRa' },
													{ paramsKey: 'status', title: 'Kết thúc', value: 'KetThuc' }
												]}
												handleChange={(event) => setTodoApi({ ...todoApi, ...event })}
												text="Chọn trạng thái"
											/>
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
					userRoleId == '1' && (
						<ModalSeminar
							mode="add"
							isLoading={isLoading}
							onSubmit={_onSubmit}
							selectOptions={selectOptions}
							onFetchData={() => setTodoApi({ ...todoApi })}
						/>
					)
				}
				loading={isLoading.type == 'GET_ALL_COURSE' && isLoading.status}
			>
				<List
					itemLayout="horizontal"
					dataSource={dataSource}
					grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
					renderItem={(item) => (
						<SeminarItem
							item={item}
							isLoading={isLoading}
							onSubmit={_onSubmit}
							selectOptions={selectOptions}
							onFetchData={() => {
								setTodoApi({ ...todoApi })
							}}
						/>
					)}
					pagination={{
						onChange: getPagination,
						total: totalPage,
						pageSize: 8,
						size: 'small',
						defaultCurrent: todoApi.pageIndex,
						showTotal: () => (
							<p className="font-weight-black" style={{ marginTop: 2, color: '#000' }}>
								Tổng cộng: {totalPage}
							</p>
						)
					}}
				/>
			</Card>
		</div>
	)
}

Seminar.Layout = MainLayout
