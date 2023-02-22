import React, { FC } from 'react'

const PrimaryTag: FC<IPrimaryTag> = (props) => {
	const { color, children, className } = props

	function getBG() {
		if (color == 'green') {
			return 'bg-[#4CAF50]'
		}
		if (color == 'blue') {
			return 'bg-[#0A89FF]'
		}
		if (color == 'red') {
			return 'bg-[#C94A4F]'
		}
		if (color == 'yellow') {
			return 'bg-[#FFBA0A]'
		}
		if (color == 'black') {
			return 'bg-[#000]'
		}
		if (color == 'disabled') {
			return 'bg-[#CFD8DC]'
		}
		if (color == 'orange') {
			return 'bg-[#ff7c38]'
		}
	}

	function getColor() {
		if (color == 'green') {
			return 'text-white '
		}
		if (color == 'blue') {
			return 'text-white '
		}
		if (color == 'red') {
			return 'text-white '
		}
		if (color == 'yellow') {
			return 'text-black'
		}
		if (color == 'black') {
			return 'text-white'
		}
		if (color == 'disabled') {
			return 'text-gray-800'
		}
	}

	return <div className={`rounded-lg px-3 py-1 w-auto inline-flex items-center ${getBG()} ${getColor()} ${className}`}>{children}</div>
}

export default PrimaryTag
