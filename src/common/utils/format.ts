import moment from 'moment'

class Format {
	toDDMMYYYY = (date: Date) => moment(date).format('DD/MM/YYYY')
	toDDMMYYYHHmm = (date: Date) => moment(date).format('DD/MM/YYYY HH:mm')
	toHHmm = (date: Date) => moment(date).format('HH:mm')
	toHHmmss = (date: Date) => moment(date).format('HH:mm:ss')

	secondToHHMMSS(param) {
		var seconds = parseInt(param, 10).toString()
		var hours = Math.floor(parseInt(seconds) / 3600).toString()
		var minutes = Math.floor((parseInt(seconds) - parseInt(hours) * 3600) / 60).toString()
		seconds = (parseInt(seconds) - parseInt(hours) * 3600 - parseInt(minutes) * 60).toString()
		if (parseInt(hours) < 10) {
			hours = '0' + hours
		}
		if (parseInt(minutes) < 10) {
			minutes = '0' + minutes
		}
		if (parseInt(seconds) < 10) {
			seconds = '0' + seconds
		}
		var time = hours + ':' + minutes + ':' + seconds
		return time
	}

	numberToPrice = (price: any) => {
		price += ''
		let x = price.split('.')
		let x1 = x[0]
		let x2 = x.length > 1 ? '.' + x[1] : ''
		let rgx = /(\d+)(\d{3})/
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2')
		}
		return x1 + x2
	}

	priceToNumber = (str: number | string) => parseInt(str.toString().replace(/\D/g, '')) || 0
}

export const _format = new Format()
