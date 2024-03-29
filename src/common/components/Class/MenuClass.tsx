import { Tabs } from 'antd'
import { AiOutlineCalendar, AiOutlineQrcode } from 'react-icons/ai'
import { BsCalendar2Week } from 'react-icons/bs'
import { CgTranscript } from 'react-icons/cg'
import { FiUserCheck } from 'react-icons/fi'
import { GrCertificate } from 'react-icons/gr'
import { IoNotificationsOutline } from 'react-icons/io5'
import { RiContactsBook2Line, RiFileList2Line, RiFileList3Line, RiQuillPenLine } from 'react-icons/ri'
import { VscFeedback, VscFolderLibrary } from 'react-icons/vsc'
import { useSelector } from 'react-redux'
import { TabMonthlyTuition } from '~/common/pages/Student/TabMonthlyTuition'
import { RootState } from '~/store'
import CalendarClassEdit from './CalendarClassEdit'
import DocumentsPageInClass from './DocumentsPage'
import HomeWork from './HomeWork'
import { LessonFeedbackPage } from './LessonFeedbackPage'
import { ListCertificates } from './ListCertificates'
import { ListStudentInClass } from './ListStudentInClass'
import { NotificationInClassPage } from './NotificationInClassPage'
import { RollUpPage } from './RollUpPage'
import { RollUpStudent } from './RollUpStudent'
import { RollUpTeacherPage } from './RollUpTeacherPage'
import { ScheduleList } from './ScheduleList'
import TransScriptFlexColumnPage from './TransScriptFlexColumnPage'

const itemsAdmin = [
	'Lịch học',
	'Học viên',
	'Học phí',
	'Các buổi học',
	// 'Bài tập',
	'Tài liệu',
	'Điểm danh',
	'Bảng điểm',
	'Điểm danh giáo viên',
	'Phản hồi buổi học',
	'Thông báo'
]

const itemsStudent = ['Lịch học', 'Học phí', 'Các buổi học', 'Tài liệu', 'Điểm danh', 'Bảng điểm']

const itemsTeacher = [
	'Lịch học',
	'Học viên',
	'Học phí',
	'Các buổi học',
	// 'Bài tập',
	'Tài liệu',
	'Điểm danh',
	'Bảng điểm',
	'Điểm danh giáo viên',
	'Phản hồi buổi học',
	'Thông báo'
]

const itemsParent = ['Lịch học', 'Các buổi học', 'Điểm danh', 'Bảng điểm']

const MenuClass = () => {
	const user = useSelector((state: RootState) => state.user.information)

	const infoClass = useSelector((state: any) => state.class.infoClass)

	console.log('---- infoClass: ', infoClass)

	const getChildren = (title) => {
		switch (title) {
			case 'Lịch học':
				return <CalendarClassEdit />
			case 'Học viên':
				return <ListStudentInClass />
			case 'Chứng chỉ':
				return <ListCertificates />
			case 'Học phí':
				return <TabMonthlyTuition StudentDetail={user} />
			case 'Các buổi học':
				return <ScheduleList />
			case 'Tài liệu':
				return <DocumentsPageInClass />
			case 'Điểm danh':
				return <RollUpPage />
			case 'Bảng điểm':
				return <TransScriptFlexColumnPage />
			case 'Điểm danh giáo viên':
				return <RollUpTeacherPage />
			case 'Phản hồi buổi học':
				return <LessonFeedbackPage />
			case 'Thông báo':
				return <NotificationInClassPage />
			case 'Bài tập':
				return <HomeWork />
			case 'Điểm danh bằng QR':
				return <RollUpStudent />
			default:
				return <CalendarClassEdit />
		}
	}

	const getLabel = (item, index) => {
		switch (item) {
			case 'Lịch học':
				return (
					<div className="label-tab">
						<AiOutlineCalendar className="mr-3" size={20} />
						<span>{item}</span>
					</div>
				)
			case 'Học viên':
				return (
					<div className="label-tab">
						<RiContactsBook2Line className="mr-3" size={20} />
						<span>{item}</span>
					</div>
				)
			case 'Chứng chỉ':
				return (
					<div className="label-tab">
						<GrCertificate className="mr-3" size={20} />
						<span>{item}</span>
					</div>
				)
			case 'Học phí':
				return (
					<div className="label-tab">
						<RiFileList3Line className="mr-3" size={20} />
						<span>{item}</span>
					</div>
				)
			case 'Các buổi học':
				return (
					<div className="label-tab">
						<BsCalendar2Week className="mr-3" size={20} />
						<span>{item}</span>
					</div>
				)
			case 'Tài liệu':
				return (
					<div className="label-tab">
						<VscFolderLibrary className="mr-3" size={20} />
						<span>{item}</span>
					</div>
				)
			case 'Điểm danh':
				return (
					<div className="label-tab">
						<RiQuillPenLine className="mr-3" size={20} />
						<span>{item}</span>
					</div>
				)
			case 'Bảng điểm':
				return (
					<div className="label-tab">
						<CgTranscript className="mr-3" size={20} />
						<span>{item}</span>
					</div>
				)
			case 'Điểm danh giáo viên':
				return (
					<div className="label-tab">
						<FiUserCheck className="mr-3" size={20} />
						<span>{item}</span>
					</div>
				)
			case 'Phản hồi buổi học':
				return (
					<div className="label-tab">
						<VscFeedback className="mr-3" size={20} />
						<span>{item}</span>
					</div>
				)
			case 'Thông báo':
				return (
					<div className="label-tab">
						<IoNotificationsOutline className="mr-3" size={20} />
						<span>{item}</span>
					</div>
				)
			case 'Bài tập':
				return (
					<div className="label-tab">
						<RiFileList2Line className="mr-3" size={20} />
						<span>{item}</span>
					</div>
				)
			case 'Điểm danh bằng QR':
				return (
					<div className="label-tab">
						<AiOutlineQrcode className="mr-3" size={20} />
						<span>{item}</span>
					</div>
				)
			default:
				return ''
		}
	}

	return (
		<>
			{(user?.RoleId == 1 || user?.RoleId == 4 || user?.RoleId == 5 || user?.RoleId == 6 || user?.RoleId == 7) && (
				// Admin
				<Tabs
					defaultActiveKey="0"
					tabPosition="left"
					items={itemsAdmin.map((item, index) => {
						if (infoClass?.PaymentType == 1 && item == 'Học phí') {
							return null
						}

						return {
							label: <div className="no-select">{getLabel(item, index)}</div>,
							key: index.toString(),
							children: getChildren(item)
						}
					})}
				/>
			)}

			{user?.RoleId == 2 && (
				// Giáo viên
				<Tabs
					defaultActiveKey="0"
					tabPosition="left"
					items={itemsTeacher.map((item, index) => {
						if (infoClass?.PaymentType == 1 && item == 'Học phí') {
							return null
						}

						return {
							label: <div className="no-select">{getLabel(item, index)}</div>,
							key: index.toString(),
							children: getChildren(item)
						}
					})}
				/>
			)}

			{user?.RoleId == 3 && (
				// Học viên
				<Tabs
					defaultActiveKey="0"
					tabPosition="left"
					items={itemsStudent.map((item, index) => {
						if (infoClass?.PaymentType == 1 && item == 'Học phí') {
							return null
						}

						return {
							label: <div className="no-select">{getLabel(item, index)}</div>,
							key: index.toString(),
							children: getChildren(item)
						}
					})}
				/>
			)}

			{user?.RoleId == 8 && (
				// Phụ huynh
				<Tabs
					defaultActiveKey="0"
					tabPosition="left"
					items={itemsParent.map((item, index) => {
						if (infoClass?.PaymentType == 1 && item == 'Học phí') {
							return null
						}

						return {
							label: <div className="no-select">{getLabel(item, index)}</div>,
							key: index.toString(),
							children: getChildren(item)
						}
					})}
				/>
			)}
		</>
	)
}

export default MenuClass
