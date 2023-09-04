import { Card, Form, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { parseSelectArray } from '~/common/utils/common'
import { RootState } from '~/store'
import PrimaryButton from '~/common/components/Primary/Button'
import { ShowNoti } from '~/common/utils'
import { elsaSpeakApi } from '~/api/elseSpeak'
import TextArea from 'antd/lib/input/TextArea'
import ColoredSentence from '~/common/components/ElsaSpeak/ColoredSentence '
import dynamic from 'next/dynamic'

const AudioRecoderApp: any = dynamic(() => import('./AudioRecoder/AudioRecoderApp'), {
	ssr: false
})

const ElsaSpeak = () => {
	const [form] = Form.useForm()
	const [isRecording, setIsRecording] = useState(false)
	const [audioBlob, setAudioBlob] = useState(null)
	const [recordedAudio, setRecordedAudio] = useState(null)
	const state = useSelector((state: RootState) => state)
	const [fileUrl, setFileUrl] = useState(null)
	const [sentence, setSentence] = useState('It had been years since the car had been driven. ')
	const [words, setWords] = useState(null)
	const [data, setData] = useState(null)
	const userInformation = useSelector((state: RootState) => state.user.information)

	const [recording, setRecording] = useState<boolean>(false)
	const [playing, setPlaying] = useState<boolean>(false)

	const [visible, setVisible] = useState<boolean>(false)
	const [linkAudio, setLinkAudio] = useState('')

	useEffect(() => {
		if (typeof window != 'undefined') setVisible(true)

		// GET PERMISSION
		function getRecordPermission() {
			navigator.mediaDevices
				.getUserMedia({ audio: true })
				.then((stream) => {})
				.catch(function (error) {
					console.log('Không thể lấy được quyền ghi âm: ' + error)
				})
		}

		getRecordPermission()
	}, [])

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

	async function onSubmit() {
		try {
			const request = {
				filePath: linkAudio,
				sentence: sentence
			}
			const response = await elsaSpeakApi.scripted(request)
			if (response.status == 200) {
				if (response.data.utterance) {
					const item = response.data.utterance[0]
					setData(item)
					const words = item.words
					setWords(words)
					ShowNoti('success', 'Thành công!')
				}
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	async function uploadFile(params) {
		try {
			const response = await elsaSpeakApi.addFile(params)
			if (response.status == 200) {
				setFileUrl(response.data.data)
			}
		} catch (err) {
			ShowNoti('error', err.message)
		}
	}

	return (
		<div>
			<Card>
				<div className="row">
					<div className="col-4">
						<div className="wrap-table">
							<div className="flex justify-center flex-col items-center">
								{/* <button className="mx-auto" onClick={handleRecord}>
									{isRecording ? (
										<>
											<FaMicrophone className="mt-2" size={60} />
											<p>Đang ghi âm...</p>
										</>
									) : (
										<FaMicrophoneSlash size={72} />
									)}
								</button> */}

								<AudioRecoderApp
									id={new Date().getTime()}
									isHideBar={true}
									linkRecord={linkAudio}
									setLinkRecord={(linkAudio: string) => setLinkAudio(linkAudio)}
									isRecord={recording}
									setIsRecord={setRecording}
									disabled={false}
									playing={playing}
									setPlaying={setPlaying}
								/>

								{!recording && !linkAudio && <div className="mt-3">Ghi âm thanh</div>}
							</div>

							{/* <div className="mt-2 flex justify-center ">
								{audioBlob && (
									<audio controls>
										<source src={URL.createObjectURL(audioBlob)} type="audio/mpeg" />
										Your browser does not support the audio element.
									</audio>
								)}
							</div> */}

							{!!linkAudio && (
								<div className="mt-2 flex justify-center">
									<PrimaryButton type="button" icon="check" background="green" onClick={onSubmit}>
										Nộp chấm điểm
									</PrimaryButton>
								</div>
							)}
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
