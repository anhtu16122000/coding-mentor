import React from 'react'
import AuthLayout from '~/common/components/Auth/Layout'
import RegisterForm from '~/common/components/Auth/RegisterForm'

function Register() {
	return <RegisterForm />
}

Register.Layout = AuthLayout
export default Register
