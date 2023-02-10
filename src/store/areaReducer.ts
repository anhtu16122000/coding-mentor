import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type IArea = {
	Code: string
	Name: string
	Description: string
	Id: number
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}

const initialState = {
	Area: [],
	District: [],
	Ward: []
}

const areaSlice = createSlice({
	name: 'area',
	initialState,
	reducers: {
		setArea: (state, { payload }: PayloadAction<Array<IArea>>) => {
			state.Area = payload
		},
		setDistrict: (state, { payload }: PayloadAction<Array<IArea>>) => {
			state.District = payload
		},
		setWard: (state, { payload }: PayloadAction<Array<IArea>>) => {
			state.Ward = payload
		}
	}
})

export const { setArea, setDistrict, setWard } = areaSlice.actions
export default areaSlice.reducer
