import { Image, Modal } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { FaPlay } from 'react-icons/fa'

type TNewsFiles = {
	files: Array<{ FileType: string; FileUrl: string; FileName: string }>
}

const NewsFiles: FC<TNewsFiles> = React.memo(({ files }) => {
	const [visible, setVisible] = useState('')

	const [images, setImages] = useState([])

	function isImage(params) {
		if (params == 'jpg' || params == 'jpeg') {
			return true
		}
		if (params == 'webp' || params == 'png' || params == 'svg') {
			return true
		}
		if (params == 'mp4' || params == 'avi' || params == 'mkv') {
			return true
		}
		return false
	}

	useEffect(() => {
		if (!!files) {
			let temp = []
			files.forEach((element) => {
				if (!!element?.FileUrl && isImage(element.FileType)) {
					temp.push({ src: element?.FileUrl, alt: element.FileName, fileType: element.FileType })
				}
			})
			setImages([...temp])
		}
	}, [files])

	const imagesLength = images.length < 4 ? images.length : 4

	function getFileName() {
		const index = files.findIndex((file) => file?.FileUrl == visible)
		if (index > -1) {
			return files[index].FileName
		}
		return ''
	}

	return (
		<>
			{files.length > 0 && <div className="cc-hr my-[8px] mx-[-6px]" />}

			<div className={`grid grid-cols-${imagesLength} gap-x-2 gap-y-2`}>
				{images.map((item, index) => {
					return (
						<div
							key={`FILE-POST-${index}-${new Date().getTime()}`}
							onClick={() => setVisible(item.src)}
							className={`shadow-md cursor-pointer bg-[#fff] h-full`}
						>
							{item.fileType !== 'mp4' && (
								<img
									draggable={false}
									src={item.src}
									className={`${imagesLength > 1 ? 'max-h-[400px] w-[100%]' : ''} object-cover`}
									width="100%"
								/>
							)}

							{(item.fileType == 'mp4' || item.fileType == 'avi' || item.fileType == 'mkv') && (
								<div className="relative text-[22px] hover:text-[24px]">
									<video className={`${imagesLength > 1 ? 'h-[120px] w-[100%]' : 'min-h-[400px]'} object-cover`} id="video" src={item.src}>
										<source src={item.src} className="min-h-[400px]" type="video/mp4" />
										Your browser does not support the video tag.
									</video>
									<div className="top-0 lef-0 right-0 absolute bottom-0 flex all-center bg-[#00000041] h-full w-full">
										<FaPlay className="" color="#fff" />
									</div>
								</div>
							)}
						</div>
					)
				})}
			</div>

			<Modal width={1000} closable={false} centered open={!!visible} footer={null} onCancel={() => setVisible('')}>
				{visible.includes('.mp4') && (
					<video className="shadow-md" controls id="video" src={visible}>
						<source src={visible} type="video/mp4" />
						Your browser does not support the video tag.
					</video>
				)}

				{visible.includes('.avi') && (
					<video className="shadow-md" controls id="video" src={visible}>
						<source src={visible} type="video/avi" />
						Your browser does not support the video tag.
					</video>
				)}

				{!visible.includes('.mp4') && !visible.includes('.avi') && (
					<img
						className="shadow-md"
						draggable={false}
						alt="example"
						style={{ width: '100%', maxHeight: '80vh', objectFit: 'cover' }}
						src={visible}
					/>
				)}
			</Modal>
		</>
	)
})

export default NewsFiles
