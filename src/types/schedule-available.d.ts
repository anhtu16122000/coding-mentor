type IScheduleAvailable = IBaseApi<{
	ClassId: number
	BranchId: number
	RoomId: number
	StartTime: string
	EndTime: string
	TeacherId: number
	TeacherAttendanceId: number
	RoomName: string
	RoomCode: string
	TeacherName: string
	TeacherCode: string
	Status: number
	StatusName: string
	Button: number
	ButtonName: string
	IsEndZoom: boolean
	ZoomId: number
	ZoomPass: string
	SignatureTeacher: any
	SignatureStudent: any
	ZoomConfigId: any
	SalaryId: string
	TeachingFee: any
	Note: ''
	Id: number
}>
