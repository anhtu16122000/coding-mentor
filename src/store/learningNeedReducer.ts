import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ILearningNeed = {
	Name: string
	Id: number
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}

const initialState = {
	LearningNeed: []
}

const learningNeedSlice = createSlice({
	name: 'learningNeed',
	initialState,
	reducers: {
		setLearningNeed: (state, { payload }: PayloadAction<Array<ILearningNeed>>) => {
			state.LearningNeed = payload
		}
	}
})

export const { setLearningNeed } = learningNeedSlice.actions
export default learningNeedSlice.reducer
