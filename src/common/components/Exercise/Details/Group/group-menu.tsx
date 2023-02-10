import { Popover } from 'antd'
import React, { useState } from 'react'
import PrimaryButton from '~/common/components/Primary/Button'
import AddQuestFromList from '../AddQuestFromList'
import QuickAddQuestion from '../Section/form-quick-add'
import QuickAddGroup from '../Section/form-quick-group'
import GroupForm from './form-group'

const GroupMenu = (props) => {
	const { isGroup, isQuest, section } = props
	const [visible, setVisible] = useState(false)

	return (
		<Popover
			placement="left"
			content={
				<>
					<div className="max-w-[200px] none-selection exam-dropdown">
						<GroupForm section={section} onOpen={() => setVisible(false)} />
						<AddQuestFromList style={2} onOpen={() => setVisible(false)} section={section} />
						<QuickAddQuestion section={section} onOpen={() => setVisible(false)} />
						<QuickAddGroup section={section} onOpen={() => setVisible(false)} />
					</div>
				</>
			}
			visible={visible}
			onVisibleChange={(event: boolean) => setVisible(event)}
			trigger="click"
			title=""
			overlayClassName="show-arrow"
		>
			<PrimaryButton
				className="!text-[#0074e4] font-[600] hover:!text-[#0074e4] hover:bg-[#fff]"
				type="button"
				icon="add"
				background="transparent"
			>
				Thêm nhóm mới
			</PrimaryButton>
		</Popover>
	)
}

export default GroupMenu
