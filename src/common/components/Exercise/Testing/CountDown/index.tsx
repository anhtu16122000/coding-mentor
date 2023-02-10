import React, { FC, useEffect, useState } from 'react'
import { ShowNoti } from '~/common/utils'

type ICountDown = {
	time: number
	onEnded?: Function
}

let warningStatus = 0

const CountDown: FC<ICountDown> = (props) => {
	const { time, onEnded } = props

	const [count, setCount] = useState(0)

	useEffect(() => {
		countDown()
	}, [time])

	function countDown() {
		let distance = time * 60
		var x = setInterval(function () {
			setCount(distance)
			distance = distance - 1
			if (distance < 0) {
				clearInterval(x)
				!!onEnded && onEnded()
			}
		}, 1000)
	}

	function formatNumber(n: number) {
		return n < 10 ? '0' + n : n
	}

	function fancyTimeFormat(duration) {
		// Hours, minutes and seconds
		var hrs = ~~(duration / 3600)
		var mins = ~~((duration % 3600) / 60)
		var secs = ~~duration % 60

		const response = { hours: hrs, mins: mins, secs: secs }
		return response
	}

	function getColor() {
		if (fancyTimeFormat(count).hours == 0 && fancyTimeFormat(count).mins == 0 && fancyTimeFormat(count).secs < 60) {
			if (warningStatus == 1) {
				ShowNoti('warning', 'Thời gian làm bài chỉ còn 1 phút')
				warningStatus = 2
			}
			return '#F44336'
		}

		if (fancyTimeFormat(count).hours == 0 && fancyTimeFormat(count).mins < 10) {
			if (warningStatus == 0) {
				if (~~(time / 3600) > 10) {
					ShowNoti('warning', 'Thời gian làm bài chỉ còn 10 phút')
				}
				warningStatus = 1
			}
			return '#FB8C00'
		}

		return '#000'
	}

	return (
		<>
			{count !== 0 && (
				<div className={`text-[16px] font-[700] ${!!time && getColor() == '#F44336' && 'shake-y'}`} style={{ color: getColor() }}>
					{fancyTimeFormat(count).hours > 0 && <span>{formatNumber(fancyTimeFormat(count).hours)}:</span>}
					<span>{formatNumber(fancyTimeFormat(count).mins)}:</span>
					<span>{formatNumber(fancyTimeFormat(count).secs)}</span>
				</div>
			)}
		</>
	)
}

export default CountDown
