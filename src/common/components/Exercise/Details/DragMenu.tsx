import React, { useRef } from 'react'

import { FiMoreHorizontal } from 'react-icons/fi'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { examGroupsApi } from '~/api/exam/group'
import { examSectionsApi } from '~/api/exam/section'
import { ShowNoti } from '~/common/utils'
import { Popconfirm, Popover } from 'antd'

import AddQuestFromList from './AddQuestFromList'
import GroupForm from './Group/form-group'
import ChoiceInputForm from './QuestionsForm/MultipleChoiceForm/Form'
import QuickAddQuestion from './Section/form-quick-add'
import QuickAddGroup from './Section/form-quick-group'
import SectionForm from './Section/form-section'

const DragMenu = (props) => {
	const { isGroup, isQuest, item, onRefresh } = props
	const theRef = useRef(null)

	async function deleteThis() {
		try {
			const response = !!isGroup ? await examGroupsApi.delete(props.item.Id) : await examSectionsApi.delete(props.item.Id)
			if (response.status === 200) {
				close()
				onRefresh()
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
	}

	function close() {
		theRef.current?.close()
	}

	return (
		<Popover
			ref={theRef}
			placement="left"
			content={
				<>
					<div className="max-w-[200px] none-selection exam-dropdown">
						{isQuest && <ChoiceInputForm isEdit defaultData={props.item} onOpen={() => close()} />}

						{!isGroup && !isQuest && (
							<>
								<GroupForm section={item} onOpen={() => close()} />
								<AddQuestFromList onOpen={() => close()} section={item} />
								<QuickAddQuestion section={item} onOpen={() => close()} />
								<QuickAddGroup section={item} onOpen={() => close()} />
								<hr className="mx-[-12px] my-2 border-[#bbbbbb]" />
								<SectionForm isEdit defaultData={props.item} onOpen={() => close()} />
							</>
						)}

						{!!isGroup && <GroupForm isEdit onRefresh={onRefresh} defaultData={props.item} onOpen={() => close()} />}

						<Popconfirm
							placement="left"
							title={isGroup ? 'Xoá nhóm câu hỏi?' : 'Xoá phần này?'}
							okText="Xóa"
							cancelText="Hủy"
							onConfirm={deleteThis}
						>
							<div className="button-delete-choice">
								<RiDeleteBin6Line size={18} className="mr-2 mt-[-2px]" />
								{isGroup ? 'Xoá nhóm' : 'Xoá phần'}
							</div>
						</Popconfirm>
					</div>
				</>
			}
			trigger="click"
			title=""
			overlayClassName="show-arrow"
		>
			<div className="cc-exercise-drag-menu">
				<FiMoreHorizontal size={18} color="#fff" />
			</div>
		</Popover>
	)
}

export default DragMenu
