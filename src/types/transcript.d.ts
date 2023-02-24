type ITranscript = IBaseApi<{
	
}>

type ITranscriptByStudentClass = IBaseApi<{
	TranscriptId: number,
      StudentId: number,
      Listening: string,
      Speaking: string,
      Reading: string,
      Writing: string,
      Medium: string,
      Note: string,
      TranscriptModel: any,
      StudentModel: any,
      Id: number,
      Enable: boolean,
      CreatedOn: string,
      CreatedBy: string,
      ModifiedOn: string,
      ModifiedBy: string
}>