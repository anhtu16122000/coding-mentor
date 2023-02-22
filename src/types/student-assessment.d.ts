type IStudentAssessment = IBaseApi<{
	ClassId: number
	ScheduleId: number
	StartTime: string
	EndTime: string
	StudentId: number
	Listening: string
	Speaking: string
	Reading: string
	Writing: string
	Note: string
	Id: number
	CreatedBy: string
	CreatedOn: string
	ModifiedOn: string
	ModifiedBy: string
	Enable: boolean
}>
