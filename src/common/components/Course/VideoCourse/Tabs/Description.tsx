import { Form, Modal, Rate } from 'antd'
import { useState } from 'react'
import { VideoCourseApi } from '~/api/course/video-course/video-course'
import PrimaryButton from '~/common/components/Primary/Button'
import { ShowNoti } from '~/common/utils'
import ReactHtmlParser from 'react-html-parser'
import { GiRoundStar } from 'react-icons/gi'
import { StudentListInCourseApi } from '~/api/course/video-course/student-list-in-video-course'
import TextArea from 'antd/lib/input/TextArea'
import PrimaryEditor from '~/common/components/Editor'
import ModalFooter from '~/common/components/ModalFooter'

type Props = {
	courseDetail: IVideoCourse
	User: any
	onFetchData: Function
}

const VideoCourseDescription = (props: Props) => {
	const { courseDetail, User, onFetchData } = props

	const [form] = Form.useForm()

	const [isLoading, setIsLoading] = useState({ type: '', status: false })

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

	const [laodingRating, setLoadingRating] = useState(false)
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
		setLoadingRating(true)
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
			setLoadingRating(false)
			setIsLoading({ type: 'ADD_RATE', status: false })
		}
	}

	return (
		<div className="">
			<Modal
				title="Đánh giá về khóa học"
				visible={visible}
				footer={<ModalFooter loading={laodingRating} onCancel={onClose} onOK={() => onPostReview()} />}
				onCancel={onClose}
			>
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
							onChange={(event) => setReviewContent({ ...reviewContent, review: event.target.value })}
						/>
					</div>
				</div>
			</Modal>

			{User?.RoleId == '1' ? (
				<Form layout="vertical" form={form} onFinish={onFinish}>
					<div>
						<div>
							<Form.Item className="col-span-4 mb-0" label="Nội dung" name="Description">
								<PrimaryEditor
									id={`content-${new Date().getTime()}`}
									height={210}
									initialValue={courseDetail?.Description || ''}
									onChange={(event) => form.setFieldValue('Description', event)}
								/>
							</Form.Item>
						</div>
						<div className="flex justify-center mt-[16px]">
							<PrimaryButton
								disable={isLoading.type == 'SUBMIT_VIDEO' && isLoading.status}
								loading={isLoading.type == 'SUBMIT_VIDEO' && isLoading.status}
								background="primary"
								type="submit"
								icon="save"
							>
								Lưu thay đổi
							</PrimaryButton>
						</div>
					</div>
				</Form>
			) : (
				<div className="flex flex-col items-start">
					<div
						onClick={onOpen}
						className="mb-[16px] hover:bg-[#efefef] cursor-pointer flex items-center p-[8px] px-[16px] rounded-[6px] w-[340px] pt-[4px] border-[1px] border-solid border-[#e1e1e1]"
					>
						<p className="font-bold mt-[4px] text-[16px] mr-[8px]">Đánh giá khóa học</p>
						<Rate
							defaultValue={courseDetail?.TotalRate}
							value={courseDetail?.TotalRate}
							character={<GiRoundStar size={28} />}
							allowHalf
							disabled
							className="text-tw-yellow !cursor-pointer"
						/>
					</div>

					<div className="custom-view-editor">
						{!!courseDetail?.Description
							? ReactHtmlParser(courseDetail?.Description)
							: ReactHtmlParser('<span>Không có giới thiệu khóa học!</span>')}
					</div>
				</div>
			)}
		</div>
	)
}

export default VideoCourseDescription
