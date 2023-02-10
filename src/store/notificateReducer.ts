import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
	dataNotificate: []
}

const notificateSlice = createSlice({
	name: 'notificate',
	initialState,
	reducers: {
		getAll: (state, { payload }: PayloadAction<any>) => {
			state.dataNotificate = payload
		}
	}
})

export const { getAll } = notificateSlice.actions
export default notificateSlice.reducer
