import React, { FC } from 'react'
import { GiPayMoney } from 'react-icons/gi'
import { TbReportMoney } from 'react-icons/tb'

type TButtonRefund = {
	className?: string
	onClick?: Function
	onBlur?: Function
	size?: number
}

// Color: orange
const mainClass = 'text-[#9000ff] hover:text-[#7517bd] active:text-[#9000ff] cursor-pointer none-selection'

const ButtonRefund: FC<TButtonRefund> = (props) => {
	const { className, onClick, onBlur, size } = props

	function _onClick() {
		if (onClick) onClick()
	}

	function _onBlur() {
		if (onClick) onBlur()
	}

	return (
		<div onClick={_onClick} onBlur={_onBlur} className={`${className || ''} ${mainClass}`}>
			<TbReportMoney size={size || 22} />
		</div>
	)
}

export default ButtonRefund
