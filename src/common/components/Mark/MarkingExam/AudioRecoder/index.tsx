import React, { useEffect, useState } from 'react'
import { Mic, Square, X } from 'react-feather'
import { Button, Popconfirm, Spin, Tooltip } from 'antd'

import Recorder from '~/common/utils/audio'
import { UploadFileApi } from '~/api/common/upload-image'

let interval: any = ''
let time = 0

type IAudioRecord = {
	id: string
	setLinkRecord: Function
	linkRecord: string
	isHideBar?: boolean
	onDelete?: Function
	disabled: boolean
	isRecord?: boolean
	setIsRecord?: Function
	playing?: boolean
	setPlaying?: Function
}

const wait = (timeout: number) => {
	return new Promise((resolve) => setTimeout(resolve, timeout))
}

function toHHMMSS(param) {
	var seconds = parseInt(param, 10).toString()
	var hours = Math.floor(parseInt(seconds) / 3600).toString()
	var minutes = Math.floor((parseInt(seconds) - parseInt(hours) * 3600) / 60).toString()
	seconds = (parseInt(seconds) - parseInt(hours) * 3600 - parseInt(minutes) * 60).toString()

	if (parseInt(hours) < 10) {
		hours = '0' + hours
	}
	if (parseInt(minutes) < 10) {
		minutes = '0' + minutes
	}
	if (parseInt(seconds) < 10) {
		seconds = '0' + seconds
	}

	var time = hours + ':' + minutes + ':' + seconds
	return time
}

const AudioRecoder = (props: IAudioRecord) => {
	const { setLinkRecord, linkRecord, isHideBar, onDelete, disabled } = props
	// const { showNoti } = useWrap()

	const [loadingUpload, setLoadingUpload] = useState(false)
	const [isRecord, setIsRecord] = useState(false)

	const [duration, setDuration] = useState('00:00:00')

	const timer = () => {
		time = time + 1
		setDuration(toHHMMSS(time))
	}

	// GET NOW TIMESTAMP
	function getTimeStamp() {
		return new Date().getTime() // Example: 1653474514413
	}

	function blobToFile(theBlob, fileName) {
		theBlob.lastModifiedDate = new Date()
		theBlob.name = fileName
		return new File([theBlob], fileName, {
			lastModified: new Date().getTime(),
			type: theBlob.type
		})
	}

	const [mediaRecorder, setMediaRecorder] = useState<any>('')

	useEffect(() => {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			getRecordPermission()
		} else {
			console.log('Trình duyệt của bạn không hỗ trợ ghi âm!')
		}
	}, [])

	// GET PERMISSION
	function getRecordPermission() {
		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((stream) => {
				setMediaRecorder(new MediaRecorder(stream))
			})
			.catch(function (error) {
				console.log('Không thể lấy được quyền ghi âm: ' + error)
			})
	}

	// HANDLE START
	function startRecoder() {
		try {
			Recorder.start()
			setIsRecord(true)
			interval = setInterval(timer, 1000)
		} catch (error) {
			console.log('Can not start recoder: ', error)
		}
	}

	// HANDLE START
	function resumeRecoder() {}

	// HANDLE PAUSE
	function pauseRecoder() {}

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
				setLinkRecord(res.data.data)
				// showNoti('success', 'Ghi âm thành công')
			}
		} catch (error) {
			// showNoti('danger', error.message)
		} finally {
			setLoadingUpload(false)
		}
	}

	// HANDLE STOP
	async function stopRecoder() {
		Recorder.stop((event) => {
			console.log('event: ', event)
			onStop(event)
		})
	}

	return (
		<div>
			<div id={`recoder-${props.id}`} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
				{loadingUpload ? (
					<div className="recoder">
						<Spin className="mr-3" />
					</div>
				) : (
					!isRecord &&
					linkRecord && (
						<>
							{!!onDelete && !disabled && (
								<Tooltip title="Xoá âm thanh">
									<Popconfirm okText="Xóa" cancelText="Hủy" onConfirm={() => !!onDelete && onDelete()} title="Bạn muốn xóa bản ghi này?">
										<Button className="btn-icon mr-2" style={{ borderWidth: 0 }}>
											<X color="red" />
										</Button>
									</Popconfirm>
								</Tooltip>
							)}

							<audio id={`audio-${props.id}`} className="mr-3 custom-audio-recorder-netxt" controls>
								<source src={linkRecord} type="audio/mpeg" />
							</audio>
						</>
					)
				)}

				{!isRecord && !disabled && (
					<Tooltip title={!!linkRecord ? 'Ghi lại' : 'Bắt đầu ghi âm'}>
						<button className="btn-record-next start" onClick={startRecoder}>
							<Mic />
						</button>
					</Tooltip>
				)}

				{isRecord && !disabled && (
					<>
						<Tooltip title="Lưu lại">
							<button className="btn-record save" onClick={stopRecoder}>
								<Square />
							</button>
						</Tooltip>
						<div className="ml-3" style={{ fontSize: 16 }}>
							{duration}
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default AudioRecoder
