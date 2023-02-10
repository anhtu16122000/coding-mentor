import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ISaler = {
	UserInformationId: number
	FullName: string
	UserName: string
	UserCode: string
	DOB: string
	Gender: number
	Mobile: string
	Email: string
	Address: string
	StatusId: number
	RoleId: number
	RoleName: string
	Avatar: string
	AreaId: number
	DistrictId: number
	WardId: number
	BranchIds: string
	LearningStatus: number
	LearningStatusName: string
	SourceId: number
	LearningNeedId: number
	SaleId: number
	PurposeId: number
	Enable: boolean
	CreatedOn: string
	CreatedBy: string
	ModifiedOn: string
	ModifiedBy: string
}

const initialState = {
	Saler: []
}

const salerSlice = createSlice({
	name: 'saler',
	initialState,
	reducers: {
		setSaler: (state, { payload }: PayloadAction<Array<ISaler>>) => {
			state.Saler = payload
		}
	}
})

export const { setSaler } = salerSlice.actions
export default salerSlice.reducer
