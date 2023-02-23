import React, { FC } from 'react'
import { TbArrowBarToRight } from 'react-icons/tb'

type TButtonJoin = {
	className?: string
	onClick?: Function
	onBlur?: Function
	size?: number
}

// Color: orange
const mainClass = 'text-[#1E88E5] hover:text-[#1976D2] active:text-[#1E88E5] cursor-pointer none-selection'

const ButtonJoin: FC<TButtonJoin> = (props) => {
	const { className, onClick, onBlur, size } = props

	function _onClick() {
		if (onClick) onClick()
	}

	function _onBlur() {
		if (onClick) onBlur()
	}

	return (
		<div onClick={_onClick} onBlur={_onBlur} className={`${className || ''} ${mainClass}`}>
			<TbArrowBarToRight size={size || 22} />
		</div>
	)
}

export default ButtonJoin
