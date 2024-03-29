import React, { useEffect, useState } from 'react'
import { Mic, Square } from 'react-feather'
import { Spin, Tooltip } from 'antd'
import Recorder from '~/common/utils/audio'
import { toHHMMSS } from '~/common/utils/main-function'
import { UploadFileApi } from '~/api/common/upload-image'
import { ShowNostis } from '~/common/utils'
import Router from 'next/router'

// import Recorder from 'react-cc-audio-recorder'

let interval: any = ''
let time = 0

const RecorderX = Recorder

const AudioRecord = (props) => {
	const { getLinkRecord, linkRecord, packageResult, dataQuestion, exerciseID, getActiveID, disabled } = props
	const [loadingUpload, setLoadingUpload] = useState(false)
	const [isRecord, setIsRecord] = useState(false)
	const [isPause, setIsPause] = useState(false)

	const [duration, setDuration] = useState('00:00:00')

	const timer = () => {
		time = time + 1
		setDuration(toHHMMSS(time))
	}

	const start = () => {
		if (!disabled) {
			try {
				RecorderX.start()
				setIsRecord(true)
				interval = setInterval(timer, 1000)
				if (!!getActiveID) {
					getActiveID(exerciseID)
				}
			} catch (error) {
				console.log(error)
			}
		}
	}

	const pause = () => {}

	const stop = () => {
		RecorderX.stop((event) => {
			console.log('event: ', event)
			onStop(event)
		})
	}

	function blobToFile(theBlob, fileName) {
		theBlob.lastModifiedDate = new Date()
		theBlob.name = fileName
		return new File([theBlob], fileName, {
			lastModified: new Date().getTime(),
			type: theBlob.type
		})
	}

	const onStop = async (audioData) => {
		clearInterval(interval)
		time = 0
		setDuration('00:00:00')

		let file = blobToFile(audioData.blob, 'record-audio.mp3')
		setLoadingUpload(true)
		setIsRecord(false)

		try {
			let res = await UploadFileApi.uploadImage(file)
			if (res.status == 200) {
				getLinkRecord(res.data.data)
				ShowNostis.success('Ghi âm thành công')
			}
		} catch (error) {
			ShowNostis.error(error.message)
		} finally {
			setLoadingUpload(false)
		}
	}

	useEffect(() => {
		if (Router.asPath.includes('/take-an-exam')) {
			Promise.resolve(navigator.mediaDevices.getUserMedia({ audio: !disabled || true }))
		}
	}, [disabled])

	return (
		<div className="wrap-audio-record mt-2">
			{loadingUpload ? (
				<div className="d-flex align-items-center mt-2 mb-2">
					<Spin />
					<span style={{ marginLeft: '5px', fontStyle: 'italic', fontSize: '13px' }}>Loading audio...</span>
				</div>
			) : (
				<>
					{!isRecord && linkRecord && (
						<audio controls>
							<source src={linkRecord} type="audio/mpeg" />
						</audio>
					)}
				</>
			)}

			{!isRecord && (
				<Tooltip title="Bắt đầu ghi âm">
					<button disabled={disabled} className="btn-record start" onClick={start}>
						<Mic />
					</button>
				</Tooltip>
			)}

			{isRecord && (
				<>
					<Tooltip title="Lưu lại">
						<button className="btn-record save" onClick={stop}>
							<Square />
						</button>
					</Tooltip>

					<div className="ml-3" style={{ fontSize: 16 }}>
						{duration}
					</div>
				</>
			)}

			{isPause && (
				<div className="d-block mt-2">
					<p className="font-italic" style={{ fontWeight: 500, opacity: 0.7 }}>
						Lưu ý: Hiện bạn đang tạm dừng. Bấm vào nút lưu bên trên để lưu lại đoạn ghi âm.
					</p>
				</div>
			)}
		</div>
	)
}

export default AudioRecord
