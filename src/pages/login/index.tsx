import React from 'react'
import AuthLayout from '~/common/components/Auth/Layout'
import SignIn from '~/common/pages/Auth/SignIn'

function LoginInPage() {
	return <SignIn />
}

LoginInPage.Layout = AuthLayout
export default LoginInPage
