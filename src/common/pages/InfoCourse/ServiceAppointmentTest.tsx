import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { branchApi } from '~/api/manage/branch'
import { testAppointmentApi } from '~/api/learn/test-appointment'
import FilterBase from '~/common/components/Elements/FilterBase'
import NotiModal from '~/common/components/Elements/NotiModal'
import SortBox from '~/common/components/Elements/SortBox'
import ExpandTable from '~/common/components/Primary/Table/ExpandTable'
import FilterColumn from '~/common/components/FilterTable/Filter/FilterColumn'
import { parseSelectArray, parseSelectArrayUser, parseToMoney } from '~/common/utils/common'
import ScoreModal from '~/common/components/Service/ScoreModal'
import TestUpdateStatus from '~/common/components/Service/TestUpdateStatus'
import { ShowNoti } from '~/common/utils'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import CancelTest from '~/common/components/Service/CancelTest'
import { useSelector } from 'react-redux'
import { RootState } from '~/store'
import { useDispatch } from 'react-redux'
import { setBranch } from '~/store/branchReducer'
import StudentForm from '~/common/components/Student/StudentForm'
import { examApi } from '~/api/exam'
import { userInformationApi } from '~/api/user/user'
import IconButton from '~/common/components/Primary/IconButton'
import { useRouter } from 'next/router'
import { Form, Modal, Select } from 'antd'
import { PrimaryTooltip, StudentNote } from '~/common/components'
import Lottie from 'react-lottie-player'
import warning from '~/common/components/json/100468-warning.json'
import { doingTestApi } from '~/api/IeltsExam/doing-test'
import { TbWritingSign } from 'react-icons/tb'

const appointmenInitFilter = [
	{
		name: 'BranchIds',
		title: 'Trung tâm',
		col: 'col-md-12 col-12',
		type: 'select',
		mode: 'multiple',
		optionList: [],
		value: null
	},
	{
		name: 'LearningStatus',
		title: 'Trạng thái',
		col: 'col-md-12 col-12',
		type: 'select',
		mode: 'multiple',
		optionList: [
			{ value: 1, title: 'Chờ kiểm tra' },
			{ value: 2, title: 'Đã kiểm tra' },
			{ value: 3, title: 'Không học' },
			{ value: 4, title: 'Chờ xếp lớp' }
		],
		value: null
	}
]

const appointmenDataOption = [
	{
		dataSort: {
			sort: 1,
			sortType: true
		},
		text: 'Tên A - Z '
	},
	{
		dataSort: {
			sort: 0,
			sortType: false
		},
		text: 'Tên Z - A'
	},
	{
		dataSort: {
			sort: 0,
			sortType: true
		},
		text: 'Ngày hẹn tăng dần'
	},
	{
		dataSort: {
			sort: 0,
			sortType: false
		},
		text: 'Ngày hẹn giảm dần'
	}
]

let pageIndex = 1

let listFieldSearch = {
	pageIndex: 1,
	FullNameUnicode: null
}

let listFieldFilter = {
	pageIndex: 1,
	BranchIds: null, // lọc
	Status: null,
	Type: null
}

export default function ServiceAppointmentTest(props) {
	const { student } = props // Trường hợp xem trong thông ti học viên

	const state = useSelector((state: RootState) => state)
	const [form] = Form.useForm()
	const router = useRouter()
	const dispatch = useDispatch()
	const [isOpenNoti, setisOpenNoti] = useState(false)

	const [listStudent, setListStudent] = useState([])
	const [listTeacher, setListTeacher] = useState([])
	const [listExamination, setListExamination] = useState([])
	const [students, setStudents] = useState<{ label: string; value: string }[]>([])

	const [dataSource, setDataSource] = useState<ITestCustomer[]>([])

	const listTodoApi = {
		pageSize: PAGE_SIZE,
		pageIndex: pageIndex,
		sort: 0,
		sortType: false,
		FullName: null,
		UserCode: null,
		BranchIds: null, // lọc
		Type: null,
		Status: null,
		studentId: null
	}

	const [isLoading, setIsLoading] = useState(true)
	const [totalPage, setTotalPage] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [todoApi, setTodoApi] = useState(listTodoApi)
	const userInformation = useSelector((state: RootState) => state.user.information)

	const [apiParametersStudent, setApiParametersStudent] = useState({
		PageSize: PAGE_SIZE,
		PageIndex: 1,
		RoleIds: '3',
		parentIds: userInformation?.RoleId == '8' ? userInformation.UserInformationId.toString() : ''
	})

	// LIST FILTER
	const [dataFilter, setDataFilter] = useState(appointmenInitFilter)

	function isAdmin() {
		return userInformation?.RoleId == 1
	}

	function isTeacher() {
		return userInformation?.RoleId == 2
	}

	function isSaler() {
		return userInformation?.RoleId == 5
	}

	function isManager() {
		return userInformation?.RoleId == 4
	}

	function isStudent() {
		return userInformation?.RoleId == 3
	}

	function isAcademic() {
		return userInformation?.RoleId == 7
	}

	useMemo(() => {
		if (state.branch.Branch.length > 0) {
			const convertDataBranch = parseSelectArray(state.branch.Branch, 'Name', 'Id')
			dataFilter[0].optionList = convertDataBranch
			setDataFilter([...dataFilter])
		}
	}, [state.branch])

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

	const getAllBranch = async () => {
		if (isAdmin() || isSaler() || isManager()) {
			try {
				const res = await branchApi.getAll({ pageSize: 99999 })
				if (res.status == 200) {
					dispatch(setBranch(res.data.data))
				} else {
					dispatch(setBranch([]))
				}
			} catch (err) {
				ShowNoti('error', err.message)
			}
		}
	}

	useEffect(() => {
		if (!student) {
			if (state.branch.Branch.length === 0) {
				getAllBranch()
			}
		}

		if (userInformation?.RoleId === '8') {
			getUsers(apiParametersStudent)
		}
	}, [])

	// GET DATA SOURCE
	const getDataSource = async () => {
		setIsLoading(true)
		try {
			let res = await testAppointmentApi.getAll(
				isStudent()
					? { ...todoApi, studentId: student?.UserInformationId }
					: !!student
					? { ...todoApi, studentId: student?.UserInformationId }
					: todoApi
			)
			if (res.status === 200) {
				if (userInformation?.RoleId == '8') {
					if (todoApi.studentId) {
						setDataSource(res.data.data)
						setTotalPage(res.data.totalRow)
					} else {
						setDataSource([])
						setTotalPage(0)
					}
				} else {
					setDataSource(res.data.data)
					setTotalPage(res.data.totalRow)
				}
			} else {
				setDataSource([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		} finally {
			setIsLoading(false)
		}
	}

	// HANDLE FILTER
	const handleFilter = (listFilter) => {
		let newListFilter = { ...listFieldFilter }
		listFilter.forEach((item, index) => {
			let key = item.name
			Object.keys(newListFilter).forEach((keyFilter) => {
				if (keyFilter == key) {
					newListFilter[key] = !!item.value ? item.value.join(',') : item.value
				}
			})
		})
		setTodoApi({ ...listTodoApi, ...newListFilter, pageIndex: 1 })
	}

	// HANDLE SORT
	const handleSort = async (option) => {
		let newTodoApi = {
			...listTodoApi,
			pageIndex: 1,
			sort: option.title.sort,
			sortType: option.title.sortType
		}
		setCurrentPage(1), setTodoApi(newTodoApi)
	}

	const onSearch = (valueSearch, dataIndex) => {
		setTodoApi({ ...todoApi, [dataIndex]: valueSearch })
	}

	// HANDLE RESET
	const resetListFieldSearch = () => {
		Object.keys(listFieldSearch).forEach(function (key) {
			if (key != 'pageIndex') {
				listFieldSearch[key] = null
			}
		})
	}

	const handleReset = () => {
		setTodoApi({ ...listTodoApi, pageIndex: 1 })
		setCurrentPage(1), resetListFieldSearch()
	}

	// GET PAGE_NUMBER
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber
		setCurrentPage(pageNumber)
		setTodoApi({ ...todoApi, pageIndex: pageIndex })
	}

	const getTeachers = async () => {
		try {
			const res = await userInformationApi.getByRole(2)
			if (res.status === 200) {
				setListTeacher(parseSelectArrayUser(res.data.data, 'FullName', 'UserCode', 'UserInformationId'))
			} else {
				setListTeacher([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getStudents = async () => {
		try {
			const res = await userInformationApi.getByRole(3)
			if (res.status == 200) {
				setListStudent(parseSelectArrayUser(res.data.data, 'FullName', 'UserCode', 'UserInformationId'))
			} else {
				setListStudent([])
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	const getAllStudentAndTeacher = async () => {
		getTeachers()
		getStudents()
	}

	const getAllExamination = async () => {
		if (isAdmin() || isSaler() || isManager()) {
			try {
				const res = await examApi.getAll({ pageSize: 9999, search: '', pageIndex: 1 })
				if (res.status === 200) {
					const convertDataExamination = parseSelectArray(res.data.data, 'Name', 'Id')
					setListExamination(convertDataExamination)
				}
				if (res.status === 204) {
					setListExamination([])
				}
			} catch (err) {
				ShowNoti('error', err.message)
			}
		}
	}

	const handleChangeStudent = (val) => {
		if (val) {
			setTodoApi({ ...todoApi, studentId: val })
		} else {
			setTodoApi(listTodoApi)
		}
	}

	// USE EFFECT - FETCH DATA
	useEffect(() => {
		getDataSource()
	}, [todoApi])

	useEffect(() => {
		getAllStudentAndTeacher()
		getAllExamination()
	}, [])

	const expandedRowRender = (record) => {
		return (
			<div className="w-[1000px]">
				<StudentNote rowData={record} studentId={record?.StudentId} />
			</div>
		)
	}

	const onUpdateData = () => {
		setTodoApi({ ...todoApi })
	}

	useEffect(() => {
		if (students && students?.length > 0) {
			setTodoApi({ ...todoApi, studentId: students[0].value })
			form.setFieldValue('student', students[0].value)
		}
	}, [students])

	const columns = [
		{
			title: 'Học viên',
			dataIndex: 'FullName',
			width: 220,
			render: (a, item) => (
				<div>
					<p className="font-weight-primary">{a}</p>
					<p className="font-[500]">Mã: {item?.UserCode}</p>
				</div>
			),
			...FilterColumn('FullName', onSearch, handleReset, 'text')
		},
		{
			title: 'Địa điểm',
			dataIndex: 'BranchName',
			render: (value, item, index) => {
				return (
					<div className="min-w-[100px]">
						<div className="font-weight-black">Trung tâm: {value}</div>
						{item?.Type == 1 && <p className="tag blue">{item.TypeName}</p>}
						{item?.Type == 2 && <p className="tag yellow">{item.TypeName}</p>}
					</div>
				)
			}
		},
		{
			title: 'Thời gian',
			dataIndex: 'Time',
			render: (date: any) => moment(date).format('HH:mm DD/MM/YYYY')
		},
		{
			title: 'Trạng thái',
			dataIndex: 'LearningStatus',
			render: (learningStatus, data) => {
				if (isAdmin() || isManager() || isTeacher() || isSaler() || isAcademic()) {
					return <TestUpdateStatus rowData={data} setTodoApi={setTodoApi} listTodoApi={listTodoApi} />
				}
				
				if (learningStatus == 1) {
					return <p className="tag red">{data.LearningStatusName}</p>
				}
				if (learningStatus == 2) {
					return <p className="tag blue">{data.LearningStatusName}</p>
				}
				if (learningStatus == 3) {
					return <p className="tag black">{data.LearningStatusName}</p>
				}
				return <p className="tag yellow">{data.LearningStatusName}</p>
			}
		},
		{
			width: 220,
			title: 'Giáo viên',
			dataIndex: 'TeacherName'
		},
		{
			title: 'Khởi tạo',
			dataIndex: 'ModifiedOn',
			render: (date: any, item) => {
				return (
					<div>
						<div className="font-weight-primary">{item?.CreatedBy}</div>
						<div>{moment(item?.CreatedOn).format('HH:mm DD/MM/YYYY')}</div>
					</div>
				)
			}
		},
		{
			title: '',
			fixed: 'right',
			responsive: ['md'],
			render: (text, data, index) => {
				return (
					<div onClick={(e) => e.stopPropagation()}>
						{(isAdmin() || isManager()) && (
							<StudentForm
								rowData={data}
								listStudent={listStudent}
								listTeacher={listTeacher}
								listExamination={listExamination}
								setTodoApi={setTodoApi}
								listTodoApi={listTodoApi}
							/>
						)}

						{(isAdmin() || isManager()) && data.Status == 1 && <CancelTest onUpdateData={onUpdateData} dataRow={data} />}

						{(isAdmin() || isManager() || isTeacher() || isAcademic()) && data.Type == 1 && (
							<ScoreModal rowData={data} listTodoApi={listTodoApi} setTodoApi={setTodoApi} />
						)}

						{(isAdmin() || isManager() || isAcademic()) && data.Status == 2 && (
							<IconButton
								icon="study"
								tooltip="Đăng ký học"
								color="green"
								type="button"
								onClick={() => router.push({ pathname: '/class/register', query: { userId: data?.StudentId } })}
							/>
						)}

						{isStudent() && data.Status == 1 && data?.Type == 2 && (
							<PrimaryTooltip place="left" id={`hw-take-${data?.Id}`} content="Làm bài">
								<div
									onClick={() => getDraft(data?.IeltsExamId, data?.Id)}
									className="w-[28px] text-[#1b73e8] h-[30px] all-center hover:opacity-70 cursor-pointer"
								>
									<TbWritingSign size={22} />
								</div>
							</PrimaryTooltip>
						)}
					</div>
				)
			}
		},
		{
			title: '',
			responsive: ['xs'],
			render: (text, data, index) => {
				return (
					<div onClick={(e) => e.stopPropagation()}>
						{(isAdmin() || isManager()) && (
							<StudentForm
								rowData={data}
								listStudent={listStudent}
								listTeacher={listTeacher}
								listExamination={listExamination}
								setTodoApi={setTodoApi}
								listTodoApi={listTodoApi}
							/>
						)}

						{(isAdmin() || isManager()) && data.Status == 1 && <CancelTest onUpdateData={onUpdateData} dataRow={data} />}

						{(isAdmin() || isManager() || isTeacher() || isAcademic()) && data.Type == 1 && (
							<ScoreModal rowData={data} listTodoApi={listTodoApi} setTodoApi={setTodoApi} />
						)}

						{(isAdmin() || isManager() || isAcademic()) && data.Status == 2 && (
							<IconButton
								icon="study"
								tooltip="Đăng ký học"
								color="green"
								type="button"
								onClick={() => router.push({ pathname: '/class/register', query: { userId: data?.StudentId } })}
							/>
						)}

						{isStudent() && data.Status == 1 && data?.Type == 2 && (
							<PrimaryTooltip place="left" id={`hw-take-${data?.Id}`} content="Làm bài">
								<div
									onClick={() => getDraft(data?.IeltsExamId, data?.Id)}
									className="w-[28px] text-[#1b73e8] h-[30px] all-center hover:opacity-70 cursor-pointer"
								>
									<TbWritingSign size={22} />
								</div>
							</PrimaryTooltip>
						)}
					</div>
				)
			}
		}
	]

	// -------- Take an exam
	async function getDraft(ExamId, HWId) {
		try {
			// 1 - Làm bài thử 2 - Làm bài hẹn test 3 - Bài tập về nhà 4 - Bộ đề
			const res = await doingTestApi.getDraft({ valueId: HWId, type: 2 })
			if (res.status == 200) {
				setCurrentData({ ExamId: ExamId, HWId: HWId, draft: res.data?.data })
				setExamWarning(true)
			} else {
				createDoingTest(ExamId, HWId)
			}
		} catch (error) {}
	}

	const [examWarning, setExamWarning] = useState<boolean>(false)
	const [currentData, setCurrentData] = useState<any>(null)

	function gotoTest(params) {
		if (params?.Id) {
			window.open(`/take-an-exam/?exam=${params?.Id}`, '_blank')
		}
	}

	async function createDoingTest(ExamId, HWId) {
		try {
			const res = await doingTestApi.post({ IeltsExamId: ExamId, ValueId: HWId, Type: 2 })
			if (res?.status == 200) {
				gotoTest(res.data?.data)
			}
		} catch (error) {}
	}

	return (
		<>
			<NotiModal
				isOpen={isOpenNoti}
				isCancel={() => setisOpenNoti(false)}
				isOk={() => setisOpenNoti(false)}
				content="Chưa đến giờ làm đề test"
			/>

			<div className="test-customer">
				<ExpandTable
					currentPage={currentPage}
					totalPage={totalPage && totalPage}
					getPagination={(pageNumber: number) => getPagination(pageNumber)}
					loading={isLoading}
					dataSource={dataSource}
					columns={columns}
					TitleCard={
						<div className="extra-table">
							{(isAdmin() || isSaler() || isManager() || isTeacher() || isAcademic()) && (
								<FilterBase
									dataFilter={dataFilter}
									handleFilter={(listFilter: any) => handleFilter(listFilter)}
									handleReset={handleReset}
								/>
							)}
							<SortBox width={170} handleSort={(value) => handleSort(value)} dataOption={appointmenDataOption} />
						</div>
					}
					Extra={
						<>
							{/* {(isAdmin() || isManager()) && !student && (
								<StudentForm
									listStudent={listStudent}
									listTeacher={listTeacher}
									listExamination={listExamination}
									setTodoApi={setTodoApi}
									listTodoApi={listTodoApi}
								/>
							)} */}

							{userInformation?.RoleId == '8' ? (
								<>
									<Form form={form}>
										<Form.Item name="student">
											<Select
												defaultActiveFirstOption
												allowClear
												className="w-[200px]"
												onChange={handleChangeStudent}
												options={students}
												placeholder="Chọn học viên"
											/>
										</Form.Item>
									</Form>
								</>
							) : (
								''
							)}
						</>
					}
					expandable={expandedRowRender}
				/>
			</div>

			<Modal width={400} open={examWarning} onCancel={() => setExamWarning(false)} footer={null}>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<Lottie loop animationData={warning} play style={{ width: 160, height: 160, marginBottom: 8 }} />
					<div style={{ fontSize: 18 }}>Bạn có muốn tiếp tục làm bản trước đó?</div>

					<div className="none-selection" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
						<div onClick={() => createDoingTest(currentData?.ExamId, currentData?.HWId)} className="exercise-btn-cancel">
							<div>Làm bài mới</div>
						</div>

						<div
							onClick={() => {
								gotoTest(currentData?.draft)
								setExamWarning(false)
							}}
							className="exercise-btn-continue"
						>
							<div>Làm tiếp</div>
						</div>
					</div>
				</div>
			</Modal>
		</>
	)
}
