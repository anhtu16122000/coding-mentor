import React from 'react'

function ContentTitle({ item, type }: { item: any; type: 'group' | 'section' }) {
	function groupTitle() {
		if (type == 'group') {
			return `: Câu ${item.SIndexInExam} - ${item.EIndexInExam}`
		}
		return ''
	}

	function groupName() {
		if (type == 'section') {
			return item?.Name && `: ${item?.Name}`
		}
		return ''
	}

	return (
		<div className={`text-16-600 mb-[8px] ${type == 'section' ? 'text-[#1c76ec]' : 'text-[#0f9f2e]'}`}>
			{type == 'section' ? 'Phần' : 'Nhóm'} {item?.Index}
			{groupTitle()} {groupName()}
		</div>
	)
}

export default ContentTitle
