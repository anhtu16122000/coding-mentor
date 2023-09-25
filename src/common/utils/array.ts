export function transformArrayToObject(array = [], key = 'insert-key') {
	if (array.length === 0) return {}
	const result = {}
	for (const item of array) {
		const studentId = item[key]
		result[studentId] = result?.[studentId] ? [...result[studentId], item] : [item]
	}

	return result
}
