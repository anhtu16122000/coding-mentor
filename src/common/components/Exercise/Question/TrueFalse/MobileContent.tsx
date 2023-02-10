import React, { FC } from 'react'

const MobileContent: FC<{ content: string }> = (props) => {
	return <div className="cc-q-tf-mobile-content mr-[16px]">{props?.content}</div>
}

export default MobileContent
