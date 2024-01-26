import React, { FC } from 'react'

type TProps = {
	item?: any
	isModal?: boolean
	Content?: string
	showButton?: boolean
	showAll?: boolean

	setVisible?: Function
	setShowAll?: Function
}

const ShowMore: FC<TProps> = (props) => {
	const { item, isModal, Content, setVisible, showButton, showAll, setShowAll } = props

	return (
		<div>
			{!isModal && (
				<>
					<span id={'news-item-content-' + item?.Id} className="cc-news-item-content in-4-line">
						{Content}
					</span>

					{showButton && (
						<div onClick={() => setVisible(true)} className="text-[#1E88E5] mt-[8px] cursor-pointer">
							Xem thêm...
						</div>
					)}
				</>
			)}

			{isModal && (
				<>
					{!showAll && (
						<span id={'news-item-content-x-' + item?.Id} className="cc-news-item-content in-4-line">
							{Content}
						</span>
					)}

					{showAll && (
						<span id={'news-item-content-x-' + item?.Id} className="cc-news-item-content full-content">
							{Content}
						</span>
					)}

					{showButton && (
						<div
							onClick={() => setShowAll(!showAll)}
							className={`${showAll ? 'text-[#F44336]' : 'text-[#1E88E5]'} mt-[8px] cursor-pointer`}
						>
							{showAll ? 'Ẩn bớt' : 'Xem thêm...'}
						</div>
					)}
				</>
			)}
		</div>
	)
}

export default ShowMore
