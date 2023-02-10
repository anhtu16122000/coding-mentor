import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type IDiscount = {
	Code: string
	Type: number
	TypeName: string
	PackageType: number
	PackageTypeName: string
	Value: number
	Status: number
	StatusName: string
	Note: string
	Expired: string
	Quantity: number
	UsedQuantity: number
	MaxDiscount: number
	Id: number
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}

const initialState = {
	Discount: []
}

const discountSlice = createSlice({
	name: 'discount',
	initialState,
	reducers: {
		setDiscount: (state, { payload }: PayloadAction<Array<IDiscount>>) => {
			state.Discount = payload
		}
	}
})

export const { setDiscount } = discountSlice.actions
export default discountSlice.reducer
