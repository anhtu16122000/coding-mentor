import { Form, Modal, Radio } from 'antd'
import React, { useState, useEffect } from 'react'
import InputText from '../../FormControl/InputTextField'
import SelectField from '../../FormControl/SelectField'
import { BsFileEarmarkPlus } from 'react-icons/bs'
import PrimaryButton from '../../Primary/Button'
import IconButton from '../../Primary/IconButton'
import UploadFileField from '../../FormControl/UploadFileField'
import { VideoCourseLessonUploadFileApi } from '~/api/course/video-course/video-course-file'
import { ShowNoti } from '~/common/utils'
import { examApi } from '~/api/exam'

type Props = {
	mode: 'add' | 'remove' | 'cancel' | 'edit' | 'check'
	isLoading: { type: string; status: boolean }
	onSubmit: Function
	item?: IVideoCourseSectionLesson
}

const typeList = [
	{ title: 'Bài giảng', value: 1 },
	{ title: 'Bài tập', value: 2 }
]

const ModalAddLesson = (props: Props) => {
	const { onSubmit, isLoading, mode, item } = props
	const [visibleModalLesson, setVisibleModalLesson] = useState(false)
	const [form] = Form.useForm()
	const [type, setType] = useState(1)
	const [typeUrl, setTypeUrl] = useState(1)
	const [isLoadingVideo, setIsLoadingVideo] = useState({ type: '', status: false })

	useEffect(() => {
		if (item) {
			form.setFieldsValue(item)
		} else {
			form.setFieldsValue({ Type: 1 })
		}
	}, [visibleModalLesson])

	const onOpenModal = () => {
		getExercises()
		setVisibleModalLesson(true)
	}
	const onCloseModal = () => {
		setVisibleModalLesson(false)
	}

	/**
	 * It takes a string and returns a string
	 * @param url - The URL of the YouTube video.
	 * @returns The video ID of the youtube video.
	 */
	function getYoutubeLink(url) {
		if (typeof url !== 'string') return ''

		const theLinkYTB = 'https://www.youtube.com/embed/'

		if (url.indexOf('youtube.com/watch') !== -1) {
			const match = url.match(/[?&]v=([^&]+)/)
			if (match) {
				return theLinkYTB + match[1]
			}
		}

		if (url.includes('https://youtu.be')) {
			const match = url.match(/youtu\.be\/([^\?]+)/)
			if (match) {
				return theLinkYTB + match[1]
			}
		}

		if (url.includes('<iframe') && url.includes('youtube.com')) {
			const div = document.createElement('div')
			div.innerHTML = url
			const iframe = div.querySelector('iframe')
			const src = iframe.getAttribute('src')
			const match = src.match(/\/embed\/([^\?]+)/)
			if (match) {
				return theLinkYTB + match[1]
			}
		}

		if (url.includes('youtube.com/embed')) {
			const videoId = url.split('/').pop()
			const index = videoId.indexOf('?')
			if (index !== -1) {
				return videoId.substring(0, index)
			}
			return theLinkYTB + videoId
		}

		return theLinkYTB + url
	}

	const onFinish = (data) => {
		const SUBMIT_DATA = { ...data, VideoUrl: getYoutubeLink(data.VideoUrl) }

		console.log('--- SUBMIT_DATA: ', SUBMIT_DATA)

		/* A conditional statement. */
		if (mode == 'add') {
			if (onSubmit) {
				onSubmit({ ...SUBMIT_DATA, FileType: typeUrl == 2 ? 'LinkYoutube' : 'FileUpload', Type: type }).then((res) => {
					if (res) {
						onCloseModal()
						form.resetFields()
					}
				})
			}
		} else {
			if (onSubmit) {
				if (onSubmit) {
					onSubmit({ ...SUBMIT_DATA, Id: item.Id, FileType: typeUrl == 2 ? 'LinkYoutube' : 'FileUpload', Type: type }).then((res) => {
						onCloseModal()
						form.resetFields()
					})
				}
			}
		}
	}

	const onChangeFile = async (data) => {
		setIsLoadingVideo({ type: 'UPLOAD_VIDEO', status: true })
		try {
			let res = await VideoCourseLessonUploadFileApi.upload(data)
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				return res
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoadingVideo({ type: 'UPLOAD_VIDEO', status: false })
		}
	}

	const onChangeTypeVideoUrl = (data) => {
		setTypeUrl(data.target.value)
	}

	// Get exams
	const [exams, setExams] = useState([])

	async function getExercises() {
		try {
			const response = await examApi.getAll({ search: '', pageIndex: 1, pageSize: 9999 })
			if (response.status === 200) {
				setExams(response.data.data)
			}
		} catch (error) {
			ShowNoti('error', error?.message)
		}
	}

	function formatExamData(params) {
		let temp = []
		params.forEach((element) => {
			temp.push({ value: element?.Id, title: `[${element?.Code}] - ${element?.Name}` })
		})
		return temp
	}

	return (
		<div className="antd-custom-wrap">
			{mode == 'add' ? (
				<div className="px-1 mt-3 flex justify-center">
					<button onClick={() => onOpenModal()} className="w-fit my-1 flex items-center justify-center">
						<BsFileEarmarkPlus size={18} className="text-tw-black font-bold mr-2" />{' '}
						<span className="text-tw-black text-bold text-base ">Thêm bài học</span>
					</button>
				</div>
			) : (
				<IconButton
					type="button"
					color={mode == 'edit' ? 'green' : 'red'}
					icon={mode}
					onClick={(event) => {
						event.stopPropagation()
						onOpenModal()
					}}
					className="mt-2"
					tooltip={mode == 'edit' ? 'Sửa bài học' : !!item?.ExamId ? 'Xóa bài tập' : 'Xóa bài học'}
				/>
			)}

			<Modal
				className="antd-custom-wrap"
				title={mode == 'add' ? 'Thêm bài học' : mode == 'edit' ? 'Sửa bài học' : 'Xóa bài học'}
				visible={visibleModalLesson}
				onCancel={onCloseModal}
				footer={null}
			>
				<Form onClick={(event) => event.stopPropagation()} layout="vertical" form={form} onFinish={onFinish}>
					<div className="grid grid-flow-row">
						{mode == 'remove' ? (
							<div className="grid-cols-1">
								<p className="text-base mb-4">Bạn có chắc muốn xóa bài học này?</p>
							</div>
						) : (
							<>
								<div className="grid-cols-1">
									<InputText name="Name" label="Bài học" placeholder="Nhập tên bài học" />
								</div>

								{/* <div className="grid-cols-1">
									<SelectField
										onChangeSelect={(value) => setType(value)}
										name="Type"
										optionList={typeList}
										label="Loại"
										placeholder="Chọn loại bài học"
									/>
								</div> */}

								{type == 1 ? (
									<>
										<Radio.Group className="mb-2" onChange={onChangeTypeVideoUrl} value={typeUrl}>
											<Radio value={1}>Tải lên video</Radio>
											<Radio value={2}>Đường dẫn Youtube</Radio>
										</Radio.Group>

										{typeUrl == 1 ? (
											<div className="grid-cols-1 mt-[8px]">
												<UploadFileField name="VideoUrl" label="" form={form} buttonText="Tải video lên" onChangeFile={onChangeFile} />
											</div>
										) : (
											<div className="grid-cols-1 mt-[8px]">
												<InputText name="VideoUrl" label="" placeholder="Nhập đường dẫn video" />
											</div>
										)}
									</>
								) : (
									<div className="grid-cols-1">
										<SelectField name="ExamId" optionList={formatExamData(exams)} label="Đề kiểm tra" placeholder="Chọn đề kiểm tra" />
									</div>
								)}
							</>
						)}

						<div className="grid-cols-1 flex justify-center">
							<PrimaryButton
								disable={
									(isLoading.type == 'SUBMIT_LESSON' && isLoading.status) ||
									(isLoadingVideo.type == 'UPLOAD_VIDEO' && isLoadingVideo.status)
								}
								loading={isLoading.type == 'SUBMIT_LESSON' && isLoading.status}
								background={mode == 'add' ? 'blue' : mode == 'edit' ? 'blue' : 'red'}
								type="submit"
								children={<span>{mode == 'remove' ? 'Xác nhận' : 'Lưu'}</span>}
								icon={mode == 'add' ? 'save' : mode == 'edit' ? 'save' : 'remove'}
							/>
						</div>
					</div>
				</Form>
			</Modal>
		</div>
	)
}

export default ModalAddLesson
