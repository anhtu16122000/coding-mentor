import React, { FC } from 'react'
import { CgArrowRightO, CgArrowRightR, CgArrowsExchange } from 'react-icons/cg'

type TButtonMoveTo = {
	className?: string
	onClick?: Function
	onBlur?: Function
	size?: number
}

// Color: orange
const mainClass = 'text-[#1E88E5] hover:text-[#1976D2] active:text-[#1E88E5] cursor-pointer none-selection'

const ButtonMoveTo: FC<TButtonMoveTo> = (props) => {
	const { className, onClick, onBlur, size } = props

	function _onClick() {
		if (onClick) onClick()
	}

	function _onBlur() {
		if (onClick) onBlur()
	}

	return (
		<div onClick={_onClick} onBlur={_onBlur} className={`${className || ''} ${mainClass}`}>
			<CgArrowRightO size={size || 20} />
		</div>
	)
}

export default ButtonMoveTo
