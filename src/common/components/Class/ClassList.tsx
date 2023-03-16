import { List, Modal } from 'antd'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { classApi } from '~/api/class'
import { userInformationApi } from '~/api/user'
import { ShowNoti } from '~/common/utils'
import { parseSelectArray, parseToMoney } from '~/common/utils/common'
import { RootState } from '~/store'
import AvatarComponent from '../AvatarComponent'
import DeleteTableRow from '../Elements/DeleteTableRow'
import PrimaryButton from '../Primary/Button'
import IconButton from '../Primary/IconButton'
import UpdateClassForm from './UpdateClassForm'

const ClassList = (props) => {
	const { isLoading, dataSource, setTodoApi, listTodoApi, totalRow, todoApi, getAllClass } = props
	const state = useSelector((state: RootState) => state)
	const router = useRouter()
	const { information: userInformation } = state.user
	const [isModalOpen, setIsModalOpen] = useState({ id: null, open: null })
	const [isLoadingDelete, setIsLoadingDelete] = useState(false)
	const [academic, setAcademic] = useState([])

	const getPagination = (page) => {
		setTodoApi({ ...todoApi, pageIndex: page })
	}

	const checkStatus = (statusID, statusName, Avatar) => {
		const rs = ['yellow', 'blue', 'gray']
		return (
			<div className="flex-all-center flex-col wrapper-img">
				<span className={`tag ${rs[statusID - 1]}`} style={{ marginBottom: 8, textAlign: 'center' }}>
					{statusName}
				</span>
				<AvatarComponent url={Avatar} type="class" />
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
		<>
			<List
				loading={isLoading}
				pagination={{
					onChange: getPagination,
					total: totalRow,
					size: 'small',
					pageSize: 30,
					showTotal: () => totalRow && <div className="font-weight-black">Tổng cộng: {totalRow}</div>
				}}
				itemLayout="horizontal"
				dataSource={dataSource}
				renderItem={(item: IClass) => (
					<List.Item
						extra={
							<>
								{userInformation?.RoleId == 1 ? (
									<>
										<div className="wrapper-btn-class">
											<UpdateClassForm dataRow={item} setTodoApi={setTodoApi} listTodoApi={listTodoApi} academic={academic} />
											<DeleteTableRow text={`${item.Name}`} handleDelete={() => handleCheckExistStudentInClass(item.Id)} />
										</div>
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
												Lớp học đang có <span className="font-medium text-[#1b73e8]">{item.TotalStudent}</span> học viên. Bạn có chắc muốn
												xóa?
											</p>
										</Modal>
									</>
								) : null}
							</>
						}
					>
						<List.Item.Meta
							avatar={checkStatus(item.Status, item.StatusName, item.Thumbnail)}
							title={
								item?.Type !== 3 ? (
									<Link href={returnPathName(item)}>
										<a className="font-medium hover:underline">{item.Name}</a>
									</Link>
								) : (
									<Link href={handleTutoring(item)}>
										<a>
											<a className="font-medium hover:underline">{item.Name}</a>
										</a>
									</Link>
								)
							}
							description={
								<div className="content-body">
									<ul className="list-ver">
										<li>
											<span>Chuyên môn: </span> <span>{item.GradeName || 'Trống'}</span>
										</li>
										<li>
											<span>Chương trình: </span> <span>{item.ProgramName || 'Trống'}</span>
										</li>
										<li>
											<span>Giáo trình: </span> <span>{item.CurriculumName || 'Trống'}</span>
										</li>
										<li>
											<span>Học vụ: </span> <span>{item.AcademicName || 'Trống'}</span>
										</li>
										{/* <li>
											<span>Giáo viên: </span> <span>{item.TeacherName || 'Trống'}</span>
										</li> */}
										<li>
											<span>Hình thức: </span> <span>{item.TypeName || 'Trống'}</span>
										</li>
										{userInformation && userInformation?.RoleId == 1 && (
											<li>
												<span>Học phí: </span> <span>{parseToMoney(item.Price)} VNĐ</span>
											</li>
										)}
									</ul>
									<ul className="list-hor">
										<li>
											Số buổi học: <span>{item.TotalLesson}</span>
										</li>
										<li>
											Số buổi đã học: <span>{item.LessonCompleted || 0}</span>
										</li>
										{item.Type !== 3 ? (
											<>
												<li>
													Bắt đầu: <span>{moment(item.StartDay).format('DD/MM/YYYY')}</span>
												</li>
												<li>
													Kết thúc: <span>{moment(item.EndDay).format('DD/MM/YYYY')}</span>
												</li>
											</>
										) : null}

										<li>
											Số học viên: <span>{item.TotalStudent || 0}</span>
										</li>
										{item.MaxQuantity && userInformation?.RoleId == 1 && (
											<li>
												Số học viên tối đa: <span>{item.MaxQuantity}</span>
											</li>
										)}
									</ul>
								</div>
							}
						/>
					</List.Item>
				)}
			/>
		</>
	)
}

export default ClassList
