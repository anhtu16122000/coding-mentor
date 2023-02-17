type INotification = {
	Content: string
	Enable: boolean
	Id: number
	IsSeen: boolean
	Title: string
	UserId: number
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}

type INotificationBase = IBaseApi<{
	NotificationID: number
	AllRole: boolean
	AllBranch: boolean
	NotificationTitle: string
	NotificationContent: string
	CourseID: number
	BranchID: string
	BranchName: string
	RoleID: string
	RoleName: string
	IsSendMail: boolean
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}>

type INotificationInClass = IBaseApi<{
	ClassId: number,
	Title: string,
	Content: string,
	IsSendMail: boolean,
	Id: number,
	Enable: boolean,
	CreatedOn: any,
	CreatedBy: string,
	ModifiedOn: any,
	ModifiedBy: string
}>
