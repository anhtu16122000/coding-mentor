import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
	loading: true,
	data: {
		user: {}
	}
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setAuthLoading: (state, { payload }: PayloadAction<any>) => {
			state.loading = payload
		},
		setAuthData: (state, { payload }: PayloadAction<any>) => {
			state.data = payload
		}
	}
})

export const { setAuthData, setAuthLoading } = authSlice.actions
export default authSlice.reducer
