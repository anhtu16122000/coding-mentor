type IVideoCourse = {
	Name: string
	Thumbnail: string
	Stag: string
	Description: string
	Active: boolean
	BeforeCourseId: number
	BeforeCourseName: string
	TotalRate: number
	TotalStudent: number
	Id: number
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}

type IVideoCourseSection = {
	Id: number
	VideoCourseId: number
	Name: string
	Index: number
	isCompleted: bool
}

type IVideoCourseSectionLesson = {
	Id: number
	SectionId: number
	Type: number
	TypeName: string
	Name: string
	Index: number
	VideoUrl: string
	ExamTopicId: number
	isCompleted: boolean
	ExamId?: number
}

type IVideoCourseFile = {
	LessonVideoId: number
	FileName: string
	FileUrl: string
	Id: number
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}

type IStudentInVideoCourse = {
	UserId: number
	VideoCourseId: number
	MyRate: number
	FullName: string
	UserCode: string
	Gender: number
	Mobile: string
	Email: string
	Id: number
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}

type IVideoCourseOfStudent = {
	UserId: number
	VideoCourseId: number
	MyRate: number
	Name: string
	Thumbnail: string
	Stag: string
	Description: string
	TotalRate: number
	TotalStudent: number
	Id: number
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}

type ICertificateOfStudent = {
	UserId: number
	VideoCourseId: number
	Content: string
	Id: number
	Enable: true
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}

type ILearningDetail = {
	UserId: number
	FullName: string
	Section: ILearningDetailSection
}
type ILearningDetailSection = {
	SectionId: number
	SectionName: string
	LessonVideo: ILearningDetailLesson
}
type ILearningDetailLesson = {
	Id: number
	LessonVideoId: number
	LessonVideoName: string
	CreatedOn: string
}

type IQuestionInVideoCourse = {
	LessonVideoId: number
	UserId: number
	FullName: string
	UserCode: string
	Avatar: string
	Content: string
	Id: number
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}

type IAnswerQuestionInVideoCourse = {
	LessonVideoId: number
	UserId: number
	FullName: string
	UserCode: string
	Avatar: string
	Content: string
	Id: number
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}

type INotificationInVideoCourse = {
	VideoCourseId: number
	Title: string
	Content: string
	IsSend: boolean
	Id: number
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}

type IReviewVideoCourse = {
	VideoCourseId: number
	UserId: number | string
	Avatar: string
	FullName: string
	MyRate: number
	RateComment: string
	CreatedOn: string
}

type IVideoCourseList = IBaseApi<{
	ID: number
	VideoCourseID: number
	VideoCourseName: string
	UserInformationID: number
	StudentName: string
	ImageThumbnails: string
	Status: number
	StatusName: number
	RatingNumber: number
	RatingComment: string
	data: { data: object }
	OriginalPrice: number
	SellPrice: number
	Quantity: number
}>
