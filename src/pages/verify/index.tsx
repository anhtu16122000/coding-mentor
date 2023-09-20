import { Typography } from 'antd'
import Head from 'next/head'
import Lottie from 'react-lottie-player'
import AuthVerifyCodeForm from '~/common/components/Auth/AuthVerifyCodeForm'
import AuthLayout from '~/common/components/Auth/Layout'
import maill from '../../../public/jsons/animation_lmocl4k9.json'
import { useRouter } from 'next/router'
import { verifyApi } from '~/api/user/user'
import { ShowNoti } from '~/common/utils'
const { Title, Text } = Typography
function Verify() {
	const router = useRouter()
	const reSen = async () => {
		try {
			const res = await verifyApi.reSenOPT(router.query.userId)
			if (res.status == 200 || res.status == 201) {
				ShowNoti('success', 'Gửi mã thành công!')
			}
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				alignItems: 'center',
				paddingTop: 40,
				paddingLeft: 10,
				paddingRight: 10
			}}
		>
			<Head>
				<title> Verify Code | LMS</title>
			</Head>

			<div className="w-full h-[300px] flex flex-col items-center justify-center">
				<Lottie loop animationData={maill} play className="inner w-[300px] mx-auto" />
			</div>
			<Title level={3}>Vui lòng kiểm tra email hoặc điện thoại của bạn!</Title>
			<Text style={{ padding: '10px 0' }}>
				Chúng tôi đã gửi email mã xác nhận gồm 6 chữ số, vui lòng nhập mã vào bên dưới hộp để xác minh email của bạn.
			</Text>

			<AuthVerifyCodeForm />

			<Title level={5}>
				Bạn không có mã? &nbsp;
				<a onClick={() => reSen()} style={{ color: '#0A8FDC', textDecorationLine: 'underline' }}>
					Gửi lại
				</a>
			</Title>
		</div>
	)
}

Verify.Layout = AuthLayout
export default Verify
