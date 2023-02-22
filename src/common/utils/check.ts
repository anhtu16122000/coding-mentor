class Check {
	isNumber = (val: string) => {
		if (val.match(/^-?[0-9]\d*([,.]\d+)?$/)) return true
		return false
	}
	checkURL(url) {
		return(url?.match(/\.(jpeg|jpg|gif|png)$/));
	}
}

// console.log('%c - Answers: ', 'color: #03A9F4', answers)

export const _check = new Check()
