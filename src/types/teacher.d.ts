type ITeacher = IBaseApi<{
	UserInformationID: number
	UserAccountID: number
	UserName: string
	FullNameUnicode: string
	Address: string
	AreaID: number
	AreaName: string
	DistrictID: number
	DistrictName: string
	Avatar: string
	Branch: { ID: number; BranchName: string }[]
	CMND: number
	CMNDDate: null
	CMNDRegister: null
	DOB: null
	Email: string
	Extension: null
	Gender: number
	Ratings: null
	StatusID: number
	StatusName: string
	RoleID: number
	Jobdate: string
	Mobile: string
	isFixSetpacked?: boolean
}>
