type IBill = IBaseApi<{
	
}>

type IBillDetail = IBaseApi<{
	
}>

type IGetDiscountHistory = IBaseApi<{
	Code: string
    StudentId: number
    TotalPrice: number,
    DiscountId: number,
    DiscountCode: string,
    Value: number,
    Reduced: number,
    Paid: number,
    Debt: number,
    PaymentMethodId: number,
    PaymentMethodName: string,
    PaymentAppointmentDate: string,
    CompleteDate: null,
    BranchId: number,
    Note: null,
    Type: number,
    TypeName:string,
    FullName: string,
    UserCode: string,
    BranchName: string,
    TotalRow: number,
    Id: number,
    Enable: boolean,
    CreatedOn: string,
    CreatedBy: string,
    ModifiedOn: string,
    ModifiedBy: string
}>