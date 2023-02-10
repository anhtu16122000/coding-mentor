type ICustomerAdvise = IBaseApi<{
	Code: string
	LearningNeedId: number
	CustomerStatusId: number
	FullName: string
	Mobile: string
	Email: string
	SourceId: number
	SaleId: number
	PurposeId: number
	AreaId: number
	DistrictId: number
	WardId: number
	Address: string
	BranchId: number
	BranchName: string
	CustomerStatusName: string
	SaleName: string
	Id: number
}>

type ICustomer = IBaseApi<{
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
