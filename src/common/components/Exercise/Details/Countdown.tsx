import React, { useState, useEffect } from 'react'
import { RootState } from '~/store'
import { useSelector, useDispatch } from 'react-redux'
import { setTimeOut } from '~/store/take-an-exam'

const CountdownTimer = ({ minutes, onSubmit }) => {
	const globalState = useSelector((state: RootState) => state.takeAnExam)
	const dispatch = useDispatch()

	const [timeLeft, setTimeLeft] = useState((minutes + 1) * 60)

	useEffect(() => {
		if (minutes == 0) {
			dispatch(setTimeOut(true))
			onSubmit()
		}
	}, [])

	useEffect(() => {
		if (!globalState.submited && timeLeft > 0) {
			const timer = timeLeft > 0 && setInterval(() => setTimeLeft(timeLeft - 1), 1000)
			return () => clearInterval(timer)
		}

		if (timeLeft == 0) {
			dispatch(setTimeOut(true))
		}
	}, [timeLeft])

	const hours = Math.floor(timeLeft / 3600)
	const minutesLeft = Math.floor((timeLeft % 3600) / 60)
	const secondsLeft = Math.floor(timeLeft % 60)

	const padTime = (time) => (time < 10 ? `0${time}` : time)

	return (
		<div>
			{timeLeft > 0 ? (
				<div>
					{padTime(hours)}:{padTime(minutesLeft)}:{padTime(secondsLeft)}
				</div>
			) : (
				<div>00:00:00</div>
			)}
		</div>
	)
}

export default CountdownTimer
