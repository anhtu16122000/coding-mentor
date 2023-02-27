type ICurriculum = IBaseApi<{
	ProgramId: number
	Name: string
	Lesson: number
	Time: number
	Id: number
}>

type ICurriculumDetail = IBaseApi<{
	CurriculumId: number
	Name: string
	FileName: string
	FileUrl: string
	FileType: string
	Id: number
	Index: number
	Time: number
	IsHide:boolean
	CreatedBy: string
	CreatedOn: string
	CurriculumDetailId: number
	Enable: boolean
	FileCurriculumId: number
	IsComplete: boolean
	IsHide: boolean
	ModifiedBy: string
	ModifiedOn: string
}>

type ITeacherOff = IBaseApi<{
	TeacherId: number
	StartTime: string
	EndTime: string
	Reason: string
	Status: number
	StatusName: string
	Note: string
	FullName: string
	UserCode: string
	Id: number
}>

type ICreateClass = {
	Name: string
	Thumbnail: string
	BranchId: number
	GradeId: number
	ProgramId: number
	CurriculumId: number
	StartDay: string
	Price: number
	AcademicId: number
	TeacherId: number
	Type: number
	TeachingFee: number
	MaxQuantity: number
	schedules: Array<any>
}

type IClass = IBaseApi<{
	Note?: string
	Fit?: boolean
	Name: string
	Thumbnail: string
	BranchId: number
	BranchName: string
	GradeId: number
	GradeName: string
	ProgramId: number
	ProgramName: string
	CurriculumId: number
	CurriculumName: string
	StartDay: string
	EndDay: string
	Price: number
	Status: number
	StatusName: string
	AcademicId: number
	AcademicName: string
	TeacherName: string
	Type: number
	TypeName: string
	TeachingFee: number
	MaxQuantity: number
	StudentQuantity: number
	TotalStudent: number
	TotalLesson: number
	LessonCompleted: number
	LessonComple: number
	Id: number
}>

type IRollUpTeacher = IBaseApi<{
	ScheduleId: number
	ClassId: number
	TeacherId: number
	TeacherName: string
	TeacherCode: string
	StartTime: any
	EndTime: any
	TeacherAttendanceId: number
}>
