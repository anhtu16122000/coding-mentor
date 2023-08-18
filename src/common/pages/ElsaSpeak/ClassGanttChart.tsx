import { Card, Form, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { parseSelectArray } from '~/common/utils/common'
import MicRecorder from 'mic-recorder-to-mp3'
import { RootState } from '~/store'
import PrimaryButton from '~/common/components/Primary/Button'
import { ShowNoti } from '~/common/utils'
import { elsaSpeakApi } from '~/api/elseSpeak'
import TextArea from 'antd/lib/input/TextArea'
import ColoredSentence from '~/common/components/ElsaSpeak/ColoredSentence '

const Mp3Recorder = new MicRecorder({ bitRate: 128 })

const ElsaSpeak = () => {
	const [form] = Form.useForm()
	const [isRecording, setIsRecording] = useState(false)
	const [audioBlob, setAudioBlob] = useState(null)
	const [recordedAudio, setRecordedAudio] = useState(null)
	const state = useSelector((state: RootState) => state)
	const [fileUrl, setFileUrl] = useState(null)
	const [sentence, setSentence] = useState(
		'It had been years since the car had been driven. It sat in the driveway, slowly being taken over by rust and weeds. The windows were boarded up and the tires were long gone. But to a young boy, it was the most beautiful car he had ever seen. He dreamed of fixing it up and taking it for a spin. One day, he gathered some scrap metal and started working on the car. It took months of hard work, but eventually, the car was roadworthy again. The young boy took it for a spin around the block, feeling like the luckiest kid in the world. Even though it was just an old rust-bucket, to him it was the most special car in the world.'
	)
	const [words, setWords] = useState(null)
	const [data, setData] = useState(null)
	const userInformation = useSelector((state: RootState) => state.user.information)

	function isAdmin() {
		return userInformation?.RoleId == 1
	}

	function isTeacher() {
		return userInformation?.RoleId == 2
	}

	function isStdent() {
		return userInformation?.RoleId == 3
	}

	const handleFileSelect = (event) => {
		const selectedFile = event.target.files[0]
		if (selectedFile) {
			setAudioBlob(selectedFile)
		}
	}
	const handleRecord = () => {
		if (isRecording) {
			Mp3Recorder.stop()
				.getMp3()
				.then(([buffer, blob]) => {
					setIsRecording(false)
					setAudioBlob(blob)
					setRecordedAudio(buffer)
					saveAudioLocally(blob)
				})
				.catch((e) => {
					console.error(e)
				})
		} else {
			Mp3Recorder.start()
				.then(() => {
					setIsRecording(true)
					setRecordedAudio(null)
					setAudioBlob(null)
				})
				.catch((e) => {
					console.error(e)
				})
		}
	}
	const saveAudioLocally = async (blob) => {
		const filename = generateUniqueFileName()
		const formData = new FormData()
		formData.append('file', blob, filename)
		await uploadFile(formData)
	}
	const generateUniqueFileName = () => {
		const timestamp = Date.now()
		const randomString = Math.random().toString(36).substring(2, 8)
		return `recording_${timestamp}_${randomString}.mp3`
	}

	async function onSubmit() {
		try {
			const request = {
				filePath: fileUrl,
				sentence: sentence
			}
			const response = await elsaSpeakApi.scripted(request)
			if (response.status == 200) {
				if (response.data.utterance) {
					const item = response.data.utterance[0]
					setData(item)
					const words = item.words
					setWords(words)
				}
			}
		} catch (err) {
			// ShowNoti('error', err.message)
		}
	}

	async function uploadFile(params) {
		try {
			const response = await elsaSpeakApi.addFile(params)
			if (response.status == 200) {
				setFileUrl(response.data.data)
			}
		} catch (err) {
			// ShowNoti('error', err.message)
		}
	}

	return (
		<div className="wrapper-class">
			<Card>
				<div className="row">
					<div className="col-4">
						<div className="wrap-table">
							<div className="flex justify-center">
								<button className="mx-auto" onClick={handleRecord}>
									{isRecording ? (
										<>
											<FaMicrophone className="mt-2" size={60} />
											<p>Đang ghi âm...</p>
										</>
									) : (
										<FaMicrophoneSlash size={72} />
									)}
								</button>
							</div>

							<div className="mt-2 flex justify-center w-1/3">
								{audioBlob && (
									<audio controls>
										<source src={URL.createObjectURL(audioBlob)} type="audio/mpeg" />
										Your browser does not support the audio element.
									</audio>
								)}
							</div>

							<div className="mt-2 flex justify-center">
								<PrimaryButton type="button" icon="check" background="green" onClick={onSubmit}>
									Nộp chấm điểm
								</PrimaryButton>
							</div>
						</div>
					</div>
					<div className="col-8">
						<TextArea value={sentence} onChange={(e) => setSentence(e.target.value)} rows={5} className="h-44 max-h-44" />
					</div>
				</div>
			</Card>
			<Card className="mt-4">
				<div className="row ">
					<div className="col-3">
						<div className="wrap-table">
							<div className="shadow-lg xl:p-6 p-4  sm:w-auto w-full bg-white sm:absolute relative z-20 sm:mt-0  xl:mt-80 sm:mt-56 xl:-ml-0 sm:-ml-12">
								<p className="text-2xl font-semibold text-tw-blue">{data !== null ? data.cefr_score : '-'}</p>
								<p className=" leading-4 xl:mt-4 mt-2 text-gray-400">Trình độ hiện tại</p>
							</div>
						</div>
					</div>
					<div className="col-3">
						<div className="wrap-table">
							<div className="shadow-lg xl:p-6 p-4  sm:w-auto w-full bg-white sm:absolute relative z-20 sm:mt-0  xl:mt-80 sm:mt-56 xl:-ml-0 sm:-ml-12">
								<p className="text-2xl font-semibold text-tw-blue">{data !== null ? data.decision : '-'}</p>
								<p className=" leading-4 xl:mt-4 mt-2 text-gray-400">Độ thành thạo</p>
							</div>
						</div>
					</div>

					<div className="col-3">
						<div className="wrap-table">
							<div className="shadow-lg xl:p-6 p-4  sm:w-auto w-full bg-white sm:absolute relative z-20 sm:mt-0  xl:mt-80 sm:mt-56 xl:-ml-0 sm:-ml-12">
								<p className="text-2xl font-semibold text-tw-blue">{data !== null ? data.fluency_score : '-'}</p>
								<p className=" leading-4 xl:mt-4 mt-2 text-gray-400">Độ diễn cảm</p>
							</div>
						</div>
					</div>
					<div className="col-3">
						<div className="wrap-table">
							<div className="shadow-lg xl:p-6 p-4  sm:w-auto w-full bg-white sm:absolute relative z-20 sm:mt-0  xl:mt-80 sm:mt-56 xl:-ml-0 sm:-ml-12">
								<p className="text-2xl font-semibold text-tw-blue">{data !== null ? data.pronunciation_score : '-'}</p>
								<p className=" leading-4 xl:mt-4 mt-2 text-gray-400">Độ tự nhiên</p>
							</div>
						</div>
					</div>
				</div>
				<div className="row mt-4">
					<div className="col-2">
						<div className="wrap-table">
							<div className="shadow-lg xl:p-6 p-4  sm:w-auto w-full bg-white sm:absolute relative z-20 sm:mt-0  xl:mt-80 sm:mt-56 xl:-ml-0 sm:-ml-12">
								<p className="text-2xl font-semibold text-tw-blue">{data !== null ? data.cefr_score : '-'}</p>
								<p className=" leading-4 xl:mt-4 mt-2 text-gray-400">Điểm phát âm</p>
							</div>
						</div>
					</div>
					<div className="col-2">
						<div className="wrap-table">
							<div className="shadow-lg xl:p-6 p-4  sm:w-auto w-full bg-white sm:absolute relative z-20 sm:mt-0  xl:mt-80 sm:mt-56 xl:-ml-0 sm:-ml-12">
								<p className="text-2xl font-semibold text-tw-blue">{data !== null ? data.ielts_score : '-'}</p>
								<p className=" leading-4 xl:mt-4 mt-2 text-gray-400">Điểm IELTS</p>
							</div>
						</div>
					</div>
					<div className="col-2">
						<div className="wrap-table">
							<div className="shadow-lg xl:p-6 p-4  sm:w-auto w-full bg-white sm:absolute relative z-20 sm:mt-0  xl:mt-80 sm:mt-56 xl:-ml-0 sm:-ml-12">
								<p className="text-2xl font-semibold text-tw-blue">{data !== null ? data.toefl_score : '-'}</p>
								<p className=" leading-4 xl:mt-4 mt-2 text-gray-400">Điểm TOEFL</p>
							</div>
						</div>
					</div>
					<div className="col-2">
						<div className="wrap-table">
							<div className="shadow-lg xl:p-6 p-4  sm:w-auto w-full bg-white sm:absolute relative z-20 sm:mt-0  xl:mt-80 sm:mt-56 xl:-ml-0 sm:-ml-12">
								<p className="text-2xl font-semibold text-tw-blue">{data !== null ? data.toeic_score : '-'}</p>
								<p className=" leading-4 xl:mt-4 mt-2 text-gray-400">Điểm TOEIC</p>
							</div>
						</div>
					</div>
					<div className="col-2">
						<div className="wrap-table">
							<div className="shadow-lg xl:p-6 p-4  sm:w-auto w-full bg-white sm:absolute relative z-20 sm:mt-0  xl:mt-80 sm:mt-56 xl:-ml-0 sm:-ml-12">
								<p className="text-2xl font-semibold text-tw-blue">{data !== null ? data.pte_score : '-'}</p>
								<p className=" leading-4 xl:mt-4 mt-2 text-gray-400">Điểm PTE</p>
							</div>
						</div>
					</div>
					<div className="col-2">
						<div className="wrap-table">
							<div className="shadow-lg xl:p-6 p-4  sm:w-auto w-full bg-white sm:absolute relative z-20 sm:mt-0  xl:mt-80 sm:mt-56 xl:-ml-0 sm:-ml-12">
								<p className="text-2xl font-semibold text-tw-blue">{data !== null ? data.eps_score : '-'}</p>
								<p className=" leading-4 xl:mt-4 mt-2 text-gray-400">Điểm EPS</p>
							</div>
						</div>
					</div>
				</div>
			</Card>

			<ColoredSentence sentence={sentence} words={words} />
		</div>
	)
}

export default ElsaSpeak
