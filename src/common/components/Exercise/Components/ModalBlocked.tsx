// Created by Chaos on 09/10/2023

import { Modal } from 'antd'
import React from 'react'
import Lottie from 'react-lottie-player'
import lottieFile from '~/common/components/json/animation_lludr9cs.json'

type TModalBlocked = {
	content: string
}

const ModalBlocked = (props: TModalBlocked) => {
	const { content } = props

	return (
		<Modal centered closable={false} width={400} open={!!content} footer={null}>
			<div className="w-full flex flex-col items-center">
				<Lottie loop animationData={lottieFile} play className="w-[220px]" />
				<div className="text-[18px] font-[600] text-[red]">{content}</div>
			</div>
		</Modal>
	)
}

export default ModalBlocked
