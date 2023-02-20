import { Modal } from 'antd'
import React, { FC, useState } from 'react'

type TAvatar = {
	uri: string
	className?: string
}

const DEFAULT_AVATAR = '/default-avatar.png'

const Avatar: FC<TAvatar> = (props) => {
	const { uri, className } = props

	const [image, setImage] = useState('')
	const [show, setShow] = useState(false)

	function toggle() {
		if (!!image || !!uri) {
			setShow(!show)
		}
	}

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

			<Modal title={image || uri} width={700} open={show} onCancel={toggle} footer={null}>
				<img
					onError={() => setImage(DEFAULT_AVATAR)}
					alt="avatar"
					src={image || uri || DEFAULT_AVATAR}
					style={{ width: '100%', maxHeight: '80vh', objectFit: 'cover' }}
				/>
			</Modal>
		</>
	)
}

export default Avatar
