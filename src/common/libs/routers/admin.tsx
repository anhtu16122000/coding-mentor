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
import { MdAirplay, MdOutlineAttachMoney, MdOutlineManageAccounts, MdOutlineSchool, MdPersonalVideo } from 'react-icons/md'
import { AiFillHome, AiFillSetting, AiOutlineCalendar, AiOutlineContainer, AiOutlineUser, AiOutlineVideoCamera } from 'react-icons/ai'
import { GiArchiveRegister, GiTeacher } from 'react-icons/gi'
import { GoHome, GoLocation, GoReport, GoSettings } from 'react-icons/go'
import { GrCertificate, GrMoney } from 'react-icons/gr'
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
	// {
	// 	MenuName: 'tab-home',
	// 	MenuTitle: 'Quản lý hệ thống',
	// 	MenuKey: '/home',
	// 	MenuItem: [
	// 		{
	// 			TypeItem: 'single',
	// 			Key: '/home/dashboard',
	// 			Route: '/home/dashboard',
	// 			Icon: <FiPieChart />,
	// 			Text: 'Thống kê'
	// 		},
	// 		{
	// 			TypeItem: 'single',
	// 			Key: '/home/report',
	// 			Route: '/home/report',
	// 			Icon: <TbReport />,
	// 			Text: 'Báo cáo'
	// 		},
	// 		{
	// 			TypeItem: 'single',
	// 			Key: '/newsfeed',
	// 			Route: '/newsfeed',
	// 			Icon: <TbNews />,
	// 			Text: 'Tin tức'
	// 		}
	// 	]
	// },
	{
		MenuName: 'Quản lý thông tin học',
		MenuTitle: 'Quản lý thông tin học',
		MenuKey: '/info-course',
		MenuItem: [
			{
				ItemType: 'sub-menu',
				Key: 'sub-list-staff-child-2',
				Icon: <MdOutlineSchool />,
				TitleSub: 'Học viên',
				SubMenuList: [
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
			}
		]
	},
	{
		MenuName: 'Quản lý tài khoản',
		MenuTitle: 'Quản lý tài khoản',
		MenuKey: '/users',
		MenuItem: [
			{
				ItemType: 'sub-menu',
				Key: 'sub-list-staff-child-1',
				Icon: <AiOutlineUser />,
				TitleSub: 'Nhân viên',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/users/personnel',
						Route: '/users/personnel',
						Text: 'Danh sách nhân viên',
						Icon: ''
					}
					// {
					// 	ItemType: 'single',
					// 	Key: '/configs/staff-salary',
					// 	Route: '/configs/staff-salary',
					// 	Text: 'Cấu hình lương',
					// 	Icon: ''
					// }
				]
			},
			// {
			// 	ItemType: 'sub-menu',
			// 	Key: 'sub-list-staff-child-2',
			// 	Icon: <MdOutlineSchool />,
			// 	TitleSub: 'Học viên',
			// 	SubMenuList: [
			// 		{
			// 			ItemType: 'single',
			// 			Key: '/users/student',
			// 			Route: '/users/student',
			// 			Text: 'Danh sách học viên',
			// 			Icon: ''
			// 		},
			// 		{
			// 			ItemType: 'single',
			// 			Key: '/users/customer',
			// 			Route: '/users/customer',
			// 			Text: 'Khách hàng',
			// 			Icon: ''
			// 		},
			// 		{
			// 			ItemType: 'single',
			// 			Key: '/users/student/student-appointment',
			// 			Route: '/users/student/student-appointment',
			// 			Text: 'Học viên chờ xếp lớp',
			// 			Icon: ''
			// 		},
			// 		{
			// 			ItemType: 'single',
			// 			Key: '/users/student/student-course',
			// 			Route: '/users/student/student-course',
			// 			Text: 'Học viên trong lớp',
			// 			Icon: ''
			// 		},
			// 		{
			// 			ItemType: 'single',
			// 			Key: '/users/student/student-change-course',
			// 			Route: '/users/student/student-change-course',
			// 			Text: 'Học viên chuyển khóa',
			// 			Icon: ''
			// 		},
			// 		{
			// 			ItemType: 'single',
			// 			Key: '/users/student/student-reserve',
			// 			Route: '/users/student/student-reserve',
			// 			Text: 'Học viên bảo lưu',
			// 			Icon: ''
			// 		},
			// 		{
			// 			ItemType: 'single',
			// 			Key: '/users/student/student-exchange',
			// 			Route: '/users/student/student-exchange',
			// 			Text: 'Học viên chuyển giao',
			// 			Icon: ''
			// 		}
			// 	]
			// },
			// {
			// 	ItemType: 'sub-menu',
			// 	Key: 'sub-list-staff-child-3',
			// 	Icon: <FiUsers />,
			// 	TitleSub: 'Phụ huynh',
			// 	SubMenuList: [
			// 		{
			// 			ItemType: 'single',
			// 			Key: '/users/parents',
			// 			Route: '/users/parents',
			// 			Text: 'Danh sách phụ huynh',
			// 			Icon: ''
			// 		}
			// 	]
			// },
			{
				ItemType: 'sub-menu',
				Key: 'sub-list-staff-child-4',
				Icon: <GiTeacher />,
				TitleSub: 'Giáo viên',
				SubMenuList: [
					// {
					// 	ItemType: 'single',
					// 	Key: '/users/teacher',
					// 	Route: '/users/teacher',
					// 	Text: 'Danh sách giáo viên',
					// 	Icon: ''
					// },
					// {
					// 	ItemType: 'single',
					// 	Key: '/users/teacher/total-lesson',
					// 	Route: '/users/teacher/total-lesson',
					// 	Text: 'Thống kê buổi dạy',
					// 	Icon: ''
					// }
					{
						ItemType: 'single',
						Key: '/users/teacher/teacher-off',
						Route: '/users/teacher/teacher-off',
						Text: 'Duyệt lịch nghỉ',
						Icon: ''
					}
				]
			}
			// {
			// 	ItemType: 'single',
			// 	Key: '/users/student',
			// 	Route: '/users/student',
			// 	Text: 'Học viên',
			// 	Icon: <RiUser3Line />
			// },
			// {
			// 	ItemType: 'single',
			// 	Key: '/users/request',
			// 	Route: '/users/request',
			// 	Text: 'Yêu cầu thay đổi',
			// 	Icon: <BiGitPullRequest />
			// }
		]
	},
	{
		MenuName: 'Đề thi',
		MenuTitle: 'Đề thi',
		MenuKey: '/exercise',
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
		MenuName: 'Danh sách tài liệu',
		MenuTitle: 'Danh sách tài liệu',
		MenuKey: '/',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/document-list',
				Route: '/document-list',
				Text: 'Danh sách tài liệu',
				Icon: <FaRegNewspaper />
			}
		]
	},
	{
		MenuName: 'Quản lý',
		MenuTitle: 'Quản lý',
		MenuKey: '/manage',
		MenuItem: [
			{
				ItemType: 'sub-menu',
				Key: 'sub-list-staff-child-5',
				Icon: <GoReport />,
				TitleSub: 'Báo cáo học viên',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/users/student/report-student-warning',
						Route: '/users/student/report-student-warning',
						Text: 'Cảnh báo học viên',
						Icon: ''
					}
				]
			},
			{
				ItemType: 'sub-menu',
				Key: 'sub-list-staff-child-6',
				Icon: <MdOutlineAttachMoney />,
				TitleSub: 'Tài chính',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/finance/billing-information',
						Route: '/finance/billing-information',
						Text: 'Thông tin thanh toán',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '15',
						Route: '',
						Text: 'Yêu cầu hoàn tiền',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '16',
						Route: '',
						Text: 'Phiếu chi',
						Icon: ''
					},
					{
						ItemType: 'single',
						Key: '17',
						Route: '',
						Text: 'Phiếu thu',
						Icon: ''
					}
				]
			},
			{
				ItemType: 'single',
				Key: '18',
				Route: '',
				Text: 'Học viên có hợp đồng',
				Icon: <AiOutlineContainer />
			},
			{
				ItemType: 'single',
				Key: '19',
				Route: '',
				Text: 'Chứng chỉ học viên',
				Icon: <GrCertificate />
			},
			{
				ItemType: 'single',
				Key: '20',
				Route: '',
				Text: 'Bảng lương giáo viên',
				Icon: <FaMoneyBillWave />
			},
			{
				ItemType: 'single',
				Key: '21',
				Route: '',
				Text: 'Bảng lương nhân viên',
				Icon: <FaMoneyBillWaveAlt />
			},
			{
				ItemType: 'single',
				Key: '22',
				Route: '',
				Text: 'Danh sách phản hồi',
				Icon: <BsReplyAll />
			},
			{
				ItemType: 'single',
				Key: '23',
				Route: '',
				Text: 'Quản lý công việc',
				Icon: <BsCardChecklist />
			}
		]
	},
	{
		MenuName: 'Webinar',
		MenuTitle: 'Hội thảo',
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
			// {
			// 	ItemType: 'sub-menu',
			// 	Key: 'sub-course',
			// 	Icon: <BsBook />,
			// 	TitleSub: 'Quản lí lớp học',
			// 	SubMenuList: [
			// 		{
			// 			ItemType: 'single',
			// 			Key: '/course/create/offline',
			// 			Route: '/course/create/offline',
			// 			Text: 'Tạo lớp học',
			// 			Icon: ''
			// 		}
			// {
			// 	ItemType: 'single',
			// 	Key: '/course/create/online',
			// 	Route: '/course/create/online',
			// 	Text: 'Tạo lớp học online',
			// 	Icon: ''
			// },
			// {
			// 	ItemType: 'single',
			// 	Key: '/course/courses',
			// 	Route: '/course/courses',
			// 	Text: 'Danh sách lớp học',
			// 	Icon: ''
			// }
			// 	]
			// },
			// {
			// 	ItemType: 'sub-menu',
			// 	Key: 'sub-course-video',
			// 	Icon: '<span class="anticon"><img src="/images/icons/zoom-video.svg" ></span>',
			// 	TitleSub: 'Khoá học video',
			// 	SubMenuList: [
			// 		{
			// 			TypeItem: 'single',
			// 			Key: '/video-course',
			// 			Route: '/video-course',
			// 			Icon: '',
			// 			Text: 'Danh sách'
			// 		},
			// 		{
			// 			TypeItem: 'single',
			// 			Key: '/video-course-order',
			// 			Icon: '',
			// 			Route: '/video-course-order',
			// 			Text: 'Đơn hàng'
			// 		},
			// 		{
			// 			TypeItem: 'single',
			// 			Key: '/video-course-list',
			// 			Icon: '',
			// 			Route: '/video-course-list',
			// 			Text: 'Đã kích hoạt'
			// 		}
			// 	]
			// },
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
			// {
			// 	TypeItem: 'single',
			// 	Key: '/course/register',
			// 	Icon: <BsBookmarkCheck />,
			// 	Route: '/course/register',
			// 	Text: 'Đăng ký lớp học'
			// },
			// {
			// 	ItemType: 'sub-menu',
			// 	Key: 'sub-course-zoom',
			// 	Icon: <AiOutlineVideoCamera />,
			// 	TitleSub: 'Quản lý Zoom',
			// 	SubMenuList: [
			// 		{
			// 			ItemType: 'single',
			// 			Key: '/course/zoom/configs',
			// 			Route: '/course/zoom/configs',
			// 			Text: 'Cấu hình',
			// 			Icon: ''
			// 		},
			// 		{
			// 			ItemType: 'single',
			// 			Key: '/course/zoom/rooms',
			// 			Route: '/course/zoom/rooms',
			// 			Text: 'Danh sách phòng học',
			// 			Icon: ''
			// 		}
			// 	]
			// }
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
	// {
	// 	MenuName: 'Quản lí nhân viên',
	// 	MenuTitle: 'Quản lí nhân viên',
	// 	MenuKey: '/staff',
	// 	MenuItem: [
	// 		{
	// 			ItemType: 'sub-menu',
	// 			Key: 'sub-list-staff-child-1',
	// 			Icon: '',
	// 			TitleSub: 'Nhân viên',
	// 			SubMenuList: [
	// 				{
	// 					ItemType: 'single',
	// 					Key: '/staff/staff-list',
	// 					Route: '/staff/staff-list',
	// 					Text: 'Danh sách nhân viên',
	// 					Icon: ''
	// 				},
	// 				{
	// 					ItemType: 'single',
	// 					Key: '/staff/saler-list',
	// 					Route: '/staff/saler-list',
	// 					Text: 'Danh sách Salers',
	// 					Icon: ''
	// 				},
	// 				{
	// 					ItemType: 'single',
	// 					Key: '/staff/feedback-list',
	// 					Route: '/staff/feedback-list',
	// 					Text: 'Duyệt feedback',
	// 					Icon: ''
	// 				}
	// 			]
	// 		},
	// 		{
	// 			ItemType: 'single',
	// 			Key: '/staff/salary-review',
	// 			Route: '/staff/salary-review',
	// 			Text: 'Bảng lương nhân viên',
	// 			Icon: ''
	// 		},
	// 		{
	// 			ItemType: 'sub-menu',
	// 			Key: 'sub-list-staff-child-300',
	// 			Icon: '',
	// 			TitleSub: 'Giáo viên',
	// 			SubMenuList: [
	// 				{
	// 					ItemType: 'single',
	// 					Key: '/staff/teacher-list',
	// 					Route: '/staff/teacher-list',
	// 					Text: 'Giáo viên',
	// 					Icon: ''
	// 				}
	// 			]
	// 		},
	// 		{
	// 			ItemType: 'single',
	// 			Key: '/staff/teacher-salary',
	// 			Route: '/staff/teacher-salary',
	// 			Text: 'Bảng lương giáo viên',
	// 			Icon: ''
	// 		},
	// 		{
	// 			ItemType: 'single',
	// 			Key: '/staff/admin-salary-staff',
	// 			Route: '/staff/admin-salary-staff',
	// 			Text: 'Bảng lương nhân viên',
	// 			Icon: ''
	// 		},
	// 		{
	// 			ItemType: 'single',
	// 			Key: '/feedback',
	// 			Route: '/feedback',
	// 			Text: 'Danh sách phản hồi',
	// 			Icon: ''
	// 		},
	// 		{
	// 			ItemType: 'sub-menu',
	// 			Key: 'sub-list-staff-child-301',
	// 			Icon: '',
	// 			TitleSub: 'Tư vấn viên',
	// 			SubMenuList: [
	// 				{
	// 					ItemType: 'single',
	// 					Key: '/staff/sales-campaign',
	// 					Route: '/staff/sales-campaign',
	// 					Text: 'Chiến dịch kinh doanh',
	// 					Icon: ''
	// 				},
	// 				{
	// 					ItemType: 'single',
	// 					Key: '/staff/sales-salary',
	// 					Route: '/staff/sales-salary',
	// 					Text: 'Duyệt lương',
	// 					Icon: ''
	// 				},
	// 				{
	// 					ItemType: 'single',
	// 					Key: '/staff/sales-salary-history',
	// 					Route: '/staff/sales-salary-history',
	// 					Text: 'Lịch sử duyệt',
	// 					Icon: ''
	// 				},
	// 				{
	// 					ItemType: 'single',
	// 					Key: '/staff/saler-list',
	// 					Route: '/staff/saler-list',
	// 					Text: 'Danh sách tư vấn viên',
	// 					Icon: ''
	// 				},
	// 				{
	// 					ItemType: 'single',
	// 					Key: '/staff/saler-revenue',
	// 					Route: '/staff/saler-revenue',
	// 					Text: 'Doanh thu tư vấn viên',
	// 					Icon: ''
	// 				}
	// 			]
	// 		},
	// 		{
	// 			ItemType: 'single',
	// 			Key: '/staff/manage-task',
	// 			Route: '/staff/manage-task',
	// 			Text: 'Quản lí công việc',
	// 			Icon: ''
	// 		}
	// 	]
	// },
	// {
	// 	MenuName: 'Ngân hàng đề thi',
	// 	MenuTitle: 'Ngân hàng đề thi',
	// 	MenuKey: '/question-bank',
	// 	MenuItem: [
	// 		{
	// 			ItemType: 'single',
	// 			Key: '/question-bank/question-list',
	// 			Route: '/question-bank/question-list',
	// 			Text: 'Danh sách câu hỏi',
	// 			Icon: ''
	// 		},
	// 		{
	// 			ItemType: 'single',
	// 			Key: '/question-bank/exam-list',
	// 			Route: '/question-bank/exam-list',
	// 			Text: 'Danh sách đề thi',
	// 			Icon: ''
	// 		}
	// 	]
	// },
	{
		MenuName: 'Cấu hình',
		MenuTitle: 'Cấu hình',
		MenuKey: '/options',
		MenuItem: [
			// {
			// 	ItemType: 'single',
			// 	Key: '/configs/certificate',
			// 	Route: '/configs/certificate',
			// 	Text: 'Chứng chỉ',
			// 	Icon: <TbFileCertificate />
			// },
			// {
			// 	ItemType: 'single',
			// 	Key: '/configs/zoom-config',
			// 	Route: '/configs/zoom-config',
			// 	Text: 'Tài khoản Zoom',
			// 	Icon: <TbVideo />
			// },
			{
				ItemType: 'sub-menu',
				Key: 'sub-list-staff-child-303',
				Icon: <GoSettings />,
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
			// {
			// 	ItemType: 'single',
			// 	Key: '/options/area',
			// 	Route: '/options/area',
			// 	Text: 'Địa chỉ',
			// 	Icon: <GoLocation />
			// },
			{
				ItemType: 'sub-menu',
				Key: 'sub-list-staff-child-304',
				Icon: <BsThreeDots />,
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
					// {
					// 	ItemType: 'single',
					// 	Key: '/options/feedback',
					// 	Route: '/options/feedback',
					// 	Text: 'Loại phản hồi',
					// 	Icon: ''
					// },
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
						Key: '/options/payment-method',
						Route: '/options/payment-method',
						Text: 'Phương thức thanh toán',
						Icon: ''
					}
				]
			}
		]
	}
]
