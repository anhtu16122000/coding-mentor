import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang="vi">
			<Head>
				<meta charSet="UTF-8" />
				<meta property="og:locale" content="vi_VN" />
				<meta property="og:site_name" content="Hệ thống quản lý giáo dục chuyên nghiệp" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
