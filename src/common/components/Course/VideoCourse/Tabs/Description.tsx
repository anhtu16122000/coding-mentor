import { Form, Modal, Rate } from 'antd'
import { useState } from 'react'
import { VideoCourseApi } from '~/api/course/video-course/video-course'
import PrimaryButton from '~/common/components/Primary/Button'
import { ShowNoti } from '~/common/utils'
import EditorField from '../../../FormControl/EditorField'
import ReactHtmlParser from 'react-html-parser'
import { GiRoundStar } from 'react-icons/gi'
import { StudentListInCourseApi } from '~/api/course/video-course/student-list-in-video-course'
import TextArea from 'antd/lib/input/TextArea'

type Props = {
	courseDetail: IVideoCourse
	User: any
	onFetchData: Function
}

const VideoCourseDescription = (props: Props) => {
	const { courseDetail, User, onFetchData } = props
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [form] = Form.useForm()

	const onChangeEditor = (value) => {
		form.setFieldsValue({
			Description: value
		})
	}

	const onFinish = async (data) => {
		setIsLoading({ type: 'SUBMIT_VIDEO', status: true })
		try {
			let res = await VideoCourseApi.update({ Id: courseDetail.Id, Description: data.Description })
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'SUBMIT_VIDEO', status: false })
		}
	}

	const [reviewContent, setReviewContent] = useState({ star: null, review: '' })
	const [visible, setVisible] = useState(false)
	const onClose = () => {
		setVisible(false)
	}
	const onOpen = () => {
		setVisible(true)
	}

	const onPostReview = async () => {
		setIsLoading({ type: 'ADD_RATE', status: true })
		try {
			let res = await StudentListInCourseApi.addRate({
				MyRate: reviewContent.star,
				RateComment: reviewContent.review,
				VideoCourseId: courseDetail.Id
			})
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				onClose()
				onFetchData && onFetchData()
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'ADD_RATE', status: false })
		}
	}

	return (
		<div className="antd-custom-wrap">
			<Modal title="Đánh giá về khóa học" visible={visible} footer={null} onCancel={onClose}>
				<div className="grid gap-2 grid-cols-1">
					<div className="border-2 rounded-lg border-tw-green mb-tw-2 pt-tw-2 pb-tw-1.5 px-tw-4">
						<div className="col-span-2">
							<p className="font-bold text-tw-green">Đánh giá của bạn</p>
							<Rate
								character={<GiRoundStar size={35} />}
								onChange={(data) => setReviewContent({ ...reviewContent, star: data })}
								className="text-tw-yellow"
							/>
						</div>
					</div>

					<div className="col-span-1">
						<TextArea
							className="h-full w-full rounded-xl "
							rows={5}
							placeholder="Nhận xét của bạn"
							onChange={(event) => {
								setReviewContent({ ...reviewContent, review: event.target.value })
							}}
						/>
					</div>

					<div className="col-span-1 flex item-center justify-center">
						<PrimaryButton
							background="blue"
							type="button"
							children={<span>Lưu</span>}
							icon="save"
							onClick={() => {
								onPostReview()
							}}
						/>
					</div>
				</div>
			</Modal>

			{User?.RoleId == '1' ? (
				<Form layout="vertical" form={form} onFinish={onFinish}>
					<div>
						<div>
							<EditorField
								name="Description"
								onChangeEditor={onChangeEditor}
								placeholder="Nhập giới thiệu khóa học"
								initialValue={courseDetail?.Description}
								disableButton={(status) => {
									setIsLoading({ type: 'SUBMIT_VIDEO', status: status })
								}}
							/>
						</div>

						<div className="flex justify-center">
							<PrimaryButton
								disable={isLoading.type == 'SUBMIT_VIDEO' && isLoading.status}
								loading={isLoading.type == 'SUBMIT_VIDEO' && isLoading.status}
								background="primary"
								type="submit"
								children={<span>Lưu</span>}
								icon="save"
							/>
						</div>
					</div>
				</Form>
			) : (
				<>
					<div className="flex justify-end items-center">
						<div className="group">
							<div
								className="relative block w-fit border-2 rounded-lg border-tw-gray mb-tw-2 pt-tw-2 pb-tw-1.5 px-tw-4 cursor-pointer"
								onClick={() => {
									onOpen()
								}}
							>
								<p className="font-bold">Đánh giá khóa học</p>
								<Rate
									defaultValue={courseDetail?.TotalRate}
									value={courseDetail?.TotalRate}
									character={<GiRoundStar size={35} />}
									allowHalf
									disabled
									className="text-tw-yellow group-hover:cursor-pointer"
								/>
								<div className="absolute top-0 bottom-0 left-0 right-0 z-10 "></div>
							</div>
						</div>
					</div>
					<div className="custom-view-editor">
						{courseDetail?.Description.length > 0
							? ReactHtmlParser(courseDetail?.Description)
							: ReactHtmlParser('<span>Không có giới thiệu khóa học!</span>')}
					</div>
				</>
			)}
		</div>
	)
}

export default VideoCourseDescription
