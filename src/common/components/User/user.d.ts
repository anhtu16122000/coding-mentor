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
	allowRegister?: boolean
	reFresh?: Function
	role?: any
}
