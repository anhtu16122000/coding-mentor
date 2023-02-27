import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type TCart = any

const initialState = {
	CartData: []
}

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		setCartData: (state, { payload }: PayloadAction<Array<TCart>>) => {
			state.CartData = payload
		}
	}
})

export const { setCartData } = cartSlice.actions
export default cartSlice.reducer
