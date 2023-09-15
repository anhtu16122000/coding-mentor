import React, { createRef } from 'react'
import { toast } from 'react-toastify'
import { debounce } from '~/common/hooks/useDebounce'

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
			if (!toast.isActive(content)) {
				// avoid duplicate toast error
				toast.error(nodeNoti, {
					toastId: content
				})
			}
			break
		case 'warning':
			toast.warning(nodeNoti)
			break
		default:
			break
	}
}

export default ShowNoti
