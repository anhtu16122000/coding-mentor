import Head from 'next/head'
import React from 'react'
import appConfigs from '~/appConfig'

const viewport = 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
const siteTitle = 'Quản lý giáo dục hiệu quả với phần mềm chuyên nghiệp từ Mona LMS'
const description =
	'Tối ưu hóa hoạt động giáo dục với phần mềm quản lý giáo dục chuyên nghiệp từ công ty phần mềm. Hỗ trợ quản lý các thông tin về học viên, giáo viên, lớp học và thời khóa biểu, giúp cho việc quản lý trở nên dễ dàng và hiệu quả hơn.'

const MainHeader = () => {
	return (
		<Head>
			<link rel="icon" href="/white-logo.png" />
			<title>{appConfigs.appName} - Phần mềm quản lý giáo dục chuyên nghiệp</title>

			<meta property="og:locale" content="vi_VN" />
			<link rel="canonical" href="https://mona.media/phan-mem-quan-ly-truong-hoc-giao-duc-lms" />
			<meta content={viewport} name="viewport" />
			<meta name="description" content={description} />

			<meta name="og:title" content={siteTitle} />
			<meta property="og:site_name" content="Hệ thống quản lý giáo dục chuyên nghiệp" />
			<meta property="og:description" content={description} />

			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content="Mona LMS - Phần mềm quản lý giáo dục chuyên nghiệp" />
			<meta name="twitter:image:alt" content="mona-lms" />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:url" content="https://mona.media/phan-mem-quan-ly-truong-hoc-giao-duc-lms" />
			<meta name="twitter:site" content="@mona.media" />
			<meta name="twitter:domain" content="mona.media" />
			<meta name="twitter:label1" content="Written by" />
			<meta name="twitter:data1" content="Nguyễn Phúc Bảo Châu" />

			<script src="https://cdn.tiny.cloud/1/lmr9ug3bh4iwjsrap9hgwgxqcngllssiraqluwto4slerrwg/tinymce/6/tinymce.min.js" />
		</Head>
	)
}

export default MainHeader
