import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	data: [],
	listQuestionID: [],
	answered: [],
	activating: null,
	details: {}
}

const testingState = createSlice({
	name: 'area',
	initialState,
	reducers: {
		setTestingData: (state, { payload }) => {
			state.data = payload
		},
		setListQuestionID: (state, { payload }) => {
			state.listQuestionID = payload
		},
		setListAnswered: (state, { payload }) => {
			state.answered = payload
		},
		setActivating: (state, { payload }) => {
			state.activating = payload
		},
		setCurrentDetails: (state, { payload }) => {
			state.details = payload
		}
	}
})

export const { setTestingData, setListQuestionID, setListAnswered, setActivating, setCurrentDetails } = testingState.actions
export default testingState.reducer
