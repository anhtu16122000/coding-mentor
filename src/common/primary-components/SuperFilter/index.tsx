// Cấm chỉnh sửa dưới mọi hình thức

import React, { FC, useRef } from 'react'
import styles from './styles.module.scss'
import { PrimaryTooltip } from '~/common/components'
import moment from 'moment'
import { FaFilter } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'
import { Tooltip } from 'antd'

export const FaFilterCircleXmark = ({ size, color }: { size: number; color: string }) => {
	return (
		<svg
			stroke={color || 'black'}
			fill={color || 'black'}
			stroke-width="0"
			viewBox="0 0 576 512"
			height={size + 'px'}
			width={size + 'px'}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M3.9 22.9C10.5 8.9 24.5 0 40 0H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L396.4 195.6C316.2 212.1 256 283 256 368c0 27.4 6.3 53.4 17.5 76.5c-1.6-.8-3.2-1.8-4.7-2.9l-64-48c-8.1-6-12.8-15.5-12.8-25.6V288.9L9 65.3C-.7 53.4-2.8 36.8 3.9 22.9zM432 224a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm59.3 107.3c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L432 345.4l-36.7-36.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L409.4 368l-36.7 36.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L432 390.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L454.6 368l36.7-36.7z"></path>
		</svg>
	)
}

type TProps = {
	children?: React.ReactNode
	style?: React.CSSProperties
	isButton?: boolean
	visible: boolean

	onClickButton?: Function
}

// Cấm chỉnh sửa dưới mọi hình thức
const SuperFilter: FC<TProps> = (props) => {
	const { style, children, isButton, onClickButton, visible } = props

	const tipRef: any = useRef()

	if (isButton) {
		return (
			<Tooltip ref={tipRef} id={`filters-${moment(new Date()).format('HHDDMMYYYY')}`} placement="right" title={visible ? 'Đóng' : 'Bộ lọc'}>
				<div
					onClick={() => {
						!!tipRef.current && tipRef.current.close()
						!!onClickButton && onClickButton()
					}}
					className={styles['btn-filter']}
				>
					{visible ? <FaFilterCircleXmark size={18} color="#de2842" /> : <FaFilter size={16} color="#1b73e8" />}
				</div>
			</Tooltip>
		)
	}

	if (!visible) {
		return <></>
	}

	const containerProps = {
		className: styles.container,
		style: style || {}
	}

	// Cấm chỉnh sửa dưới mọi hình thức
	return (
		<div {...containerProps}>
			<div onClick={() => !!onClickButton && onClickButton()} className={styles.close}>
				<IoClose size={20} />
			</div>
			{children}
		</div>
	)
}

export default SuperFilter

// Cấm chỉnh sửa dưới mọi hình thức
