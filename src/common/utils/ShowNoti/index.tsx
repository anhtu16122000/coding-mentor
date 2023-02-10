import React from 'react'
import { toast } from 'react-toastify'

const ShowNoti = (type: 'success' | 'warning' | 'error', content: string) => {
	const nodeNoti = () => {
		return (
			<div className={`noti-box`}>
				<span className="text">{content}</span>
			</div>
		)
	}

	switch (type) {
		case 'success':
			toast.success(nodeNoti)
			break
		case 'error':
			toast.error(nodeNoti)
			break
		case 'warning':
			toast.warning(nodeNoti)
			break
		default:
			break
	}
}

export default ShowNoti
