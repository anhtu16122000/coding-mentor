import React from 'react'

const ButtonQuestion = (props) => {
	const { data, onClick, isActivated } = props

	// console.log('--- data: ', data)

	const isError = false

	if (isActivated) {
		return (
			<div onClick={onClick} className="cc-23-btn-question bg-[#3b87ea] border-[#275fa9]">
				<div className="text-[#fff] font-[500]">{data?.Index}</div>
			</div>
		)
	}

	if (data?.IsDone) {
		return (
			<div onClick={onClick} className="cc-23-btn-question bg-[#e4f9e0] border-[#87dc70]">
				<div className="text-[#469131] font-[500]">{data?.Index}</div>
			</div>
		)
	}

	if (isError) {
		return (
			<div onClick={onClick} className="cc-23-btn-question bg-[#fbe2e2] border-[#eeb2b1]">
				<div className="text-[#e44848] font-[500]">{data?.Index}</div>
			</div>
		)
	}

	return (
		<div onClick={onClick} className="cc-23-btn-question bg-[#F0EEED] border-[#d4d2d2]">
			<div className="text-[#000] font-[500]">{data?.Index}</div>
		</div>
	)
}

export default ButtonQuestion
