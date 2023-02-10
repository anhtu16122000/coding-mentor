import { AiOutlineCalendar } from 'react-icons/ai'
import { BiBookBookmark } from 'react-icons/bi'
import { FiAirplay, FiPieChart } from 'react-icons/fi'
import { MdAirplay, MdPersonalVideo } from 'react-icons/md'
import { TbFileCertificate, TbHome, TbScreenShare } from 'react-icons/tb'

export const StudentMenu = [
	{
		TabName: 'tab-home',
		Icon: <TbHome size={22} />
	},
	{
		TabName: 'Webinar',
		Icon: <TbScreenShare size={22} />
	},
	{
		TabName: 'Lớp học',
		Icon: <MdAirplay size={22} />
	},
	{
		TabName: 'Khóa học',
		Icon: <BiBookBookmark size={22} />
	}
]

export const StudentChildMenu = [
	{
		MenuName: 'tab-home',
		MenuTitle: 'xx69x',
		MenuKey: '/home',
		MenuItem: [
			{
				TypeItem: 'single',
				Key: '/home/dashboard',
				Route: '/home/dashboard',
				Icon: <FiPieChart />,
				Text: 'Thông tin chung'
			}
		]
	},
	{
		MenuName: 'Webinar',
		MenuTitle: 'xx69x',
		MenuKey: '/webinars',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/webinars',
				Route: '/webinars',
				Text: 'Webinar',
				Icon: <TbScreenShare />
			}
		]
	},
	{
		MenuName: 'Lớp học',
		MenuTitle: 'Lớp học',
		MenuKey: '/class',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/class/schedule',
				Route: '/class/schedule',
				Text: 'Lịch học',
				Icon: <AiOutlineCalendar />
			},
			{
				ItemType: 'single',
				Key: '/class/list-class',
				Route: '/class/list-class',
				Text: 'Lớp học của bạn',
				Icon: <FiAirplay />
			}
		]
	},
	{
		MenuName: 'Khóa học',
		MenuTitle: 'Khóa học',
		MenuKey: '/course',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/course/video-course',
				Route: '/course/video-course',
				Text: 'Khóa học',
				Icon: <MdPersonalVideo />
			},
			{
				ItemType: 'single',
				Key: '/course/video-course-student',
				Route: '/course/video-course-student',
				Text: 'Chứng chỉ',
				Icon: <TbFileCertificate />
			}
		]
	},
	{
		MenuName: 'Ngân hàng đề thi',
		MenuTitle: 'Ngân hàng đề thi',
		MenuKey: '/question-bank',
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
