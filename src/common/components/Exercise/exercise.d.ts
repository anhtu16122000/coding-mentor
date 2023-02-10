type IExerciseItem = {
	data: IExamsResponse
	onRefresh?: Function
}

type ICreateExam = {
	onRefresh?: Function
	defaultData?: any
	className?: string
	isEdit?: boolean
	onOpen?: Function
}

type IPackage = {
	ExerciseGroups: Array<IGroup>
	Explanations: string
	Id: number
	Index: number
	Name: string
}

type IExercise = {
	Answers: Array<{
		AnswerContent?: string
		Content?: string
		Id?: number
		IsTrue: boolean
		isAdd?: boolean
		Enable?: boolean
		ficaID?: any
		timestamp?: any
	}>
	Content: string
	DescribeAnswer: string
	Id: number
	Index: number
	IndexInExam: number
	InputId: string
	Point: number
}

type IGroup = {
	Content: string
	EIndexInExam: number
	ExerciseNumber: number
	Exercises: Array<IExercise>
	Id: number
	Index: number
	IsExist: boolean
	Level: number
	LevelName: string
	Paragraph: string
	SIndexInExam: number
	Type: number
	TypeName: string
}

type ISectionForm = {
	onRefresh?: Function
	isEdit?: boolean
	defaultData?: any
	isStudent?: boolean
	isChangeInfo?: boolean
	className?: string
	onOpen?: Function
}

type IGroupForm = {
	onRefresh?: Function
	isEdit?: boolean
	defaultData?: any
	isStudent?: boolean
	isChangeInfo?: boolean
	className?: string
	onOpen?: Function
	section?: any
	isWriting?: boolean
}
