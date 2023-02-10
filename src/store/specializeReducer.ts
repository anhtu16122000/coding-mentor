import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ISpecialize = {
	Id: number
	Code: string
	Name: string
}

const initialState = {
	Specialize: []
}

const specializeSlice = createSlice({
	name: 'specialize',
	initialState,
	reducers: {
		setSpecialize: (state, { payload }: PayloadAction<Array<ISpecialize>>) => {
			state.Specialize = payload
		}
	}
})

export const { setSpecialize } = specializeSlice.actions
export default specializeSlice.reducer
