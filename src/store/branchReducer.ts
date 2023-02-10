import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type IBranch = {
	Code: string
	Name: string
	AreaId: number
	DistrictId: number
	WardId: number
	Address: string
	Mobile: string
	Email: string
	Id: number
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}

const initialState = {
	Branch: []
}

const branchSlice = createSlice({
	name: 'branch',
	initialState,
	reducers: {
		setBranch: (state, { payload }: PayloadAction<Array<IBranch>>) => {
			state.Branch = payload
		}
	}
})

export const { setBranch } = branchSlice.actions
export default branchSlice.reducer
