import React, { FC } from 'react'
import ReactHTMLParser from 'react-html-parser'
import { RiErrorWarningLine } from 'react-icons/ri'
import { TbFileCertificate } from 'react-icons/tb'

type THeaderTrueFalse = {
	data: any
	children?: React.ReactNode
	isNoneSelect?: boolean
}

const HeaderTrueFalse: FC<THeaderTrueFalse> = (props) => {
	const { data, children, isNoneSelect } = props

	return (
		<div className="cc-qh-tf-container pr-[16px]">
			<div className="cc-qh-tf-title">
				<div>Câu {data?.IndexInExam}:</div>
				<div className="cc-choice-orange ml-[8px]">
					<TbFileCertificate size={12} className="mr-1" />
					<span className="mt-[1px]">{data?.Point} điểm</span>
				</div>
				{!!children && children}
			</div>

			{ReactHTMLParser(data?.Content)}

			<div>
				{!!isNoneSelect && (
					<div className="none-answer">
						<RiErrorWarningLine size={20} className="mr-2" /> Không chọn đáp án
					</div>
				)}
			</div>
		</div>
	)
}

export default HeaderTrueFalse
