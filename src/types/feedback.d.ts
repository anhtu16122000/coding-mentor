type IFeedback = IBaseApi<{
	ID: number
	Name: string
	Role: number
}>

type IFeedbackStudent = IBaseApi<{
	Avatar: string
	Content: string
	CreatedBy: string
	CreatedIdBy: number
	CreatedOn: string
	Enable: boolean
	Id: number
	IsIncognito: boolean
	IsPriority: boolean
	ModifiedBy: string
	ModifiedOn: string
	StarRating: number
	Status: number
	StatusName: string
	Title: string
}>

type IFeedbackStudentReply = IBaseApi<{
	FeedbackId: number
	Content: string
	IsIncognito: boolean
	CreatedIdBy: number
	Avatar: string
	Id: number
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}>
