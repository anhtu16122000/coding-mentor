import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
	loading: true,
	data: {
		user: {}
	},
	refreshToken: null
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
		},
		setRefreshToken: (state, { payload }: PayloadAction<any>) => {
			state.refreshToken = payload
		}
	}
})

export const { setAuthData, setAuthLoading, setRefreshToken } = authSlice.actions
export default authSlice.reducer
