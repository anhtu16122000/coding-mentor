import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState = {
	Branchs: [],
	Programs: [],
	Classes: []
}

const filterSlice = createSlice({
	name: 'filter',
	initialState,
	reducers: {
		setFilterBranchs: (state, { payload }: PayloadAction<any>) => {
			state.Branchs = payload
		},
		setFilterPrograms: (state, { payload }: PayloadAction<any>) => {
			state.Programs = payload
		},
		setFilterClass: (state, { payload }: PayloadAction<any>) => {
			state.Classes = payload
		}
	}
})

export const { setFilterBranchs, setFilterPrograms, setFilterClass } = filterSlice.actions
export default filterSlice.reducer
