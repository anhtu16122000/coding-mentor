import { Form, Popconfirm, Rate, Select } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { HiStar } from 'react-icons/hi'
import { RiShieldStarFill } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { feedbackStudentApi } from '~/api/feedbacks-student'
import { userInformationApi } from '~/api/user'
import { ModalLessonFeedback } from '~/common/components/Class/ModalLessonFeedback'
import IconButton from '~/common/components/Primary/IconButton'
import PrimaryTable from '~/common/components/Primary/Table'
import PrimaryTag from '~/common/components/Primary/Tag'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import { RootState } from '~/store'
import { ModalFeedback } from './ModalFeedback'
import Avatar from '~/common/components/Avatar'

export interface IFeedbacksStudentPageProps {}

export default function FeedbacksStudentPage(props: IFeedbacksStudentPageProps) {
	const userInformation = useSelector((state: RootState) => state.user.information)
	const [form] = Form.useForm()
	const initialParams = {
		pageIndex: 1,
		pageSize: PAGE_SIZE,
		userIds: userInformation?.RoleId === '3' ? userInformation.UserInformationId.toString() : ''
	}
	const [dataSource, setDataSource] = useState<IFeedbackStudent[]>([])
	const [totalRow, setTotalRow] = useState(0)
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [todoApi, setTodoApi] = useState(initialParams)
	const router = useRouter()
	const [apiParametersStudent, setApiParametersStudent] = useState({
		PageSize: 9999,
		PageIndex: 1,
		RoleIds: '3',
		parentIds: userInformation?.RoleId == '8' ? userInformation.UserInformationId.toString() : ''
	})
	const [students, setStudents] = useState<{ label: string; value: string }[]>([])

	const getUsers = async (param) => {
		try {
			const response = await userInformationApi.getAll(param)
			if (response.status == 200) {
				let temp = []
				response.data.data?.forEach((item) => {
					temp.push({ label: `${item?.FullName} - ${item.UserCode}`, value: item.UserInformationId })
				})
				setStudents(temp)
			}
			if (response.status == 204) {
				setStudents([])
			}
		} catch (error) {
			console.error(error)
		} finally {
		}
	}
	const getFeedbacks = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await feedbackStudentApi.getAll(todoApi)
			if (res.status == 200) {
				if (userInformation?.RoleId === '8') {
					if (todoApi.userIds && todoApi.userIds !== '') {
						setDataSource(res.data.data)
						setTotalRow(res.data.totalRow)
					} else {
						setDataSource([])
						setTotalRow(0)
					}
				} else {
					setDataSource(res.data.data)
					setTotalRow(res.data.totalRow)
				}
			}
			if (res.status == 204) {
				setTotalRow(0)
				setDataSource([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
		}
	}

	useEffect(() => {
		getFeedbacks()
	}, [todoApi])
	useEffect(() => {
		if (userInformation?.RoleId === '8') {
			getUsers(apiParametersStudent)
		}
	}, [])

	const handleChangeStudent = (val) => {
		if (val) {
			setTodoApi({ ...todoApi, userIds: val.toString() })
		} else {
			setTodoApi(initialParams)
		}
	}

	const handleChangeStatus = async (ID) => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await feedbackStudentApi.update({ Id: ID, Status: 3 })
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				getFeedbacks()
			}
			if (res.status == 204) {
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
		}
	}

	useEffect(() => {
		if (students && students?.length > 0) {
			setTodoApi({ ...todoApi, userIds: students[0].value?.toString() })
			form.setFieldValue('student', students[0].value)
		}
	}, [students])

	function isAdmin() {
		return userInformation?.RoleId == 1
	}

	function isTeacher() {
		return userInformation?.RoleId == 2
	}

	function isManager() {
		return userInformation?.RoleId == 4
	}

	function isStdent() {
		return userInformation?.RoleId == 3
	}

	function isAccountant() {
		return userInformation?.RoleId == 6
	}

	function isAcademic() {
		return userInformation?.RoleId == 7
	}

	function isParent() {
		return userInformation?.RoleId == 8
	}

	const columns = [
		{
			title: 'Tiêu đề',
			width: 270,
			dataIndex: 'Title',
			render: (text, item) => {
				return (
					<div className="feedback-student-title">
						<Avatar uri={item.Avatar} className="fb-student-avatar shadow-sm" alt="feedback-user-avatar" />
						<div>
							<p className="fb-student-name">{item.CreatedBy || 'Ẩn danh'}</p>
							<div style={{ color: '#9d9d9d', fontSize: 14 }}>{moment(item.CreateOn).format('DD/MM/YYYY HH:mm')}</div>
							<div className="">{text}</div>
						</div>
					</div>
				)
			}
		},
		{
			title: 'Nội dụng',
			width: 300,
			dataIndex: 'Content',
			render: (text) => {
				return <p className="table-row-main-text">{text}</p>
			}
		},
		{
			title: 'Rating',
			width: 170,
			dataIndex: 'StarRating',
			render: (text) => {
				return (
					<div className="custom-rating">
						<Rate defaultValue={text} disabled={true} />
					</div>
				)
			}
		},
		{
			title: 'Trạng thái',
			width: 140,
			dataIndex: 'StatusName',
			render: (text, item) => {
				return (
					<div>
						{item.Status == 1 && <PrimaryTag children={<span>{text}</span>} color="blue" />}
						{item.Status == 2 && <PrimaryTag children={<span>{text}</span>} color="yellow" />}
						{item.Status == 3 && <PrimaryTag children={<span>{text}</span>} color="green" />}
					</div>
				)
			}
		},
		{
			title: '',
			width: 100,
			dataIndex: 'Actions',
			render: (text, item) => {
				return (
					<div className="flex items-center">
						{!isStdent() && !isParent() && (
							<Popconfirm
								title="Bạn muốn hoàn thành phản hồi này?"
								onConfirm={() => handleChangeStatus(item.Id)}
								placement="topRight"
								disabled={item.Status == 3}
								onCancel={() => {}}
								okText="Xác nhận"
								cancelText="Hủy"
							>
								<IconButton
									type="button"
									icon="check"
									color={item.Status == 3 ? 'disabled' : 'green'}
									tooltip={item.Status == 3 ? 'Đã xong' : 'Hoàn tất phản hồi'}
								/>
							</Popconfirm>
						)}

						<IconButton
							type="button"
							icon="eye"
							color="blue"
							onClick={() => router.push({ pathname: '/info-course/feedbacks/detail', query: { feedbackId: item.Id } })}
							className=""
							tooltip="Chi tiết"
						/>
					</div>
				)
			}
		}
	]

	return (
		<>
			<PrimaryTable
				total={totalRow}
				loading={isLoading.type == 'GET_ALL' && isLoading.status}
				onChangePage={(event: number) => setTodoApi({ ...todoApi, pageIndex: event })}
				columns={columns}
				data={dataSource}
				Extra={
					userInformation?.RoleId === '8' ? (
						<>
							<Form form={form}>
								<Form.Item name="student">
									<Select allowClear className="w-[200px]" onChange={handleChangeStudent} options={students} placeholder="Chọn học viên" />
								</Form.Item>
							</Form>
						</>
					) : userInformation?.RoleId === '3' ? (
						<ModalFeedback mode="add" onRefresh={() => getFeedbacks()} />
					) : (
						''
					)
				}
			/>
		</>
	)
}
