import React from 'react'
import PrimaryTooltip from '../../PrimaryTooltip'
import { IoCloseSharp } from 'react-icons/io5'
import AudioPlayer from 'react-h5-audio-player'
import { FaMinus } from 'react-icons/fa'
import { TbArrowsMaximize } from 'react-icons/tb'

const MainAudioPlayer2 = (props) => {
	const { curAudio, setCurAudio, showAudioControl, setShowAudioControl, curSection, curSkill } = props

	return (
		<>
			{!!curAudio?.Audio && (
				<div className={`duration-200 ex-au-show`}>
					<AudioPlayer
						className="h-[32px] !w-[calc(100vw-32px)] hide-loop"
						src={curAudio?.Audio}
						onPlay={(e) => {}}
						showSkipControls={false}
						showDownloadProgress={false}
						showJumpControls={false}
						loop={false}
						autoPlay
						layout="horizontal-reverse"
						header={null}
					/>
				</div>
			)}
		</>
	)
}

export default MainAudioPlayer2
