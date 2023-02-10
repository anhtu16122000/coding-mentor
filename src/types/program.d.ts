type IProgram = IBaseApi<{
	GradeId: number
	Code: string
	Name: string
	Price: number
	Type: number
	TypeName: string
	Description: string
	GradeCode: string
	GradeName: string
	Id: number
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}>

type ITeacher = IBaseApi<{
	TeacherId: number
	TeacherName: string
	TeacherCode: string
	ProgramId: number
	Allow: boolean
}>
