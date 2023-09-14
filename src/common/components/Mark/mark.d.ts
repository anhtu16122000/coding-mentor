type IComments = {
	ID?: number
	Code?: string
	Comment?: string
	LinkAudio?: string
	Avatar?: string
	CreatedBy?: string
	CreatedOn?: string
	RoleName?: string
	IeltsAnswerResultId?: number
	isAdd?: boolean
	Enable?: boolean
}

type IDataRow = {
	Content: string
	DescribeAnswer: string
	ExerciseAnswer: Array<{
		AnswerComment: Array<any>
		AnswerContent: string
		AnswerContentFix: string
		AnswerID: number
		ExerciseAnswerContent: string
		ExerciseAnswerID: number
		FileAudio: string
		ID: number
		StatusFix: number
		isResult: any
		isTrue: any
	}>
	EssayPoint?: string
	ExerciseID: number
	ID: number
	Level: number
	LevelName: string
	LinkAudio: string
	Point: number
	PointMax: number
	SetPackageExerciseAnswerStudent: Array<{
		AnswerComment: Array<any>
		AnswerContent: string
		AnswerContentFix: string
		AnswerID: number
		ExerciseAnswerContent: string
		ExerciseAnswerID: number
		FileAudio: string
		ID: number
		StatusFix: number
		isResult: any
		isTrue: any
	}>
	SkillID: number
	SkillName: string
	Type: number
	TypeName: string
	inputID: any
	isDone: boolean
	isTrue: boolean
}

type IdataMarking = {
	Note: string
	SetPackageResultID: number
	setPackageExerciseStudentsList: Array<{
		ID: number
		Point: any
	}>
}

type IMark = {
	dataMarking?: IdataMarking
	dataRow?: any
	info?: any
	setMarkingWritting?: Function
	onRefresh?: Function
	markingWritting: boolean
}

type IConmmentItem = {
	item: IComments
	active?: string
	onSave?: Function
	onActive?: Function
	onDeleteItem?: Function
	loading?: boolean
	isSubmit?: boolean
	disabled?: boolean
	hiddenRemove?: boolean
}

type IConmmentItemViewApp = {
	item: IComments
	active: string
	onActive: Function
	loading?: boolean
	isSubmit?: boolean
	disabled: boolean
}

type IFunCreate = { ID: number; Text: string }
