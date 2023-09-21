import React from 'react'
import PrimaryTooltip from '../../PrimaryTooltip'
import { IoCloseSharp } from 'react-icons/io5'
import AudioPlayer from 'react-h5-audio-player'
import { FaMinus } from 'react-icons/fa'
import { TbArrowsMaximize } from 'react-icons/tb'

const MainAudioPlayer = (props) => {
	const { curAudio, setCurAudio, showAudioControl, setShowAudioControl, curSection, curSkill } = props

	return (
		<>
			{!!curAudio?.Audio && (
				<div className={`right-[16px] duration-200 bottom-[16px] absolute ${showAudioControl ? 'ex-au-show' : 'ex-au-hidden'}`}>
					<AudioPlayer
						className="h-[94px] duration-200 !w-[calc(100vw-32px)] w400:!w-[350px] hide-loop"
						src={curAudio?.Audio}
						onPlay={(e) => {}}
						showSkipControls={false}
						showDownloadProgress={false}
						showJumpControls={false}
						loop={false}
						autoPlay
						layout="horizontal-reverse"
						header={
							<div className="flex items-center">
								<PrimaryTooltip content="Đóng" place="left" id={`x-${curSection?.Id}-${curSkill?.Id}`}>
									<div
										onClick={() => setCurAudio(null)}
										className={`all-center rounded-full w-[24px] h-[24px] cursor-pointer mr-[8px] bg-[red]`}
									>
										<IoCloseSharp size={18} color="#fff" />
									</div>
								</PrimaryTooltip>

								<PrimaryTooltip
									content={showAudioControl ? 'Thu nhỏ' : 'Mở rộng'}
									place="left"
									id={`min-${curSection?.Id}-${curSkill?.Id}`}
								>
									<div
										onClick={() => setShowAudioControl(!showAudioControl)}
										className={`all-center rounded-full w-[24px] h-[24px] cursor-pointer ${
											showAudioControl ? 'bg-[#a2a2a2]' : 'bg-[#0A89FF]'
										}`}
									>
										{showAudioControl && <FaMinus size={14} color="#fff" />}
										{!showAudioControl && <TbArrowsMaximize size={14} color="#fff" />}
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
