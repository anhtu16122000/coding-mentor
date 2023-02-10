type ICreateNew = {
	onRefresh?: Function
	isEdit?: boolean
	defaultData?: any
	isStudent?: boolean
	isChangeInfo?: boolean
	className?: string
	onOpen?: Function
	roleStaff?: Array<any>
	source?: Array<any>
	purpose?: Array<any>
	sale?: Array<any>
	learningNeed?: Array<any>
}

type IPersonnel = {
	type: 'personnel' | 'student'
	allowRegister?: boolean
	reFresh?: Function
}
