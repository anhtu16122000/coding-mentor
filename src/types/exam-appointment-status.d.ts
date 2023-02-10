type IGetExamAppointStatus<T = IExamAppointStatus[]> = {
	message: string
	data: T
}
type IExamAppointStatusAll = {
	Id: number
	Name: string
}

type IConfigAppointmentStatus = IBaseApi<{
	Id: number
	Name: string
}>
