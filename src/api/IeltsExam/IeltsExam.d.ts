type TIeltsExam = IBaseApi<{
	Name?: string
	Code?: string
	QuestionsAmount?: number
	QuestionsEasy?: number
	QuestionsNormal?: number
	QuestionsDifficult?: number
	Thumbnail?: string
	Time?: number
	Description?: string
	Active?: boolean
	Point?: number
	Id?: number
}>

type TInputIeltsExam = {
	Name: string
	Code: string
	Thumbnail: string
	Description: string
}

type TIeltsExamOverview = {
	Id: number
	Name: string
	Code: string
	QuestionsAmount: number
	QuestionsEasy: number
	QuestionsNormal: number
	QuestionsDifficult: number
	Thumbnail: string
	Time: number
	Description: string
	IeltsSkills: null
}
