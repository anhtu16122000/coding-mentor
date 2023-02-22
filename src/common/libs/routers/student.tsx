import { BiBookBookmark } from 'react-icons/bi'
import { MdAirplay } from 'react-icons/md'
import { TbHome, TbScreenShare } from 'react-icons/tb'

export const StudentMenu = [
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
	}
]

export const StudentChildMenu = [
	{
		MenuName: 'tab-home',
		Parent: 'home',
		MenuTitle: 'xx69x',
		MenuKey: '/home',
		MenuItem: [
			{
				TypeItem: 'single',
				Key: '/home/dashboard',
				Route: '/home/dashboard',
				Icon: '',
				Text: 'Thông tin chung'
			}
		]
	},
	{
		MenuName: 'Webinar',
		MenuTitle: 'xx69x',
		Parent: 'webinar',
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
		MenuTitle: 'Lớp học',
		Parent: 'class',
		MenuKey: '/class',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/class/schedule',
				Route: '/class/schedule',
				Text: 'Lịch học',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/class/list-class',
				Route: '/class/list-class',
				Text: 'Lớp học của bạn',
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
			},
			{
				ItemType: 'single',
				Key: '/course/video-course-student',
				Route: '/course/video-course-student',
				Text: 'Chứng chỉ',
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
	}
]
