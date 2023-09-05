import { createSlice } from '@reduxjs/toolkit'
import type { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface PostedState {
	navLoading: boolean
	submitVisible: boolean
	activeNav: any
	navigations: Array<any>
	submited: boolean
	timeout: boolean
	overview?: any
	curGroup?: any
}

const initialState: PostedState = {
	navLoading: true,
	activeNav: null,
	navigations: [],
	submitVisible: false,
	submited: false,
	timeout: false,
	overview: {},
	curGroup: null
}

export const takeAnExamSlice = createSlice({
	name: 'takeAnExam',
	initialState,
	reducers: {
		setNavLoading: (state, action: PayloadAction<any>) => {
			state.navLoading = action.payload
		},
		setNavigations: (state, action: PayloadAction<any>) => {
			state.navigations = action.payload
		},
		setActiveNav: (state, action: PayloadAction<any>) => {
			state.activeNav = action.payload
		},
		openSubmitModal: (state) => {
			state.submitVisible = true
		},
		closeSubmitModal: (state) => {
			state.submitVisible = false
		},
		setSubmited: (state, action: PayloadAction<any>) => {
			state.submited = action.payload
		},
		setTimeOut: (state, action: PayloadAction<any>) => {
			state.timeout = action.payload
		},
		setSuperOverview: (state, action: PayloadAction<any>) => {
			state.overview = action.payload
		},
		setGlobalCurGroup: (state, action: PayloadAction<any>) => {
			state.curGroup = action.payload
		}
	}
})

// Action creators are generated for each case reducer function
export const {
	setNavLoading,
	setGlobalCurGroup,
	setSuperOverview,
	setNavigations,
	setActiveNav,
	closeSubmitModal,
	openSubmitModal,
	setSubmited,
	setTimeOut
} = takeAnExamSlice.actions

export default takeAnExamSlice.reducer
