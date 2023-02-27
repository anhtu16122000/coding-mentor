import { configureStore } from '@reduxjs/toolkit'
import areaReducer from './areaReducer'
import settingsReducer from './settingsReducer'
import userReducer from './userReducer'
import authReducer from './authReducer'
import notificationReducer from './notificateReducer'
import globalStateReducer from './globalState'
import testingState from './testingState'
import branchReducer from './branchReducer'
import discountReducer from './discountReducer'
import learningNeedReducer from './learningNeedReducer'
import purposeReducer from './purposeReducer'
import sourceReducer from './sourceReducer'
import salerReducer from './salerReducer'
import customerStatusReducer from './customerStatusReducer'
import specializeReducer from './specializeReducer'
import studyTimeReducer from './studyTimeReducer'
import classReducer from './classReducer'
import paymentMethodReducer from './paymentMethodReducer'
import filterReducer from './filterReducer'
import cartReducer from './cartReducer'

export const store = configureStore({
	reducer: {
		auth: authReducer,
		user: userReducer,
		settings: settingsReducer,
		area: areaReducer,
		notificate: notificationReducer,
		globalState: globalStateReducer,
		class: classReducer,
		testingState: testingState,
		branch: branchReducer,
		discount: discountReducer,
		paymentMethod: paymentMethodReducer,
		learningNeed: learningNeedReducer,
		purpose: purposeReducer,
		source: sourceReducer,
		saler: salerReducer,
		customerStatus: customerStatusReducer,
		specialize: specializeReducer,
		studyTime: studyTimeReducer,
		filter: filterReducer,
		cart: cartReducer
	}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
