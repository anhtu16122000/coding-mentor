import { Form } from 'antd'
import React from 'react'
import CodesInput from '~/common/custom/CodesInput'

function AuthVerifyCodeForm() {
	const onFinish = (values: any) => {
		console.log('Success:', values)
	}

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo)
	}
	return (
		<>
			<Form
				name="basic"
				// labelCol={{ span: 8 }}
				// wrapperCol={{ span: 16 }}
				// style={{ maxWidth: 600 }}
				// initialValues={{ remember: true }}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				// autoComplete="off"
			>
				<CodesInput keyName="code" inputs={['code1', 'code2', 'code3', 'code4', 'code5', 'code6']} />
			</Form>
		</>
	)
}

export default AuthVerifyCodeForm
