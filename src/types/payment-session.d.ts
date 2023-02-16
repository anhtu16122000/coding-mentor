type IPaymentSession = IBaseApi<{
	BranchId: number
	UserId: number
	Value: number
	PrintContent: string
	PaymentMethodId: number
	Reason: string
	Note: string
	Type: number
	TypeName: string
	FullName: string
	UserCode: string
	BranchName: string
	PaymentMethodName: string
	Id: number
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}>
