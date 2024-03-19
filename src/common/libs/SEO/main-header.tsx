import Head from 'next/head'
import Script from 'next/script'
import appConfigs from '~/appConfig'

const viewport = 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'

const siteTitle = 'Coding Mentor - Nền tảng học lập trình dành cho mọi người'

const description = 'Dù bạn ở mảng nào của giáo dục, chúng tôi đều có sản phẩm phù hợp'

const MainHeader = () => {
	return (
		<Head>
			<title>{appConfigs.appName} - Nền tảng học lập trình dành cho mọi người</title>

			<meta property="og:locale" content="vi_VN" />
			<meta content={viewport} name="viewport" />
			<meta name="description" content={description} />

			<meta name="robots" content="noindex" />
			<meta property="og:image" content="/favicon_io/apple-touch-icon.png" />

			<meta name="og:title" content={siteTitle} />
			<meta property="og:site_name" content="Coding Mentor - Nền tảng học lập trình dành cho mọi người" />
			<meta property="og:description" content={description} />
			<link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png" />
			<link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png" />
			<link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/favicon-16x16.png" />
			<link rel="manifest" href="/favicon_io/site.webmanifest" />

			<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
			<meta http-equiv="Pragma" content="no-cache" />
			<meta http-equiv="Expires" content="0" />

			<meta name="keywords" content="học lập trình, lập trình viên, học coding" />

			{/* <script defer data-domain="monalms.monamedia.net" src="https://web-analytics.mona.host/js/script.js"></script> */}

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
