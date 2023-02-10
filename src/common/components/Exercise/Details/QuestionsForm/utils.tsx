/**
 *
 * @param answers list of answers
 * @param ans answer delete
 * @param callback
 */
export function removeChoiceAnswer(answers, ans, callback) {
	let temp = []
	answers.forEach((element) => {
		if (!!element?.Id) {
			if (element.Id == ans.Id) {
				temp.push({ ...element, Enable: false })
			} else {
				temp.push({ ...element })
			}
		} else {
			if (element.timestamp !== ans.timestamp) {
				temp.push({ ...element })
			}
		}
	})
	callback(temp)
}

export function formatExerciseInGroup(params, isAdd, section) {
	const dataUpdate = []
	if (!!params.ExerciseUpdates) {
		params?.ExerciseUpdates.forEach((element) => {
			let answerUpdates = element.AnswerUpdates || element.Answers
			dataUpdate.push({ ...element, AnswerUpdates: answerUpdates })
		})
	} else {
		params.ExerciseCreates.forEach((element) => {
			const temp = { ...element }
			dataUpdate.push({ ...temp, AnswerCreates: element.Answers })
		})
	}
	return isAdd ? { ...params, ExerciseCreates: dataUpdate, ExamSectionId: section?.Id } : { ...params, ExerciseUpdates: dataUpdate }
}
