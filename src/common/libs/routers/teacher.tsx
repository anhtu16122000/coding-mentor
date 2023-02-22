import { UserCheck } from 'react-feather'
import { BiBookBookmark } from 'react-icons/bi'
import { BsFillGridFill } from 'react-icons/bs'
import { FaUserCheck } from 'react-icons/fa'
import { IoLibrarySharp } from 'react-icons/io5'
import { MdAirplay } from 'react-icons/md'
import { RiFileList2Fill } from 'react-icons/ri'
import { TbHome, TbScreenShare } from 'react-icons/tb'
import { TiHome } from 'react-icons/ti'

export const TeacherMenu = [
	{
		Key: 'home',
		TabName: 'Trang chủ',
		Icon: <TiHome style={{ width: 24, height: 24 }} />
	},
	{
		Key: 'class',
		TabName: 'Lớp học',
		Icon: <BsFillGridFill size={22} />
	},
	{
		Key: 'library-online',
		TabName: 'Thư viện online',
		Icon: <IoLibrarySharp size={22} />
	},
	{
		Key: 'library',
		TabName: 'Đề thi',
		Icon: <RiFileList2Fill size={22} />
	},
	{
		Key: 'assignment',
		TabName: 'Phân công',
		Icon: <FaUserCheck size={22} />
	}
]

export const TeacherChildMenu = [
	{
		Parent: 'home',
		MenuTitle: 'Quản lý hệ thống',
		MenuKey: 'home',
		MenuItem: [
			{
				TypeItem: 'single',
				Key: '/news',
				Route: '/news',
				Icon: '',
				Text: 'Tin tức'
			},
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
		MenuName: 'Lớp học',
		MenuTitle: 'Lớp học',
		MenuKey: '/class',
		Parent: 'class',
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
		MenuName: 'Thư viện online',
		MenuTitle: 'Thư viện online',
		Parent: 'library-online',
		MenuKey: '/library-online',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/library-online/library',
				Route: '/library-online/library',
				Text: 'Tài liệu',
				Icon: ''
			}
		]
	},
	{
		MenuName: 'Đề thi',
		MenuTitle: 'Đề thi',
		MenuKey: '/exercise',
		Parent: 'library',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/exercise/all',
				Route: '/exercise/all',
				Text: 'Quản lý đề thi',
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
