type ISalaryConfig = IBaseApi<{
	UserId: number,
    Value: number,
    Note: string,
    FullName: string
    UserCode: string,
    RoleId: number,
    RoleName: string,
    Id: number,
    Enable: boolean,
    CreatedOn: any,
    CreatedBy: string,
    ModifiedOn: any,
    ModifiedBy: string
}>

type ISalary = IBaseApi<{
	
}>