type IFormInputText = {
	style?: object
	label: string | element
	name: string
	isRequired?: boolean
	className?: string
	allowClear?: boolean
	placeholder?: string
	disabled?: boolean
	rules?: array
	defaultValue?: string
	onChange?: any
	value?: any
}

type IUploadImageField = {
	style?: object
	label: string
	form: any
	name: string
	isRequired?: boolean
	multiple?: boolean
	className?: string
	disabled?: boolean
	rules?: array
	setIsLoadingImage?: Function
	max?: any
	onChangeImage?: any
}

type IFormInputNumber = {
	style?: object
	name: string
	label: string
	isRequired?: boolean
	className?: string
	allowClear?: boolean
	placeholder?: string
	disabled?: boolean
	rules?: array
	max?: number
	onChange?: any
	loading?: boolean
}

type IFormSelectField = {
	style?: object
	name: string
	label: string | element
	isRequired?: boolean
	className?: string
	placeholder?: string
	mode?: 'multiple' | 'tags'
	disabled?: boolean
	isLoading?: boolean
	rules?: array
	onChangeSelect?: function
	onSearch?: function
	onScroll?: function
	optionList: ISelectOptionList[]
	title?: string[] | string
}

type ISelectOptionList = {
	title: string
	value: any
}

type IEditorField = {
	label?: string
	name: string
	onChangeEditor: Function
	disableButton?: Function
	isRequired?: boolean
	disabled?: boolean
	rules?: array
	initialValue?: string
	placeholder?: string
	customFieldProps?: any
	id?: any
	height?: number
}

type IUploadFileField = {
	style?: object
	label: string
	form: any
	name: string
	buttonText?: string
	isRequired?: boolean
	multiple?: boolean
	className?: string
	disabled?: boolean
	rules?: array
	onChangeFile?: Function
	max?: number
}

type ITextBoxField = {
	style?: object
	label?: string
	name?: string
	rows?: number
	isRequired?: boolean
	className?: string
	allowClear?: boolean
	placeholder?: string
	disabled?: boolean
	rules?: array
	maxLength?: number
	onChange?: Function
}

type IDatePickerField = {
	label: string
	name: string
	mode: 'range' | 'single'
	placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
	format?: string
	picker?: 'date' | 'showTime' | 'date' | 'week' | 'month' | 'quarter' | 'year'
	isRequired?: boolean
	className?: string
	placeholderRange?: [string, string]
	placeholder?: string
	disabled?: boolean
	allowClear?: boolean
	rules?: array
	disabledDate?: any
	form?: any
	showTime?: any
	onChange?: FC
}
