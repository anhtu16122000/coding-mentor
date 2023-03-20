import { Modal, Pagination, Popover, Tag, Tooltip } from 'antd'
import moment from 'moment'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import { BsCalendar3, BsCalendarDate } from 'react-icons/bs'
import { FiBook } from 'react-icons/fi'
import { HiOutlineAcademicCap, HiOutlineBookOpen, HiOutlineUsers } from 'react-icons/hi'
import { MdOutlineAttachMoney, MdOutlineBookmarkAdded, MdOutlineBookmarkBorder, MdOutlineGrade } from 'react-icons/md'
import { RiComputerLine } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { classApi } from '~/api/class'
import { userInformationApi } from '~/api/user'
import { ShowNoti } from '~/common/utils'
import { parseSelectArray, parseToMoney } from '~/common/utils/common'
import { RootState } from '~/store'
import AvatarComponent from '../AvatarComponent'
import DeleteTableRow from '../Elements/DeleteTableRow'
import PrimaryButton from '../Primary/Button'
import UpdateClassForm from './UpdateClassForm'

type IClassListContent = {
	totalRow?: number
	isLoading?: boolean
	dataSource: any
	setTodoApi?: Function
	listTodoApi?: any
	todoApi?: any
	getAllClass?: Function
}
export const ClassListContent: React.FC<IClassListContent> = ({
	isLoading,
	dataSource,
	setTodoApi,
	listTodoApi,
	totalRow,
	todoApi,
	getAllClass
}) => {
	const [academic, setAcademic] = useState([])
	const state = useSelector((state: RootState) => state)
	const { information: userInformation } = state.user
	const [isLoadingDelete, setIsLoadingDelete] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState({ id: null, open: null })
	const [showPop, setShowPop] = useState('')

	const checkStatus = (statusID, statusName) => {
		const rs = ['gold', 'blue', 'default']
		return (
			<div className="custom-tag-ant">
				<Tag color={`${rs[statusID - 1]}`}>{statusName}</Tag>
				{/* <span className={`tag ${rs[statusID - 1]}`} style={{ marginBottom: 8, textAlign: 'center' }}>
					{statusName}
				</span> */}
			</div>
		)
	}
	const returnPathName = (item) => {
		if (!userInformation) return ''
		let role = userInformation?.RoleId
		let path = null
		if (role == 1 || role == 5) {
			path = {
				pathname: '/class/list-class/detail',
				query: { class: item?.Id, CurriculumId: item?.CurriculumId, BranchId: item?.BranchId }
			}
		} else {
			path = {
				pathname: '/class/list-class/detail',
				query: { class: item?.Id, CurriculumId: item?.CurriculumId, BranchId: item?.BranchId }
			}
		}

		return path
	}

	const handleTutoring = (item) => {
		if (!userInformation) return ''
		let role = userInformation?.RoleId
		let path = null

		if (role == 1 || role == 5) {
			path = {
				pathname: '/class/list-class/tutoring',
				// , type: TypeCourse, CourseName
				// query: { slug: ID, name: CourseName, CurriculumId: CurriculumId, BranchId: BranchId, ProgramId: ProgramId, Type: Type }
				query: { class: item?.Id, CurriculumId: item?.CurriculumId, BranchId: item?.BranchId }
			}
		} else {
			path = {
				pathname: '/class/list-class/tutoring',
				query: { class: item?.Id, CurriculumId: item?.CurriculumId, BranchId: item?.BranchId }
			}
		}

		return path
	}
	const getAllAcademic = async () => {
		try {
			const res = await userInformationApi.getAll({ roleIds: '7' })
			if (res.status === 200) {
				const convertData = parseSelectArray(res.data.data, 'FullName', 'UserInformationId')
				setAcademic(convertData)
			}
			if (res.status === 204) {
				setAcademic([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}
	const handleDelete = async (Id) => {
		setIsLoadingDelete(true)
		try {
			const res = await classApi.deleteClass(Id)
			if (res.status === 200) {
				setTodoApi(listTodoApi)
				setIsModalOpen({ id: Id, open: false })
				getAllClass()
				ShowNoti('success', res.data.message)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoadingDelete(false)
		}
	}
	const handleCheckExistStudentInClass = async (Id) => {
		try {
			const res = await classApi.checkExistStudentInClass(Id)
			if (res.status === 200) {
				if (res.data.data === true) {
					setIsModalOpen({ id: Id, open: true })
				} else {
					handleDelete(Id)
				}
				return res
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	useEffect(() => {
		if (userInformation?.RoleId == 1) {
			getAllAcademic()
		}
	}, [])

	return (
		<div className="content-class">
			{dataSource?.map((item) => (
				<div className="item">
					<div className="inner-item">
						<div className="header">
							<div className="header-inner">
								<div className="status">{checkStatus(item.Status, item.StatusName)}</div>
								<div className="action">
									<Popover
										open={showPop == item?.Id}
										onOpenChange={(event) => setShowPop(event ? item?.Id : '')}
										placement="left"
										trigger="click"
										content={
											<div>
												<UpdateClassForm
													getAllClass={getAllClass}
													setShowPop={setShowPop}
													dataRow={item}
													setTodoApi={setTodoApi}
													listTodoApi={listTodoApi}
													academic={academic}
												/>
												<DeleteTableRow
													setShowPop={setShowPop}
													text={`${item.Name}`}
													handleDelete={() => handleCheckExistStudentInClass(item.Id)}
												/>
												<Modal
													title="Xác nhận xóa"
													open={item.Id === isModalOpen.id ? isModalOpen.open : false}
													onCancel={() => setIsModalOpen({ ...isModalOpen, open: false })}
													footer={
														<PrimaryButton
															onClick={() => handleDelete(item.Id)}
															background="blue"
															type="button"
															icon="remove"
															disable={isLoadingDelete}
															loading={isLoadingDelete}
														>
															Xóa
														</PrimaryButton>
													}
												>
													<p>
														Lớp học đang có <span className="font-medium text-[#1b73e8]">{item.TotalStudent}</span> học viên. Bạn có chắc
														muốn xóa?
													</p>
												</Modal>
											</div>
										}
										title={null}
									>
										<button>
											<BiDotsHorizontalRounded size={22} color="#fff" />
										</button>
									</Popover>
								</div>
							</div>
						</div>
						<div className="image">
							<AvatarComponent url={item.Thumbnail} type="class" />
						</div>
						<div className="content">
							<div className="content-body">
								<div className="title">
									{item?.Type !== 3 ? (
										<Link href={returnPathName(item)}>
											<Tooltip title={item?.Name}>
												<a className="font-medium hover:underline">{item.Name}</a>
											</Tooltip>
										</Link>
									) : (
										<Link href={handleTutoring(item)}>
											<a>
												<Tooltip title={item?.Name}>
													<a className="font-medium hover:underline">{item.Name}</a>
												</Tooltip>
											</a>
										</Link>
									)}
								</div>

								<div className="inner-body">
									<Tooltip title="Chuyên môn">
										{item.GradeName && (
											<div className="i">
												<div className="icn">
													<MdOutlineGrade />
												</div>
												<p>{item.GradeName}</p>
											</div>
										)}
									</Tooltip>
									<Tooltip title="Hình thức">
										{item.TypeName && (
											<div className="i">
												<div className="icn">
													<FiBook />
												</div>
												<p>{item.TypeName}</p>
											</div>
										)}
									</Tooltip>
									<Tooltip title="Chương trình">
										{item.ProgramName && (
											<div className="i">
												<div className="icn">
													<RiComputerLine />
												</div>
												<p>{item.ProgramName}</p>
											</div>
										)}
									</Tooltip>
									<Tooltip title="Giáo trình">
										{item.CurriculumName && (
											<div className="i">
												<div className="icn">
													<HiOutlineBookOpen />
												</div>
												<p>{item.CurriculumName}</p>
											</div>
										)}
									</Tooltip>
									<Tooltip title="Học phí">
										{userInformation && userInformation?.RoleId == 1 && (
											<div className="i">
												<div className="icn">
													<MdOutlineAttachMoney />
												</div>
												<p>{parseToMoney(item.Price)} VNĐ</p>
											</div>
										)}
									</Tooltip>
									<Tooltip title="Học vụ">
										{item.AcademicName && (
											<div className="i">
												<div className="icn">
													<HiOutlineAcademicCap />
												</div>
												<p>{item.AcademicName}</p>
											</div>
										)}
									</Tooltip>
								</div>
								<div className="inner-body-top">
									<p>
										Số buổi học: <span>{item.TotalLesson}</span>
									</p>
									<p>
										Số buổi đã học: <span>{item.LessonCompleted || 0}</span>
									</p>
								</div>
							</div>
						</div>
						<div className="line"></div>
						<div className="footer-s">
							<Popover content="Số học viên">
								<div className="item">
									<div className="icon">
										<HiOutlineUsers size={12} />
									</div>
									<p>
										{`${item.TotalStudent || 0}`}
										{item.MaxQuantity && userInformation?.RoleId == 1 && `/${item.MaxQuantity}`}
									</p>
								</div>
							</Popover>
							<Popover content="Thời gian bắt đầu - kết thúc">
								<div className="item">
									<div className="icon">
										<BsCalendar3 size={12} />
									</div>
									<p>{`${item.StartDay ? moment(item.StartDay).format('DD/MM/YYYY') : 'Trống'} - ${
										item.EndDay ? moment(item.EndDay).format('DD/MM/YYYY') : 'Trống'
									}`}</p>
								</div>
							</Popover>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
