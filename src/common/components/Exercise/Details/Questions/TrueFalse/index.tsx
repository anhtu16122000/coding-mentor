import React, { FC } from 'react'
import HeaderTrueFalse from '../../../Question/TrueFalse/Header'
import CheckBox from '../../../Question/TrueFalse/CheckBox'

const TrueFalse: FC<{ data: IExercise }> = (props) => {
	const { data } = props

	function isChecked(index: number) {
		if (data.Answers[index].IsTrue) {
			return true
		}
		return false
	}

	return (
		<div className="cc-tf-question">
			<HeaderTrueFalse data={data} />

			<div className="true-false-container">
				<CheckBox content="True" checked={isChecked(0)} data={data} />

				<CheckBox content="False" checked={isChecked(1)} data={data} />

				<CheckBox content="Not given" checked={isChecked(2)} data={data} />
			</div>

			<div className="w-[90%] h-[1px] bg-[#00000016] block w500:hidden" />
		</div>
	)
}

export default TrueFalse
