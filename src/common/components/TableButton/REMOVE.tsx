import React, { FC } from 'react'
import { Trash2 } from 'react-feather'
import { CgArrowsExchange } from 'react-icons/cg'

type TButtonRemove = {
	className?: string
	onClick?: Function
	onBlur?: Function
	size?: number
}

// Color: orange
const mainClass = 'text-[#C94A4F] hover:text-[#b43f43] active:text-[#C94A4F] cursor-pointer none-selection'

const ButtonRemove: FC<TButtonRemove> = (props) => {
	const { className, onClick, onBlur, size } = props

	function _onClick() {
		if (onClick) onClick()
	}

	function _onBlur() {
		if (onClick) onBlur()
	}

	return (
		<div onClick={_onClick} onBlur={_onBlur} className={`${className || ''} ${mainClass}`}>
			<Trash2 size={size || 22} />
		</div>
	)
}

export default ButtonRemove
