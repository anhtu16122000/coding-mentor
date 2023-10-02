import { Modal } from 'antd'
import React, { useState, useEffect, useRef } from 'react'
import { wait } from '~/common/utils'

function ReadMoreText({ text, title }) {
	const [showFullText, setShowFullText] = useState(false)
	const [lineCount, setLineCount] = useState(0)
	const containerRef = useRef(null)
	const lineHeight = 16 // Điều chỉnh chiều cao của mỗi dòng theo thiết lập thực tế của bạn

	useEffect(() => {
		const container = containerRef.current
		if (container) {
			makeSomeNoise(container)
		}
	}, [])

	async function makeSomeNoise(container) {
		await wait(200)
		const containerHeight = container.clientHeight
		const calculatedLineCount = Math.round(containerHeight / lineHeight)
		setLineCount(calculatedLineCount)
	}

	const handleReadMoreClick = () => {
		// setShowFullText(true)
		setVisible(true)
	}

	const [visible, setVisible] = useState<boolean>(false)

	return (
		<>
			<div
				ref={containerRef}
				style={{ overflow: 'hidden', lineHeight: `${lineHeight}px`, maxHeight: showFullText ? 'none' : `${lineHeight * 2}px` }}
			>
				{!!text && text.split('\n').map((line, index) => <p key={index}>{line}</p>)}
			</div>

			{lineCount > 1 && (
				<div className="font-[400] text-[14px] text-[#1b73e8] cursor-pointer" onClick={handleReadMoreClick}>
					Xem thêm
				</div>
			)}

			<Modal open={visible} onCancel={() => setVisible(false)} title={title || ''} footer={null}>
				{text}
			</Modal>
		</>
	)
}

export default ReadMoreText
