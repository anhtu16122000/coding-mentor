import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type IStudyTime = {
	Name: string
	StartTime: string
	EndTime: string
	Time: number
	Id: number
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}

const initialState = {
	StudyTime: []
}

const studyTimeSlice = createSlice({
	name: 'studyTime',
	initialState,
	reducers: {
		setStudyTime: (state, { payload }: PayloadAction<Array<IStudyTime>>) => {
			state.StudyTime = payload
		}
	}
})

export const { setStudyTime } = studyTimeSlice.actions
export default studyTimeSlice.reducer
