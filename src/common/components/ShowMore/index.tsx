import React, { FC } from 'react'
import ShowMoreText from 'react-show-more-text'

type TProps = {
	children: React.ReactNode
	lines: number
}

const ShowMore: FC<TProps> = (props) => {
	const { children, lines } = props

	return (
		<ShowMoreText
			lines={lines || 3}
			more="Hiện thêm"
			less="Ẩn bớt"
			className="content-css"
			anchorClass="show-more-less-clickable"
			expanded={false}
			truncatedEndingComponent={'... '}
		>
			{children}
		</ShowMoreText>
	)
}

export default ShowMore
