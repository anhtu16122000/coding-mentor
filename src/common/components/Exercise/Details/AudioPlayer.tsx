import React from 'react'
import PrimaryTooltip from '../../PrimaryTooltip'
import { IoCloseSharp } from 'react-icons/io5'
import { VscSettings } from 'react-icons/vsc'
import AudioPlayer from 'react-h5-audio-player'

const MainAudioPlayer = (props) => {
	const { curAudio, showAudioControl, setShowAudioControl, curSection, curSkill } = props

	return (
		<>
			{!!curAudio?.Audio && (
				<div className={`right-[16px] duration-200 bottom-[16px] absolute ${showAudioControl ? 'ex-au-show' : 'ex-au-hidden'}`}>
					<AudioPlayer
						className="h-[94px] duration-200 !w-[calc(100vw-32px)] w400:!w-[350px] hide-loop"
						src={curAudio?.Audio}
						onPlay={(e) => console.log('onPlay')}
						showSkipControls={false}
						showDownloadProgress={false}
						showJumpControls={false}
						loop={false}
						autoPlay
						layout="horizontal-reverse"
						header={
							<div className="flex items-center">
								<PrimaryTooltip content={showAudioControl ? 'Thu nhỏ' : 'Mở rộng'} place="left" id={`x-${curSection?.Id}-${curSkill?.Id}`}>
									<div
										onClick={() => setShowAudioControl(!showAudioControl)}
										className={`all-center rounded-full w-[24px] h-[24px] cursor-pointer ${showAudioControl ? 'bg-[red]' : 'bg-[#0A89FF]'}`}
									>
										{showAudioControl && <IoCloseSharp size={18} color="#fff" />}
										{!showAudioControl && <VscSettings size={16} color="#fff" />}
									</div>
								</PrimaryTooltip>
								<div className="ml-[8px] font-[600] in-1-line">{curAudio?.Name}</div>
							</div>
						}
					/>
				</div>
			)}
		</>
	)
}

export default MainAudioPlayer
