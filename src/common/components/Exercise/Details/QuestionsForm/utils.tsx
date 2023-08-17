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
	if (!!params.IeltsQuestions) {
		params?.IeltsQuestions.forEach((element) => {
			let answerUpdates = element.IeltsAnswers || element.Answers
			dataUpdate.push({ ...element, IeltsAnswers: answerUpdates })
		})
	} else {
		params.IeltsQuestions.forEach((element) => {
			const temp = { ...element }
			dataUpdate.push({ ...temp, IeltsAnswers: element.Answers })
		})
	}
	return isAdd ? { ...params, IeltsQuestions: dataUpdate, ExamSectionId: section?.Id } : { ...params, IeltsQuestions: dataUpdate }
}
