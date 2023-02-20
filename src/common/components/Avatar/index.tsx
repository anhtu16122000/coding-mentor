import React, { FC, useState } from 'react'

type TAvatar = {
	uri: string
	className?: string
}

const DEFAULT_AVATAR = 'https://nguyenchau.w3spaces.com/default-avatar.png'

const Avatar: FC<TAvatar> = (props) => {
	const { uri, className } = props

	const [image, setImage] = useState('')

	return <img onError={() => setImage(DEFAULT_AVATAR)} alt="avatar" src={image || uri || DEFAULT_AVATAR} className={className} />
}

export default Avatar
