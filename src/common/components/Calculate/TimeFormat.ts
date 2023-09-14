// add 0
const addZero = (v: number) => {
	return `${v > 0 ? (v > 9 ? v : `0${v}`) : '00'}`
}

// dd/mm/yy hh:MM
export const formatDateTime = (date: string) => {
	const dateTime = new Date(date)
	const dd = dateTime.getDay()
	const mm = dateTime.getMonth()
	const yy = dateTime.getFullYear()
	const MM = dateTime.getMinutes()
	const hh = dateTime.getHours()

	return `${addZero(dd)}/${addZero(mm)}/${yy} ${addZero(hh)}:${addZero(MM)}`
}
