import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ICustomerStatus = {
	Type: number
	Name: string
	Id: number
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}

const initialState = {
	CustomerStatus: []
}

const customerStatusSlice = createSlice({
	name: 'customerStatus',
	initialState,
	reducers: {
		setCustomerStatus: (state, { payload }: PayloadAction<Array<ICustomerStatus>>) => {
			state.CustomerStatus = payload
		}
	}
})

export const { setCustomerStatus } = customerStatusSlice.actions
export default customerStatusSlice.reducer
