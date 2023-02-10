import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
	dataChangeSchedule: {} as any,
	listCalendar: [] as any,
	teacher: [] as any,
	room: [] as any,
	showModal: { open: false, id: null } as any,
	prevSchedule: {} as any,
	dataChangeScheduleEdit: {} as any,
	listCalendarEdit: [] as any,
	teacherEdit: [] as any,
	roomEdit: [] as any,
	showModalEdit: { open: false, id: null } as any,
	prevScheduleEdit: {} as any,
	isEditSchedule: false,
	paramsSchedule: { classId: null, from: null, to: null },
	infoClass: {} as IClass,
	loadingCalendar: false
}

const classState = createSlice({
	name: 'area',
	initialState,
	reducers: {
		setParamsSchedule: (state, { payload }: PayloadAction<any>) => {
			state.paramsSchedule = payload
		},
		setDataChangeSchedule: (state, { payload }: PayloadAction<any>) => {
			state.dataChangeSchedule = payload
		},
		setDataChangeScheduleEdit: (state, { payload }: PayloadAction<any>) => {
			state.dataChangeScheduleEdit = payload
		},
		setInfoClass: (state, { payload }: PayloadAction<any>) => {
			state.infoClass = payload
		},
		setListCalendar: (state, { payload }: PayloadAction<any>) => {
			state.listCalendar = payload
		},
		setListCalendarEdit: (state, { payload }: PayloadAction<any>) => {
			state.listCalendarEdit = payload
		},
		setTeacher: (state, { payload }: PayloadAction<any>) => {
			state.teacher = payload
		},
		setTeacherEdit: (state, { payload }: PayloadAction<any>) => {
			state.teacherEdit = payload
		},
		setRoom: (state, { payload }: PayloadAction<any>) => {
			state.room = payload
		},
		setRoomEdit: (state, { payload }: PayloadAction<any>) => {
			state.roomEdit = payload
		},
		setShowModal: (state, { payload }: PayloadAction<any>) => {
			state.showModal = payload
		},
		setShowModalEdit: (state, { payload }: PayloadAction<any>) => {
			state.showModalEdit = payload
		},
		setPrevSchedule: (state, { payload }: PayloadAction<any>) => {
			state.prevSchedule = payload
		},
		setPrevScheduleEdit: (state, { payload }: PayloadAction<any>) => {
			state.prevScheduleEdit = payload
		},
		setIsEditSchedule: (state, { payload }: PayloadAction<any>) => {
			state.isEditSchedule = payload
		},
		setLoadingCalendar: (state, { payload }: PayloadAction<any>) => {
			state.loadingCalendar = payload
		}
	}
})

export const {
	setTeacher,
	setShowModal,
	setDataChangeSchedule,
	setListCalendar,
	setPrevSchedule,
	setRoom,
	setTeacherEdit,
	setShowModalEdit,
	setDataChangeScheduleEdit,
	setListCalendarEdit,
	setPrevScheduleEdit,
	setRoomEdit,
	setIsEditSchedule,
	setParamsSchedule,
	setLoadingCalendar,
	setInfoClass
} = classState.actions
export default classState.reducer
