import Router from 'next/router'

export function viewClassDetails(data) {
	Router.push({
		pathname: '/class/list-class/detail',
		query: { class: data?.Id, curriculum: data?.CurriculumId, branch: data?.BranchId, scoreBoardTemplateId: data?.ScoreboardTemplateId }
	})
}
