import { Modal } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import ModalFooter from '~/common/components/ModalFooter'
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop'
import { useDebounceEffect } from './useDebounceEffect'
import { canvasPreview } from './canvasPreview'
import { UploadFileApi } from '~/api/common/upload-image'
import { ShowNoti } from '~/common/utils'

const ButtonClass =
	'w-[100px] h-[100px] cursor-pointer text-[#939393] bg-[#efefef] all-center hover:bg-[#e8e8e8] active:bg-[#efefef] rounded-[6px] border-[1px] border-[#c9c9c9] '

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
	return centerCrop(
		makeAspectCrop(
			{
				unit: '%',
				width: 90
			},
			aspect,
			mediaWidth,
			mediaHeight
		),
		mediaWidth,
		mediaHeight
	)
}

const aspect = 3 / 2

const MiniImageCrop = (props) => {
	const { className, onChange, defaultValue } = props

	const [visible, setVisible] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)

	const [imgSrc, setImgSrc] = useState('')
	const previewCanvasRef = useRef<HTMLCanvasElement>(null)
	const imgRef = useRef<HTMLImageElement>(null)
	const blobUrlRef = useRef('')
	const [crop, setCrop] = useState<Crop>()
	const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
	const [imgSelected, setImgSelected] = useState(null)

	useEffect(() => {
		setcurrentImage({ uri: defaultValue || '', createdBy: 'Chaos', timeStamp: new Date().getTime() })
	}, [])

	function onSelectFile(e: any) {
		if (e.target.files && e.target.files.length > 0) {
			setImgSelected(e.target.files?.name)
			setCrop(undefined) // Makes crop preview update between images.
			const reader = new FileReader()
			reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''))
			reader.readAsDataURL(e.target.files[0])

			setVisible(!visible)
		}
	}

	function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
		if (aspect) {
			const { width, height } = e.currentTarget
			setCrop(centerAspectCrop(width, height, aspect))
		}
	}

	function blobToFile(blob, fileName, mimeType) {
		const options = { type: mimeType }

		// Tạo đối tượng File từ Blob
		const file = new File([blob], fileName, options)

		return file
	}

	function onDownloadCropClick() {
		if (!previewCanvasRef.current) {
			throw new Error('Crop canvas does not exist')
		}

		setLoading(true)

		previewCanvasRef.current.toBlob((blob) => {
			if (!blob) {
				throw new Error('Failed to create blob')
			}

			if (blobUrlRef.current) {
				URL.revokeObjectURL(blobUrlRef.current)
			}

			handleChange_img(blobToFile(blob, 'chaos-image.jpg', 'image/jpeg'))
		})
	}

	useDebounceEffect(
		async () => {
			if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
				canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, 1, 0)
			}
		},
		100,
		[completedCrop]
	)

	const handleChange_img = async (info: any) => {
		try {
			let res = await UploadFileApi.uploadImage(info)
			if (res.status == 200) {
				ShowNoti('success', 'Upload ảnh thành công')
				if (!!onChange) {
					onChange({ uri: res.data?.data, createdBy: 'Chaos', timeStamp: new Date().getTime() })
				}
				setcurrentImage({ uri: res.data?.data, createdBy: 'Chaos', timeStamp: new Date().getTime() })
				setVisible(false)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setLoading(false)
		}
	}

	const inputRef = useRef(null)

	function onClickSelect() {
		if (!!inputRef?.current) {
			inputRef?.current.click()
		}
	}

	const [currentImage, setcurrentImage] = useState(null)

	return (
		<>
			<input ref={inputRef} style={{ display: 'none' }} type="file" accept="image/*" onChange={onSelectFile} />

			<div className={'flex flex-col ' + className || ''}>
				<div onClick={onClickSelect} className={ButtonClass + ' flex-shrink-0 relative'}>
					<BiPlus size={25} style={{ zIndex: 99 }} />

					{!!currentImage?.uri && (
						<img
							draggable={false}
							className="w-[100px] rounded-[6px] h-[100px] object-cover absolute top-0 left-0 right-0 bottom-0"
							src={currentImage?.uri}
							style={{ zIndex: 80 }}
						/>
					)}
				</div>
			</div>

			<Modal
				title="Thêm hình ảnh"
				open={visible}
				width={500}
				closable={false}
				destroyOnClose
				footer={<ModalFooter loading={loading} onOK={onDownloadCropClick} onCancel={() => setVisible(!visible)} />}
			>
				{!imgSelected?.name && <div className="mb-[8px]">{imgSelected?.name}</div>}

				{!!imgSrc && (
					<ReactCrop
						className=""
						crop={crop}
						onChange={(_, percentCrop) => setCrop(percentCrop)}
						onComplete={(c) => setCompletedCrop(c)}
						aspect={aspect}
						minHeight={200}
					>
						<img ref={imgRef} alt="Crop me" src={imgSrc} style={{ transform: `scale(${1}) rotate(${0}deg)` }} onLoad={onImageLoad} />
					</ReactCrop>
				)}

				{!!completedCrop && (
					<div className="col-span-4 mt-[8px] hidden">
						<canvas
							ref={previewCanvasRef}
							style={{
								border: '1px solid black',
								objectFit: 'contain',
								width: completedCrop?.width,
								height: completedCrop?.height
							}}
						/>
					</div>
				)}
			</Modal>
		</>
	)
}

export default MiniImageCrop
