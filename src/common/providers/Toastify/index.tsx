import { ToastContainer } from 'react-toastify'
import React from 'react'
import { RiWifiLine, RiWifiOffLine } from 'react-icons/ri'

const ToastifyContainer = () => {
	return (
		<>
			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>

			<div id="internet-container" className="hidden">
				<div id="cc-icon-offline">
					<RiWifiOffLine className="mr-3 text-[#fff]" size={22} />
				</div>
				<div id="cc-icon-online">
					<RiWifiLine className="mr-3 text-[#fff]" size={22} />
				</div>
				<div id="internet-status"></div>
			</div>
		</>
	)
}

export default ToastifyContainer
