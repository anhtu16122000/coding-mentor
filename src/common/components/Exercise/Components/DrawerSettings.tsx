// Created by Chaos on 09/10/2023

import { Drawer, Switch } from 'antd'
import React, { useState } from 'react'
import PrimaryButton from '../../Primary/Button'
import { MdSettings } from 'react-icons/md'

type TDrawerSettings = {
	showSkills: boolean
	setShowSkills: Function
	showSections: boolean
	setShowSections: Function
	showQuestions: boolean
	setShowQuestions: Function
}

const DrawerSettings = (props: TDrawerSettings) => {
	const { showSkills, setShowSkills, showSections, setShowSections, showQuestions, setShowQuestions } = props

	const [visible, setVisible] = useState<boolean>(false)

	return (
		<>
			<PrimaryButton onClick={() => setVisible(!visible)} className="mr-[16px]" type="button" background="yellow">
				<MdSettings size={20} />
			</PrimaryButton>

			<Drawer open={visible} title="Tuỳ chỉnh" width={window?.innerWidth > 350 ? '300' : '90%'} onClose={() => setVisible(false)}>
				<div className="exercise-settings">
					<div className="flex items-center bg-[#F2F2F7] border-[#d4d4da] rounded-[6px] px-[8px] py-[8px]">
						<div className=""></div>
						<div className="flex-1 font-[500]">Hiển thị kỹ năng</div>
						<Switch checked={showSkills} onClick={() => setShowSkills(!showSkills)} />
					</div>

					<div className="flex items-center bg-[#F2F2F7] border-[#d4d4da] rounded-[6px] px-[8px] py-[8px] mt-[8px]">
						<div className=""></div>
						<div className="flex-1 font-[500]">Hiển thị section</div>
						<Switch checked={showSections} onClick={() => setShowSections(!showSections)} />
					</div>

					<div className="flex items-center bg-[#F2F2F7] border-[#d4d4da] rounded-[6px] px-[8px] py-[8px] mt-[8px]">
						<div className=""></div>
						<div className="flex-1 font-[500]">Hiển thị danh sách câu</div>
						<Switch checked={showQuestions} onClick={() => setShowQuestions(!showQuestions)} />
					</div>
				</div>
			</Drawer>
		</>
	)
}

export default DrawerSettings
