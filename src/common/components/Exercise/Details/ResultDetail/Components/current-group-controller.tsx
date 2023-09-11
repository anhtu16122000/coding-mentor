import React from 'react'
import { Popconfirm } from 'antd'
import { IoClose } from 'react-icons/io5'
import { ieltsGroupApi } from '~/api/IeltsExam/ieltsGroup'
import { ShowNostis } from '~/common/utils'

type TProps = { currentSection: any; curGroup: any; onRefresh: Function; getQuestions: Function }

function CurrentGroupController(props: TProps) {
	const { currentSection, curGroup, onRefresh, getQuestions } = props

	async function handleDeleteGroup() {
		try {
			const res = await ieltsGroupApi.delete(curGroup?.Id)
			if (res?.status == 200) {
				getQuestions()
			}
		} catch (error) {
			ShowNostis.error(error?.message)
		}
	}

	return (
		<div className="flex items-center">
			{/* <GroupForm isEdit section={currentSection} defaultData={curGroup} onRefresh={onRefresh} /> */}
			<Popconfirm title="Xoá nhóm câu hỏi này?" onConfirm={handleDeleteGroup}>
				<div className="exam-23-btn-del-group">
					<IoClose size={20} />
					<div className="hidden w600:inline ml-2">Xoá nhóm câu</div>
				</div>
			</Popconfirm>
		</div>
	)
}

export default CurrentGroupController
