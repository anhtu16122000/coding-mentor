import React from 'react'
import confetti from 'canvas-confetti'

const Fireworks = (props) => {
	const { showFirework } = props
	if (showFirework) {
		confetti({
			shapes: ['square'],
			particleCount: 500,
			spread: 60,
			startVelocity: 90,
			origin: { y: 1.4, x: 0.0 },
			angle: 64,
			zIndex: 9999,
			ticks: 500,
			scalar: 1.8,
			gravity: 0.5,
			colors: ['#bb0000', '#04f90e', '#edf904', '#04d5f9']
		})

		confetti({
			particleCount: 600,
			spread: 60,
			startVelocity: 90,
			origin: { y: 1.4, x: 0.5 },
			angle: 90,
			zIndex: 9999,
			ticks: 500,
			scalar: 1.8,
			gravity: 0.5
		})

		confetti({
			shapes: ['square'],
			particleCount: 500,
			spread: 60,
			startVelocity: 90,
			origin: { y: 1.4, x: 1 },
			angle: 110,
			zIndex: 9999,
			ticks: 500,
			scalar: 1.8,
			gravity: 0.5,
			colors: ['#bb0000', '#04f90e', '#edf904', '#04d5f9']
		})
	}

	return <div className={`fixed inset-0 ${showFirework ? 'z-[150] bg-[rgba(0,0,0,0.4)]' : 'z-0'}`}></div>
}

export default Fireworks
