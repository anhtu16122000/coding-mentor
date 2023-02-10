import React, { FC } from 'react'
import PrimaryTooltip from '~/common/components/PrimaryTooltip'
import MobileContent from './MobileContent'
import { Checkbox } from 'antd'

type TCheckbox = {
	data?: any
	checked?: boolean
	onChange?: Function
	content?: string
	isTrue?: boolean
}

const CheckBox: FC<TCheckbox> = (props) => {
	const { data, checked, onChange, content, isTrue } = props

	function _change(params) {
		!!onChange && onChange(params)
	}

	function isNotGiven() {
		return content == 'Not given' ? 'w500:w-[80px]' : 'w500:w-[50px]'
	}

	return (
		<div className="tf-check-box-wrapper">
			<div className={`cc-q-tf-checkbox ${isTrue ? 'is-true-answer' : ' '} ${isNotGiven()}`}>
				<PrimaryTooltip id={`${content.replace(/ /g, '')}-${data?.Id}`} content={content} place="left">
					<Checkbox checked={checked} onChange={_change} />
				</PrimaryTooltip>
			</div>
			<MobileContent content={content} />
		</div>
	)
}

export default CheckBox
