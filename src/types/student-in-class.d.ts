type IStudentInClass = IBaseApi<{
	UserInformationID: number
	UserAccountID: number
	Username: string
	Password: string
	FullNameUnicode: string
	StatusID: number
	StatusName: string
	Mobile: string
	Email: string
	Gender: number
	Extension: string
	Address: string
	Avatar: string
	AreaID: number
	AreaName: string
	DistrictID: number
	DistrictName: string
	WardID: number
	WardName: string
	HouseNumber: string
	DOB: string
	CMND: string
	CMNDDate: string
	CMNDRegister: string
	Branch: { BranchName: string; ID: number }[]
	AcademicPurposesID: number
	AcademicPurposesName: string
	JobID: number
	JobName: string
	SourceInformationID: number
	SourceInformationName: string
	ParentsIDOf: number
	ParentsNameOf: string
	CounselorsName: string
}>