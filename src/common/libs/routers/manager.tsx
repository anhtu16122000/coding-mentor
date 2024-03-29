import { AiFillSetting } from 'react-icons/ai'
import { BsFillGridFill } from 'react-icons/bs'
import { FaMoneyBillAlt, FaUserGraduate, FaUserTie } from 'react-icons/fa'
import { IoLibrarySharp, IoVideocam } from 'react-icons/io5'
import { RiFileList2Fill } from 'react-icons/ri'
import { TiHome } from 'react-icons/ti'

export const ManagerMenu = [
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
		Key: 'finance',
		TabName: 'Tài chính',
		Icon: <FaMoneyBillAlt size={20} />
	},
	{
		Key: 'video',
		TabName: 'Khoá học video',
		Icon: <IoVideocam size={22} />
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
		Key: 'config',
		TabName: 'Cấu hình',
		Icon: <AiFillSetting size={22} />
	}
]

export const ManagerChildMenu = [
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
				Key: '/dashboard',
				Route: '/dashboard',
				Icon: '',
				Text: 'Thống kê'
			},
			{
				TypeItem: 'single',
				Key: '/elsa-speak',
				Route: '/elsa-speak',
				Icon: '',
				Text: 'Kiểm tra nói'
			}
		]
	},
	{
		Parent: 'finance',
		MenuTitle: 'Tài chính',
		MenuKey: '/finance',
		MenuItem: [
			{
				TypeItem: 'single',
				Key: '/finance/payment',
				Route: '/finance/payment',
				Icon: '',
				Text: 'Quản lý thanh toán'
			},
			{
				TypeItem: 'single',
				Key: '/finance/cash-flow',
				Route: '/finance/cash-flow',
				Icon: '',
				Text: 'Quản lý thu chi'
			},
			{
				TypeItem: 'single',
				Key: '/finance/verification',
				Route: '/finance/verification',
				Icon: '',
				Text: 'Duyệt thanh toán'
			},
			{
				TypeItem: 'single',
				Key: '/finance/refund',
				Route: '/finance/refund',
				Text: 'Hoàn tiền'
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
				Key: '/leads',
				Route: '/leads',
				Text: 'Leads',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/entry-test',
				Route: '/entry-test',
				Text: 'Hẹn test',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/info-course/student',
				Route: '/info-course/student',
				Text: 'Danh sách học viên',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/info-course/student-in-class',
				Route: '/info-course/student-in-class',
				Text: 'Học viên trong lớp',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/info-course/reserved',
				Route: '/info-course/reserved',
				Text: 'Học viên bảo lưu',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/info-course/changed',
				Route: '/info-course/changed',
				Text: 'Học viên chuyển lớp',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/info-course/registration',
				Route: '/info-course/registration',
				Text: 'Hẹn đăng ký',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/info-course/student/warning',
				Route: '/info-course/student/warning',
				Text: 'Cảnh báo học viên',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/info-course/feedbacks',
				Route: '/info-course/feedbacks',
				Text: 'Phản hồi học viên',
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
				Key: '/users/salary',
				Route: '/users/salary',
				Text: 'Bảng lương',
				Icon: ''
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
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/class/class-timeline',
				Route: '/class/class-timeline',
				Text: 'Timeline',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/class',
				Route: '/class',
				Text: 'Danh sách lớp học',
				Icon: ''
			},
			{
				TypeItem: 'single',
				Key: '/class/schedule',
				Icon: '',
				Route: '/class/schedule',
				Text: 'Kiểm tra lịch'
			},
			{
				TypeItem: 'single',
				Key: '/class/register',
				Icon: '',
				Route: '/class/register',
				Text: 'Đăng ký học'
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
				Key: '/package-exam',
				Route: '/package-exam',
				Text: 'Bộ đề',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/questions',
				Route: '/questions',
				Text: 'Ngân hàng câu hỏi',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/exam',
				Route: '/exam',
				Text: 'Ngân hàng đề',
				Icon: ''
			}
		]
	},
	{
		MenuName: 'Khóa học',
		MenuTitle: 'Khóa học video',
		Parent: 'video',
		MenuKey: '/course',
		MenuItem: [
			{
				ItemType: 'single',
				Key: '/course/videos',
				Route: '/course/videos',
				Text: 'Danh sách khoá học',
				Icon: ''
			},
			{
				ItemType: 'single',
				Key: '/course/codes',
				Route: '/course/codes',
				Text: 'Khoá học đã bán',
				Icon: ''
			},
			{
				TypeItem: 'single',
				Key: '/course/donation-history',
				Route: '/course/donation-history',
				Text: 'Lịch sử tặng'
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
				Icon: '',
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
					},
					{
						ItemType: 'single',
						Key: '/options/grades-templates',
						Route: '/options/grades-templates',
						Text: 'Bảng điểm mẫu',
						Icon: ''
					}
				]
			},
			{
				ItemType: 'sub-menu',
				Key: 'sub-list-staff-child-304',
				Icon: '',
				TitleSub: 'Khác',
				SubMenuList: [
					{
						ItemType: 'single',
						Key: '/options/tuition-package',
						Route: '/options/tuition-package',
						Text: 'Gói học phí',
						Icon: ''
					},
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
						Key: '/options/leads-status',
						Route: '/options/leads-status',
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
