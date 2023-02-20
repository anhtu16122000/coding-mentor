type IRollUp = IBaseApi<{
}>

type IRollUpStudent = IBaseApi<{
    ClassId: number,
    StudentId: number,
    ScheduleId: number,
    Status: number,
    StatusName: string,
    LearningStatus: number,
    LearningStatusName: string,
    Note: string,
    FullName: string,
    UserCode: string
    ScheduleModel: any
}>
