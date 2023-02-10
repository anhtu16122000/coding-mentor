import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ISource = {
	Name: string
	Id: number
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}

const initialState = {
	Source: []
}

const sourceSlice = createSlice({
	name: 'source',
	initialState,
	reducers: {
		setSource: (state, { payload }: PayloadAction<Array<ISource>>) => {
			state.Source = payload
		}
	}
})

export const { setSource } = sourceSlice.actions
export default sourceSlice.reducer
