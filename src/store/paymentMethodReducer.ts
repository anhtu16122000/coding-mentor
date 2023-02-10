import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type IPaymentMethod = {
	Name: string
	Code: string
	Thumbnail: string
	Description: string
	Active: boolean
	Id: number
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}

const initialState = {
	PaymentMethod: []
}

const paymentMethodSlice = createSlice({
	name: 'paymentMethod',
	initialState,
	reducers: {
		setPaymentMethod: (state, { payload }: PayloadAction<Array<IPaymentMethod>>) => {
			state.PaymentMethod = payload
		}
	}
})

export const { setPaymentMethod } = paymentMethodSlice.actions
export default paymentMethodSlice.reducer
