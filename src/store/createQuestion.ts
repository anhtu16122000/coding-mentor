import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState = {
	Questions: [],
	QuestionWithAnswers: []
}

const createQuestionSlice = createSlice({
	name: 'filter',
	initialState,
	reducers: {
		setQuestions: (state, { payload }: PayloadAction<any>) => {
			state.Questions = payload
		},
		setQuestionsWithAnswers: (state, { payload }: PayloadAction<any>) => {
			state.QuestionWithAnswers = payload
		}
	}
})

export const { setQuestions, setQuestionsWithAnswers } = createQuestionSlice.actions
export default createQuestionSlice.reducer
