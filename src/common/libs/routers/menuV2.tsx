import {
	ROLE_ACADEMIC,
	ROLE_ACCOUNTANT,
	ROLE_ADMIN,
	ROLE_MANAGER,
	ROLE_PARENT,
	ROLE_SALER,
	ROLE_STUDENT,
	ROLE_TEACHER
} from '~/constants/common'
import { renderItemMenu } from './func'
import { MenuItems } from './type'

// menu cấp quản lý
export const MANAGEMENT_MENU: MenuItems[] = [
	{
		key: 'trungtam',
		label: 'Trung tâm',
		type: 'group',
		allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC],
		children: [
			{
				label: 'Thông tin chung',
				key: 'thongtinchung',
				icon: <img style={{ width: 'unset' }} src="/icons/menu/insert-chart.svg" />,
				allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC],
				children: [
					renderItemMenu({
						key: '/',
						label: 'Tin tức',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/dashboard',
						label: 'Thống kê',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/elsa-speak',
						label: 'Kiểm tra nói',
						allow: []
						// allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/options/general-notification',
						label: 'Tạo thông báo',
						allow: [ROLE_ADMIN, ROLE_MANAGER]
					}),
					renderItemMenu({
						key: '/users/salary',
						label: 'Bảng lương',
						allow: [ROLE_TEACHER, ROLE_SALER]
					}),
					renderItemMenu({
						key: '/users/teacher/teacher-off',
						label: 'Đăng ký lịch nghỉ',
						allow: [ROLE_TEACHER]
					})
				]
			},
			{
				label: 'Khách hàng',
				key: 'khachhang',
				icon: <img style={{ width: '24px', height: '24px' }} src="/icons/menu/local-library.svg" />,
				allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC],
				children: [
					renderItemMenu({
						key: '/leads',
						label: 'Leads',
						allow: [ROLE_ADMIN, ROLE_MANAGER, ROLE_SALER, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/entry-test',
						label: 'Hẹn test',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/class/register',
						label: 'Đăng ký học',
						allow: [ROLE_ADMIN, ROLE_MANAGER, ROLE_SALER, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/info-course/registration',
						label: 'Hẹn đăng ký',
						allow: [ROLE_ADMIN, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/options/discount',
						label: 'Mã khuyến mãi',
						allow: [ROLE_ADMIN, ROLE_MANAGER, ROLE_SALER, ROLE_ACADEMIC]
					})
				]
			}
		]
	},
	{
		key: 'hoctap',
		label: 'Học tập',
		type: 'group',
		allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC],
		children: [
			{
				label: 'Lớp học',
				key: 'lophoc',
				icon: <img style={{ width: 'unset' }} src="/icons/menu/class.svg" />,
				allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC],
				children: [
					renderItemMenu({
						key: '/class/create',
						label: 'Tạo lớp học',
						allow: [ROLE_ADMIN, ROLE_MANAGER, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/class',
						label: 'Danh sách lớp học',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC],
						children: [
							renderItemMenu({
								key: '/class/list-class/detail',
								label: 'Chi tiết lớp học',
								allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
							})
						]
					}),
					renderItemMenu({
						key: '/class/class-timeline',
						label: 'Timeline lớp học',
						allow: [ROLE_ADMIN, ROLE_MANAGER, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/class/schedule',
						label: 'Kiểm tra lịch',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/class/zoom-rooms',
						label: 'Danh sách phòng Zoom',
						allow: [ROLE_ADMIN, ROLE_MANAGER, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/class/schedule',
						label: 'Lịch dạy',
						allow: [ROLE_TEACHER]
					})
				]
			},
			{
				label: 'Học viên',
				key: 'họcvien',
				icon: <img style={{ width: 'unset' }} src="/icons/menu/hocvien.svg" />,
				allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC],
				children: [
					renderItemMenu({
						key: '/info-course/student',
						label: 'Dữ liệu học viên',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/info-course/student-in-class',
						label: 'Học viên trong lớp',
						allow: [ROLE_ADMIN, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/info-course/changed',
						label: 'Chuyển lớp',
						allow: [ROLE_ADMIN, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/info-course/reserved',
						label: 'Bảo lưu',
						allow: [ROLE_ADMIN, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/library-online/library',
						label: 'Tài liệu',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/info-course/nearing-completion',
						label: 'Danh sách học viên sắp học xong',
						allow: [ROLE_ADMIN, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/practice',
						label: 'Luyện tập',
						allow: [ROLE_ADMIN, ROLE_MANAGER, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/info-course/rollup',
						label: 'Điểm danh mã QR',
						allow: [ROLE_ADMIN, ROLE_MANAGER, ROLE_ACADEMIC]
					})
				]
			},
			{
				label: 'Kết nối phụ huynh',
				key: 'ketnoiphuhuynh',
				icon: <img style={{ width: 'unset' }} src="/icons/menu/ketnoiphuhuynh.svg" />,
				allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACADEMIC],
				children: [
					renderItemMenu({
						key: '/info-course/parents',
						label: 'Danh sách phụ huynh',
						allow: [ROLE_ADMIN, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/info-course/feedbacks',
						label: 'Phản hồi',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/info-course/student/warning',
						label: 'Cảnh báo học viên',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					})
				]
			},
			{
				label: 'Cấu hình học',
				key: 'cauhinhhoc',
				icon: <img style={{ width: 'unset' }} src="/icons/menu/cauhinhhoc.svg" />,
				allow: [ROLE_ADMIN, ROLE_MANAGER, ROLE_ACADEMIC],
				children: [
					renderItemMenu({
						key: '/options/specialize',
						label: 'Chuyên môn',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/options/program',
						label: 'Chương trình học',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/options/study-time',
						label: 'Ca học',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/options/zoom',
						label: 'Cấu hình Zoom',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/options/grades-templates',
						label: 'Bảng điểm mẫu',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/options/tuition-package',
						label: 'Gói học phí',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					})
				]
			},
			{
				label: 'Đề thi',
				key: 'dethi',
				icon: <img style={{ width: 'unset' }} src="/icons/menu/dethi.svg" />,
				// allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_ACADEMIC],
				allow: [],
				children: [
					renderItemMenu({
						key: '/package-exam',
						label: 'Bộ đề',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/questions',
						label: 'Ngân hàng câu hỏi',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/exam',
						label: 'Ngân hàng đề',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					})
				]
			},
			{
				label: 'Khóa học video ',
				key: 'khoahocvideo',
				icon: <img style={{ width: 'unset' }} src="/icons/menu/khoahocvideo.svg" />,
				allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_ACADEMIC],
				children: [
					renderItemMenu({
						key: '/course/videos',
						label: 'Danh sách khoá học',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/course/codes',
						label: 'Khoá học đã bán',
						allow: [ROLE_ADMIN, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/course/donation-history',
						label: 'Lịch sử tặng',
						allow: [ROLE_ADMIN, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					})
				]
			}
		]
	},
	{
		key: 'quanly',
		label: 'Quản lý',
		type: 'group',
		allow: [ROLE_ADMIN, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC],
		children: [
			{
				key: 'quanlynhanvien',
				label: 'Quản lý nhân viên',
				icon: <img style={{ width: 'unset' }} src="/icons/menu/person-outline.svg" />,
				allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_ACCOUNTANT, ROLE_ACADEMIC],
				children: [
					renderItemMenu({
						key: '/users/personnel',
						label: 'Danh sách nhân viên',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT]
					}),
					renderItemMenu({
						key: '/users/teacher/teacher-off',
						label: 'Duyệt lịch nghỉ',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/users/salary-config',
						label: 'Cấu hình lương',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT]
					}),
					renderItemMenu({
						key: '/users/salary',
						label: 'Bảng lương',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					})
				]
			},
			{
				key: 'quanlytaichinh',
				label: 'Quản lý tài chính',
				icon: <img style={{ width: 'unset' }} src="/icons/menu/finance.svg" />,
				allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC],
				children: [
					renderItemMenu({
						key: '/finance/payment',
						label: 'Thông tin thanh toán',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/finance/cash-flow',
						label: 'Thu chi',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_ACCOUNTANT]
					}),
					renderItemMenu({
						key: '/finance/verification',
						label: 'Duyệt thanh toán',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/finance/refund',
						label: 'Hoàn tiền',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					})
				]
			}
		]
	},
	{
		key: 'cauhinh',
		label: 'Cấu hình',
		type: 'group',
		allow: [ROLE_ADMIN, ROLE_MANAGER, ROLE_ACADEMIC],
		children: [
			{
				key: 'hethong',
				label: 'Hệ thống',
				icon: <img style={{ width: 'unset' }} src="/icons/menu/settings.svg" />,
				allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT],
				children: [
					renderItemMenu({
						key: '/options/center',
						label: 'Trung tâm',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/options/day-off',
						label: 'Ngày nghỉ',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/options/idiom',
						label: 'Thành ngữ lịch',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/configs/certificates',
						label: 'Mẫu chứng chỉ',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/options/payment',
						label: 'Phương thức thanh toán',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/options/paymentPemission',
						label: 'Cấp quyền thanh toán',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/options/faq',
						label: 'Câu hỏi thường gặp',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/options/config-template',
						label: 'Mẫu',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					})
				]
			},
			{
				key: 'danhmuc',
				label: 'Danh mục',
				icon: <img style={{ width: 'unset' }} src="/icons/menu/student.svg" />,
				allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC],
				children: [
					renderItemMenu({
						key: '/options/learning-needs',
						label: 'Nhu cầu học',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/options/customer-supplier',
						label: 'Nguồn khách hàng',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/options/jobs',
						label: 'Công việc',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/options/leads-status',
						label: 'Trạng thái khách hàng',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),
					renderItemMenu({
						key: '/options/purpose',
						label: 'Mục đích học',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					}),

					renderItemMenu({
						key: '/options/tags',
						label: 'Từ khoá',
						allow: [ROLE_ADMIN, ROLE_TEACHER, ROLE_MANAGER, ROLE_SALER, ROLE_ACCOUNTANT, ROLE_ACADEMIC]
					})
				]
			}
		]
	}
]
// menu cho phụ huynh và học sinh
export const NORMAL_MENU: MenuItems[] = [
	{
		key: 'thongtinchung',
		label: 'Thông tin chung',
		type: 'group',
		allow: [ROLE_STUDENT, ROLE_PARENT],
		children: [
			{
				label: 'Tin tức',
				key: '/',
				icon: <img style={{ width: 'unset' }} src="/icons/menu/normal/tintuc.svg" />,
				allow: [ROLE_STUDENT, ROLE_PARENT]
			},
			{
				label: 'Thống kê',
				key: '/dashboard',
				icon: <img style={{ width: '24px', height: '24px' }} src="/icons/menu/normal/thongke.svg" />,
				allow: [ROLE_STUDENT, ROLE_PARENT]
			},
			{
				label: 'Phản hồi',
				key: '/info-course/feedbacks',
				icon: <img style={{ width: '24px', height: '24px' }} src="/icons/menu/normal/phanhoi.svg" />,
				allow: [ROLE_STUDENT, ROLE_PARENT]
			}
		]
	},
	{
		label: 'Học tập',
		key: 'hoctap',
		type: 'group',
		allow: [ROLE_STUDENT, ROLE_PARENT],
		children: [
			{
				label: 'Lịch học',
				key: '/class/schedule',
				icon: <img style={{ width: 'unset' }} src="/icons/menu/normal/lichhoc.svg" />,
				allow: [ROLE_STUDENT, ROLE_PARENT]
			},
			{
				label: 'Danh sách lớp học',
				key: '/class',
				icon: <img style={{ width: 'unset' }} src="/icons/menu/normal/danhsachlophoc.svg" />,
				allow: [ROLE_STUDENT, ROLE_PARENT]
			},
			{
				label: 'Luyện tập',
				key: '/training-student',
				icon: <img style={{ width: 'unset' }} src="/icons/menu/normal/luyentap.svg" />,
				allow: [ROLE_STUDENT, ROLE_PARENT]
			},
			{
				label: 'Thông tin hẹn test',
				key: '/entry-test',
				icon: <img style={{ width: 'unset' }} src="/icons/menu/normal/thongtinhentest.svg" />,
				allow: [ROLE_STUDENT, ROLE_PARENT]
			},
			{
				label: 'Thông tin cảnh báo',
				key: '/info-course/student/warning',
				icon: <img style={{ width: 'unset' }} src="/icons/menu/normal/thongtincanhbao.svg" />,
				allow: [ROLE_STUDENT, ROLE_PARENT]
			},
			{
				label: 'Thư viện online',
				key: '/library-online/library',
				icon: <img style={{ width: 'unset' }} src="/icons/menu/normal/thuvientructuyen.svg" />,
				allow: [ROLE_STUDENT, ROLE_PARENT]
			}
		]
	},
	{
		key: 'cuahang',
		label: 'Cửa hàng',
		type: 'group',
		allow: [ROLE_STUDENT],
		children: [
			{
				label: 'Bộ đề',
				key: '/package-exam',
				icon: <img style={{ width: 'unset' }} src="/icons/menu/normal/bode.svg" />,
				// allow: [ROLE_STUDENT, ROLE_PARENT],
				allow: []
			},
			{
				label: 'Khóa học video',
				key: '/course',
				icon: <img style={{ width: '24px', height: '24px' }} src="/icons/menu/normal/khoahocvideo.svg" />,
				allow: [ROLE_STUDENT, ROLE_PARENT]
			},
			{
				label: 'Danh sách mã kích hoạt',
				key: '/course/codes',
				icon: <img style={{ width: '24px', height: '24px' }} src="/icons/menu/normal/danhsachmakichhoat.svg" />,
				allow: [ROLE_STUDENT, ROLE_PARENT]
			}
		]
	}
]
