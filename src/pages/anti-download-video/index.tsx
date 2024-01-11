import React, { useEffect } from 'react'

import style from './style.module.scss'
import { useRouter } from 'next/router'
import { wait } from '~/common/utils'

function TestingAntiDownload() {
	const router = useRouter()

	useEffect(() => {
		if (router?.query?.time) {
			handleRouterTime()
		}
	}, [router])

	async function handleRouterTime() {
		await wait(2000)
		seekIframeVideo(router.query?.time)
	}

	function getIframeVideoCurrentTime() {
		var iframe: any = document.getElementById('video-iframe')
		if (iframe) {
			iframe.contentWindow.postMessage('MONA-GET-CURRENT-TIME', 'https://video.monamedia.net')
		}
	}

	function pauseIframeVideo() {
		var iframe: any = document.getElementById('video-iframe')
		if (iframe) {
			iframe.contentWindow.postMessage('MONA-PAUSE-VIDEO', 'https://video.monamedia.net')
		}
	}

	function playIframeVideo() {
		var iframe: any = document.getElementById('video-iframe')
		if (iframe) {
			iframe.contentWindow.postMessage('MONA-PLAY-VIDEO', 'https://video.monamedia.net')
		}
	}

	function startIframeVideo() {
		var iframe: any = document.getElementById('video-iframe')
		if (iframe) {
			iframe.contentWindow.postMessage('MONA-START-VIDEO', 'https://video.monamedia.net')
		}
	}

	function seekIframeVideo(time) {
		var iframe: any = document.getElementById('video-iframe')
		if (iframe) {
			iframe.contentWindow.postMessage({ key: 'MONA-SEEK-VIDEO', time: time }, 'https://video.monamedia.net')
		}
	}

	return (
		<div className="w-[100vw] h-[100vh] flex items-center flex-col">
			<div id="no-download-1704873848827" className={style.vcMainIframe}>
				<iframe
					// id="id-1704873848827"
					id="video-iframe"
					src="https://video.monamedia.net/streamer/embed.php?v=MTExNzA=&draggable=false" // embed-testing -- &draggable=true
					title="Video player"
					allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				/>
			</div>

			<div className="w-full max-w-[800px] p-[16px] bg-[#fff] mt-[16px] rounded-[8px]">
				<div>
					Do <div className="inline ml-[0px] bg-[#bbdaf6] px-[4px] font-[600]">server chống download</div> tích hợp qua iframe nên chỉ có
					thể xử lý bằng cách
					<div className="inline ml-[4px] bg-[yellow] px-[4px] font-[600]">iframe.contentWindow.postMessage(params)</div>
				</div>

				<div className="mt-[16px]">Để làm gì đó thì postMessage với params là nội dung kế bên cái nút ở dưới</div>

				<div className="h-[1px] bg-[#000] opacity-30 w-full my-[16px]" />

				<div className="w-full flex items-center">
					<div
						onClick={playIframeVideo}
						className="bg-[#1E88E5] text-[#fff] font-[600] h-[30px] cursor-pointer no-select hover:scale-95 active:scale-100 px-[8px] rounded-[6px] flex items-center justify-center"
					>
						<div>Phát / phát tiếp </div>
					</div>
					<div className="ml-[24px] font-[600]">('MONA-PLAY-VIDEO', 'https://video.monamedia.net')</div>
				</div>

				<div className="w-full flex items-center mt-[16px]">
					<div
						onClick={pauseIframeVideo}
						className="bg-[#1E88E5] text-[#fff] font-[600] h-[30px] cursor-pointer no-select hover:scale-95 active:scale-100 px-[8px] rounded-[6px] flex items-center justify-center"
					>
						<div>Pause </div>
					</div>
					<div className="ml-[24px] font-[600]">('MONA-PAUSE-VIDEO', 'https://video.monamedia.net')</div>
				</div>

				<div className="w-full flex items-center mt-[16px]">
					<div
						onClick={() => seekIframeVideo(25)}
						className="bg-[#1E88E5] text-[#fff] font-[600] h-[30px] cursor-pointer no-select hover:scale-95 active:scale-100 px-[8px] rounded-[6px] flex items-center justify-center"
					>
						<div>Seek to 25 seconds </div>
					</div>
					<div className="ml-[24px] font-[600]">{`({ key: 'MONA-SEEK-VIDEO', time: secondNumber }, 'https://video.monamedia.net')`}</div>
				</div>

				<div className="h-[1px] bg-[#000] opacity-30 w-full my-[16px]" />

				<div>
					Ở{' '}
					<div
						onClick={() => seekIframeVideo(175)}
						className="inline ml-[0px] cursor-pointer text-[blue] hover:underline px-[4px] font-[600]"
					>
						02:55
					</div>{' '}
					anh Tứn có chỉ tay lên bảng và nói rằng
					<div
						onClick={() => seekIframeVideo(1315)}
						className="inline ml-[0px] cursor-pointer text-[blue] hover:underline px-[4px] font-[600]"
					>
						21:37
					</div>{' '}
					anh Tứn sẽ khoanh tay lại.
				</div>
			</div>
		</div>
	)
}

export default TestingAntiDownload
