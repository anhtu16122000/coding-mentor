type ITestCustomer = IBaseApi<{
	ID: number
	BranchID: number
	BranchName: string
	UserInformationID: number
	FullNameUnicode: string
	AppointmentDate: string
	Time: string
	Note: string
	Status: number
	StatusName: string
	ListeningPoint?: string
	ReadingPoint?: string
	SpeakingPoint?: string
	WritingPoint?: string
}>

type ITestCustomerNote = IBaseApi<{
	TestAppointmentId: number
	Note: string
	Id: number
	Enable: true
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}>
