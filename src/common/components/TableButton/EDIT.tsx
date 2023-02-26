import React, { FC } from 'react'
import { FiEdit } from 'react-icons/fi'
import { GiPayMoney } from 'react-icons/gi'
import { TbReportMoney } from 'react-icons/tb'

type TButtonEdit = {
	className?: string
	onClick?: Function
	onBlur?: Function
	size?: number
}

// Color: orange
const mainClass = 'text-[#FF9800] hover:text-[#f49302] active:text-[#FF9800] cursor-pointer none-selection'

const ButtonEdit: FC<TButtonEdit> = (props) => {
	const { className, onClick, onBlur, size } = props

	function _onClick() {
		if (onClick) onClick()
	}

	function _onBlur() {
		if (onClick) onBlur()
	}

	return (
		<div onClick={_onClick} onBlur={_onBlur} className={`${className || ''} ${mainClass}`}>
			<FiEdit size={size || 22} />
		</div>
	)
}

export default ButtonEdit
