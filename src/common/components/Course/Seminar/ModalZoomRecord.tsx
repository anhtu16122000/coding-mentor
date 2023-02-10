import { Modal } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { ZoomRoomApi } from '~/api/zoom'
import { ShowNoti } from '~/common/utils'
import PrimaryButton from '../../Primary/Button'

export interface IModalZoomRecordProps {
	item: ISeminar
	onOpen?: Function
}

export default function ModalZoomRecord(props: IModalZoomRecordProps) {
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
			let res = await ZoomRoomApi.getRecordByID(item.Id)
			if (res.status == 200) {
				setDataSource(res.data.data)
			} else {
				setDataSource([])
			}
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
				<PrimaryButton className="!w-[160px]" background="blue" type="button" icon="eye" onClick={() => onOpenModal()}>
					Xem bản ghi
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
							icon="eye"
							onClick={() => window.open(dataSource[0].play_url)}
						>
							Xem bản ghi
						</PrimaryButton>

						<PrimaryButton
							className="!w-full w460:w-auto"
							disable={dataSource.length < 2}
							background="yellow"
							type="button"
							icon="download"
							onClick={() => window.open(dataSource[0].download_url)}
						>
							Tải tệp video
						</PrimaryButton>
					</div>
				</div>
			</Modal>
		</div>
	)
}
