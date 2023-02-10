import { Modal } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { SiYoutube } from 'react-icons/si'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '../../Primary/Button'

export interface IModalZoomRecordProps {
	item: ISeminar
	onOpen?: Function
}

function ModalYoutubeRecord(props: IModalZoomRecordProps) {
	const { item, onOpen } = props
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [dataSource, setDataSource] = useState<IRecord[]>([])

	const onOpenModal = () => {
		!!onOpen && onOpen()
		setIsModalVisible(true)
	}

	const onCloseModal = () => {
		setIsModalVisible(false)
	}

	const getZoomRecord = async () => {
		try {
		} catch (error) {
			ShowNoti('error', error.message)
		}
	}

	useEffect(() => {
		if (isModalVisible) {
			getZoomRecord()
		}
	}, [isModalVisible])

	return (
		<div>
			<div className="w-full">
				<PrimaryButton background="yellow" className="!w-[160px]" type="button" onClick={() => onOpenModal()}>
					<SiYoutube size={18} className="mr-2" /> Bản ghi Youtube
				</PrimaryButton>
			</div>

			<Modal title="Xem lại bản ghi" visible={isModalVisible} onCancel={onCloseModal} footer={null}>
				<div>
					<div className="flex gap-2 justify-start items-center">
						<p className="font-[700]">Chủ đề:</p>
						<p className="text-tw-green flex-1">{item.Name}</p>
					</div>

					<div className="flex gap-2 justify-start items-center">
						<p className="font-[700]">Giảng viên:</p>
						<p className="text-tw-green flex-1">{item.LeaderName}</p>
					</div>

					<div className="flex gap-2 justify-start">
						<p className="font-[700]">Thời gian diễn ra:</p>
						<p className="flex-1">
							{moment(item.StartTime).format('HH:mm DD/MM/YYYY')} - {moment(item.EndTime).format('HH:mm DD/MM/YYYY')}
						</p>
					</div>

					<div className="flex gap-2 justify-start">
						<div className="font-[700]">Nội dung:</div>
						<div className="text-tw-green flex-1">{item.Description && item.Description.length > 0 ? item.Description : 'Trống'}</div>
					</div>

					<div className="flex flex-col w460:flex-row justify-center items-center gap-2 mt-4">
						<PrimaryButton
							className="!w-full w460:w-auto"
							disable={dataSource.length == 0}
							background="blue"
							type="button"
							children={<span>Xem bản ghi (MP4)</span>}
							icon="eye"
							onClick={() => {
								window.open(dataSource[0].play_url)
							}}
						/>
						<PrimaryButton
							className="!w-full w460:w-auto"
							disable={dataSource.length < 2}
							background="yellow"
							type="button"
							children={<span>Tải tệp âm thanh (M4A)</span>}
							icon="download"
							onClick={() => {
								window.open(dataSource[1].download_url)
							}}
						/>
					</div>
				</div>
			</Modal>
		</div>
	)
}

export default ModalYoutubeRecord
