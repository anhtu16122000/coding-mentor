import Head from 'next/head'
import Script from 'next/script'
import React from 'react'
import appConfigs from '~/appConfig'

const viewport = 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'

const siteTitle = 'Bạn lo giảng dạy, MONA lo quản trị'

const description = 'Dù bạn ở mảng nào của giáo dục, chúng tôi đều có sản phẩm phù hợp'

const MainHeader = () => {
	return (
		<Head>
			<title>{appConfigs.appName} - Phần mềm quản lý trung tâm giáo dục</title>

			<meta property="og:locale" content="vi_VN" />
			<link rel="icon" href="/white-logo.png" />
			<meta content={viewport} name="viewport" />

			<meta name="description" content={description} />

			<meta name="robots" content="noindex" />
			<meta property="og:image" content="/og-image.png" />

			<meta name="og:title" content={siteTitle} />
			<meta property="og:site_name" content="Bạn lo giảng dạy, MONA lo quản trị" />
			<meta property="og:description" content={description} />

			<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
			<meta http-equiv="Pragma" content="no-cache" />
			<meta http-equiv="Expires" content="0" />

			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content="Mona Edutech - Hiểu quản trị hơn chính bạn" />
			<meta name="twitter:image:alt" content="mona-lms" />
			<meta name="twitter:image" content="/og-image.png" />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:url" content="https://mona.software/edutech" />
			<meta name="twitter:site" content="mona.media" />
			<meta name="twitter:domain" content="mona.media" />
			<meta name="twitter:label1" content="Written by" />
			<meta name="twitter:data1" content="Nguyễn Phúc Bảo Châu" />

			<meta name="keywords" content="hệ thống đào tạo, lms, hệ thống quản lý đào tạo" />

			<script defer data-domain="monalms.monamedia.net" src="https://web-analytics.mona.host/js/script.js"></script>

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
