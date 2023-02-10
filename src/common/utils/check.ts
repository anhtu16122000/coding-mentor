class Check {
	isNumber = (val: string) => {
		if (val.match(/^-?[0-9]\d*([,.]\d+)?$/)) return true
		return false
	}
}

// console.log('%c - Answers: ', 'color: #03A9F4', answers)

export const _check = new Check()
