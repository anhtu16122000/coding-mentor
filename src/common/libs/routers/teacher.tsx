import { UserCheck } from 'react-feather'
import { BiBookBookmark } from 'react-icons/bi'
import { MdAirplay } from 'react-icons/md'
import { TbHome, TbScreenShare } from 'react-icons/tb'

export const TeacherMenu = [
	{
		Key: 'home',
		TabName: 'tab-home',
		Icon: <TbHome size={22} />
	},
	{
		Key: 'webinar',
		TabName: 'Webinar',
		Icon: <TbScreenShare size={22} />
	},
	{
		Key: 'class',
		TabName: 'Lớp học',
		Icon: <MdAirplay size={22} />
	},
	{
		Key: 'course',
		TabName: 'Khóa học',
		Icon: <BiBookBookmark size={22} />
	},
	{
		Key: 'assignment',
		TabName: 'Phân công',
		Icon: <UserCheck size={22} />
	}
]

export const TeacherChildMenu = [
	{
		MenuName: 'tab-home',
		Parent: 'home',
		MenuTitle: 'Quản lý hệ thống',
		MenuKey: '/home',
		MenuItem: [
			{
				TypeItem: 'single',
				Key: '/home/dashboard',
				Route: '/home/dashboard',
				Icon: '',
				Text: 'Thống kê'
			}
		]
	},
	{
		MenuName: 'Webinar',
		Parent: 'webinar',
		MenuTitle: 'xx69x',
		MenuKey: '/webinars',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/webinars',
				Route: '/webinars',
				Text: 'Webinar',
				Icon: ''
			}
		]
	},
	{
		MenuName: 'Lớp học',
		Parent: 'class',
		MenuTitle: 'Lớp học',
		MenuKey: '/class',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/class/list-class',
				Route: '/class/list-class',
				Text: 'Danh sách lớp học',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/class/schedule',
				Route: '/class/schedule',
				Text: 'Lịch dạy',
				Icon: ''
			}
		]
	},
	{
		MenuName: 'Khóa học',
		MenuTitle: 'Khóa học',
		Parent: 'course',
		MenuKey: '/course',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/course/video-course',
				Route: '/course/video-course',
				Text: 'Khóa học',
				Icon: ''
			}
		]
	},
	{
		MenuName: 'Ngân hàng đề thi',
		MenuTitle: 'Ngân hàng đề thi',
		MenuKey: '/question-bank',
		Parent: 'webinar',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/question-bank/question-list',
				Route: '/question-bank/question-list',
				Text: 'Danh sách câu hỏi',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/question-bank/exam-list',
				Route: '/question-bank/exam-list',
				Text: 'Danh sách đề thi',
				Icon: ''
			}
		]
	},
	{
		MenuName: 'Phân công',
		MenuTitle: 'Phân công',
		Parent: 'assignment',
		MenuKey: '/users',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/users/teacher/teacher-off',
				Route: '/users/teacher/teacher-off',
				Text: 'Đăng ký lịch nghỉ',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/users/teacher/open-calender',
				Route: '/users/teacher/open-calender',
				Text: 'Mở lịch trống',
				Icon: ''
			}
		]
	}
]
