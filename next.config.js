/** @type {import('next').NextConfig} */
const nextConfig = {
	// assetPrefix: './', // For export
	reactStrictMode: false,
	swcMinify: true,
	trailingSlash: false,
	compiler: {
		removeConsole: process.env.NODE_ENV == 'production'
	}
}

module.exports = nextConfig
