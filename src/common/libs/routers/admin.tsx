import React from 'react'
import { TbFileCertificate, TbHome, TbNews, TbReport, TbScreenShare, TbSettings, TbVideo } from 'react-icons/tb'
import {
	BsBook,
	BsBookmarkCheck,
	BsCardChecklist,
	BsFilePost,
	BsFillGridFill,
	BsPeople,
	BsPeopleFill,
	BsReplyAll,
	BsThreeDots
} from 'react-icons/bs'
import { FiAirplay, FiBook, FiFileText, FiPieChart, FiUsers } from 'react-icons/fi'
import { RiFileEditLine, RiFileList2Fill, RiHomeHeartFill, RiUser2Line, RiUser3Line } from 'react-icons/ri'
import { BiBookAdd, BiBookBookmark, BiGitPullRequest } from 'react-icons/bi'
import {
	MdAirplay,
	MdOutlineAttachMoney,
	MdOutlineManageAccounts,
	MdOutlineSchool,
	MdOutlineSettingsInputComposite,
	MdPersonalVideo
} from 'react-icons/md'
import { AiFillHome, AiFillSetting, AiOutlineCalendar, AiOutlineContainer, AiOutlineUser, AiOutlineVideoCamera } from 'react-icons/ai'
import { GiArchiveRegister, GiTeacher } from 'react-icons/gi'
import { GoHome, GoLocation, GoReport, GoSettings } from 'react-icons/go'
import { GrCertificate, GrMoney, GrSettingsOption } from 'react-icons/gr'
import { FaHouseDamage, FaMoneyBillWave, FaMoneyBillWaveAlt, FaRegNewspaper, FaUserGraduate, FaUserTie } from 'react-icons/fa'
import { IoPeopleOutline, IoVideocam } from 'react-icons/io5'
import { User } from 'react-feather'
import { HiHome, HiPresentationChartLine } from 'react-icons/hi'
import { TiHome } from 'react-icons/ti'

export const AdminMenu = [
	{
		Key: 'home',
		TabName: 'Trang chủ',
		Icon: <TiHome style={{ width: 24, height: 24 }} />
	},
	{
		Key: 'student',
		TabName: 'Học viên',
		Icon: <FaUserGraduate size={20} />
	},
	{
		Key: 'staff',
		TabName: 'Nhân viên',
		Icon: <FaUserTie size={20} />
	},
	{
		Key: 'class',
		TabName: 'Lớp học',
		Icon: <BsFillGridFill size={22} />
	},
	{
		Key: 'video',
		TabName: 'Khoá học video',
		Icon: <IoVideocam size={22} />
	},
	{
		Key: 'library',
		TabName: 'Đề thi',
		Icon: <RiFileList2Fill size={22} />
	},
	{
		Key: 'config',
		TabName: 'Cấu hình',
		Icon: <AiFillSetting size={22} />
	}
]

export const AdminChildMenu = [
	{
		Parent: 'home',
		MenuTitle: 'Quản lý hệ thống',
		MenuKey: 'home',
		MenuItem: [
			{
				TypeItem: 'single',
				Key: '/news',
				Route: '/news',
				Icon: <FaHouseDamage />,
				Text: 'Tin tức'
			},
			{
				TypeItem: 'single',
				Key: '/dashboard',
				Route: '/dashboard',
				Icon: <HiPresentationChartLine style={{ width: 18, height: 18 }} />,
				Text: 'Thống kê'
			}
		]
	},
	{
		MenuName: 'Quản lý thông tin học',
		MenuTitle: 'Thông tin học',
		MenuKey: '/info-course',
		Parent: 'student',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/info-course/student',
				Route: '/info-course/student',
				Text: 'Danh sách học viên',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/info-course/customer',
				Route: '/info-course/customer',
				Text: 'Leads',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/info-course/service-appointment-test',
				Route: '/info-course/service-appointment-test',
				Text: 'Khách hẹn test',
				Icon: ''
			}
		]
	},
	{
		MenuName: 'Quản lý tài khoản',
		MenuTitle: 'Quản lý tài khoản',
		MenuKey: '/users',
		Parent: 'staff',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/users/personnel',
				Route: '/users/personnel',
				Text: 'Danh sách nhân viên',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/users/teacher/teacher-off',
				Route: '/users/teacher/teacher-off',
				Text: 'Duyệt lịch nghỉ',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/users/salary-config',
				Route: '/users/salary-config',
				Text: 'Cấu hình lương',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/users/salary',
				Route: '/users/salary',
				Text: 'Bảng lương',
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
				Icon: <RiFileEditLine />
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
				Key: '/class/create',
				Route: '/class/create',
				Text: 'Tạo lớp học',
				Icon: <BsBook />
			},
			{
				ItemType: 'single',
				Key: '/class/list-class',
				Route: '/class/list-class',
				Text: 'Danh sách lớp học',
				Icon: <FiAirplay />
			},
			{
				TypeItem: 'single',
				Key: '/class/schedule',
				Icon: <AiOutlineCalendar />,
				Route: '/class/schedule',
				Text: 'Kiểm tra lịch'
			},
			{
				TypeItem: 'single',
				Key: '/class/register',
				Icon: <BiBookAdd />,
				Route: '/class/register',
				Text: 'Đăng ký học'
			}
		]
	},
	{
		MenuName: 'Khóa học',
		MenuTitle: 'Khóa học',
		Parent: 'video',
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
				Text: 'Danh sách chứng chỉ',
				Icon: <TbFileCertificate />
			},
			{
				ItemType: 'single',
				Key: '/course/video-course-order',
				Route: '/course/video-course-order',
				Text: 'Danh sách đơn hàng',
				Icon: <GrMoney />
			}
		]
	},
	{
		MenuName: 'Cấu hình',
		MenuTitle: 'Cấu hình',
		MenuKey: '/options',
		Parent: 'config',
		MenuItem: [
			{
				ItemType: 'sub-menu',
				Key: 'sub-list-staff-child-303',
				Icon: <GrSettingsOption />,
				TitleSub: 'Cấu hình học',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/options/center',
						Route: '/options/center',
						Text: 'Trung tâm',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/options/specialize',
						Route: '/options/specialize',
						Text: 'Chuyên môn',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/options/program',
						Route: '/options/program',
						Text: 'Chương trình',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/options/study-time',
						Route: '/options/study-time',
						Text: 'Ca học',
						Icon: ''
					}
				]
			},
			{
				ItemType: 'sub-menu',
				Key: 'sub-list-staff-child-304',
				Icon: <MdOutlineSettingsInputComposite />,
				TitleSub: 'Khác',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/options/discount',
						Route: '/options/discount',
						Text: 'Mã khuyến mãi',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/options/learning-needs',
						Route: '/options/learning-needs',
						Text: 'Nhu cầu học',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/options/customer-supplier',
						Route: '/options/customer-supplier',
						Text: 'Nguồn khách hàng',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/options/day-off',
						Route: '/options/day-off',
						Text: 'Ngày nghỉ',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/options/jobs',
						Route: '/options/jobs',
						Text: 'Công việc',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/options/consultation-status',
						Route: '/options/consultation-status',
						Text: 'Trạng thái khách hàng',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/options/purpose',
						Route: '/options/purpose',
						Text: 'Mục đích học',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/options/general-notification',
						Route: '/options/general-notification',
						Text: 'Tạo thông báo',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/options/idiom',
						Route: '/options/idiom',
						Text: 'Thành ngữ lịch',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/options/config-template',
						Route: '/options/config-template',
						Text: 'Mẫu',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/options/faq',
						Route: '/options/faq',
						Text: 'Câu hỏi thường gặp',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/options/payment',
						Route: '/options/payment',
						Text: 'Phương thức thanh toán',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '/options/tags',
						Route: '/options/tags',
						Text: 'Danh mục từ khoá',
						Icon: ''
					}
				]
			}
		]
	}
]
