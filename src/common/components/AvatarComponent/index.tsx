import React, { FC, useState } from 'react'

type TAvatar = {
	url: string
	className?: string
	type: 'user' | 'class' | 'cash' | 'default'
}

let DEFAULT_AVATAR = ''

const AvatarComponent: FC<TAvatar> = (props) => {
	const { url, className, type } = props

	switch (type) {
		case 'user':
			DEFAULT_AVATAR = 'https://nguyenchau.w3spaces.com/default-avatar.png'
			break
		case 'class':
			DEFAULT_AVATAR = '/images/study01.png'
			break
		case 'cash':
			DEFAULT_AVATAR = '/images/cash-payment.png'
			break
		default:
			DEFAULT_AVATAR = '/images/empty-image.png'
			break
	}

	return (
		<img
			draggable={false}
			onError={(e) => {
				const targetEvent = e.target as any
				targetEvent.src = DEFAULT_AVATAR
			}}
			alt="avatar"
			src={url || DEFAULT_AVATAR}
			className={!!className ? className : 'w-full h-full rounded-[10px] object-cover'}
		/>
	)
}

export default AvatarComponent
