import React from 'react'
import AudioPlayer from 'react-h5-audio-player'
import { useExamContext } from '~/common/providers/Exam'

const MainAudioPlayer2 = () => {
	const { curAudio } = useExamContext()

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
