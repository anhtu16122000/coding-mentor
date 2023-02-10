type ICourseOfStudent = IBaseApi<{
	ID: number
	BranchID: number
	BranchName: string
	CourseID: number
	CourseName: string
	StartDay: string
	EndDay: string
	Price: number
	UserInformationID: number
	FullNameUnicode: string
	Warning: boolean
	Examresult: string
	CourseOfStudentPriceID: number
	Commitment: string
	Note: string
	Combo: boolean
	isContract: boolean
	Enable: boolean
	CreatedBy: string
	CreatedOn: string
	ModifiedBy: string
	ModifiedOn: string
}>[]
