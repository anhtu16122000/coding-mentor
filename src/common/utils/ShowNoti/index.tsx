import React from 'react'
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
			if (content === 'Hết hạn đăng nhập') {
				debounce(function () {
					toast.error(nodeNoti)
				}, 1500)
			} else {
				toast.error(nodeNoti)
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
