import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialUser = null as IUser

const initialState = {
	information: initialUser
}

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, { payload }: PayloadAction<IUser>) => {
			state.information = payload
		}
	}
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
