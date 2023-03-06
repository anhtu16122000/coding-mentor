import { Modal, Spin } from 'antd'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SeminarApi } from '~/api/course/seminar/seminar'
import { ShowNoti } from '~/common/utils'
import Lottie from 'react-lottie-player'

export interface IZoomViewProps {}

import warning from '~/common/components/json/38063-log-out.json'
import PrimaryButton from '~/common/components/Primary/Button'

export default function ZoomView(props: IZoomViewProps) {
	const router = useRouter()
	const [user, setUser] = useState(null)
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [dataSeminar, setDataSeminar] = useState<ISeminar[]>()
	const [leaderID, setLeaderID] = useState(0)
	const [dataZoom, setDataZoom] = useState<{
		apiKey: string
		signature: string
		meetingNumber: string
		passWord: string
		userName: string
	}>(null)

	const [visibleModal, setVisibleModal] = useState(false)

	useEffect(() => {
		setUser(JSON.parse(localStorage.getItem('userData')).user)
		changePrimaryZoom()
	}, [])

	const getSeminar = async () => {
		setIsLoading({ type: '', status: true })
		try {
			let res = await SeminarApi.getAll({ pageSize: 9999999, pageIndex: 1 })
			if (res.status == 200) {
				setDataSeminar(res.data.data)
			}
			if (res.status == 204) {
				setDataSeminar([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: '', status: false })
			changePrimaryZoom()
		}
	}

	useEffect(() => {
		getSeminar()
	}, [router.query.SeminarId])

	useEffect(() => {
		if (dataSeminar && dataSeminar.length > 0) {
			let temp = dataSeminar.filter((item) => item.Id === Number(router.query.SeminarID))
			setDataZoom({
				apiKey: temp[0]?.APIKey,
				signature: user && (user?.RoleId == '1' || user?.RoleId == '2') ? temp[0].SignatureTeacher : temp[0].SignatureStudent,
				meetingNumber: temp[0].RoomId,
				userName: user.FullName,
				passWord: temp[0].RoomPass
			})
			setLeaderID(temp[0].LeaderId)
			changePrimaryZoom()
		}
	}, [dataSeminar])

	useEffect(() => {
		if (typeof user !== 'undefined') {
			if (user == null) {
				changePrimaryZoom()
			}
		}
	}, [user])

	const initZoom = async () => {
		if (!dataZoom) return

		const module = await import('@zoomus/websdk')

		// DECLARE MODULE
		const { ZoomMtg } = module

		ZoomMtg.setZoomJSLib('https://source.zoom.us/2.6.0/lib', '/av')

		ZoomMtg.preLoadWasm()
		ZoomMtg.prepareWebSDK()

		// ZoomMtg.prepareJssdk()

		// loads language files, also passes any error messages to the ui
		ZoomMtg.i18n.load('vi-VN')
		ZoomMtg.i18n.reload('vi-VN')

		// SHOW LAYOUT ZOOM
		document.getElementById('zmmtg-root')?.setAttribute('style', 'display:block;')

		let leaveUrl = ''
		if (typeof window !== 'undefined') {
			leaveUrl = window.location.origin
		}

		changePrimaryZoom()

		// INIT MEETING
		ZoomMtg.init({
			leaveUrl,
			isSupportAV: true,
			success: (success) => {
				changePrimaryZoom()

				console.log('---- dataZoom: ', dataZoom)

				// JOIN MEETING
				ZoomMtg.join({
					...dataZoom,
					success: (success) => {
						changePrimaryZoom()

						ZoomMtg.getCurrentUser({
							success: function (res) {
								console.log('success getCurrentUser', res.result.currentUser)
								changePrimaryZoom()
							}
						})
					},
					error: (error) => {}
				})
			},
			error: (error) => {}
		})
		// ZoomMtg.inMeetingServiceListener('onUserJoin', function (data) {
		// 	console.log('inMeetingServiceListener onUserJoin', data)
		// })

		// ZoomMtg.inMeetingServiceListener('onUserLeave', function (data) {
		// 	console.log('inMeetingServiceListener onUserLeave', data)
		// })

		// ZoomMtg.inMeetingServiceListener('onUserIsInWaitingRoom', function (data) {
		// 	console.log('inMeetingServiceListener onUserIsInWaitingRoom', data)
		// })

		// ZoomMtg.inMeetingServiceListener('onMeetingStatus', function (data) {
		// 	console.log('inMeetingServiceListener onMeetingStatus', data)
		// })
	}

	useEffect(() => {
		if (dataZoom) {
			if (user) {
				initZoom()
			}
			changePrimaryZoom()
		}
	}, [dataZoom])

	const handleLeaveWorkshop = async () => {
		const module = await import('@zoomus/websdk')
		// DECLARE MODULE
		const { ZoomMtg } = module
		ZoomMtg.leaveMeeting({
			success: (res) => {
				if (!!window) {
					window.close()
				}
			},
			error: (error) => {}
		})
	}

	function changePrimaryZoom() {
		const nodeTitles = document.getElementsByClassName('meeting-title')

		if (nodeTitles.length > 0) {
			// @ts-ignore
			nodeTitles[0].innerText = 'Tham gia hội nghị'
		}

		const joinButton = document.getElementById('join-btn')
		if (!!joinButton) {
			joinButton.innerText = 'Tham gia'
		}

		const audioButton = document.getElementById('audio-text')
		if (!!audioButton) {
			audioButton.innerText = 'Âm thanh'
		}

		const videoButton = document.getElementById('video-text')
		if (!!videoButton) {
			videoButton.innerText = 'Video'
		}

		const leaveButton = document.getElementsByClassName('footer__leave-btn')
		if (leaveButton.length > 0) {
			// @ts-ignore
			leaveButton[0].innerText = 'Thoát'
		}

		const leaveOption = document.getElementsByClassName('footer__leave-btn')
		if (leaveOption.length > 0) {
			// @ts-ignore
			leaveOption[0].classList.add('leave-options')
		}

		// leave-meeting-options

		const mediaPreviewText = document.getElementsByClassName('media-preview-tooltip-text')
		if (mediaPreviewText.length > 0) {
			// @ts-ignore
			mediaPreviewText[0].innerText = 'Tùy chọn âm thanh và video sẽ được sử dụng cho các cuộc họp trong tương lai.'
		}

		const mediaPreviewButton = document.getElementById('media-preview-tooltip-btn')
		if (!!mediaPreviewButton) {
			mediaPreviewButton.innerText = 'Đã hiểu'
		}
	}

	return (
		<>
			<Head>
				{router.query?.name && <title>Webinar - {router.query?.name}</title>}
				{!router.query?.name && <title>Webinar</title>}
				<link type="text/css" rel="stylesheet" href="https://source.zoom.us/2.6.0/css/bootstrap.css" />
				<link type="text/css" rel="stylesheet" href="https://source.zoom.us/2.6.0/css/react-select.css" />
			</Head>

			<div className="zoom-view" style={{ height: '100vh', width: '100vw', position: 'relative' }}>
				<Spin size="large" />
			</div>

			<Modal visible={visibleModal} footer={null} onCancel={() => setVisibleModal(false)}>
				<div className="flex w-full h-full flex-col items-center justify-center">
					<Lottie loop animationData={warning} play className="inner w-[180px] mx-auto" />
					<div className="text-[18px] font-[600] mb-4">
						Bạn muốn <span className="text-[red]">rời khỏi</span> Webinar này?
					</div>
					<PrimaryButton onClick={handleLeaveWorkshop} type="button" background="red">
						Rời khỏi phòng
					</PrimaryButton>
				</div>
			</Modal>
		</>
	)
}
