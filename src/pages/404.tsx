import React, { useState } from 'react'
import Lottie from 'react-lottie-player'

import loadingJson from '~/common/components/json/36395-lonely-404.json'

const LoadingPage = () => {
	return (
		<div className="w-full h-[100vh] flex flex-col items-center justify-center">
			<Lottie loop animationData={loadingJson} play className="inner w-[30vw] mx-auto" />
		</div>
	)
}

export default LoadingPage
