import React, { useEffect, useState } from 'react'
// import { exerciseGroupApi } from '~/apiBase/'
// import { useWrap } from '~/context/wrap'
import { Mic, Square } from 'react-feather'
import { Button, Popconfirm, Spin, Tooltip } from 'antd'
// import { toHHMMSS, wait } from '~/utils/functions'
import Recorder from '~/common/utils/audio'
import { elsaSpeakApi } from '~/api/elseSpeak'
import { newsFeedApi } from '~/api/newsfeed/newsfeed'
import { UploadFileApi } from '~/api/common/upload-image'

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

type IAudioRecord = {
	id: string
	setLinkRecord: Function
	linkRecord: string
	isHideBar?: boolean
	onDelete?: Function
	disabled: boolean
	isRecord?: boolean
	setIsRecord?: Function
	setPlaying?: Function
	playing?: boolean
	loading?: boolean
}

let interval: any = ''
let time = 0

const AudioRecoder = (props: IAudioRecord) => {
	const { setLinkRecord, linkRecord, isHideBar, onDelete, disabled, isRecord, setIsRecord } = props
	// const { showNoti } = useWrap()

	const [loadingUpload, setLoadingUpload] = useState(false)

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
			.getUserMedia({ video: false, audio: true })
			.then((stream) => {
				setMediaRecorder(new MediaRecorder(stream))
			})
			.catch(function (error) {
				console.log('Không thể lấy được quyền ghi âm: ' + error)
			})
	}

	const [duration, setDuration] = useState('00:00:00')

	const timer = () => {
		time = time + 1
		setDuration(toHHMMSS(time))
	}

	// HANDLE START
	function startRecoder() {
		if (!!mediaRecorder) {
			Recorder.start()
			setIsRecord(true)
			interval = setInterval(timer, 1000)
		} else {
			// showNoti('danger', 'Hãy cấp quyền sử dụng micro')
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

	// async function uploadFile(params) {
	// 	try {
	// 		const response = await elsaSpeakApi.addFile(params)
	// 		if (response.status == 200) {
	// 			setFileUrl(response.data.data)
	// 		}
	// 	} catch (err) {
	// 		ShowNoti('error', err.message)
	// 	}
	// }

	// HANDLE STOP
	async function stopRecoder() {
		try {
			Recorder.stop((event) => {
				console.log('event: ', event)
				onStop(event)
			})
		} catch (error) {
			// showNoti('danger', 'Can not start recoder')
		}
	}

	async function _urlChanged() {
		setLoadingUpload(true)
		await wait(0)
		setLoadingUpload(false)
	}

	useEffect(() => {
		_urlChanged()
	}, [linkRecord])

	function showAuio() {
		if (!isRecord && linkRecord) {
			return true
		} else {
			return false
		}
	}

	return (
		<div>
			<div id={`recoder-${props.id}`} className="wrapper-recoder-audio">
				{!linkRecord && !isRecord && !disabled && (
					<Tooltip title={!!linkRecord ? 'Ghi lại' : 'Bắt đầu ghi âm'}>
						<button className="btn-record start mt-2" onClick={startRecoder}>
							<Mic />
						</button>
					</Tooltip>
				)}

				{isRecord && !disabled && (
					<>
						<Tooltip title="Lưu lại">
							<button className="btn-record save mt-3" onClick={stopRecoder}>
								<Square />
							</button>
						</Tooltip>
						<div className="mt-3" style={{ fontSize: 16 }}>
							{duration}
						</div>
					</>
				)}

				{loadingUpload ? (
					<Spin className="mt-3" />
				) : (
					showAuio() && (
						<>
							{!!onDelete && !disabled && (
								<Tooltip title="Xoá âm thanh">
									<Popconfirm okText="Xóa" cancelText="Hủy" onConfirm={() => !!onDelete && onDelete()} title="Bạn muốn xóa bản ghi này?">
										<Button className="btn-icon mr-2">{/* <FontAwesomeIcon icon={faXmark} size="lg" style={{ color: 'red' }} /> */}</Button>
									</Popconfirm>
								</Tooltip>
							)}
							<audio
								onPlay={() => props.setPlaying(true)}
								onPause={() => props.setPlaying(false)}
								onEnded={() => props.setPlaying(false)}
								id={`audio-${props.id}`}
								className="mt-3 custom-audio-recorder-netxt"
								controls
							>
								<source src={linkRecord} type="audio/mpeg" />
							</audio>
						</>
					)
				)}
			</div>
		</div>
	)
}

export default AudioRecoder
