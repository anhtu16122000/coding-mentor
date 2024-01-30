// Cấm chỉnh sửa dưới mọi hình thức

import React, { FC } from 'react'
import styles from './styles.module.scss'

type TProps = {
	key?: string | number
	children?: React.ReactNode | string
	background?: 'red' | 'green' | 'blue' | 'yellow' | 'black' | 'white' | 'dark'
}

function getBackground(color: 'red' | 'green' | 'blue' | 'yellow' | 'black' | 'white' | 'dark') {
	switch (color) {
		case 'red':
			return styles['red-tag']

		case 'green':
			return styles['green-tag']

		case 'blue':
			return styles['blue-tag']

		case 'yellow':
			return styles['yellow-tag']

		case 'black':
			return styles['black-tag']

		case 'white':
			return styles['white-tag']

		case 'dark':
			return styles['dark-tag']

		default:
			return styles['blue-tag']
	}
}

// Cấm chỉnh sửa dưới mọi hình thức
const TagByChao: FC<TProps> = (props) => {
	const { key, children, background = 'blue' } = props

	const divProps = {
		key: key || `$tag-${new Date().getTime()}`,
		className: getBackground(background)
	}

	return <div {...divProps}>{children}</div>
}

export default TagByChao

// Cấm chỉnh sửa dưới mọi hình thức
