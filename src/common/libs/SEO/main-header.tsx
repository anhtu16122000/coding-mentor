import Head from 'next/head'
import Script from 'next/script'
import React from 'react'
import appConfigs from '~/appConfig'

const viewport = 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
const siteTitle = 'Quản lý giáo dục hiệu quả với phần mềm chuyên nghiệp từ Mona LMS'
const description =
	'Tối ưu hoá hoạt động quản lý giáo dục với phần mềm chuyên nghiệp từ Mona Software. Hỗ trợ quàn lý tất cả các thông tin về học viên, giáo viên, lớp học... giúp cho việc quản lý trở nên dễ dàng và hiệu quả hơn.'

const MainHeader = () => {
	return (
		<Head>
			<title>{appConfigs.appName} - Phần mềm quản lý giáo dục chuyên nghiệp</title>

			<meta property="og:locale" content="vi_VN" />
			<meta content={viewport} name="viewport" />
			<meta name="description" content={description} />

			<meta name="robots" content="noindex" />

			<meta name="og:title" content={siteTitle} />
			<meta property="og:site_name" content="Hệ thống quản lý giáo dục chuyên nghiệp" />
			<meta property="og:description" content={description} />

			<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
			<meta http-equiv="Pragma" content="no-cache" />
			<meta http-equiv="Expires" content="0" />

			<link rel="icon" href="/white-logo.png" />

			<script
				type="text/javascript"
				dangerouslySetInnerHTML={{
					__html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "k274o07cd9");
          `
				}}
			/>

			<Script src="https://cdn.tiny.cloud/1/lmr9ug3bh4iwjsrap9hgwgxqcngllssiraqluwto4slerrwg/tinymce/6/tinymce.min.js" />
		</Head>
	)
}

export default MainHeader
