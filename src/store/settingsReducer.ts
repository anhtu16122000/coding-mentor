import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const storageKey = 'BAOCHAU_SETTING'

type IMode = 'light' | 'dark'
type ISettings = {
	Mode: IMode
	Token: string
	opened: boolean
	isOpen: Array<any>
}

const initialState = {
	Mode: 'light',
	Token: '',
	borderRadius: 12,
	fontFamily: "'Roboto', sans-serif",
	isOpen: ['default'],
	opened: false
} as ISettings

const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		setMode: (state: ISettings, { payload }: PayloadAction<IMode>) => {
			state.Mode = payload
		},
		setToken: (state: ISettings, { payload }: PayloadAction<IMode>) => {
			state.Token = payload
		},
		setOpen: (state: ISettings, { payload }: PayloadAction<boolean>) => {
			state.opened = payload
		}
	}
})

const { actions, reducer } = settingsSlice
export const { setMode, setToken, setOpen } = actions
export default settingsSlice.reducer
