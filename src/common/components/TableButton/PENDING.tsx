import React, { FC } from 'react'
import { MdPendingActions } from 'react-icons/md'

type TButtonPending = {
	className?: string
	onClick?: Function
	onBlur?: Function
	size?: number
}

// Color: orange
const mainClass = 'text-[#9000ff] hover:text-[#7517bd] active:text-[#9000ff] cursor-pointer none-selection'

const ButtonPending: FC<TButtonPending> = (props) => {
	const { className, onClick, onBlur, size } = props

	function _onClick() {
		if (onClick) onClick()
	}

	function _onBlur() {
		if (onClick) onBlur()
	}

	return (
		<div onClick={_onClick} onBlur={_onBlur} className={`${className || ''} ${mainClass}`}>
			<MdPendingActions size={size || 21} />
		</div>
	)
}

export default ButtonPending
