type IStatisticGetAll<T = Array[IStatisticAll]> = {
	message: string
	data: T
}

type IStatisticAll = {
	TypeName: string
	Count: number
}

type IGetOverviewTeacher<T = Array[IOverviewTeacher]> = {
	message: string
	data: T
}

type IOverviewTeacher = {
	Type: string
	Count: number
}

type IGetOverviewStudent<T = Array[IOverviewStudent]> = {
	message: string
	data: T
}

type IOverviewStudent = {
	Type: string
	Count: number
}

type IStatisticGetAllInMonth<T = Array[IStatisticGetInMonth]> = {
	message: string
	data: T
}

type IStatisticGetInMonth = {
	TypeName: string
	Count: number
	Note: string
}

type IStatisticGetAgeStudent<T = Array[IStatisticAgeStudent]> = {
	message: string
	data: T
}

type IStatisticAgeStudent = {
	Type: number
	Note: string
	Count: number
}

type IStatisticGetTopCourse<T = Array[IStatisticTopCourse]> = {
	message: string
	data: T
}

type IStatisticTopCourse = {
	Id: number
	Name: string
	Total: number
}
