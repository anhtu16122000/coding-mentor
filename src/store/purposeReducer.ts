import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type IPurpose = {
	Name: string
	Id: number
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}

const initialState = {
	Purpose: []
}

const purposeSlice = createSlice({
	name: 'purpose',
	initialState,
	reducers: {
		setPurpose: (state, { payload }: PayloadAction<Array<IPurpose>>) => {
			state.Purpose = payload
		}
	}
})

export const { setPurpose } = purposeSlice.actions
export default purposeSlice.reducer
