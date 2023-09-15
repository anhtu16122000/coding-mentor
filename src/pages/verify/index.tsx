import Head from 'next/head'
import AuthVerifyCodeForm from '~/common/components/Auth/AuthVerifyCodeForm'
import AuthLayout from '~/common/components/Auth/Layout'

function Verify() {
	return (
		<>
			<Head>
				<title> Verify Code | LMS</title>
			</Head>
			<AuthVerifyCodeForm />
		</>
	)
}

Verify.Layout = AuthLayout
export default Verify
