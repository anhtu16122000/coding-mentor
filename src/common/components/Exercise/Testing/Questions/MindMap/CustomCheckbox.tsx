import { Checkbox } from 'antd'
import Router from 'next/router'
import React from 'react'

const MindMapCheckBox = ({ answers, getSelectedAns, exercise, isResult, onClick }) => {
	return (
		<div className="ex-mind-checkbox">
			<div className="inline-flex">
				{answers.map((answer, ansIndex) => {
					const selected = getSelectedAns(exercise, !isResult ? answer?.Id : answer?.IeltsAnswerId)?.checked
					const corrected = getSelectedAns(exercise, answer?.IeltsAnswerId)?.correct?.IeltsAnswerId == answer?.IeltsAnswerId

					let checked = false

					if (isResult) {
						if (selected || corrected) {
							checked = true
						} else {
							checked = false
						}
					}

					const resultClass = selected ? (corrected ? 'mind-correct' : 'mind-incorrect') : corrected ? 'mind-corr-ans' : ''

					return (
						<div className={`${ansIndex !== 0 ? 'antd-mind-check-border' : ''} antd-mind-check`}>
							<Checkbox
								onClick={() => !isResult && onClick(exercise, answer?.Id)}
								checked={!isResult ? getSelectedAns(exercise, answer?.Id)?.checked : checked}
								disabled={Router.asPath.includes('exam/detail')}
								id={`mind-${exercise?.Id}-${answer?.Id}`}
								className={`${isResult ? resultClass : ''}`}
							/>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default MindMapCheckBox
