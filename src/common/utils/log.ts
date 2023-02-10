class Log {
	Blue = (title: string, content: any) => {
		console.log(`%c - ${title}: `, 'color: #03A9F4; font-weight: 600', content)
	}

	Red = (title: string, content: any) => {
		console.log(`%c - ${title}: `, 'color: #F44336; font-weight: 600', content)
	}

	Green = (title: string, content: any) => {
		console.log(`%c - ${title}: `, 'color: #66BB6A; font-weight: 600', content)
	}

	Yellow = (title: string, content: any) => {
		console.log(`%c - ${title}: `, 'color: #FFEB3B; font-weight: 600', content)
	}
}

export const log = new Log()
