import { Card, Empty, Modal } from 'antd'
import { useEffect, useState } from 'react'
import { GrDocumentImage, GrDocumentPdf, GrDocumentPpt, GrDocumentWord, GrDocumentZip } from 'react-icons/gr'
import { SiMicrosoftexcel } from 'react-icons/si'
import { VideoCourseLessonUploadFileApi } from '~/api/course/video-course/video-course-file'
import { PAGE_SIZE } from '~/common/libs/others/constant-constructer'
import { ShowNoti } from '~/common/utils'
import IconButton from '../../Primary/IconButton'
import ModalAddFileVideoCourse from './ModalAddFIle'

interface Props {
	lessonID: number
	UserID: string | number
}

export default function ModalShowFile(props: Props) {
	const { lessonID, UserID } = props
	const [visible, setVisible] = useState(false)
	const [dataSource, setDataSource] = useState<IVideoCourseFile[]>(null)
	const [isLoading, setIsLoading] = useState({ type: '', status: false })
	const [todoApi, setTodoApi] = useState({ pageIndex: 1, pageSie: PAGE_SIZE })

	const onCloseModal = () => {
		setVisible(false)
	}

	const onOpenModal = () => {
		setVisible(true)
		getDataSource()
	}

	const getDataSource = async () => {
		setIsLoading({ type: 'GET_ALL', status: true })
		try {
			let res = await VideoCourseLessonUploadFileApi.getByLessonID(lessonID)
			if (res.status == 200) {
				setDataSource(res.data.data)
			}
			if (res.status === 204) {
				setDataSource([])
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false })
		}
	}

	const handleRemoveFile = async (item) => {
		setIsLoading({ type: 'DELETE', status: true })
		try {
			let res = await VideoCourseLessonUploadFileApi.delete(item.Id)
			if (res.status == 200) {
				ShowNoti('success', res.data.message)
				setTodoApi({ ...todoApi })
				getDataSource()
			}
		} catch (error) {
			ShowNoti('error', error.message)
		} finally {
			setIsLoading({ type: 'DELETE', status: false })
		}
	}

	const renderFiles = () => {
		return dataSource.map((item) => {
			let type = item.FileUrl?.split('.')[item.FileUrl.split('.').length - 1]
			return (
				<div className="flex justify-between items-center mb-2.5 last-of-type:mb-0 group hover:bg-tw-primary-lightest px-4 py-2 rounded-md">
					<div className="flex gap-2 justify-start items-center select-none">
						{(type == 'xlsx' || type == 'xls') && <SiMicrosoftexcel size={24} />}
						{(type == 'doc' || type == 'docx' || type == 'txt') && <GrDocumentWord size={24} />}
						{type == 'pdf' && <GrDocumentPdf size={24} />}
						{type == 'zip' && <GrDocumentZip size={24} />}
						{(type == 'ppt' || type == 'pps') && <GrDocumentPpt size={24} />}
						{(type == 'png' || type == 'jpg') && <GrDocumentImage size={24} />}
						<p className="text-base font-bold line-clamp-1">{item.FileName}</p>
					</div>

					<div className="gap-2 hidden group-hover:flex">
						<IconButton
							type="button"
							icon={'download'}
							color="green"
							onClick={() => {
								window.open(item.FileUrl, '_blank')
							}}
							tooltip="Tải tệp"
						/>
						{UserID == '1' && (
							<IconButton
								type="button"
								icon={'remove'}
								color="primary"
								onClick={() => {
									handleRemoveFile(item)
								}}
								tooltip="Xóa tệp"
							/>
						)}
					</div>
				</div>
			)
		})
	}

	// useEffect(() => {
	// 	getDataSource()
	// }, [todoApi])

	return (
		<div>
			<IconButton type="button" icon="document" color="blue" onClick={() => onOpenModal()} className="mt-2" tooltip="Xem tài liệu" />
			<Modal
				title={'Danh sách tài liệu'}
				visible={visible}
				width={700}
				onCancel={() => onCloseModal()}
				footer={
					UserID == '1' && (
						<ModalAddFileVideoCourse lessonID={lessonID} getDataSource={getDataSource} onFetchData={() => setTodoApi({ ...todoApi })} />
					)
				}
			>
				<Card>{dataSource ? <>{renderFiles()}</> : <Empty />}</Card>
			</Modal>
		</div>
	)
}
