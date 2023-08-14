import React from 'react'

const ButtonQuestion = (props) => {
	const { data, onClick, isActivated } = props

	const isError = false

	if (data?.IsDone) {
		return (
			<div onClick={onClick} className="cc-23-btn-question bg-[#e0e4f9] border-[#b0baef]">
				<div className="text-[#2F4AD7] font-[500]">{data?.Index}</div>
			</div>
		)
	}

	if (isActivated) {
		return (
			<div onClick={onClick} className="cc-23-btn-question bg-[#e0f9ee] border-[#b1f0d6]">
				<div className="text-[#3bc188] font-[500]">{data?.Index}</div>
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
