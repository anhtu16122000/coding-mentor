import { wait } from './common'

export const getFileThumbnails = (type, FileUrl) => {
	if (type == 'pdf') {
		return <img draggable={false} src="/images/docs-pdf-02.png" alt="lms thumbnails" className="in-1-line" style={{ height: 125 }} />
	}

	if (type == 'zip') {
		return <img draggable={false} src="/images/docs-zip-01.png" alt="lms thumbnails" className="in-1-line" style={{ height: 125 }} />
	}

	if (type == 'doc' || type == 'docx' || type == 'word') {
		return <img draggable={false} src="/images/docs-word.png" alt="lms thumbnails" className="in-1-line" style={{ height: 125 }} />
	}

	if (type == 'xlsx' || type == 'xls' || type == 'excel') {
		return <img draggable={false} src="/images/docs-excel-01.png" alt="lms thumbnails" className="in-1-line" style={{ height: 140 }} />
	}

	if (type == 'pptx' || type == 'ppt') {
		return <img draggable={false} src="/images/docs-ppt.png" alt="lms thumbnails" className="in-1-line" style={{ height: 125 }} />
	}

	if (type == 'mp4' || type == 'avi') {
		return <img draggable={false} src="/images/docs-video.png" alt="lms thumbnails" className="in-1-line" style={{ height: 125 }} />
	}

	if (type == 'jpeg' || type == 'jpg' || type == 'png' || type == 'webp') {
		return (
			<img
				draggable={false}
				src={FileUrl || ''}
				alt="lms thumbnails"
				className="h-full w-full object-cover in-1-line"
				style={{ borderTopLeftRadius: 6, borderTopRightRadius: 6 }}
			/>
		)
	}

	return <img draggable={false} src="/images/docs-other.png" alt="lms thumbnails" className="in-1-line" style={{ height: 125 }} />
}

export const getFileIcons = (type, FileUrl) => {
	if (type == 'pdf') {
		return <img draggable={false} src="/icons/pdf-file.svg" alt="lms icons" className="" style={{ height: 50, width: 50 }} />
	}

	if (type == 'zip') {
		return <img draggable={false} src="/icons/zip-file-2.svg" alt="lms icons" className="" style={{ height: 50, width: 50 }} />
	}

	if (type == 'doc' || type == 'docx' || type == 'word') {
		return <img draggable={false} src="/icons/doc-svgrepo-com.svg" alt="lms icons" className="" style={{ height: 50, width: 50 }} />
	}

	if (type == 'xlsx' || type == 'xls' || type == 'excel') {
		return <img draggable={false} src="/icons/xls-file.svg" alt="lms icons" className="" style={{ height: 45, width: 50 }} />
	}

	if (type == 'pptx' || type == 'ppt') {
		return <img draggable={false} src="/icons/ppt-file.svg" alt="lms icons" className="" style={{ height: 50, width: 50 }} />
	}

	if (type == 'mp4' || type == 'avi') {
		return <img draggable={false} src="/icons/mp4-file.svg" alt="lms icons" className="" style={{ height: 50, width: 50 }} />
	}

	if (type == 'jpeg' || type == 'jpg' || type == 'png' || type == 'webp') {
		return <img draggable={false} src="/icons/jpg-file.svg" alt="lms icons" className="" style={{ height: 50, width: 50 }} />
	}

	return <img draggable={false} src="/images/docs-other.png" alt="lms icons" className="" style={{ height: 50, width: 50 }} />
}

export function checkInternet() {
	console.log('Initially ' + (window.navigator.onLine ? 'on' : 'off') + 'line')

	const container = document.getElementById('internet-container')
	const internetStatus = document.getElementById('internet-status')
	const iconOff = document.getElementById('cc-icon-offline')
	const iconOn = document.getElementById('cc-icon-online')

	if (!!window?.navigator?.onLine) {
		if (!!container) container.className = 'hidden'
	} else {
		if (!!internetStatus) internetStatus.innerText = 'Không có internet'
		if (!!container) container.className = 'internet-offline'

		if (!!iconOff) iconOff.className = 'block'
		if (!!iconOn) iconOn.className = 'hidden'
	}

	window.addEventListener('online', async () => {
		if (!!container) container.className = 'internet-online'
		if (!!internetStatus) internetStatus.innerText = 'Đã kết nối internet'

		if (!!iconOff) iconOff.className = 'hidden'
		if (!!iconOn) iconOn.className = 'block'

		await wait(2000)

		if (!!container) container.className = 'hidden'
	})

	window.addEventListener('offline', () => {
		if (!!internetStatus) internetStatus.innerText = 'Không có internet'
		if (!!container) container.className = 'internet-offline'

		if (!!iconOff) iconOff.className = 'block'
		if (!!iconOn) iconOff.className = 'hidden'
	})
}

export function viewContent(content: string, isShown: boolean, type: 'section' | 'group') {
	const contentElement = document.getElementById('testing-content')
	const groupContentElement = document.getElementById('testing-group-content')
	var container = document.getElementById('container')
	var left = document.getElementById('left_panel')
	var right = document.getElementById('right_panel')
	var drag = document.getElementById('drag')
	var masterContent = document.getElementById('content-container')

	if (contentElement) {
		if (type == 'section') {
			contentElement.innerHTML = content
		} else if (type == 'group') {
			groupContentElement.innerHTML = content
		}
	} else {
		if (type == 'section') {
			contentElement.innerHTML = null
		} else if (type == 'group') {
			groupContentElement.innerHTML = null
		}
	}

	if (isShown) {
		masterContent.style.display = 'block'
		drag.style.display = 'flex'
		contentElement.style.display = 'flex'
		groupContentElement.style.display = 'flex'
		right.style.left = 550 + 'px'
		left.style.width = container.clientWidth - 550 + 'px'
		left.style.minWidth = 12 + 'px'
	} else {
		drag.style.display = 'none'
		right.style.right = '12px'
		left.style.width = 0 + 'px'
		left.style.minWidth = 0 + 'px'
	}
}

export const domMastersContent = (section, group) => {
	if (!!section || !!group) {
		if (section) {
			viewContent(section.Explanations, true, 'section')
		} else {
			viewContent(null, true, 'section')
		}

		if (group) {
			viewContent(group?.Content, true, 'group')
		} else {
			viewContent(null, true, 'group')
		}
	}

	if (!section && !group) {
		viewContent('', false, 'section')
	}
}
