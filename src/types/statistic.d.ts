type IStatisticTotalLessonOfTeacher = IBaseApi<{
	UserInformationID: number
	RoleID: number
	FullNameUnicode: string
	Avatar: string
	Email: string
	Mobile: string
	TotalLesson: number
	TotalRow: number
}>

type ILessonDetailsOfTeacher = IBaseApi<{
	ID: number
	TeacherID: number
	Date: string
	BranchName: string
	CourseName: string
	TimeStart: string
	TimeEnd: string
	Time: number
}>
