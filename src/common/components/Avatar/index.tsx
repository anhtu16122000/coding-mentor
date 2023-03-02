import { Modal } from 'antd'
import React, { FC, useState } from 'react'

type TAvatar = {
	uri: string
	className?: string
	disabled?: boolean
	isThumbnail?: boolean
	alt?: string
}

const Avatar: FC<TAvatar> = (props) => {
	const { uri, className, disabled, isThumbnail, alt } = props

	const [image, setImage] = useState('')
	const [show, setShow] = useState(false)

	function toggle() {
		if (!disabled && (!!image || !!uri)) {
			setShow(!show)
		}
	}

	const DEFAULT_AVATAR = isThumbnail ? '/default-thumbnail.png' : '/default-avatar.png'

	return (
		<>
			<img
				onClick={toggle}
				onError={() => setImage(DEFAULT_AVATAR)}
				alt="avatar"
				src={image || uri || DEFAULT_AVATAR}
				className={className}
				style={{ cursor: !!image || !!uri ? 'pointer' : 'default' }}
			/>

			<Modal closable={false} title={null} width={700} open={show} onCancel={toggle} footer={null}>
				<img
					onError={() => setImage(DEFAULT_AVATAR)}
					alt={alt || 'avatar'}
					src={image || uri || DEFAULT_AVATAR}
					style={{ width: '100%', maxHeight: '70vh', objectFit: 'cover' }}
				/>
			</Modal>
		</>
	)
}

export default Avatar
