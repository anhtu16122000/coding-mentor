type ICourseOfStudentChange = IBaseApi<{
	CourseOfStudentID: number //int ID
	CourseIDAfter: number //int ID lớp học mới
	Paid: number //số tiền thanh toán thêm
	Note: string
	Commitment: string
}>

type IStudentOfChangeCourse = IBaseApi<{
	ID: number
	UserInformationID: number
	FullNameUnicode: string
	CourseIDBefore: number
	CourseNameBefore: string
	CourseIDAfter: number
	CourseNameAfter: string
	Note: string
	BranchID: number
	BranchName: string
	Commitment: string
}>
