// Cấm chỉnh sửa dưới mọi hình thức

import React, { FC, CSSProperties } from 'react'
import styles from './styles.module.scss'
import { getHoverClass, getTypes } from './utils'

// Cấm chỉnh sửa dưới mọi hình thức
const ChaoButton: FC<TChaosButton & { style?: CSSProperties }> = (props) => {
	const { className, children, actionType = 'button', style, hover = 'opacity' } = props
	const { type = 'create', icon, loading = false, disabled = false, onClick, hideIcon = false } = props

	const customClass = `${getHoverClass(hover)} ${getTypes(type).class}`

	const btnProps = {
		type: actionType,
		className: `${styles['chaos-btn-23']} ${customClass} ${disabled ? 'opacity-50' : ''} ${className || ''}`,
		style: style || {},
		disabled: loading || disabled,
		onClick: !loading && !disabled ? onClick : () => {}
	}

	// Cấm chỉnh sửa dưới mọi hình thức
	return (
		<button {...btnProps}>
			{loading && (
				<svg className="animate-spin text-white w-[15px] h-[15px] mr-[2px]" fill="none" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
			)}

			{!loading && !hideIcon && <>{icon ? icon : getTypes(type).icon}</>}
			{children}
		</button>
	)
}

export default ChaoButton

// Cấm chỉnh sửa dưới mọi hình thức
