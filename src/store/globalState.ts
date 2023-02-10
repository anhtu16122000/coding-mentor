import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
	dragItem: {
		dragging: ''
	},
	currentPackage: [],
	packageTotalPoint: '0',
	currentExerciseForm: [],
	breadcrumb: {
		name: null,
		group: null
	},
	currentSection: null,
	currentGroup: null
}

const globalState = createSlice({
	name: 'area',
	initialState,
	reducers: {
		setDragItem: (state, { payload }: PayloadAction<{ dragging: string }>) => {
			state.dragItem = payload
		},
		setCurrentPackage: (state, { payload }: PayloadAction<any>) => {
			state.currentPackage = payload
		},
		setCurrentExerciseForm: (state, { payload }: PayloadAction<any>) => {
			state.currentExerciseForm = payload
		},
		setTotalPoint: (state, { payload }: PayloadAction<any>) => {
			state.packageTotalPoint = payload
		},
		setBreadcrumb: (state, { payload }: PayloadAction<any>) => {
			state.breadcrumb = payload
		},
		setCurrentSection: (state, { payload }: PayloadAction<any>) => {
			state.currentSection = payload
		},
		setCurrentGroup: (state, { payload }: PayloadAction<any>) => {
			state.currentGroup = payload
		}
	}
})

export const { setDragItem, setCurrentPackage, setCurrentExerciseForm, setCurrentGroup, setCurrentSection, setTotalPoint, setBreadcrumb } =
	globalState.actions

export default globalState.reducer
