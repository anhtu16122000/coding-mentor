import React, { FC } from 'react'
import { HiOutlineEye } from 'react-icons/hi'

type TButtonEye = {
	className?: string
	onClick?: Function
	onBlur?: Function
	size?: number
}

// Color: orange
const mainClass = 'text-[#FB8C00] hover:text-[#F57C00] active:text-[#FB8C00] cursor-pointer none-selection'

const ButtonEye: FC<TButtonEye> = (props) => {
	const { className, onClick, onBlur, size } = props

	function _onClick() {
		if (onClick) onClick()
	}

	function _onBlur() {
		if (onClick) onBlur()
	}

	return (
		<div onClick={_onClick} onBlur={_onBlur} className={`${className || ''} ${mainClass}`}>
			<HiOutlineEye size={size || 22} />
		</div>
	)
}

export default ButtonEye
