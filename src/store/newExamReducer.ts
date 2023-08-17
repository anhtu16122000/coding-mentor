import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
	currentSection: null,
	currentGroup: null
}

const newExamReducer = createSlice({
	name: 'area',
	initialState,
	reducers: {
		setNewCurrentSection: (state, { payload }: PayloadAction<any>) => {
			state.currentSection = payload
		},
		setNewCurrentGroup: (state, { payload }: PayloadAction<any>) => {
			state.currentGroup = payload
		}
	}
})

export const { setNewCurrentSection, setNewCurrentGroup } = newExamReducer.actions

export default newExamReducer.reducer
