import React, { FC } from 'react'
import { GiAlarmClock } from 'react-icons/gi'
import CountDown from '../CountDown'
import IconButton from '~/common/components/Primary/IconButton'

type TTestingHeader = {
	title?: string
	totalPoint?: number | string
	time?: number
	passPoint?: number | string
	onEnded?: Function
	onClickMenu?: Function
	hideTime?: boolean
}

const TestingHeader: FC<TTestingHeader> = (props) => {
	const { title, totalPoint, time, onEnded, onClickMenu, passPoint, hideTime } = props

	function _clickMenu() {
		!!onClickMenu && onClickMenu()
	}

	return (
		<div id="the-fica-header" className="cc-testing-header">
			<div className="flex-1">
				<div className="text-16-700">{title + ''}</div>
				<div className="text-15-500 text-[#0074e4]">
					Tổng điểm: {totalPoint}
					{!!passPoint ? ' - Điểm đạt: ' + passPoint : ''}
				</div>
			</div>

			{!hideTime && (
				<div className="cc-testing-clock">
					<GiAlarmClock size={28} className="hidden w800:!block" />

					<div>
						{!!time ? (
							<CountDown time={time} onEnded={onEnded} />
						) : (
							<div className={`text-[16px] font-[700]`}>
								<span>Loading..</span>
							</div>
						)}
					</div>
				</div>
			)}

			<div className="cc-test-icon-menu">
				<IconButton onClick={_clickMenu} color="black" type="button" icon="menu" />
			</div>
		</div>
	)
}

export default TestingHeader
