type ICourse = IBaseApi<{
	CourseName: string
	AcademicUID: number
	AcademicName: string
	BranchID: number
	EndDay: string
	GradeID: number
	Price: string
	ProgramID: number
	MaximumStudent: number
	TypeCourse: string
	TypeCourseName: string
	CurriculumID: number
	StartDay: string
	ID: number
	TeacherLeaderUID: number
	TeacherLeaderName: string
	TeacherName: string
	Status: number
	StatusName: string
	TotalDays: number
	TotalStudents: number
	TotalRow: number
	DonePercent: number
	SalaryOfLesson: number
	Avatar: string
	isTutoring?: boolean
	ProgramName?: string
	CurriculumName?: string
}>

type ICourseDetail = IBaseApi<{
	ID: number
	CourseName: string
	BranchID: number
	GradeID: number
	ProgramID: number
	CurriculumID: number
	StartDay: string
	EndDay: string
	Price: number
	Status: number
	StatusName: string
	AcademicUID: number
	TeacherLeaderUID: number
	TypeCourse: number
	SalaryOfLesson: number
}>
