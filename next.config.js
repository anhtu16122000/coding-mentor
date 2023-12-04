const { DefinePlugin } = require('webpack')

const nextConfig = {
	reactStrictMode: false,
	swcMinify: true,
	trailingSlash: true
}

// Cái qq này là cả một bầu trời nghệ thuật đó mấy ba
const webpackConfig = {
	webpack: (config, { isServer, buildId }) => {
		config.plugins.push(
			new DefinePlugin({
				'process.env.NEXT_PUBLIC_BUILD_TIME': JSON.stringify(new Date().toString()),
				'process.env.NEXT_PUBLIC_BUILD_ID': JSON.stringify(buildId)
			})
		)

		return config
	}
}

const withTM = require('next-transpile-modules')([
	// '@fullcalendar/common',
	'babel-preset-react',
	'@fullcalendar/daygrid',
	'@fullcalendar/timegrid',
	'@fullcalendar/interaction'
])

module.exports = withTM({ ...nextConfig, ...webpackConfig })
