type IGetAllSeminar<T = ISeminar[]> = {
	message: string
	totalRow: number
	data: T
}

type ISeminar = {
	Name: string
	Description: string
	StartTime: string
	EndTime: string
	VideoCourseId: number
	VideoCourseName: string
	LeaderId: number
	LeaderName: string
	Status: number
	StatusName: string
	Member: number
	Thumbnail: string
	RoomId: string
	RoomPass: string
	SignatureTeacher: string
	SignatureStudent: string
	APIKey: string
	Button: number
	ButtonName: string
	Id: number
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}
