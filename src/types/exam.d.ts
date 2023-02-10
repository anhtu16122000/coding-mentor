type IUserInputGetall = {}

type IExamsResponse = IBaseApi<{
	Code: string
	Description: string
	DifficultExercise: number
	EasyExercise: number
	Enable: boolean
	Id: number
	ModifiedBy: string
	ModifiedOn: string
	Name: string
	NormalExercise: number
	NumberExercise: number
	PassPoint: number
	Time: number
}>

type IPostExam = {
	Name: string
	Code: string
	Description?: string
	Time?: nay
	PassPoint?: string
	ID?: number
}

type TPostSection = {
	ExamId: number
	Name: string
	Explanations: string
}

type IGetExam = {
	search: string
	pageSize: number
	pageIndex: number
}

type IRecord = {
	Id: string
	download_url: string
	file_extension: string
	file_size: string
	file_type: string
	meeting_Id: string
	play_url: string
	recording_end: string
	recording_start: string
	recording_type: string
}

type IExamTopic = IBaseApi<{
	ID: number
	Name: string
	Code: string
	Type: number
	TypeName: string
	CurriculumID: number
	CurriculumName: string
	NumberExercise: number
	Time: number
	DifficultExercise: number
	NormalExercise: number
	EasyExercise: number
	Description: string
	GradeName?: string
	GradeID?: number
	ProgramName: string
	TotalPoint: number
}>
