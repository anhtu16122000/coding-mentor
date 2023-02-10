import { Spin } from 'antd'
import React from 'react'

class LoadingComponent {
	White = () => {
		return <Spin className="loading-white" />
	}
	Black = () => {
		return <Spin className="loading-black" />
	}
	Blue = () => {
		return <Spin className="loading-blue" />
	}
}

const BaseLoading = new LoadingComponent()
export default BaseLoading
