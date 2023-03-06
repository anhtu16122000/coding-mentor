import Router from 'next/router'

export const wait = (timeout: number) => {
	return new Promise((resolve) => setTimeout(resolve, timeout))
}

export const fmSelectArr = (arr: Array<{ [key: string]: any }>, title: string, value: string, options = [], price?: string) => {
	if (Array.isArray(arr) && arr.length > 0) {
		return arr
			.filter((x) => (x.Enable === false ? false : x))
			.map((x) => ({
				title: x[title],
				value: x[value],
				options: options.reduce((obj, o) => ({ ...obj, [o]: x[o] }), {}),
				price: x[price]
			}))
	}
	return []
}

export function encode(str) {
	return window?.btoa(unescape(encodeURIComponent(str)))
}

export function decode(str) {
	return !!str && str != 'undefined' ? decodeURIComponent(escape(window?.atob(str))) : ''
}

export function removeAccents(str) {
	var AccentsMap = [
		'aàảãáạăằẳẵắặâầẩẫấậ',
		'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
		'dđ',
		'DĐ',
		'eèẻẽéẹêềểễếệ',
		'EÈẺẼÉẸÊỀỂỄẾỆ',
		'iìỉĩíị',
		'IÌỈĨÍỊ',
		'oòỏõóọôồổỗốộơờởỡớợ',
		'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
		'uùủũúụưừửữứự',
		'UÙỦŨÚỤƯỪỬỮỨỰ',
		'yỳỷỹýỵ',
		'YỲỶỸÝỴ'
	]
	for (var i = 0; i < AccentsMap.length; i++) {
		var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g')
		var char = AccentsMap[i][0]
		str = str.replace(re, char)
	}
	return str
}

export function parseSelectArray(arr: Array<{ [key: string]: any }>, title: string, value: string) {
	if (Array.isArray(arr) && arr.length > 0) {
		return arr
			.filter((item) => (item.Enable == false ? false : item))
			.map((item) => ({
				title: item[title],
				value: item[value]
			}))
	}
}

export function parseSelectArrayUser(arr: Array<{ [key: string]: any }>, title: string, title2: string, value: string) {
	if (Array.isArray(arr) && arr.length > 0) {
		return arr
			.filter((item) => (item.Enable == false ? false : item))
			.map((item) => ({
				title: `${item[title]} - ${item[title2]}`,
				value: item[value]
			}))
	}
}

export const parseStringToNumber = (str: number | string) => parseInt(str.toString().replace(/\D/g, '')) || 0

export const copyRightLog = () => {
	console.log('----------------------------------------------------')
	console.log('----------                                ----------')
	console.log('----------   LMS - © 2022 • NGUYEN CHAU   ----------')
	console.log('----------                                ----------')
	console.log('----------------------------------------------------')
}

export function getPreviousDay(date = new Date()) {
	const previous = new Date(date.getTime())
	previous.setDate(date.getDate() - 1)

	return previous
}

export const parseToMoney = (value: any) => {
	if (value == '' || value == undefined || value == null) {
		return '0'
	}
	value += ''
	let x = value.split('.')
	let x1 = x[0]
	let x2 = x.length > 1 ? '.' + x[1] : ''
	let rgx = /(\d+)(\d{3})/
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2')
	}
	return x1 + x2
}

import { logOut, parseJwt } from './token-handle'

export { logOut, parseJwt }
