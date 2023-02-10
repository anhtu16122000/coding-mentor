/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')
module.exports = {
	content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}', './src/common/components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			gap: {
				3: '0.75rem !important'
			},
			opacity: {
				'tw-0': '0',
				'tw-1': '.1',
				'tw-2': '.2',
				'tw-3': '.3',
				'tw-4': '.4',
				'tw-5': '.5',
				'tw-6': '.6',
				'tw-7': '.7',
				'tw-8': '.8',
				'tw-9': '.9',
				'tw-10': '1'
			},
			// that is actual animation
			keyframes: (theme) => ({
				fadeOut: {
					'0%': { opacity: '0' },
					'100%': { opacity: '.4' }
				},
				bell: {
					'0%': {
						transform: 'rotate(35deg)'
					},
					'12.5%': {
						transform: 'rotate(-30deg)'
					},
					'25%': {
						transform: 'rotate(25deg)'
					},
					'37.5%': {
						transform: 'rotate(-20deg)'
					},
					'50%': {
						transform: 'rotate(15deg)'
					},
					'62.5%': {
						transform: 'rotate(-10deg)'
					},
					'75%': {
						transform: 'rotate(5deg)'
					},
					'100%': {
						transform: 'rotate(0)'
					}
				}
			}),
			animation: {
				fade: 'fadeOut 0.5s linear',
				bell: 'bell 1s linear infinite'
			},
			spacing: {
				'tw-0': '0rem',
				'tw-0.5': '0.125rem',
				'tw-1': '0.25rem',
				'tw-1.5': '0.375rem',
				'tw-2': '0.5rem',
				'tw-2.5': '0.625rem',
				'tw-3': '0.75rem',
				'tw-3.5': '0.875rem',
				'tw-4': '1rem',
				'tw-4.5': '1.125rem',
				'tw-5': '1.25rem',
				'tw-5.5': '1.375rem',
				'tw-6': '1.5rem',
				'tw-6.5': '1.625rem',
				'tw-7': '1.75rem',
				'tw-7.5': '1.875rem',
				'tw-8': '2rem',
				'tw-8.5': '2.125rem',
				'tw-9': '2.25rem',
				'tw-9.5': '2.375rem',
				'tw-10': '2.5rem',
				'tw-10.5': '2.625rem',
				'tw-750': '46.875rem'
			}
		},
		colors: {
			transparent: 'transparent',
			current: 'currentColor',
			'tw-white': '#ffffff',
			'tw-gray': '#e2e8f0',
			'tw-disable': '#cacaca',
			'tw-black': '#000000',
			'tw-yellow': '#FFBA0A',
			'tw-blue': '#1986da',
			'tw-orange': '#ff7c38',
			'tw-red': '#e21b1b',
			'tw-green': '#38853b',
			'tw-success': '#32c6a4',
			'tw-primary': '#1b73e8',
			'tw-primary-lightest': '#cc9fa7',
			'tw-secondary': '#c94a4f'
		},
		screens: {
			smartphone: '360px',
			tablet: '640px',
			laptop: '1024px',
			desktop: '1280px',
			w400: '400px',
			w430: '430px',
			w450: '450px',
			w460: '460px',
			w500: '500px',
			w550: '550px',
			w600: '600px',
			w650: '650px',
			w690: '690px',
			w700: '700px',
			w710: '710px',
			w720: '720px',
			w730: '730px',
			w740: '740px',
			w750: '750px',
			w760: '760px',
			w768: '768px',
			w770: '770px',
			w780: '780px',
			w790: '790px',
			w800: '800px',
			w810: '810px',
			w820: '820px',
			w830: '830px',
			w840: '840px',
			w850: '850px',
			w860: '860px',
			w870: '870px',
			w880: '880px',
			w890: '890px',
			w900: '900px',
			w910: '910px',
			w920: '920px',
			w930: '930px',
			w940: '940px',
			w950: '950px',
			w960: '960px',
			w970: '970px',
			w980: '980px',
			w990: '990px',
			w1000: '1000px',
			w1024: '1024px',
			w1050: '1050px',
			w1100: '1100px',
			w1150: '1150px',
			w1200: '1200px',
			w1250: '1250px',
			w1300: '1300px',
			w1400: '1400px',
			w1500: '1500px',
			w1600: '1600px',
			'-lg': { max: '1023px' },
			'-md': { max: '767px' }
		}
	},
	plugins: [
		require('@tailwindcss/line-clamp'),
		plugin(function ({ addBase, theme }) {
			addBase({
				h1: { fontSize: theme('fontSize.3xl') },
				h2: { fontSize: theme('fontSize.2xl') },
				h3: { fontSize: theme('fontSize.xg') }
			})
		})
	]
}
