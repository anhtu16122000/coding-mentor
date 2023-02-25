import moment from 'moment'
import Router from 'next/router'

export const removeProductionLog = () => {
	if (process.env.NODE_ENV == 'production') {
		console.log = () => {}
		console.error = () => {}
		console.debug = () => {}
		console.warn = () => {}
	}
}

export const wait = (timeout: number) => {
	return new Promise((resolve) => setTimeout(resolve, timeout))
}

export function getTimeStamp() {
	return new Date().getTime() // Example: 1653474514413
}

export function parseJwt(token: string) {
	const base64Url = token.split('.')[1]
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
	const buf = Buffer.from(base64, 'base64').toString('utf-8')
	const payload = JSON.parse(buf)

	return {
		userInfo: JSON.parse(payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata']),
		exp: payload.exp
	}
}

/**
 * Function get date text from timestamp
 * @param params timestamp
 * @returns string
 */
export function getDate(params) {
	var date = new Date(params)
	return { moment: moment(date), full: moment(date).format('HH:mm DD/MM/YYYY'), stringDate: moment(date).format('DD/MM/YYYY'), date: date }
}

export function encode(str) {
	return window?.btoa(unescape(encodeURIComponent(str)))
}

export function decode(str) {
	if (!str || str == 'undefined' || str.includes('+')) {
		return ''
	}
	return !!str && str != 'undefined' ? decodeURIComponent(escape(window?.atob(str))) : ''
}

export const getFileThumbnails = (type, fileUrl) => {
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
				src={fileUrl || ''}
				alt="lms thumbnails"
				className="h-full w-full object-cover in-1-line"
				style={{ borderTopLeftRadius: 6, borderTopRightRadius: 6 }}
			/>
		)
	}

	return <img draggable={false} src="/images/docs-other.png" alt="lms thumbnails" className="in-1-line" style={{ height: 125 }} />
}

/**
 * Function get status permission
 * @param permission List of permissions
 * @param controller Name of the permissions controller
 * @returns boolean
 */
export function getPer(permission: Array<any>, controller: string) {
	const index = permission.indexOf(controller)
	if (index !== -1) return true
	return false
}

/**
 * Function get status permission
 * @param permission List of permissions
 * @param controller 'NewsFeed-roleObject' | 'NewsFeed-DeleteItem' | 'NewsFeed-GetById' | 'NewsFeed-AddItem' | 'NewsFeed-UpdateItem'| 'NewsFeed-Get'
 * @returns boolean
 */
export function getNewsPer(
	permission: Array<any>,
	controller:
		| 'NewsFeed-roleObject'
		| 'NewsFeed-DeleteItem'
		| 'NewsFeed-GetById'
		| 'NewsFeed-AddItem'
		| 'NewsFeed-UpdateItem'
		| 'NewsFeed-Get'
) {
	const index = permission.indexOf(controller)
	if (index !== -1) return true
	return false
}

/**
 * Function get shoter text
 * @param text string
 * @returns string
 */
export function getShoterText(text: string) {
	let temp = ''
	if (!!text) {
		if (text.length > 24) {
			let cloneText = text.split('.')
			for (let i = 0; i < cloneText[0].length; i++) {
				const element = cloneText[0][i]
				if (temp.length < 20) {
					temp += element
				} else if (temp.length < 24) {
					temp += '.'
				}
			}
			return temp + cloneText[cloneText.length - 1]
		} else {
			return text
		}
	}
	return 'unknow'
}

/**
 * Function check your file is a image file
 * @param fileName string
 * @returns true | false
 */
export function checkIsImage(fileName: string) {
	const theName = fileName.split('.')
	if (theName[theName.length - 1] == 'jpg' || theName[theName.length - 1] == 'jpeg') {
		return true
	}
	if (theName[theName.length - 1] == 'png') {
		return true
	}
	if (theName[theName.length - 1] == 'webp') {
		return true
	}
	return false
}

/**
 *
 * @param params role code
 * @returns role name
 */
export function getRoleName(params: string) {
	if (!params) {
		return ''
	}

	if (params.toLowerCase() == 'teacher') {
		return 'Giảng viên'
	}

	if (params.toLowerCase() == 'student') {
		return 'Học viên'
	}

	if (params.toLowerCase() == 'admin') {
		return 'Quản trị viên'
	}

	return 'Điều phối viên'
}

/**
 * Remove commas from a string.
 * @param str - The string to remove commas from.
 * @returns A function that takes a string as an argument and returns the string with all commas
 * removed.
 */
export function removeCommas(str) {
	return typeof str == 'string' ? parseInt(str.replace(/,/g, '')) : str
}
