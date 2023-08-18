import { Card } from 'antd'
import React from 'react'

const ColoredSentence = ({ sentence, words }) => {
	const getColorForDecision = (decision) => {
		switch (decision) {
			case 'correct':
				return '#59b96c' // You can use any color here
			case 'incorrect':
				return '#ff7c38'
			case 'warning':
				return '#e21b1b'
			default:
				return 'black'
		}
	}

	const renderColoredSentence = () => {
		let currentIndex = 0
		return sentence.split('').map((char, charIndex) => {
			const word = words?.find((word) => word.start_index <= charIndex && word.end_index >= charIndex)
			const color = word ? getColorForDecision(word.decision) : 'black'

			return (
				<span key={`char-${charIndex}`} style={{ color }}>
					{char}
				</span>
			)
		})
	}

	return (
		<>
			<Card className="mt-4">
				<div className="flex items-center my-2">
					<div className="flex items-center">
						<div className="bg-[#59b96c] w-[20px] h-[20px] rounded-[4px] mr-[8px]"></div>
						<span>Chính xác</span>
					</div>
					<div className="flex items-center">
						<div className="bg-[#ff7c38] w-[20px] h-[20px] rounded-[4px] mr-[8px] ml-[32px]"></div>
						<span>Cần điều chỉnh</span>
					</div>
					<div className="flex items-center">
						<div className="bg-[#e21b1b] w-[20px] h-[20px] rounded-[4px] mr-[8px] ml-[32px]"></div>
						<span>Sai</span>
					</div>
				</div>
				{renderColoredSentence()}
			</Card>
		</>
	)
}

export default ColoredSentence
